import React, { memo } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { SCREEN_W, TEMP_GUIDE_ROWS } from '../constants/config';
import { useTheme } from '../hooks/useTheme';
import SecondaryButton from './SecondaryButton';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const PANEL_W = Math.min(SCREEN_W - 40, 360);

function TempGuideModal({ visible, onClose }: Props) {
  const t = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.panel,
            { backgroundColor: t.surfaceRaised, borderColor: t.hairlineStrong, shadowColor: t.shadow },
          ]}>
          <Text style={[styles.title, { color: t.textPrimary }]}>FOOD-SAFE TEMPERATURES</Text>

          {TEMP_GUIDE_ROWS.map(row => (
            <View key={row.id} style={[styles.row, { borderBottomColor: t.hairline }]}>
              <View style={[styles.dot, { backgroundColor: row.dot }]} />
              <Text style={[styles.name, { color: t.textPrimary }]}>{row.name}</Text>
              <Text style={[styles.temp, { color: t.primary }]}>{row.tempC}°C</Text>
            </View>
          ))}

          <Text style={[styles.note, { color: t.textSecondary }]}>
            REST 10-30 MIN · THE CORE RISES 2-5°C WHILE RESTING
          </Text>

          <SecondaryButton label="CLOSE" onPress={onClose} height={48} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11,6,4,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panel: {
    width: PANEL_W,
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 20,
  },
  title: { fontSize: 17, fontWeight: '800', letterSpacing: 1.2, marginBottom: 12 },
  row: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  name: { flex: 1, fontSize: 12, fontWeight: '700', letterSpacing: 0.8 },
  temp: { fontSize: 15, fontWeight: '900', fontVariant: ['tabular-nums'] },
  note: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 14,
    lineHeight: 15,
  },
});

export default memo(TempGuideModal);
