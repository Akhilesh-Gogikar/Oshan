import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming Expo for icons
import { sendChatMessage } from '../services/backendService';
import { ChatMessage, ChatResponse } from '../types/models';

interface ChatComponentProps {
  initialMessages?: ChatMessage[];
  context?: any; // Context for the LLM, e.g., stock details
}

const ChatComponent: React.FC<ChatComponentProps> = ({ initialMessages = [], context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputText.trim().length === 0) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Constructing messages for the backend API
      // If there's context, add it to the user's message
      const messageContent = context
        ? `Current context: ${JSON.stringify(context)}. User message: ${newUserMessage.message}`
        : newUserMessage.message;

      // Constructing messages for the backend API (sending only user/assistant messages)
      const messagesToSend = updatedMessages.map(msg => ({
        role: (msg.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant' | 'system', // Map 'ai' to 'assistant' for backend and cast
        content: msg.message,
      }));

      // Replace the last user message with the one including context
      messagesToSend[messagesToSend.length - 1] = {
        role: 'user',
        content: messageContent,
      } as any; // Cast to any to bypass type checking here temporarily, this assumes BackendChatMessage
      
      const response: ChatResponse = await sendChatMessage(messagesToSend);

      if (response && response.success && response.response) {
       const aiMessage: ChatMessage = {
         id: (Date.now() + 1).toString(),
         message: response.response,
         sender: 'ai',
         timestamp: new Date(),
       };
        setMessages(prev => [...prev, aiMessage]);
      } else {
       const errorMessage: ChatMessage = {
         id: (Date.now() + 1).toString(),
         message: 'Sorry, I could not get a response.',
         sender: 'ai',
         timestamp: new Date(),
       };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
       id: (Date.now() + 1).toString(),
       message: 'An error occurred. Please try again later.',
       sender: 'ai',
       timestamp: new Date(),
     };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // Adjust this offset as needed
    >
      <ScrollView 
        ref={scrollViewRef} 
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <View key={index} style={[
            styles.messageBubble,
            msg.sender === 'user' ? styles.userMessage : styles.assistantMessage,
          ]}>
            <Text style={msg.sender === 'user' ? styles.userText : styles.assistantText}>
              {msg.message}
            </Text>
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask Oshan anything..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSendMessage} 
          disabled={isLoading || inputText.trim().length === 0}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    padding: 10,
    paddingBottom: 20, // Add some bottom padding
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',
    elevation: 1, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  userText: {
    color: '#fff',
    fontSize: 16,
  },
  assistantText: {
    color: '#333',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 120, // Limit height for multiline input
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    marginVertical: 5,
  },
  loadingText: {
    marginLeft: 10,
    color: '#333',
  },
});

export default ChatComponent;