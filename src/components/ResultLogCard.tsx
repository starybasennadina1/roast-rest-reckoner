import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import Chip from './Chip';
import { CONTENT_W } from '../constants/config';
import {
  LOG_DONENESS_LABEL,
  LOG_DONENESS_ORDER,
  LogDoneness,
  formatFactor,
} from '../game/ovenFactor';
import { useTheme } from '../hooks/useTheme';
import { formatDuration } from '../utils/time';

interface Props {
  doneness: LogDoneness;
  onDoneness: (d: LogDoneness) => void;
  actualMin: number;
  onActual: (delta: number) => void;
  factorFrom: number;
  factorTo: number;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const CHIP_GAP = 6;
const CHIP_W = Math.floor((CONTENT_W - 28 - CHIP_GAP * 3) / 4);
const COUNT_FRAMES = 20;

function ResultLogCard({
  doneness,
  onDoneness,
  actualMin,
  onActual,
  factorFrom,
  factorTo,
}: Props) {
  const t = useTheme();
  const [shown, setShown] = useState(factorFrom);
  const pulse = useRef(new Animated.Value(1)).current;
  const frameRef = useRef(0);

  useEffect(() => {
    frameRef.current = 0;
    setShown(factorFrom);
    const id = setInterval(() => {
      frameRef.current += 1;
      const k = Math.min(1, frameRef.current / COUNT_FRAMES);
      setShown(factorFrom + (factorTo - factorFrom) * k);
      if (k >= 1) {
        clearInterval(id);
      }
    }, 30);

    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.06, duration: 300, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    return () => clearInterval(id);
  }, [factorFrom, factorTo, pulse]);

  const less = useCallback(() => onActual(-5), [onActual]);
  const more = useCallback(() => onActual(5), [onActual]);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: t.surfaceRaised, borderColor: t.hairline, shadowColor: t.shadow },
      ]}>
      <Text style={[styles.label, { color: t.textSecondary }]}>HOW DID IT COME OUT</Text>
      <View style={styles.chips}>
        {LOG_DONENESS_ORDER.map((d, i) => (
          <View key={d} style={i > 0 ? styles.chipSlot : null}>
            <Chip
              label={LOG_DONENESS_LABEL[d]}
              active={d === doneness}
              onPress={() => onDoneness(d)}
              width={CHIP_W}
              height={38}
              tone={d === 'perfect' ? 'accent' : 'primary'}
            />
          </View>
        ))}
      </View>

      <Text style={[styles.label, styles.spaced, { color: t.textSecondary }]}>
        ACTUAL OVEN TIME
      </Text>
      <View style={styles.stepperRow}>
        <Pressable
          onPress={less}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Five minutes less"
          style={[styles.step, { backgroundColor: t.surface, borderColor: t.hairlineStrong }]}>
          <Text style={[styles.stepText, { color: t.textPrimary }]}>-5</Text>
        </Pressable>

        <Text style={[styles.actual, { color: t.textPrimary }]}>
          {formatDuration(actualMin)}
        </Text>

        <Pressable
          onPress={more}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Five minutes more"
          style={[styles.step, { backgroundColor: t.surface, borderColor: t.hairlineStrong }]}>
          <Text style={[styles.stepText, { color: t.textPrimary }]}>+5</Text>
        </Pressable>
      </View>

      <View style={[styles.factorRow, { borderTopColor: t.hairline }]}>
        <Text style={[styles.label, { color: t.textSecondary }]}>OVEN FACTOR</Text>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.factorValue, { transform: [{ scale: pulse }] }]}>
          <Text style={[styles.factorOld, { color: t.textMuted }]}>
            {formatFactor(factorFrom)}
          </Text>
          <ArrowRight size={16} color={t.textMuted} strokeWidth={2.6} />
          <Text style={[styles.factorNew, { color: t.primary }]}>{formatFactor(shown)}</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CONTENT_W,
    alignSelf: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  label: { fontSize: 9, fontWeight: '700', letterSpacing: 1.4 },
  spaced: { marginTop: 12 },
  chips: { flexDirection: 'row', marginTop: 8 },
  chipSlot: { marginLeft: CHIP_GAP },
  stepperRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  step: {
    width: 44,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { fontSize: 13, fontWeight: '900', lineHeight: 18 },
  actual: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  factorRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  factorValue: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  factorOld: { fontSize: 15, fontWeight: '800', fontVariant: ['tabular-nums'] },
  factorNew: { fontSize: 21, fontWeight: '900', fontVariant: ['tabular-nums'] },
});

export default memo(ResultLogCard);
