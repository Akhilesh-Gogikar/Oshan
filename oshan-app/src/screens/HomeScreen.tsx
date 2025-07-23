import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StockCard } from '../components/StockCard';
import FlipCard from '../components/FlipCard';
import { Theme, Stock, NewsArticle } from '../types/models';
import { useTheme } from '../context/ThemeContext';
import { getThemes } from '../services/backendService';
import { getStoredAuthData } from '../services/authService';
import { getStocks, getNews } from '../services/apiService'; // Import getStocks and getNews

const HomeScreen = () => {
  const { theme } = useTheme();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [trendingStocks, setTrendingStocks] = useState<Stock[]>([]);
  const [newsStories, setNewsStories] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { userId } = await getStoredAuthData();
        if (userId) {
          const fetchedThemes = await getThemes(userId);
          setThemes(fetchedThemes);
        } else {
          setError("User not logged in or no user ID found.");
        }

        const fetchedStocks = await getStocks(); // Fetch trending stocks
        setTrendingStocks(fetchedStocks);

        const fetchedNews = await getNews(); // Fetch news stories
        setNewsStories(fetchedNews);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={{ color: theme.colors.text }}>Loading data...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>Oshan</Text>
          {/* Main CTA banner */}
          <View style={[styles.ctaBanner, { backgroundColor: theme.colors.secondary }]}>
            <Text style={[styles.ctaText, { color: theme.colors.primary }]}>🎣 Catch the Big Fish</Text>
          </View>
        </View>

        {/* Personalized Themes */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Themes</Text>
        <View style={styles.themeList}>
          {themes.length > 0 ? (
            themes.map((t) => (
              <View key={t.id} style={[styles.themeCard, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow }]}>
                <Text style={[styles.themeName, { color: theme.colors.secondary }]}>{t.name}</Text>
                <Text style={[styles.themeDescription, { color: theme.colors.textSecondary }]}>{t.description}</Text>
                {t.stocks && t.stocks.length > 0 && (
                  <Text style={[styles.themeStocks, { color: theme.colors.textSecondary }]}>
                    Key Stocks: {t.stocks.join(', ')}
                  </Text>
                )}
                <Text style={[styles.themePerformance, { color: t.trend === 'up' ? '#28a745' : '#dc3545' }]}>Performance: {t.performance}% ({t.trend})</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.noThemesText, { color: theme.colors.textSecondary }]}>No personalized themes found. Try adjusting your profile!</Text>
          )}
        </View>

        {/* Trending Now */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Trending Now</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stockCardScroll}>
          {trendingStocks.length > 0 ? (
            trendingStocks.map((stock) => (
              <StockCard key={stock.sid} stock={stock} onPress={() => { /* Navigate to StockDetailScreen */ }} />
            ))
          ) : (
            <Text style={[styles.noDataText, { color: theme.colors.textSecondary }]}>No trending stocks available.</Text>
          )}
        </ScrollView>

        {/* Flip Cards for News/Stories */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Today's Stories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.flipCardScroll}>
          {newsStories.length > 0 ? (
            newsStories.map((article) => (
              <FlipCard
                key={article.sid}
                frontContent={
                  <View style={[styles.flipCardContent, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.flipCardTitle, { color: theme.colors.primary }]}>{article.headline}</Text>
                    <Text style={[styles.flipCardText, { color: theme.colors.textSecondary }]}>Tap to learn more</Text>
                  </View>
                }
                backContent={
                  <View style={[styles.flipCardContent, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.flipCardTitle, { color: theme.colors.primary }]}>{article.headline}</Text>
                    <Text style={[styles.flipCardText, { color: theme.colors.textSecondary }]}>{article.summary}</Text>
                  </View>
                }
              />
            ))
          ) : (
            <Text style={[styles.noDataText, { color: theme.colors.textSecondary }]}>No news stories available.</Text>
          )}
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
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    width: '100%',
  },
});

export default HomeScreen;