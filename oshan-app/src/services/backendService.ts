import backendApi from './apiService';
import { Theme, ChatMessage  as ClientChatMessage } from '../types/models'; // Import ChatMessage as ClientChatMessage
import { AxiosError } from 'axios';

// Define a type for the messages expected by the backend
interface BackendChatMessage {
  role: 'user' | 'assistant' | 'system'; // Backend can accept system messages
  content: string;
}

export const storeQuizResults = async (answers: object) => {
  try {
    const response = await backendApi.post('/profile', answers);
    console.log("Quiz results stored:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error storing quiz results:", error);
    throw error;
  }
}

export const getProfile = async (userId: string) => {
  try {
    const response = await backendApi.get(`/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // If the profile doesn't exist, the backend will return a 404, we can treat that as no profile found
    if ((error as AxiosError).response && (error as AxiosError).response?.status === 404) {
        return null;
    }
    throw error;
  }
}

export const getThemes = async (userId: string): Promise<Theme[]> => {
  try {
    const response = await backendApi.get(`/themes/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching themes:", error);
    if ((error as AxiosError).response && (error as AxiosError).response?.status) {
      // You might want to handle specific error statuses here if needed
    }
    return [];
  }
}

export const getStockReport = async (stockId: string): Promise<string> => {
  try {
    const response = await backendApi.post('/report', { stockId });
    return response.data; // Expecting markdown string
  } catch (error) {
    console.error("Error fetching stock report:", error);
    throw error;
  }
}

export const sendChatMessage = async (messages: BackendChatMessage[]) => {
  try {
    const response = await backendApi.post('/chat', { messages });
    return response.data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
}