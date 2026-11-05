import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SERVE_STEP_MIN } from '../constants/config';
import { useTheme } from '../hooks/useTheme';
import { formatClock } from '../utils/time';

interface Props {
  serveMin: number;
  onShift: (delta: number) => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function TimeStepper({ serveMin, onShift }: Props) {
  const t = useTheme();
  const back = useCallback(() => onShift(-SERVE_STEP_MIN), [onShift]);
  const fwd = useCallback(() => onShift(SERVE_STEP_MIN), [onShift]);

  return (
    <View style={styles.root}>
      <Text style={[styles.caption, { color: t.textSecondary }]}>SERVE AT</Text>
      <View style={styles.row}>
        <Pressable
          onPress={back}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Serve 15 minutes earlier"
          style={[styles.step, { backgroundColor: t.surfaceRaised, borderColor: t.hairlineStrong }]}>
          <Text style={[styles.stepText, { color: t.textPrimary }]}>-15</Text>
        </Pressable>

        <Text style={[styles.clock, { color: t.textPrimary }]}>{formatClock(serveMin)}</Text>

        <Pressable
          onPress={fwd}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Serve 15 minutes later"
          style={[styles.step, { backgroundColor: t.surfaceRaised, borderColor: t.hairlineStrong }]}>
          <Text style={[styles.stepText, { color: t.textPrimary }]}>+15</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'flex-start' },
  caption: { fontSize: 9, fontWeight: '700', letterSpacing: 1.4, marginBottom: 5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  step: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { fontSize: 13, fontWeight: '900', letterSpacing: 0.4, lineHeight: 18 },
  clock: {
    width: 76,
    textAlign: 'center',
    fontSize: 21,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
});

export default memo(TimeStepper);
