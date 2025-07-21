import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions, Button, SafeAreaView } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useGetStockQuery } from '../services/stockApi';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { StackNavigationProp } from '@react-navigation/stack';
import ChatComponent from '../components/ChatComponent'; // Import the new ChatComponent

type RootStackParamList = {
  StockDetail: { stockId: string };
  Report: { stockId: string }; // Add Report screen to RootStackParamList
};

type StockDetailScreenRouteProp = RouteProp<RootStackParamList, 'StockDetail'>;

const StockDetailScreen = () => {
  const route = useRoute<StockDetailScreenRouteProp>();
  const { stockId } = route.params;
  const { data: stock, error, isLoading } = useGetStockQuery(stockId);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading stock details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error loading stock details</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!stock) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Stock not found</Text>
        </View>
      </SafeAreaView>
    );
  }


  const HomeRoute = ({ stock, priceChange, priceChangePercent, isPositive }: any) => (
    <ScrollView style={styles.tabContent}>
      {/* Existing Stock Details */}
        <View style={styles.header}>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <Text style={styles.name}>{stock.name}</Text>
          <Text style={styles.exchange}>{stock.exchange}</Text>
        </View>
        
        <View style={styles.priceSection}>
          <Text style={styles.price}>${stock.currentPrice.toFixed(2)}</Text>
          <Text style={[styles.change, isPositive ? styles.positive : styles.negative]}>
            {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
          </Text>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Previous Close</Text>
            <Text style={styles.detailValue}>${stock.previousClose.toFixed(2)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Market Cap</Text>
            <Text style={styles.detailValue}>
              {stock.marketCap ? `$${(stock.marketCap / 1000000000).toFixed(2)}B` : 'N/A'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>P/E Ratio</Text>
            <Text style={styles.detailValue}>{stock.peRatio || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>ROE</Text>
            <Text style={styles.detailValue}>{stock.roe ? `${stock.roe}%` : 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>EPS</Text>
            <Text style={styles.detailValue}>{stock.eps || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Sector</Text>
            <Text style={styles.detailValue}>{stock.sector}</Text>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{stock.description || 'No description available.'}</Text>
        </View>
    </ScrollView>
  );

  const FinancialsRoute = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Financials Data (Coming Soon)</Text>
      <Text>Detailed financial statements and charts will be displayed here.</Text>
    </ScrollView>
  );

  const AnalystChatRoute = ({ stock }: any) => {
    // Basic context for the chat. You can expand this with more stock details, user profile, etc.
    const chatContext = {
      stockName: stock.name,
      stockSymbol: stock.symbol,
      // Add other relevant stock details here
    };

    return (
      <View style={styles.chatTabContent}>
        <ChatComponent context={chatContext} />
      </View>
    );
  };

  const NewsRoute = ({ stock }: any) => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>News & Updates (Coming Soon)</Text>
      <Text>Latest news and relevant articles for {stock.name}.</Text>
    </ScrollView>
  );
 
  type StockDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StockDetail'>;
 
   const ReportRoute = () => {
    const navigation = useNavigation<StockDetailScreenNavigationProp>();
     return (
       <ScrollView style={styles.tabContent}>
         <Text style={styles.sectionTitle}>Research Report</Text>
         <Text>Tap the button below to generate and view the detailed research report for {stock?.name}.</Text>
         <Button
           title="Generate Report"
           onPress={() => navigation.navigate('Report', { stockId: stockId })}
           color="#007bff"
         />
       </ScrollView>
     );
   };
 
   const initialLayout = { width: Dimensions.get('window').width };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'summary', title: 'Summary' },
    { key: 'financials', title: 'Financials' },
    { key: 'chat', title: 'Analyst Chat' },
    { key: 'news', title: 'News' },
    { key: 'report', title: 'Report' },
  ]);

  const renderScene = SceneMap({
    summary: HomeRoute,
    financials: FinancialsRoute,
    chat: AnalystChatRoute,
    news: NewsRoute,
    report: ReportRoute,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading stock details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error loading stock details</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!stock) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Stock not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const priceChange = stock.currentPrice - stock.previousClose;
  const priceChangePercent = (priceChange / stock.previousClose) * 100;
  const isPositive = priceChange >= 0;

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      scrollEnabled
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'summary':
              return <HomeRoute stock={stock} priceChange={priceChange} priceChangePercent={priceChangePercent} isPositive={isPositive} />;
            case 'financials':
              return <FinancialsRoute />;
            case 'chat':
              return <AnalystChatRoute stock={stock} />;
            case 'news':
              return <NewsRoute stock={stock} />;
            case 'report':
              return <ReportRoute />;
            default:
              return null;
          }
        }}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 20,
  },
  chatTabContent: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  symbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  name: {
    fontSize: 20,
    color: '#6b7280',
    marginTop: 4,
  },
  exchange: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 2,
  },
  priceSection: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  change: {
    fontSize: 18,
    marginLeft: 10,
  },
  positive: {
    color: '#00C851',
  },
  negative: {
    color: '#FF4444',
  },
  detailsSection: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    marginTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  descriptionSection: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
  },
  tabBar: {
    backgroundColor: '#ffffff',
  },
  tabLabel: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabIndicator: {
    backgroundColor: '#3b82f6',
    height: 3,
  },
});

export default StockDetailScreen;