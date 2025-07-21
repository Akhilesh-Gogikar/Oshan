import os
import json
import pymongo
from pymongo import InsertOne, UpdateOne
from pymongo.errors import BulkWriteError
from datetime import datetime

# MongoDB configuration
MONGODB_URI = "mongodb+srv://oshanadmin:oshanadmin@cluster0.df9xk0u.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "Cluster0" # Using the provided database name

# Collection names
COLLECTION_STOCKS = "stocks"
COLLECTION_NEWS = "news_articles"
COLLECTION_RATIOS = "ratios"
COLLECTION_HOLDINGS = "holdings"
COLLECTION_FINANCIALS = "financial_summaries"
COLLECTION_RAW_JSON = "raw_json"

# Connect to MongoDB
client = pymongo.MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]

# Ensure indexes
def create_indexes():
    db[COLLECTION_STOCKS].create_index([("sid", 1)], unique=True)
    db[COLLECTION_NEWS].create_index([("sid", 1), ("news_date", -1)])
    db[COLLECTION_RATIOS].create_index([("sid", 1)])
    db[COLLECTION_HOLDINGS].create_index([("sid", 1), ("date", -1)])
    db[COLLECTION_FINANCIALS].create_index([("sid", 1), ("year", -1)])
    db[COLLECTION_RAW_JSON].create_index([("sid", 1), ("news_date", -1)])

# Load and process JSON file
def process_json_file(filepath):
    with open(filepath, 'r') as file:
        raw_data = json.load(file)

    all_operations = {
        COLLECTION_STOCKS: [],
        COLLECTION_NEWS: [],
        COLLECTION_RATIOS: [],
        COLLECTION_HOLDINGS: [],
        COLLECTION_FINANCIALS: [],
        COLLECTION_RAW_JSON: []
    }

    if isinstance(raw_data, list):
        for record in raw_data:
            sid = record.get("sid")
            news_date_str = record.get("news_date") # Use a different variable name to avoid conflict

            # Parse news_date safely
            news_date_obj = None
            if news_date_str:
                try:
                    news_date_obj = datetime.fromisoformat(news_date_str.replace('Z', '+00:00'))
                except ValueError:
                    print(f"Warning: Could not parse news_date '{news_date_str}' for sid {sid}")

            # Prepare stock document
            stock_info = record.get("data_before_date", {}).get("securityInfo", {}).get("info", {})
            stock_doc = {
                "sid": sid,
                "name": stock_info.get("name"),
                "ticker": stock_info.get("ticker"),
                "exchange": stock_info.get("exchange"),
                "sector": stock_info.get("sector"),
                "description": stock_info.get("description"),
                "gic": record.get("data_before_date", {}).get("securityInfo", {}).get("gic", {})
            }
            all_operations[COLLECTION_STOCKS].append(UpdateOne({"sid": stock_doc["sid"]}, {"$set": stock_doc}, upsert=True))

            # Prepare news document
            news_content = record.get("news_content", {})
            news_doc = {
                "sid": sid,
                "news_date": news_date_obj, # Use the parsed object
                "headline": news_content.get("headline"),
                "summary": news_content.get("summary"),
                "publisher": news_content.get("publisher"),
                "tag": news_content.get("tag")
            }
            all_operations[COLLECTION_NEWS].append(InsertOne(news_doc))

            # Prepare ratios document
            ratios_doc = record.get("data_before_date", {}).get("ratios", {})
            ratios_doc["sid"] = sid
            all_operations[COLLECTION_RATIOS].append(UpdateOne({"sid": ratios_doc["sid"]}, {"$set": ratios_doc}, upsert=True))

            # Prepare holdings documents
            holdings = record.get("data_before_date", {}).get("holdings", [])
            for holding in holdings:
                holding_date_str = holding.get("date")
                holding_date_obj = None
                if holding_date_str:
                    try:
                        holding_date_obj = datetime.fromisoformat(holding_date_str.replace('Z', '+00:00'))
                    except ValueError:
                        print(f"Warning: Could not parse holding date '{holding_date_str}' for sid {sid}")
                
                # Ensure the query part also uses the parsed object or handles None correctly
                query_date = holding_date_obj if holding_date_obj else holding_date_str # Fallback to original string if parsing failed, or handle as None
                if not query_date: # If date is truly missing or invalid, skip the update for this specific field
                    continue

                all_operations[COLLECTION_HOLDINGS].append(UpdateOne(
                    {"sid": sid, "date": query_date},
                    {"$set": {"sid": sid, "date": holding_date_obj, "data": holding["data"]}}, upsert=True))

            # Prepare financial summaries
            financials = record.get("data_before_date", {}).get("financialSummary", {}).get("fiscalYearToData", [])
            for fin in financials:
                all_operations[COLLECTION_FINANCIALS].append(UpdateOne(
                    {"sid": sid, "year": int(fin["year"])},
                    {"$set": {"sid": sid, "year": int(fin["year"]), "revenue": fin["revenue"], "profit": fin["profit"]}}, upsert=True))

            # Store raw JSON
            all_operations[COLLECTION_RAW_JSON].append(UpdateOne(
                {"sid": sid, "news_date": news_date_obj}, # Use the parsed object
                {"$set": {"raw_json": record}}, upsert=True))

    elif isinstance(raw_data, dict):
        # Handle the case where the file might contain a single dictionary
        sid = raw_data.get("sid")
        news_date_str = raw_data.get("news_date") # Use a different variable name

        # Parse news_date safely
        news_date_obj = None
        if news_date_str:
            try:
                news_date_obj = datetime.fromisoformat(news_date_str.replace('Z', '+00:00'))
            except ValueError:
                print(f"Warning: Could not parse news_date '{news_date_str}' for sid {sid}")

        # Prepare stock document
        stock_info = raw_data.get("data_before_date", {}).get("securityInfo", {}).get("info", {})
        stock_doc = {
            "sid": sid,
            "name": stock_info.get("name"),
            "ticker": stock_info.get("ticker"),
            "exchange": stock_info.get("exchange"),
            "sector": stock_info.get("sector"),
            "description": stock_info.get("description"),
            "gic": raw_data.get("data_before_date", {}).get("securityInfo", {}).get("gic", {})
        }
        all_operations[COLLECTION_STOCKS].append(UpdateOne({"sid": stock_doc["sid"]}, {"$set": stock_doc}, upsert=True))

        # Prepare news document
        news_content = raw_data.get("news_content", {})
        news_doc = {
            "sid": sid,
            "news_date": news_date_obj, # Use the parsed object
            "headline": news_content.get("headline"),
            "summary": news_content.get("summary"),
            "publisher": news_content.get("publisher"),
            "tag": news_content.get("tag")
        }
        all_operations[COLLECTION_NEWS].append(InsertOne(news_doc))

        # Prepare ratios document
        ratios_doc = raw_data.get("data_before_date", {}).get("ratios", {})
        ratios_doc["sid"] = sid
        all_operations[COLLECTION_RATIOS].append(UpdateOne({"sid": ratios_doc["sid"]}, {"$set": ratios_doc}, upsert=True))

        # Prepare holdings documents
        holdings = raw_data.get("data_before_date", {}).get("holdings", [])
        for holding in holdings:
            holding_date_str = holding.get("date")
            holding_date_obj = None
            if holding_date_str:
                try:
                    holding_date_obj = datetime.fromisoformat(holding_date_str.replace('Z', '+00:00'))
                except ValueError:
                    print(f"Warning: Could not parse holding date '{holding_date_str}' for sid {sid}")
            
            query_date = holding_date_obj if holding_date_obj else holding_date_str
            if not query_date:
                continue

            all_operations[COLLECTION_HOLDINGS].append(UpdateOne(
                {"sid": sid, "date": query_date},
                {"$set": {"sid": sid, "date": holding_date_obj, "data": holding["data"]}}, upsert=True))

        # Prepare financial summaries
        financials = raw_data.get("data_before_date", {}).get("financialSummary", {}).get("fiscalYearToData", [])
        for fin in financials:
            all_operations[COLLECTION_FINANCIALS].append(UpdateOne(
                {"sid": sid, "year": int(fin["year"])},
                {"$set": {"sid": sid, "year": int(fin["year"]), "revenue": fin["revenue"], "profit": fin["profit"]}}, upsert=True))

        # Store raw JSON
        all_operations[COLLECTION_RAW_JSON].append(UpdateOne(
            {"sid": sid, "news_date": news_date_obj}, # Use the parsed object
            {"$set": {"raw_json": raw_data}}, upsert=True))

    else:
        print(f"Unexpected data format in {filepath}")
        return None # Indicate failure or no operations

    return all_operations

# Bulk insert/update function
def bulk_write_docs(collection_name, operations):
    if operations:
        try:
            result = db[collection_name].bulk_write(operations, ordered=False)
            print(f"Bulk write to {collection_name} successful: {result.bulk_api_result}")
        except BulkWriteError as bwe:
            print(f"Bulk write error in {collection_name}: {bwe.details}")

if __name__ == "__main__":
    json_filepath = "processed_zomato-ZOM_raw.json"
    create_indexes()

    try:
        operations_by_collection = process_json_file(json_filepath)

        if operations_by_collection:
            for collection_name, ops in operations_by_collection.items():
                bulk_write_docs(collection_name, ops)

    except FileNotFoundError:
        print(f"Error: File not found at {json_filepath}")
    except Exception as e:
        print(f"An error occurred: {e}")
