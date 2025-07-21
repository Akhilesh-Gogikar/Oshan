import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const uri = process.env.MONGODB_URI;
const dbName = new URL(uri!).pathname.substring(1); // Extract db name from URI

let client: MongoClient;
let db: Db;

async function connectToMongo() {
  if (db) {
    return db;
  }

  if (!uri) {
    throw new Error('MongoDB URI not found in environment variables.');
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected successfully to MongoDB');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Example function to insert a document
async function insertDocument(collectionName: string, document: object) {
  const database = await connectToMongo();
  const collection = database.collection(collectionName);
  const result = await collection.insertOne(document);
  console.log(`A document was inserted with the _id: ${result.insertedId}`);
  return result;
}

// Example function to find documents
async function findDocuments(collectionName: string, query: object = {}) {
  const database = await connectToMongo();
  const collection = database.collection(collectionName);
  const cursor = collection.find(query);
  const documents = await cursor.toArray();
  console.log(`Found ${documents.length} documents`);
  return documents;
}

// Close the connection when the application is shutting down
async function closeMongoConnection() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Function to retrieve all stocks
export async function getAllStocks() {
  try {
    const stocks = await findDocuments('stocks');
    return stocks;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
}
export { connectToMongo, insertDocument, findDocuments, closeMongoConnection };