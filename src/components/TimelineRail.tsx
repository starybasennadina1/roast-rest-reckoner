import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RAIL_LEFT } from '../constants/config';
import THEME from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

interface Props {
  /** 0..1 — how far the cook has travelled through the plan */
  progress: number;
  height: number;
}

const INSET = 14;

/** Rail + oven-rack decor + the creeping NOW marker. */
function TimelineRail({ progress, height }: Props) {
  const t = useTheme();
  const top = useRef(new Animated.Value(INSET)).current;

  useEffect(() => {
    const span = Math.max(0, height - INSET * 2 - 20);
    Animated.timing(top, {
      toValue: INSET + span * Math.min(1, Math.max(0, progress)),
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, height, top]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.rack, { top: height * 0.25, backgroundColor: t.hairline }]} />
      <View style={[styles.rack, { top: height * 0.5, backgroundColor: t.hairline }]} />
      <View style={[styles.rack, { top: height * 0.75, backgroundColor: t.hairline }]} />

      <LinearGradient
        colors={THEME.gradients.rail}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.rail}
      />

      <Animated.View style={[styles.nowRow, { top }]}>
        <View style={[styles.nowBadge, { backgroundColor: t.textPrimary }]}>
          <Text style={[styles.nowText, { color: t.bg }]}>NOW</Text>
        </View>
        <View style={[styles.nowLine, { backgroundColor: t.textPrimary }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    position: 'absolute',
    left: RAIL_LEFT,
    top: INSET,
    bottom: INSET,
    width: 3,
    borderRadius: 2,
  },
  rack: { position: 'absolute', left: 16, right: 16, height: 1 },
  nowRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nowBadge: {
    width: 42,
    height: 18,
    borderRadius: 9,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nowText: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, lineHeight: 12 },
  nowLine: { flex: 1, height: 2, marginRight: 16, opacity: 0.85 },
});

export default memo(TimelineRail);
