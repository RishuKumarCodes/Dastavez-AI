import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    View,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const StarDust = ({ style, duration = 40000 }) => {
  const scaleAnim = useRef(new Animated.Value(0.2)).current;
  const opacityAnim = useRef(new Animated.Value(0.1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Twinkling animation
    const twinkleAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: duration / 6,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: duration / 6,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.2,
            duration: duration / 6,
            easing: Easing.bezier(0.55, 0.06, 0.68, 0.19),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.1,
            duration: duration / 6,
            easing: Easing.bezier(0.55, 0.06, 0.68, 0.19),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Falling animation
    const initialProgress = Math.random(); // Random starting position along path
// Random initial X on left half of the screen
const initialX = Math.random() * (screenWidth * 0.5);
const initialY = Math.random() * screenHeight;

translateX.setValue(initialX);
translateY.setValue(initialY);

const fallingAnimation = Animated.loop(
  Animated.parallel([
    Animated.timing(translateY, {
      toValue: screenHeight + 100, // fall down
      duration: duration * (1 - initialProgress),
      easing: Easing.linear,
      useNativeDriver: true,
    }),
    Animated.timing(translateX, {
      toValue: screenWidth + 100, // drift to right
      duration: duration * (1 - initialProgress),
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ])
);


    // Rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: duration / 2,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    twinkleAnimation.start();
    fallingAnimation.start();
    rotateAnimation.start();

    return () => {
      twinkleAnimation.stop();
      fallingAnimation.stop();
      rotateAnimation.stop();
    };
  }, [duration, scaleAnim, opacityAnim, translateX, translateY, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.starDust,
        style,
        {
          transform: [
            { translateX },
            { translateY },
            { scale: scaleAnim },
            { rotate },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.starDustShape} />
    </Animated.View>
  );
};

const ShootingStar = ({ delay = 0 }) => {
  const translateX = useRef(new Animated.Value(-100)).current;
  const translateY = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const startY = Math.random() * screenHeight * 0.4;
    const endX = screenWidth + 100;
    const endY = startY + screenWidth * 0.3;

    translateY.setValue(startY);

    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: endX,
            duration: 5000, // slower
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: endY,
            duration: 5000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.parallel([
              Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
              Animated.timing(scale, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]),
            Animated.parallel([
              Animated.timing(opacity, { toValue: 0, duration: 4700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
              Animated.timing(scale, { toValue: 0.3, duration: 4700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(translateX, { toValue: -100, duration: 0, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: Math.random() * screenHeight * 0.4, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [delay, translateX, translateY, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.shootingStar,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
            { rotate: '25deg' },
          ],
          opacity,
        },
      ]}
    >
      <View style={styles.shootingStarTail} />
      <View style={styles.shootingStarHead} />
    </Animated.View>
  );
};

const AnimatedStars = () => {
  const generateStarDust = (count) => {
    return Array.from({ length: count }, (_, index) => ({
      id: index,
      left: Math.random() * (screenWidth + 200) - 100,
      top: Math.random() * screenHeight, // fill screen immediately
      size: Math.random() * 5 + 4,
      duration: Math.random() * 100000 + 101000, // 30–50s
    }));
  };

  const starDust = generateStarDust(80);

  const shootingStars = Array.from({ length: 4 }, (_, index) => ({
    id: index,
    delay: Math.random() * 20000, // 0–20s delay
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {starDust.map((dust) => (
        <StarDust
          key={dust.id}
          style={{
            position: 'absolute',
            left: dust.left,
            top: dust.top,
            width: dust.size,
            height: dust.size,
          }}
          duration={dust.duration}
        />
      ))}
      {shootingStars.map((star) => (
        <ShootingStar key={`shooting-${star.id}`} delay={star.delay} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -100,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  starDust: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  starDustShape: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 4,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  shootingStar: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  shootingStarTail: {
    width: 50,
    height: 2,
    backgroundColor: '#FFD700',
    opacity: 0.8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 6,
    borderRadius: 1,
    transform: [{ skewX: '-10deg' }],
  },
  shootingStarHead: {
    width: 8,
    height: 8,
    backgroundColor: '#FFD700',
    borderRadius: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 12,
    marginLeft: -2,
  },
});

export default AnimatedStars;
