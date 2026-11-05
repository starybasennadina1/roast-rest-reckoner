import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  ovenC: number;
  coreC: number;
  restMin: number;
}

/** The thin G3 three-cell strip. Cells use a fixed 33.33% width (rule #19a). */
function StatStrip({ ovenC, coreC, restMin }: Props) {
  const t = useTheme();

  const cells = [
    { key: 'oven', value: `${ovenC}°C`, label: 'OVEN', color: t.primary },
    { key: 'core', value: `${coreC}°C`, label: 'TARGET CORE', color: t.accentText },
    { key: 'rest', value: `${restMin}M`, label: 'REST', color: t.textPrimary },
  ];

  return (
    <View style={[styles.strip, { backgroundColor: t.bgDeep, borderTopColor: t.hairline }]}>
      {cells.map((c, i) => (
        <View
          key={c.key}
          style={[
            styles.cell,
            i > 0 ? { borderLeftWidth: 1, borderLeftColor: t.hairline } : null,
          ]}>
          <Text style={[styles.value, { color: c.color }]}>{c.value}</Text>
          <Text style={[styles.label, { color: t.textSecondary }]}>{c.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  cell: { width: '33.33%', alignItems: 'center', justifyContent: 'center', height: 44 },
  value: { fontSize: 15, fontWeight: '800', fontVariant: ['tabular-nums'], lineHeight: 19 },
  label: { fontSize: 9, fontWeight: '700', letterSpacing: 1.2, marginTop: 3 },
});

export default memo(StatStrip);
