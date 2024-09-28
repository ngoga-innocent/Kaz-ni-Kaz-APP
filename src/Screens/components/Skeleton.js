import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const Skeleton = ({ width, height, borderRadius = 4 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1300,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.skeletonContainer, { width, height, borderRadius }]}>
      <Animated.View
        style={[
          styles.shimmer,
          { transform: [{ translateX }], borderRadius },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    backgroundColor: '#e0e0e0', // Base color for skeleton
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f0f0f0', // Lighter shimmer color
    opacity: 0.7,
  },
});

export default Skeleton;
