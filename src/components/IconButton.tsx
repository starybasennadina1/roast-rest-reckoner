import React, { memo, useCallback, useRef } from 'react';
import { Animated, Image, ImageSourcePropType, Pressable, StyleSheet } from 'react-native';
import type { LucideIcon } from '../types/icons';
import { useTheme } from '../hooks/useTheme';

interface Props {
  Icon?: LucideIcon;
  image?: ImageSourcePropType;
  onPress: () => void;
  label: string;
  tone?: 'default' | 'accent';
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** 44x44 round enamel button — explicit width AND height (ui-pressable). */
function IconButton({ Icon, image, onPress, label, tone = 'default' }: Props) {
  const t = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.92,
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

  const color = tone === 'accent' ? t.accent : t.primary;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.body,
          {
            backgroundColor: t.surfaceRaised,
            borderColor: t.hairlineStrong,
            transform: [{ scale }],
          },
        ]}>
        {image ? (
          <Image source={image} style={styles.img} />
        ) : Icon ? (
          <Icon size={22} color={color} strokeWidth={2.2} />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: 44, height: 44 },
  body: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: { width: 24, height: 24, resizeMode: 'contain' },
});

export default memo(IconButton);
