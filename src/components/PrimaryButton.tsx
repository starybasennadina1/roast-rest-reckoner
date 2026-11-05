import React, { memo, useCallback, useRef } from 'react';
import {
  Animated,
  DimensionValue,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import THEME from '../constants/theme';
import type { LucideIcon } from '../types/icons';
import { useTheme } from '../hooks/useTheme';

interface Props {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  disabled?: boolean;
  height?: number;
  width?: DimensionValue;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

/**
 * Pressable is the PARENT, the Animated.View is the CHILD (rule #8) —
 * an animated wrapper around a Pressable swallows onPress on Android release.
 */
function PrimaryButton({
  label,
  onPress,
  Icon,
  disabled = false,
  height = 60,
  width = '100%',
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

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, { width, height, opacity: disabled ? 0.5 : 1 }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.shell,
          {
            height,
            shadowColor: t.primary,
            transform: [{ scale }],
          },
        ]}>
        <LinearGradient
          colors={THEME.gradients.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.fill, { height }]}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} color={t.onPrimary} strokeWidth={2.4} /> : null}
            <Text numberOfLines={1} style={[styles.label, { color: t.onPrimary }]}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { alignSelf: 'center' },
  shell: {
    width: '100%',
    borderRadius: 18,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  fill: {
    width: '100%',
    borderRadius: 18,
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
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
    lineHeight: ICON,
  },
});

export default memo(PrimaryButton);
