import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StockCard } from '../components/StockCard';
import FlipCard from '../components/FlipCard';
import { Theme, Stock } from '../types/models'; // Assuming Theme interface is available
import { getThemes } from '../services/backendService'; // Import the new service function
import { getStoredAuthData } from '../services/authService'; // Import auth service for user ID

const HomeScreen = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const { userId } = await getStoredAuthData();
        if (userId) {
          const fetchedThemes = await getThemes(userId);
          setThemes(fetchedThemes);
        } else {
          setError("User not logged in or no user ID found.");
        }
      } catch (err) {
        console.error("Failed to fetch themes:", err);
        setError("Failed to load personalized themes.");
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading themes...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Oshan</Text>
          {/* Main CTA banner */}
          <View style={styles.ctaBanner}>
            <Text style={styles.ctaText}>🎣 Catch the Big Fish</Text>
          </View>
        </View>

        {/* Personalized Themes */}
        <Text style={styles.sectionTitle}>Your Themes</Text>
        <View style={styles.themeList}>
          {themes.length > 0 ? (
            themes.map((theme) => (
              <View key={theme.id} style={styles.themeCard}>
                <Text style={styles.themeName}>{theme.name}</Text>
                <Text style={styles.themeDescription}>{theme.description}</Text>
                {theme.stocks && theme.stocks.length > 0 && (
                  <Text style={styles.themeStocks}>
                    Key Stocks: {theme.stocks.join(', ')}
                  </Text>
                )}
                <Text style={styles.themePerformance}>Performance: {theme.performance}% ({theme.trend})</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noThemesText}>No personalized themes found. Try adjusting your profile!</Text>
          )}
        </View>

        {/* Trending Now */}
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stockCardScroll}>
          {/* Placeholder StockCards */}
          <StockCard stock={{ sid: '1', symbol: 'MSFT', name: 'Microsoft', currentPrice: 0, previousClose: 0, exchange: 'NASDAQ', sector: 'Technology' }} onPress={() => {}}/>
          <StockCard stock={{ sid: '2', symbol: 'AAPL', name: 'Apple', currentPrice: 0, previousClose: 0, exchange: 'NASDAQ', sector: 'Technology' }} onPress={() => {}}/>
          <StockCard stock={{ sid: '3', symbol: 'GOOG', name: 'Google', currentPrice: 0, previousClose: 0, exchange: 'NASDAQ', sector: 'Technology' }} onPress={() => {}}/>
        </ScrollView>

        {/* Flip Cards for News/Stories */}
        <Text style={styles.sectionTitle}>Today's Stories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.flipCardScroll}>
          <FlipCard
            frontContent={
              <View style={styles.flipCardContent}>
                <Text style={styles.flipCardTitle}>Why IT's Hot</Text>
                <Text style={styles.flipCardText}>Tap to learn more</Text>
              </View>
            }
            backContent={
              <View style={styles.flipCardContent}>
                <Text style={styles.flipCardTitle}>IT Sector Surges</Text>
                <Text style={styles.flipCardText}>
                  The information technology sector is experiencing a significant boom due to increased digital transformation initiatives across industries.
                </Text>
              </View>
            }
          />
          {/* Add more FlipCard components as needed for actual news/stories */}
          <FlipCard
            frontContent={
              <View style={styles.flipCardContent}>
                <Text style={styles.flipCardTitle}>Green Energy</Text>
                <Text style={styles.flipCardText}>Explore opportunities</Text>
              </View>
            }
            backContent={
              <View style={styles.flipCardContent}>
                <Text style={styles.flipCardTitle}>Sustainable Growth</Text>
                <Text style={styles.flipCardText}>
                  Investments in renewable energy sources are rapidly increasing, driven by global sustainability goals and supportive government policies.
                </Text>
              </View>
            }
          />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  themeList: {
    padding: 16,
  },
  themeCard:{
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  themeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  themeDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  themeStocks: {
    fontSize: 13,
    color: '#777',
    marginBottom: 3,
  },
  themePerformance: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745', // Green for positive, could be dynamic
  },
  noThemesText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  ctaBanner: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockCardScroll: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  flipCardScroll: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  flipCardContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  flipCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  flipCardText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
    marginBottom: 10,
    marginTop: 20,
  },
});

export default HomeScreen;