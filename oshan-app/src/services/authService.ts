import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backendApi from './apiService'; // Assuming you have an apiService for backend calls

WebBrowser.maybeCompleteAuthSession();

// Hardcode client ID for demonstration. In a real app, use environment variables.
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;

export const signInWithGoogle = async () => {
  try {
    const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId: ANDROID_CLIENT_ID,
      iosClientId: IOS_CLIENT_ID,
      webClientId: WEB_CLIENT_ID,
      scopes: ['profile', 'email'],
    });

    // You would typically call promptAsync from a button press
    // For now, let's assume it's called somewhere higher up or triggered programmatically.
    // This is a simplified example. In a real application, you'd manage the auth flow more robustly.
    const result = await promptAsync();

    if (result.type === 'success') {
      // Safely access id_token from the authentication result
      const idToken = result.authentication?.idToken;

      if (idToken) {
        // Send idToken to your backend for verification and JWT issuance
        const backendResponse = await backendApi.post('/auth/google', { idToken: idToken });
        const { token, userId } = backendResponse.data; // Assuming your backend returns a JWT and user ID

        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userId', userId); // Store user ID for backend calls

        console.log('User signed in. JWT stored.');
        return { success: true, token, userId };
      }
    }
    return { success: false, error: 'Google Sign-In failed or was cancelled.' };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    // Type assertion for error to access its message property
    return { success: false, error: (error as Error).message || 'An unknown error occurred during sign-in.' };
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