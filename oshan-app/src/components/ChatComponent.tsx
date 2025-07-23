import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styled, useColorScheme } from 'nativewind';
import { useTheme } from '../context/ThemeContext';
import { sendChatMessage } from '../services/backendService';
import { ChatMessage, ChatResponse } from '../types/models';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledActivityIndicator = styled(ActivityIndicator);

// Get screen width for responsive adjustments
const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 768; // Tailwind's 'md' breakpoint is 768px

interface ChatComponentProps {
  initialMessages?: ChatMessage[];
  context?: any; // Context for the LLM, e.g., stock details
}

const ChatComponent: React.FC<ChatComponentProps> = ({ initialMessages = [], context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const {colorScheme} = useColorScheme();
  const {theme} = useTheme();

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
      className="flex-1 bg-gray-100 dark:bg-zinc-900"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{padding: 8, paddingBottom: 20}} // Using inline style as contentContainerClassName is not working with tw
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <StyledView
            key={index}
            className={`p-3 rounded-xl m-1 ${
              msg.sender === 'user'
                ? 'self-end bg-blue-500 dark:bg-blue-700'
                : 'self-start bg-gray-300 dark:bg-zinc-700'
            } shadow-md shadow-black/20 ${
              Platform.OS === 'web' && isSmallScreen ? 'max-w-full' : 'max-w-[80%]'
            }`}
          >
            <StyledText
              className={`${
                msg.sender === 'user'
                  ? 'text-white'
                  : 'text-gray-900 dark:text-gray-100'
              } text-base`}
            >
              {msg.message}
            </StyledText>
          </StyledView>
        ))}
        {isLoading && (
          <StyledView className="flex-row items-center p-2 self-start bg-gray-300 dark:bg-zinc-700 rounded-xl m-1">
            <StyledActivityIndicator size="small" color={colorScheme === 'dark' ? theme.colors.primary : "#007AFF"} />
            <StyledText className="ml-2 text-gray-900 dark:text-gray-100">Thinking...</StyledText>
          </StyledView>
        )}
      </ScrollView>

      <StyledView className="flex-row p-3 border-t border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 items-center">
        <StyledTextInput
          className="flex-1 border border-gray-400 dark:border-zinc-600 rounded-3xl px-4 py-3 mr-3 text-base text-gray-900 dark:text-gray-100 max-h-30"
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask Oshan anything..."
          placeholderTextColor={colorScheme === 'dark' ? "#a1a1aa" : "#999"}
          multiline
        />
        <StyledTouchableOpacity
          className="bg-blue-500 dark:bg-blue-700 rounded-3xl w-12 h-12 justify-center items-center"
          onPress={handleSendMessage}
          disabled={isLoading || inputText.trim().length === 0}
        >
          {isLoading ? (
            <StyledActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={24} color="#fff" />
          )}
        </StyledTouchableOpacity>
      </StyledView>
    </KeyboardAvoidingView>
  );
};

export default ChatComponent;