import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stock } from '../types/models';

interface StockCardProps {
  stock: Stock;
  onPress: () => void;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, onPress }) => {
  const priceChange = stock.currentPrice - stock.previousClose;
  const priceChangePercent = (priceChange / stock.previousClose) * 100;
  const isPositive = priceChange >= 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftSection}>
        <Text style={styles.symbol}>{stock.symbol}</Text>
        <Text style={styles.name} numberOfLines={1}>{stock.name}</Text>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={styles.price}>${stock.currentPrice.toFixed(2)}</Text>
        <Text style={[styles.change, isPositive ? styles.positive : styles.negative]}>
          {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  leftSection: {
    flex: 1,
    marginRight: 12,
  },
  symbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.3,
  },
  name: {
    fontSize: 15,
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.3,
  },
  change: {
    fontSize: 15,
    marginTop: 4,
    fontWeight: '600',
  },
  positive: {
    color: '#10b981',
  },
  negative: {
    color: '#ef4444',
  },
});