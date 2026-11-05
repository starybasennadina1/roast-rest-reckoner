import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import {
  Carrot,
  Check,
  ChefHat,
  Flame,
  Thermometer,
  Timer,
  Utensils,
} from 'lucide-react-native';
import { PILL_GAP, PILL_H, RAIL_LEFT, SCREEN_W } from '../constants/config';
import { StepKind } from '../game/schedule';
import type { LucideIcon } from '../types/icons';
import { useTheme } from '../hooks/useTheme';
import { formatClock, formatDuration } from '../utils/time';

export type PillState = 'done' | 'active' | 'pending';

interface Props {
  index: number;
  kind: StepKind;
  at: number;
  label: string;
  action: string;
  durationMin: number;
  sharesOven: boolean;
  state: PillState;
}

const ICONS: Record<StepKind, LucideIcon> = {
  prep: ChefHat,
  oven: Flame,
  meat: Thermometer,
  side: Carrot,
  rest: Timer,
  serve: Utensils,
};

function StepPill({
  index,
  kind,
  at,
  label,
  action,
  durationMin,
  sharesOven,
  state,
}: Props) {
  const t = useTheme();
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 240,
      delay: Math.min(index, 8) * 24,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  const hue =
    state === 'done' ? t.textMuted : state === 'active' ? t.primary : t.accent;
  const Icon = ICONS[kind];

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.row,
        {
          opacity: Animated.multiply(enter, state === 'done' ? 0.55 : 1),
          transform: [
            {
              translateY: enter.interpolate({
                inputRange: [0, 1],
                outputRange: [14, 0],
              }),
            },
          ],
        },
      ]}>
      <View style={[styles.dot, { backgroundColor: hue, borderColor: t.bg }]} />

      <View
        style={[
          styles.pill,
          {
            backgroundColor: t.surfaceRaised,
            borderColor: state === 'active' ? t.primary : t.hairline,
            borderWidth: state === 'active' ? 2 : 1,
            shadowColor: state === 'active' ? t.primary : t.shadow,
            shadowOpacity: state === 'active' ? 0.5 : 0.3,
          },
        ]}>
        <View style={[styles.iconTile, { backgroundColor: hue + '24' }]}>
          <Icon size={19} color={hue} strokeWidth={2.2} />
        </View>

        <View style={styles.mid}>
          <Text numberOfLines={1} style={[styles.label, { color: t.textPrimary }]}>
            {formatClock(at)} · {label}
          </Text>
          <Text numberOfLines={1} style={[styles.action, { color: t.textSecondary }]}>
            {sharesOven ? 'SHARES OVEN · ' : ''}
            {action}
          </Text>
        </View>

        {state === 'done' ? (
          <View style={[styles.badge, { borderColor: t.hairline }]}>
            <Check size={14} color={t.textMuted} strokeWidth={3} />
          </View>
        ) : durationMin > 0 ? (
          <View style={[styles.badge, { borderColor: hue + '66' }]}>
            <Text style={[styles.badgeText, { color: hue }]}>
              {formatDuration(durationMin)}
            </Text>
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: SCREEN_W,
    height: PILL_H,
    marginBottom: PILL_GAP,
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    left: RAIL_LEFT - 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    zIndex: 2,
  },
  pill: {
    marginLeft: 68,
    marginRight: 16,
    height: PILL_H,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mid: { flex: 1, marginLeft: 10, justifyContent: 'center' },
  label: { fontSize: 13, fontWeight: '800', letterSpacing: 0.4 },
  action: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, marginTop: 3 },
  badge: {
    minWidth: 50,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
    marginLeft: 6,
  },
  badgeText: { fontSize: 10, fontWeight: '800', fontVariant: ['tabular-nums'] },
});

export default memo(StepPill);
