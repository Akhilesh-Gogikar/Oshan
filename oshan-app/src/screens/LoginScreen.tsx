import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App'; // Adjust path if necessary
import backendApi from '../services/apiService'; // Assuming apiService is available
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

WebBrowser.maybeCompleteAuthSession();

type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const idToken = authentication?.idToken;

      const handleLogin = async () => {
        setLoading(true);
        if (idToken) {
          try {
            const backendResponse = await backendApi.post('/auth/google', { idToken });
            const { token, userId } = backendResponse.data;

            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userId', userId);

            console.log('User signed in. JWT stored.');
            // In a real app, you might check if user profile exists to decide navigation
            // For this example, we assume if userId exists, user is logged in.
            // Navigate to MainTabs or OnboardingQuiz based on whether it's a new user
            // For now, let's always go to OnboardingQuiz if it's the first time, or MainTabs if not
            const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');

            if (hasCompletedOnboarding === 'true') {
              navigation.replace('MainTabs');
            } else {
              navigation.replace('OnboardingQuiz');
            }

          } catch (error) {
            console.error('Backend authentication error:', error);
            Alert.alert('Login Error', 'Failed to authenticate with backend.');
          } finally {
            setLoading(false);
          }
        } else {
          Alert.alert('Login Failed', 'No ID token received from Google.');
          setLoading(false);
        }
      };
      handleLogin();
    } else if (response?.type === 'cancel') {
        Alert.alert('Login Cancelled', 'Google Sign-In was cancelled.');
    } else if (response?.type === 'error') {
        Alert.alert('Login Error', 'An error occurred during Google Sign-In.');
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Oshan 🌊</Text>
      <Text style={styles.subtitle}>Discover Indian stocks with AI insights.</Text>
      <Button
        title="Sign in with Google"
        disabled={!request || loading}
        onPress={() => {
          setLoading(true);
          promptAsync();
        }}
      />
      {loading && <ActivityIndicator size="small" color="#0000ff" style={styles.loading} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  loading: {
    marginTop: 20,
  },
});

export default LoginScreen;