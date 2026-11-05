import React, { memo, useCallback, useMemo, useRef } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  WEIGHT_MAX,
  WEIGHT_MIN,
  WEIGHT_STEP,
  WHEEL_ROW_H,
  WHEEL_W,
} from '../constants/config';
import { useTheme } from '../hooks/useTheme';

interface Props {
  value: number;
  onChange: (kg: number) => void;
}

interface Row {
  key: string;
  kg: number;
}

const VALUES: Row[] = (() => {
  const out: Row[] = [];
  const steps = Math.round((WEIGHT_MAX - WEIGHT_MIN) / WEIGHT_STEP);
  for (let i = 0; i <= steps; i += 1) {
    const kg = Math.round((WEIGHT_MIN + i * WEIGHT_STEP) * 10) / 10;
    out.push({ key: kg.toFixed(1), kg });
  }
  return out;
})();

function indexFor(kg: number): number {
  const i = Math.round((kg - WEIGHT_MIN) / WEIGHT_STEP);
  return Math.min(VALUES.length - 1, Math.max(0, i));
}

const getItemLayout = (_data: ArrayLike<Row> | null | undefined, index: number) => ({
  length: WHEEL_ROW_H,
  offset: WHEEL_ROW_H * index,
  index,
});

const keyExtractor = (item: Row) => item.key;

/** 3-row snapping picker — fat 58px rows, usable with buttery hands. */
function WeightWheel({ value, onChange }: Props) {
  const t = useTheme();
  const listRef = useRef<FlatList<Row>>(null);
  const didInit = useRef(false);
  const selected = useMemo(() => indexFor(value), [value]);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const onContentSizeChange = useCallback(() => {
    if (didInit.current) {
      return;
    }
    didInit.current = true;
    listRef.current?.scrollToOffset({
      offset: selectedRef.current * WHEEL_ROW_H,
      animated: false,
    });
  }, []);

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.y / WHEEL_ROW_H);
      const row = VALUES[Math.min(VALUES.length - 1, Math.max(0, idx))];
      if (row) {
        onChange(row.kg);
      }
    },
    [onChange],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Row>) => {
      const isActive = item.key === VALUES[selectedRef.current]?.key;
      return (
        <View style={styles.row}>
          <Text
            style={[
              styles.rowText,
              {
                color: isActive ? t.primary : t.textMuted,
                fontSize: isActive ? 26 : 19,
              },
            ]}>
            {item.key}
          </Text>
        </View>
      );
    },
    [t.primary, t.textMuted],
  );

  return (
    <View style={[styles.root, { backgroundColor: t.surface, borderColor: t.hairline }]}>
      <Text style={[styles.caption, { color: t.textSecondary }]}>WEIGHT · KG</Text>
      <View style={styles.viewport}>
        <View
          pointerEvents="none"
          style={[
            styles.selection,
            { backgroundColor: t.primary + '24', borderColor: t.primary + '66' },
          ]}
        />
        <FlatList
          ref={listRef}
          data={VALUES}
          extraData={selected}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          showsVerticalScrollIndicator={false}
          snapToInterval={WHEEL_ROW_H}
          decelerationRate="fast"
          windowSize={5}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          onContentSizeChange={onContentSizeChange}
          onMomentumScrollEnd={onMomentumEnd}
          contentContainerStyle={styles.content}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: WHEEL_W,
    borderRadius: 14,
    borderWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
  },
  caption: { fontSize: 9, fontWeight: '700', letterSpacing: 1.4, marginBottom: 6 },
  viewport: { width: WHEEL_W - 16, height: WHEEL_ROW_H * 3, overflow: 'hidden' },
  selection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: WHEEL_ROW_H,
    height: WHEEL_ROW_H,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderRadius: 4,
    zIndex: 2,
  },
  content: { paddingVertical: WHEEL_ROW_H },
  row: { height: WHEEL_ROW_H, alignItems: 'center', justifyContent: 'center' },
  rowText: { fontWeight: '800', fontVariant: ['tabular-nums'] },
});

export default memo(WeightWheel);
