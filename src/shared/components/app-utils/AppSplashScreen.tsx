import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import colors from '../../theme/colors';

const { width, height } = Dimensions.get('window');

type IconName = 'key-variant' | 'wallet' | 'cellphone' | 'bag-personal' | 'watch' | 'glasses' | 'headphones' | 'camera';

interface FloatingItemProps {
  delay: number;
  startX: number;
  startY: number;
  icon: IconName;
  size: number;
  color: string;
}

function FloatingItem({ delay, startX, startY, icon, size, color }: FloatingItemProps) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.3);
  const rotate = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.7, { duration: 800 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 10 }));

    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-20, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
          withTiming(20, { duration: 2500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(15, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-15, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    rotate.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: startX,
          top: startY,
          width: size + 20,
          height: size + 20,
          borderRadius: (size + 20) / 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        },
        animatedStyle,
      ]}
    >
      <MaterialCommunityIcons name={icon} size={size} color={color} />
    </Animated.View>
  );
}

function SearchPulse() {
  const ringScale1 = useSharedValue(0.6);
  const ringScale2 = useSharedValue(0.6);
  const ringScale3 = useSharedValue(0.6);
  const ringOpacity1 = useSharedValue(0);
  const ringOpacity2 = useSharedValue(0);
  const ringOpacity3 = useSharedValue(0);

  useEffect(() => {
    const animateRing = (
      scaleValue: SharedValue<number>,
      opacityValue: SharedValue<number>,
      delay: number
    ) => {
      scaleValue.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0.6, { duration: 0 }),
            withTiming(2.2, { duration: 2000, easing: Easing.out(Easing.ease) })
          ),
          -1
        )
      );
      opacityValue.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0.6, { duration: 0 }),
            withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) })
          ),
          -1
        )
      );
    };

    animateRing(ringScale1, ringOpacity1, 300);
    animateRing(ringScale2, ringOpacity2, 900);
    animateRing(ringScale3, ringOpacity3, 1500);
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale1.value }],
    opacity: ringOpacity1.value,
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale2.value }],
    opacity: ringOpacity2.value,
  }));

  const ring3Style = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale3.value }],
    opacity: ringOpacity3.value,
  }));

  return (
    <>
      <Animated.View style={[styles.searchRing, ring1Style]} />
      <Animated.View style={[styles.searchRing, ring2Style]} />
      <Animated.View style={[styles.searchRing, ring3Style]} />
    </>
  );
}

function MagnifierIcon() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(-20);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    scale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 80 }));
    rotate.value = withDelay(200, withSpring(0, { damping: 12 }));

    pulseScale.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(1.08, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value * pulseScale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.magnifierContainer, animatedStyle]}>
      <View style={styles.magnifierCircle}>
        <MaterialCommunityIcons name="magnify" size={70} color="#fff" />
      </View>
    </Animated.View>
  );
}

function LocationPin() {
  const bounce = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    bounce.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 400, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 400, easing: Easing.in(Easing.ease) })
        ),
        -1
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.locationPin, animatedStyle]}>
      <MaterialCommunityIcons name="map-marker" size={32} color="#ef4444" />
    </Animated.View>
  );
}

interface AppSplashScreenProps {
  onAnimationComplete?: () => void;
}

export function AppSplashScreen({ onAnimationComplete }: AppSplashScreenProps) {
  const gradientProgress = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);
  const checkmarkOpacity = useSharedValue(0);

  useEffect(() => {
    // Background gradient animation
    gradientProgress.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Checkmark animation (found!)
    checkmarkScale.value = withDelay(1200, withSpring(1, { damping: 8 }));
    checkmarkOpacity.value = withDelay(1200, withTiming(1, { duration: 300 }));

    if (onAnimationComplete) {
      const timer = setTimeout(onAnimationComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      gradientProgress.value,
      [0, 0.5, 1],
      ['#f0f9ff', '#e8f4fe', '#f0f9ff']
    );
    return { backgroundColor };
  });

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
    opacity: checkmarkOpacity.value,
  }));

  // Lost & Found themed floating items
  const floatingItems: FloatingItemProps[] = [
    { delay: 100, startX: width * 0.05, startY: height * 0.12, icon: 'key-variant', size: 28, color: '#f59e0b' },
    { delay: 300, startX: width * 0.75, startY: height * 0.08, icon: 'wallet', size: 26, color: '#8b5cf6' },
    { delay: 200, startX: width * 0.8, startY: height * 0.35, icon: 'cellphone', size: 26, color: '#3b82f6' },
    { delay: 500, startX: width * 0.02, startY: height * 0.4, icon: 'bag-personal', size: 28, color: '#ec4899' },
    { delay: 400, startX: width * 0.1, startY: height * 0.72, icon: 'watch', size: 24, color: '#14b8a6' },
    { delay: 600, startX: width * 0.7, startY: height * 0.75, icon: 'glasses', size: 26, color: '#6366f1' },
    { delay: 350, startX: width * 0.4, startY: height * 0.05, icon: 'headphones', size: 26, color: '#f43f5e' },
    { delay: 550, startX: width * 0.78, startY: height * 0.6, icon: 'camera', size: 24, color: '#0ea5e9' },
  ];

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Floating lost items */}
      {floatingItems.map((item, index) => (
        <FloatingItem key={index} {...item} />
      ))}

      {/* Subtle gradient overlay */}
      <LinearGradient
        colors={['rgba(19, 127, 236, 0.03)', 'transparent', 'rgba(19, 127, 236, 0.05)']}
        style={styles.gradientOverlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Center content */}
      <View style={styles.centerContent}>
        {/* Search pulse rings */}
        <SearchPulse />

        {/* Main magnifier icon */}
        <MagnifierIcon />

        {/* Location pin indicator */}
        <LocationPin />

        {/* Found checkmark */}
        <Animated.View style={[styles.checkmark, checkmarkStyle]}>
          <View style={styles.checkmarkCircle}>
            <MaterialCommunityIcons name="check" size={18} color="#fff" />
          </View>
        </Animated.View>
      </View>

      {/* Bottom accent with location theme */}
      <LinearGradient
        colors={['transparent', 'rgba(19, 127, 236, 0.08)']}
        style={styles.bottomAccent}
      />

      {/* Decorative dots pattern */}
      <View style={styles.dotsPattern}>
        {[...Array(5)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { left: 30 + i * 25, opacity: 0.2 + i * 0.1 },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: 'rgba(19, 127, 236, 0.4)',
  },
  magnifierContainer: {
    zIndex: 10,
  },
  magnifierCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  locationPin: {
    position: 'absolute',
    top: -70,
    right: -50,
  },
  checkmark: {
    position: 'absolute',
    bottom: -45,
    right: -40,
  },
  checkmarkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  dotsPattern: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#137fec',
  },
});
