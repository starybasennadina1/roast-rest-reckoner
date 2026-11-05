import React, { memo, useCallback, useRef } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CONTENT_W } from '../constants/config';
import { useTheme } from '../hooks/useTheme';

interface Props {
  id: string;
  thumb: ImageSourcePropType;
  title: string;
  meta: string;
  total: string;
  onPress: (id: string) => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const CARD_H = 62;

function PlanCard({ id, thumb, title, meta, total, onPress }: Props) {
  const t = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const press = useCallback(() => onPress(id), [id, onPress]);

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.97,
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
      accessibilityLabel={`${title} ${meta}`}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.card,
          {
            backgroundColor: t.surface,
            borderColor: t.primary + '3A',
            shadowColor: t.shadow,
            transform: [{ scale }],
          },
        ]}>
        <View style={[styles.thumbWrap, { backgroundColor: t.bgDeep, borderColor: t.hairline }]}>
          <Image source={thumb} style={styles.thumb} />
        </View>

        <View style={styles.mid}>
          <Text numberOfLines={1} style={[styles.title, { color: t.textPrimary }]}>
            {title}
          </Text>
          <Text numberOfLines={1} style={[styles.meta, { color: t.textSecondary }]}>
            {meta}
          </Text>
        </View>

        <View style={styles.right}>
          <Text style={[styles.total, { color: t.primary }]}>{total}</Text>
          <Text style={[styles.totalLabel, { color: t.textMuted }]}>TOTAL</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: CONTENT_W, height: CARD_H, marginBottom: 8 },
  card: {
    width: CONTENT_W,
    height: CARD_H,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  thumbWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: { width: 32, height: 32, resizeMode: 'contain' },
  mid: { flex: 1, marginLeft: 10, justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '800', letterSpacing: 0.4 },
  meta: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginTop: 3 },
  right: { alignItems: 'flex-end', justifyContent: 'center' },
  total: { fontSize: 14, fontWeight: '900', fontVariant: ['tabular-nums'] },
  totalLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1.2, marginTop: 2 },
});

export default memo(PlanCard);
