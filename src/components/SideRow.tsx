import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Carrot, Flame, X } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  id: string;
  name: string;
  durationMin: number;
  needsOven: boolean;
  onRemove: (id: string) => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function SideRow({ id, name, durationMin, needsOven, onRemove }: Props) {
  const t = useTheme();
  const remove = useCallback(() => onRemove(id), [id, onRemove]);
  const hue = needsOven ? t.primary : t.accent;
  const Icon = needsOven ? Flame : Carrot;

  return (
    <View style={[styles.row, { backgroundColor: t.surface, borderColor: t.hairline }]}>
      <View style={[styles.iconWrap, { backgroundColor: hue + '22' }]}>
        <Icon size={18} color={hue} strokeWidth={2.2} />
      </View>

      <Text numberOfLines={1} style={[styles.name, { color: t.textPrimary }]}>
        {name}
      </Text>

      <View style={[styles.pill, { borderColor: t.hairlineStrong }]}>
        <Text style={[styles.pillText, { color: t.textSecondary }]}>{durationMin}M</Text>
      </View>

      <View style={[styles.badge, { backgroundColor: hue + '2E' }]}>
        <Text style={[styles.badgeText, { color: needsOven ? t.primary : t.accentText }]}>
          {needsOven ? 'OVEN' : 'HOB'}
        </Text>
      </View>

      <Pressable
        onPress={remove}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${name}`}
        style={[styles.remove, { borderColor: t.hairline }]}>
        <X size={14} color={t.textMuted} strokeWidth={2.6} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { flex: 1, marginLeft: 9, fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },
  pill: {
    height: 22,
    minWidth: 42,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  pillText: { fontSize: 10, fontWeight: '800', fontVariant: ['tabular-nums'] },
  badge: {
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
    marginLeft: 6,
  },
  badgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  remove: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
});

export default memo(SideRow);
