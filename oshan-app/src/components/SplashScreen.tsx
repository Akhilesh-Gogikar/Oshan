import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';

interface SplashScreenProps {
  onAnimationFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationFinish }) => {
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 1000 });
    logoScale.value = withSequence(
      withTiming(1.2, { duration: 1000 }),
      withTiming(1, { duration: 500 }),
      withDelay(500, withTiming(5, { duration: 1000 })),
    );

    const timer = setTimeout(() => {
      onAnimationFinish();
    }, 3000); // Total animation time + delay

    return () => clearTimeout(timer);
  }, [logoScale, logoOpacity, onAnimationFinish]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/icon.png')} // Adjust path to your app icon
        style={[styles.logo, animatedStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Or your splash screen background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});

export default SplashScreen;