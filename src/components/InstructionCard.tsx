import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import ArcTimer from './ArcTimer';
import { CONTENT_W } from '../constants/config';
import { useTheme } from '../hooks/useTheme';

interface Props {
  action: string;
  atLabel: string;
  remainingSec: number;
  totalSec: number;
  flashing: boolean;
  paused: boolean;
}

/** The "readable from across the kitchen" card. */
function InstructionCard({
  action,
  atLabel,
  remainingSec,
  totalSec,
  flashing,
  paused,
}: Props) {
  const t = useTheme();
  const enter = useRef(new Animated.Value(0)).current;
  const flash = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      tension: 46,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [enter]);

  useEffect(() => {
    if (!flashing) {
      flash.setValue(0);
      return;
    }
    Animated.sequence([
      Animated.timing(flash, { toValue: 1, duration: 260, useNativeDriver: false }),
      Animated.timing(flash, { toValue: 0, duration: 260, useNativeDriver: false }),
    ]).start();
  }, [flashing, flash]);

  const borderColor = flash.interpolate({
    inputRange: [0, 1],
    outputRange: [t.primary + '5A', t.accent],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.card,
        {
          backgroundColor: t.bgDeep,
          borderColor,
          shadowColor: t.primary,
          opacity: enter,
          transform: [
            {
              scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }),
            },
          ],
        },
      ]}>
      <ArcTimer remainingSec={remainingSec} totalSec={totalSec} />

      <View style={styles.right}>
        <Text numberOfLines={1} style={[styles.caption, { color: t.textSecondary }]}>
          {paused ? 'PAUSED' : 'NEXT STEP'} · {atLabel}
        </Text>
        <Text numberOfLines={2} style={[styles.action, { color: t.textPrimary }]}>
          {action}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CONTENT_W,
    height: 136,
    alignSelf: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowOpacity: 0.4,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  right: { flex: 1, marginLeft: 14, justifyContent: 'center' },
  caption: { fontSize: 10, fontWeight: '700', letterSpacing: 1.6, marginBottom: 6 },
  action: { fontSize: 24, fontWeight: '900', letterSpacing: 0.4, lineHeight: 28 },
});

export default memo(InstructionCard);
