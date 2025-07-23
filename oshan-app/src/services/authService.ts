import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './apiService';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Client IDs from environment variables
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;

// Create a singleton instance for the auth request
let authRequest: any = null;
let promptAsync: any = null;

export const initializeGoogleAuth = () => {
  [authRequest, , promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
  });
};

export const signInWithGoogle = async () => {
  try {
    // Ensure auth is initialized
    if (!promptAsync) {
      initializeGoogleAuth();
    }

    // For web platform, we might need to handle differently
    if (Platform.OS === 'web') {
      return await signInWithGoogleWeb();
    }

    const result = await promptAsync();

    if (result.type === 'success') {
      const idToken = result.authentication?.idToken;

      if (idToken) {
        return await handleGoogleSignIn(idToken);
      }
    }
    
    return { success: false, error: 'Google Sign-In failed or was cancelled.' };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred during sign-in.' };
  }
};

// Separate handler for web platform
const signInWithGoogleWeb = async () => {
  try {
    const [request, response, promptAsync] = Google.useAuthRequest({
      webClientId: WEB_CLIENT_ID,
      scopes: ['profile', 'email'],
    });

    const result = await promptAsync();

    if (result?.type === 'success') {
      const idToken = result.authentication?.idToken;
      if (idToken) {
        return await handleGoogleSignIn(idToken);
      }
    }
    
    return { success: false, error: 'Google Sign-In failed or was cancelled.' };
  } catch (error) {
    console.error('Web Google Sign-In Error:', error);
    return { success: false, error: (error as Error).message || 'An unknown error occurred during sign-in.' };
  }
};

// Common handler for Google sign-in
const handleGoogleSignIn = async (idToken: string) => {
  try {
    const backendResponse = await apiService.post('/auth/google', { idToken });
    const { token, userId } = backendResponse.data;

    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userId', userId);

    console.log('User signed in. JWT stored.');
    return { success: true, token, userId };
  } catch (error) {
    console.error('Backend authentication error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId'); // Remove user ID on sign out
    console.log('User signed out.');
    return { success: true };
  } catch (error) {
    console.error('Sign Out Error:', error);
    // Type assertion for error to access its message property
    return { success: false, error: (error as Error).message || 'An unknown error occurred during sign-out.' };
  }
};

export const getStoredAuthData = async () => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    const userId = await AsyncStorage.getItem('userId');
    return { userToken, userId };
  } catch (error) {
    console.error('Error getting stored auth data:', error);
    return { userToken: null, userId : null };
  }
};