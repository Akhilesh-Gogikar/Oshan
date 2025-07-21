import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatMessage, ChatResponse} from '../types/models'; // Use ChatMessage from backendService
import { sendChatMessage } from '../services/backendService'; // Import sendChatMessage from backendService

const ChatScreen = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: 'Hello! I\'m your AI assistant for stock market insights. Ask me anything about stocks, markets, or trading strategies.',
      sender: "ai",
      timestamp: new Date(),
      // context: undefined, // Add context if needed, though not used for initial message
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      // context: undefined, // Add context if needed
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Messages for the backend API
      // The backend expects an array of { role: 'user' | 'assistant' | 'system', content: string }
      const messagesForBackend = [...messages, newUserMessage].map(msg => ({
        role: (msg.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant' | 'system', // Map 'ai' sender to 'assistant' role for backend and cast
        content: msg.message,
      }));

      const response: ChatResponse = await sendChatMessage(messagesForBackend);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response.response,
        sender: 'ai',
        timestamp: new Date(),
        // context: undefined,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert(
        'Error',
        'Failed to get response. Please check your API configuration and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>AI Chat</Text>
          <Text style={styles.subtitle}>Ask questions about stocks and markets</Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.sender === 'user' ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.sender === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.sender === 'user' ? styles.userText : styles.aiText,
                  ]}
                >
                  {message.message}
                </Text>
                <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
              </View>
            </View>
          ))}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text style={styles.loadingText}>AI is thinking...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about stocks, markets, or trading..."
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={[styles.sendButtonText, (!inputText.trim() || isLoading) && styles.sendButtonTextDisabled]}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#e2e8f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  aiText: {
    color: '#1e293b',
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#64748b',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1e293b',
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButtonTextDisabled: {
    color: '#94a3b8',
  },
});

export default ChatScreen;