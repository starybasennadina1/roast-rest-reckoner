import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';
import { formatCountdown } from '../utils/time';

interface Props {
  remainingSec: number;
  totalSec: number;
  size?: number;
}

function ArcTimer({ remainingSec, totalSec, size = 104 }: Props) {
  const t = useTheme();
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const fraction = Math.min(1, Math.max(0, totalSec > 0 ? remainingSec / totalSec : 0));
  const offset = c * (1 - fraction);

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(251,239,226,0.14)"
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={t.primary}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${c}, ${c}`}
            strokeDashoffset={offset}
            fill="none"
          />
        </G>
      </Svg>

      <View style={styles.center} pointerEvents="none">
        <Text style={[styles.value, { color: t.textPrimary }]}>
          {formatCountdown(remainingSec)}
        </Text>
        <Text style={[styles.label, { color: t.textMuted }]}>LEFT</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center' },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 23, fontWeight: '900', fontVariant: ['tabular-nums'], lineHeight: 27 },
  label: { fontSize: 9, fontWeight: '700', letterSpacing: 1.6, marginTop: 1 },
});

export default memo(ArcTimer);
