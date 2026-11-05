import React, { memo, useCallback, useRef } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { CUT_TILE_H, CUT_TILE_W } from '../constants/config';
import { useTheme } from '../hooks/useTheme';

interface Props {
  id: string;
  sprite: ImageSourcePropType;
  name: string;
  hint: string;
  active: boolean;
  onPress: (id: string) => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function CutTile({ id, sprite, name, hint, active, onPress }: Props) {
  const t = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const press = useCallback(() => onPress(id), [id, onPress]);

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.94,
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
      onPress={press}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={name}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.tile,
          {
            backgroundColor: active ? t.surfaceHigh : t.surface,
            borderColor: active ? t.primary : t.hairline,
            borderWidth: active ? 2 : 1,
            shadowColor: active ? t.primary : t.shadow,
            shadowOpacity: active ? 0.45 : 0.25,
            transform: [{ scale }],
          },
        ]}>
        <Image source={sprite} style={styles.sprite} />
        <Text numberOfLines={1} style={[styles.name, { color: active ? t.textPrimary : t.textSecondary }]}>
          {name}
        </Text>
        <Text numberOfLines={1} style={[styles.hint, { color: active ? t.primary : t.textMuted }]}>
          {hint}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: CUT_TILE_W, height: CUT_TILE_H },
  tile: {
    width: CUT_TILE_W,
    height: CUT_TILE_H,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  sprite: { width: 42, height: 42, resizeMode: 'contain', marginBottom: 6 },
  name: { fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  hint: { fontSize: 9, fontWeight: '700', letterSpacing: 0.6, marginTop: 2 },
});

export default memo(CutTile);
