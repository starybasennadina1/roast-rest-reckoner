import React, { memo } from 'react';
import { DimensionValue, Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
  width?: DimensionValue;
  height?: number;
  tone?: 'accent' | 'primary';
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function Chip({
  label,
  active,
  onPress,
  disabled = false,
  width = '100%',
  height = 42,
  tone = 'accent',
}: Props) {
  const t = useTheme();
  const hue = tone === 'accent' ? t.accent : t.primary;
  const hueText = tone === 'accent' ? t.accentText : t.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled }}
      accessibilityLabel={label}
      style={[
        styles.chip,
        {
          width,
          height,
          opacity: disabled ? 0.4 : 1,
          backgroundColor: active ? hue + '29' : t.surfaceRaised,
          borderColor: active ? hue : t.hairline,
          borderWidth: active ? 2 : 1,
        },
      ]}>
      <Text
        numberOfLines={1}
        style={[styles.label, { color: active ? hueText : t.textSecondary }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
});

export default memo(Chip);
