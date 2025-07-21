import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetStocksQuery } from '../services/stockApi';
import { StockCard } from '../components/StockCard';

const ExploreScreen = () => {
  const { data: stocks, isLoading, isError } = useGetStocksQuery();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover Investment Themes</Text>
        </View>
        
        <View style={styles.content}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#3b82f6" />
          ) : isError ? (
            <Text style={styles.errorText}>Failed to load stocks</Text>
          ) : (
            stocks?.map(stock => (
              <StockCard
                key={stock.sid}
                stock={stock}
                onPress={() => console.log('Pressed stock:', stock.sid)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
});

export default ExploreScreen;