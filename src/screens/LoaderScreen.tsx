import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppBackground from '../components/AppBackground';
import { logo } from '../assets';
import { LOADER_DURATION_MS } from '../constants/config';
import THEME from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

interface Props {
  onDone: () => void;
}

const BAR_W = 220;
const CAPTIONS = [
  'HEATING THE OVEN...',
  'WEIGHING THE JOINT...',
  'SETTING THE TIMELINE...',
  'READY',
];

export default function LoaderScreen({ onDone }: Props) {
  const t = useTheme();
  const [captionIndex, setCaptionIndex] = useState(0);

  const plate = useRef(new Animated.Value(0)).current;
  const title = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0.45)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(plate, {
        toValue: 1,
        tension: 42,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(title, {
        toValue: 1,
        duration: 500,
        delay: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 0.85, duration: 1800, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.45, duration: 1800, useNativeDriver: true }),
      ]),
    );
    breathe.start();

    // width is a layout prop -> useNativeDriver MUST be false (rule #8)
    Animated.timing(bar, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const captionTimer = setInterval(() => {
      setCaptionIndex(prev => (prev < CAPTIONS.length - 1 ? prev + 1 : prev));
    }, 2000);

    const exit = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }).start(() => doneRef.current());
    }, LOADER_DURATION_MS);

    return () => {
      breathe.stop();
      clearInterval(captionTimer);
      clearTimeout(exit);
    };
  }, [plate, title, glow, bar, fade]);

  const barWidth = bar.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_W],
  });

  return (
    <Animated.View style={[styles.root, { opacity: fade }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <AppBackground overlay="loader" blobs={false}>
        <View style={styles.center}>
          <Animated.View
            pointerEvents="none"
            style={[styles.glow, { backgroundColor: t.glowOrange, opacity: glow }]}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.plate,
              {
                backgroundColor: '#1B100B',
                borderColor: 'rgba(224,142,69,0.35)',
                shadowColor: '#E08E45',
                opacity: plate,
                transform: [
                  {
                    scale: plate.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.82, 1],
                    }),
                  },
                ],
              },
            ]}>
            <Image source={logo} style={styles.logo} />
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={{
              opacity: title,
              transform: [
                {
                  translateY: title.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            }}>
            <Text style={styles.brand}>ROAST REST</Text>
            <Text style={styles.brand}>RECKONER</Text>
            <Text style={styles.tagline}>DINNER, BACKWARDS FROM THE TABLE</Text>
          </Animated.View>

          <View style={styles.barTrack}>
            <Animated.View style={[styles.barFillWrap, { width: barWidth }]}>
              <LinearGradient
                colors={THEME.gradients.progress}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.barFill}
              />
            </Animated.View>
          </View>

          <Text style={styles.status}>{CAPTIONS[captionIndex]}</Text>
        </View>
      </AppBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0604' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 30 },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: '18%',
  },
  plate: {
    width: 176,
    height: 176,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.45,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
    marginBottom: 30,
  },
  logo: { width: 142, height: 142, resizeMode: 'contain' },
  brand: {
    fontSize: 33,
    fontWeight: '900',
    letterSpacing: 3,
    color: '#FBEFE2',
    textAlign: 'center',
    textShadowColor: 'rgba(224,142,69,0.55)',
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
    lineHeight: 39,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: '#A7C957',
    textAlign: 'center',
    marginTop: 12,
  },
  barTrack: {
    width: BAR_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(251,239,226,0.12)',
    marginTop: 36,
    overflow: 'hidden',
  },
  barFillWrap: { height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { flex: 1, borderRadius: 3 },
  status: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: '#C9AE9B',
    marginTop: 14,
  },
});
