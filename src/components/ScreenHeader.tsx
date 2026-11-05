import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HEADER_H, HEADER_TOP_PAD, SCREEN_PAD } from '../constants/config';
import { useTheme } from '../hooks/useTheme';

interface Props {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  /** transparent sits over full-bleed art (Menu); surface draws the enamel bar */
  variant?: 'surface' | 'transparent';
}

/** The one header used by every screen — Menu, Planner, Cook Mode, Result. */
function ScreenHeader({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  variant = 'surface',
}: Props) {
  const t = useTheme();
  const surface = variant === 'surface';

  return (
    <View
      style={[
        styles.root,
        surface
          ? { backgroundColor: 'rgba(11,6,4,0.55)', borderBottomWidth: 1, borderBottomColor: t.hairline }
          : null,
      ]}>
      <View style={styles.side}>{leftSlot ?? null}</View>

      <View style={styles.center}>
        {subtitle ? (
          <Text numberOfLines={1} style={[styles.sub, { color: t.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
        <Text numberOfLines={1} style={[styles.title, { color: t.textPrimary }]}>
          {title}
        </Text>
      </View>

      <View style={[styles.side, styles.sideRight]}>{rightSlot ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: HEADER_H + HEADER_TOP_PAD,
    paddingTop: HEADER_TOP_PAD,
    paddingHorizontal: SCREEN_PAD,
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: { width: 100, justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sub: { fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 2 },
  title: { fontSize: 15, fontWeight: '800', letterSpacing: 1.6 },
});

export default memo(ScreenHeader);
