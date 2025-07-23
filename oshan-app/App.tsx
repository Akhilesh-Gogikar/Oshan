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
import SplashScreen from './src/components/SplashScreen'; // Import SplashScreen
import './src/styles/global.css';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import StockDetailScreen from './src/screens/StockDetailScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';
import ChatScreen from './src/screens/ChatScreen';
import OnboardingQuizScreen from './src/screens/OnboardingQuizScreen';
import ReportScreen from './src/screens/ReportScreen';
import LoginScreen from './src/screens/LoginScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export type RootStackParamList = {
  Login: undefined;
  OnboardingQuiz: undefined;
  MainTabs: undefined;
  StockDetail: { stockId: string };
  Report: { stockId: string };
  Settings: undefined; // Add Settings screen to RootStackParamList
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
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    console.log('[App] useEffect triggered, showSplash:', showSplash);
    const checkAuthStatus = async () => {
      console.log('[App] Checking authentication status...');
      try {
        const { userId } = await getStoredAuthData();
        console.log('[App] AuthService returned userId:', userId);
        setIsLoggedIn(!!userId);
      } catch (error) {
        console.error('[App] Error checking authentication status:', error);
        setIsLoggedIn(false);
      }
    };

    if (!showSplash) {
      checkAuthStatus();
    }
  }, [showSplash]);

  const handleSplashAnimationFinish = () => {
    console.log('[App] Splash animation finished');
    setShowSplash(false);
  };

  if (showSplash) {
    console.log('[App] Showing SplashScreen');
    return <SplashScreen onAnimationFinish={handleSplashAnimationFinish} />;
  }

  if (isLoggedIn === null) {
    console.log('[App] isLoggedIn is null, showing loading spinner');
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading app...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  console.log('[App] Rendering main app, isLoggedIn:', isLoggedIn);
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
                  {console.log('[App] User is logged in, showing MainTabs and other screens')}
                  <Stack.Screen name="MainTabs" component={MainTabs} />
                  <Stack.Screen name="StockDetail" component={StockDetailScreen} />
                  <Stack.Screen name="Report" component={ReportScreen} />
                  <Stack.Screen name="Settings" component={SettingsScreen} />
                </>
              ) : (
                // User is not logged in, navigate to Login screen
                <>
                  {console.log('[App] User is not logged in, showing Login and Onboarding screens')}
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