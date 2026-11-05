import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { ChefHat, Gauge, Moon, Sun, Thermometer } from 'lucide-react-native';
import AppBackground from '../components/AppBackground';
import IconButton from '../components/IconButton';
import PlanCard from '../components/PlanCard';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import TempGuideModal from '../components/TempGuideModal';
import { SPRITES, iconHome, sprite1 } from '../assets';
import { CONTENT_W, SAVED_PLANS, SCREEN_PAD, SavedPlan } from '../constants/config';
import { ThemeMode } from '../constants/theme';
import { useTheme, useThemeMode } from '../hooks/useTheme';

interface Props {
  ovenFactor: number;
  roastsCooked: number;
  onStart: () => void;
  onLoadPlan: (plan: SavedPlan) => void;
  onToggleMode: (mode: ThemeMode) => void;
}

export default function MenuScreen({
  ovenFactor,
  roastsCooked,
  onStart,
  onLoadPlan,
  onToggleMode,
}: Props) {
  const t = useTheme();
  const mode = useThemeMode();
  const [guideOpen, setGuideOpen] = useState(false);

  const sheet = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(sheet, {
      toValue: 1,
      tension: 50,
      friction: 9,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 2600, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [sheet, float]);

  const openGuide = useCallback(() => setGuideOpen(true), []);
  const closeGuide = useCallback(() => setGuideOpen(false), []);
  const toggleMode = useCallback(
    () => onToggleMode(mode === 'dark' ? 'light' : 'dark'),
    [mode, onToggleMode],
  );

  const handlePlan = useCallback(
    (id: string) => {
      const found = SAVED_PLANS.find(p => p.id === id);
      if (found) {
        onLoadPlan(found);
      }
    },
    [onLoadPlan],
  );

  const factorPct = Math.round((ovenFactor - 1) * 100);
  const factorText = `${factorPct >= 0 ? '+' : ''}${factorPct}%`;

  return (
    <View style={styles.root}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
      <AppBackground overlay="menu">
        <ScreenHeader
          variant="transparent"
          title="ROAST REST"
          leftSlot={<Image source={iconHome} style={styles.brandIcon} />}
          rightSlot={
            <View style={styles.headerRight}>
              <IconButton
                Icon={mode === 'dark' ? Sun : Moon}
                onPress={toggleMode}
                label="Toggle day mode"
                tone="accent"
              />
              <View style={styles.headerGap} />
              <IconButton Icon={Thermometer} onPress={openGuide} label="Temperature guide" />
            </View>
          }
        />

        <View style={styles.art}>
          <Animated.Image
            source={sprite1}
            style={[
              styles.artSprite,
              {
                transform: [
                  {
                    translateY: float.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -8],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.sheet,
            {
              backgroundColor: t.surfaceRaised,
              borderTopColor: t.hairlineStrong,
              shadowColor: t.shadow,
              transform: [
                {
                  translateY: sheet.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0],
                  }),
                },
              ],
            },
          ]}>
          <View style={[styles.handle, { backgroundColor: t.hairlineStrong }]} />

          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: t.textPrimary }]}>SUNDAY ROASTS</Text>
            <View style={[styles.savedPill, { borderColor: t.accent + '80', backgroundColor: t.accent + '29' }]}>
              <Text style={[styles.savedText, { color: t.accentText }]}>3 SAVED</Text>
            </View>
          </View>

          <View style={[styles.ovenStrip, { backgroundColor: t.surfaceHigh, borderColor: t.hairline }]}>
            <Gauge size={18} color={t.primary} strokeWidth={2.2} />
            <Text style={[styles.ovenLabel, { color: t.textSecondary }]}>
              YOUR OVEN RUNS {ovenFactor.toFixed(2)}x
            </Text>
            <Text style={[styles.ovenValue, { color: t.primary }]}>{factorText}</Text>
          </View>

          {SAVED_PLANS.map(p => (
            <PlanCard
              key={p.id}
              id={p.id}
              thumb={SPRITES[p.spriteKey]}
              title={p.title}
              meta={p.meta}
              total={p.total}
              onPress={handlePlan}
            />
          ))}

          <View style={styles.statsRow}>
            <View style={styles.statSlot}>
              <StatCard value={String(roastsCooked)} label="roasts cooked" valueColor={t.primary} />
            </View>
            <View style={styles.statGap} />
            <View style={styles.statSlot}>
              <StatCard value="94%" label="on-time" valueColor={t.accent} />
            </View>
          </View>

          <Text style={[styles.hint, { color: t.textSecondary }]}>
            OFFLINE · NO ADS · NO PURCHASES
          </Text>

          <PrimaryButton
            label="START PLANNING"
            Icon={ChefHat}
            onPress={onStart}
            height={58}
            width={CONTENT_W}
          />
        </Animated.View>
      </AppBackground>

      <TempGuideModal visible={guideOpen} onClose={closeGuide} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2A1A14' },
  brandIcon: { width: 28, height: 28, resizeMode: 'contain' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerGap: { width: 10 },
  art: { flex: 1, minHeight: 0, justifyContent: 'flex-end', alignItems: 'flex-end' },
  artSprite: {
    width: 128,
    height: 128,
    resizeMode: 'contain',
    marginRight: 22,
    marginBottom: 8,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    paddingHorizontal: SCREEN_PAD,
    paddingTop: 10,
    paddingBottom: 16,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    elevation: 18,
  },
  handle: { width: 44, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: 10 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: 0.6 },
  savedPill: {
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedText: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  ovenStrip: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  ovenLabel: { flex: 1, marginLeft: 9, fontSize: 10, fontWeight: '700', letterSpacing: 1.1 },
  ovenValue: { fontSize: 14, fontWeight: '900', fontVariant: ['tabular-nums'] },
  statsRow: { flexDirection: 'row', alignItems: 'stretch', marginTop: 2, marginBottom: 10 },
  statSlot: { flex: 1 },
  statGap: { width: 12 },
  hint: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginBottom: 10,
  },
});
