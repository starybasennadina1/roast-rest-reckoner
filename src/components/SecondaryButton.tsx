import React, { memo, useCallback, useRef } from 'react';
import {
  Animated,
  DimensionValue,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { LucideIcon } from '../types/icons';
import { useTheme } from '../hooks/useTheme';

interface Props {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  height?: number;
  width?: DimensionValue;
  tone?: 'neutral' | 'accent';
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

function SecondaryButton({
  label,
  onPress,
  Icon,
  height = 48,
  width = '100%',
  tone = 'neutral',
}: Props) {
  const t = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
      tension: 320,
      friction: 14,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 320,
      friction: 14,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const fg = tone === 'accent' ? t.accentText : t.textPrimary;
  const bg = tone === 'accent' ? 'rgba(167,201,87,0.18)' : 'rgba(251,239,226,0.08)';
  const bd = tone === 'accent' ? 'rgba(167,201,87,0.45)' : t.hairlineStrong;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, { width, height }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.body,
          {
            height,
            backgroundColor: bg,
            borderColor: bd,
            transform: [{ scale }],
          },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={fg} strokeWidth={2.2} /> : null}
          <Text numberOfLines={1} style={[styles.label, { color: fg }]}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { alignSelf: 'center' },
  body: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.4,
    lineHeight: ICON,
  },
});

export default memo(SecondaryButton);
