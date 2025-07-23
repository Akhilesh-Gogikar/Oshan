import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
}

const FlipCard: React.FC<FlipCardProps> = ({ frontContent, backContent }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  // Using a ref to track flipped state to avoid re-renders and potential animation issues
  const isFlippedRef = useRef(false);

  const flipCard = () => {
    if (isFlippedRef.current) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start(() => {
        isFlippedRef.current = false;
      });
    } else {
      Animated.spring(animatedValue, {
        toValue: 1,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start(() => {
        isFlippedRef.current = true;
      });
    }
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <StyledTouchableOpacity onPress={flipCard} activeOpacity={1} className="w-[300px] h-[200px] mx-2 my-2">
      <StyledView className="w-full h-full">
        <Animated.View style={[
          { backfaceVisibility: 'hidden' },
          frontAnimatedStyle,
          { position: 'absolute', width: '100%', height: '100%', borderRadius: 8,
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
          }
        ]}>
          <StyledView className="w-full h-full bg-white border border-gray-200 justify-center items-center rounded-lg p-4">
            {frontContent}
          </StyledView>
        </Animated.View>
        <Animated.View style={[
          { backfaceVisibility: 'hidden' },
          backAnimatedStyle,
          { position: 'absolute', top: 0, width: '100%', height: '100%', borderRadius: 8,
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
          }
        ]}>
          <StyledView className="w-full h-full bg-white border border-gray-200 justify-center items-center rounded-lg p-4">
            {backContent}
          </StyledView>
        </Animated.View>
      </StyledView>
    </StyledTouchableOpacity>
  );
};

export default FlipCard;