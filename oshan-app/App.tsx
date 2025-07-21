import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { ThemeProvider } from './src/context/ThemeContext';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { getStoredAuthData } from './src/services/authService'; // Only need to check auth status here

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import StockDetailScreen from './src/screens/StockDetailScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';
import ChatScreen from './src/screens/ChatScreen';
import OnboardingQuizScreen from './src/screens/OnboardingQuizScreen';
import ReportScreen from './src/screens/ReportScreen';
import LoginScreen from './src/screens/LoginScreen'; // Import the new LoginScreen

export type RootStackParamList = {
  Login: undefined;
  OnboardingQuiz: undefined;
  MainTabs: undefined;
  StockDetail: { stockId: string };
  Report: { stockId: string };
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#2563eb',
      tabBarInactiveTintColor: '#6b7280',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopColor: '#e5e7eb',
      },
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Explore" component={ExploreScreen} />
    <Tab.Screen name="Watchlist" component={WatchlistScreen} />
    <Tab.Screen name="Chat" component={ChatScreen} />
  </Tab.Navigator>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null means still checking auth status

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { userId } = await getStoredAuthData();
        setIsLoggedIn(!!userId); // Set to true if userId exists, false otherwise
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsLoggedIn(false); // Assume not logged in on error
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoggedIn === null) {
    // Show loading indicator while checking authentication status
    return (
      <SafeAreaProvider style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading app...</Text>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {isLoggedIn ? (
                // User is logged in, navigate to main tabs
                <>
                  <Stack.Screen name="MainTabs" component={MainTabs} />
                  <Stack.Screen name="StockDetail" component={StockDetailScreen} />
                  <Stack.Screen name="Report" component={ReportScreen} />
                </>
              ) : (
                // User is not logged in, navigate to Login screen
                <>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="OnboardingQuiz" component={OnboardingQuizScreen} />
                  <Stack.Screen name="MainTabs" component={MainTabs} />
                  <Stack.Screen name="StockDetail" component={StockDetailScreen} />
                  <Stack.Screen name="Report" component={ReportScreen} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
});

export default App;