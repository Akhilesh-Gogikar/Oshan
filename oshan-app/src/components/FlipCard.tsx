import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
}

const FlipCard: React.FC<FlipCardProps> = ({ frontContent, backContent }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  let isFlipped = false;

  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(animatedValue, {
        toValue: 1,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    isFlipped = !isFlipped;
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
    <TouchableOpacity onPress={flipCard} activeOpacity={1}>
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
          <View style={styles.cardFront}>
            {frontContent}
          </View>
        </Animated.View>
        <Animated.View style={[styles.flipCard, styles.flipCardBack, backAnimatedStyle]}>
          <View style={styles.cardBack}>
            {backContent}
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 300,
    height: 200,
    
  },
  flipCard: {
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    position: 'absolute',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flipCardBack: {
    position: 'absolute',
    top: 0,
  },
  cardFront: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
  },
  cardBack: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
  },
});

export default FlipCard;