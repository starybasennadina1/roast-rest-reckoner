import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  value: string;
  label: string;
  valueColor: string;
}

/**
 * Rule #21 pill: no raster icon (AI sprites have unpredictable inner bbox) —
 * an 8px accent dot carries the semantics, the big number carries the data.
 * width:'100%' (never flex:1 inside a flex:1 slot — rule #19a).
 */
function StatCard({ value, label, valueColor }: Props) {
  const t = useTheme();
  if (!value) {
    return null;
  }
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: t.surfaceRaised,
          borderColor: valueColor + '55',
          shadowColor: t.shadow,
        },
      ]}>
      <View style={[styles.dot, { backgroundColor: valueColor }]} />
      <Text numberOfLines={1} style={[styles.value, { color: valueColor }]}>
        {value}
      </Text>
      <Text numberOfLines={1} style={[styles.label, { color: t.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 7 },
  value: {
    fontSize: 21,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    lineHeight: 25,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 3,
    textTransform: 'uppercase',
  },
});

export default memo(StatCard);
