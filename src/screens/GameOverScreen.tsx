import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Home, RotateCcw } from 'lucide-react-native';
import AppBackground from '../components/AppBackground';
import PrimaryButton from '../components/PrimaryButton';
import ResultLogCard from '../components/ResultLogCard';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import { sprite3 } from '../assets';
import { CONTENT_W, SCREEN_PAD } from '../constants/config';
import { LogDoneness, nextFactor } from '../game/ovenFactor';
import { useTheme, useThemeMode } from '../hooks/useTheme';
import { formatDuration } from '../utils/time';

interface Props {
  lateMin: number;
  plannedOvenMin: number;
  ovenFactor: number;
  roastsCooked: number;
  onCookAgain: (newFactor: number) => void;
  onMenu: (newFactor: number) => void;
}

export default function GameOverScreen({
  lateMin,
  plannedOvenMin,
  ovenFactor,
  roastsCooked,
  onCookAgain,
  onMenu,
}: Props) {
  const t = useTheme();
  const mode = useThemeMode();
  const [doneness, setDoneness] = useState<LogDoneness>('perfect');
  const [actualMin, setActualMin] = useState(plannedOvenMin);

  const hero = useRef(new Animated.Value(0)).current;
  const card = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(hero, { toValue: 1, tension: 44, friction: 7, useNativeDriver: true }),
      Animated.timing(card, { toValue: 1, duration: 380, delay: 120, useNativeDriver: true }),
    ]).start();
  }, [hero, card]);

  const newFactor = useMemo(
    () => nextFactor(ovenFactor, doneness, plannedOvenMin, actualMin),
    [ovenFactor, doneness, plannedOvenMin, actualMin],
  );

  const shiftActual = useCallback((delta: number) => {
    setActualMin(prev => Math.max(10, prev + delta));
  }, []);

  const again = useCallback(() => onCookAgain(newFactor), [newFactor, onCookAgain]);
  const toMenu = useCallback(() => onMenu(newFactor), [newFactor, onMenu]);

  const onTime = lateMin <= 0;
  const headline = onTime ? 'SERVED ON TIME' : `SERVED ${lateMin} MIN LATE`;
  const deltaText = onTime
    ? 'THE TABLE WAS READY WHEN THE FOOD WAS'
    : `YOU ADDED ${formatDuration(lateMin)} ALONG THE WAY`;

  return (
    <View style={styles.root}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
      <AppBackground overlay="gameover">
        <ScreenHeader title="RESULT LOG" subtitle="DINNER IS DONE" />

        <View style={styles.body}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.plate,
              {
                backgroundColor: t.bgDeep,
                borderColor: t.primary + '66',
                shadowColor: t.primary,
                opacity: hero,
                transform: [
                  { scale: hero.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
                ],
              },
            ]}>
            <Image source={sprite3} style={styles.heroSprite} />
          </Animated.View>

          <Text style={[styles.headline, { color: t.textPrimary }]}>{headline}</Text>
          <Text
            style={[styles.delta, { color: onTime ? t.accentText : t.primary }]}
            numberOfLines={2}>
            {deltaText}
          </Text>

          <Animated.View
            pointerEvents="box-none"
            style={{
              opacity: card,
              transform: [
                {
                  translateY: card.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
              ],
            }}>
            <ResultLogCard
              doneness={doneness}
              onDoneness={setDoneness}
              actualMin={actualMin}
              onActual={shiftActual}
              factorFrom={ovenFactor}
              factorTo={newFactor}
            />

            <View style={styles.statsRow}>
              <View style={styles.statSlot}>
                <StatCard
                  value={onTime ? 'ON TIME' : `+${lateMin}M`}
                  label="vs plan"
                  valueColor={onTime ? t.accent : t.primary}
                />
              </View>
              <View style={styles.statGap} />
              <View style={styles.statSlot}>
                <StatCard
                  value={String(roastsCooked)}
                  label="roasts cooked"
                  valueColor={t.primary}
                />
              </View>
            </View>
          </Animated.View>

          <View style={styles.ctas}>
            <PrimaryButton
              label="COOK AGAIN"
              Icon={RotateCcw}
              onPress={again}
              height={58}
              width={CONTENT_W}
            />
            <View style={styles.ctaGap} />
            <SecondaryButton
              label="SAVE AND BACK TO PLANS"
              Icon={Home}
              onPress={toMenu}
              height={48}
              width={CONTENT_W}
            />
          </View>
        </View>
      </AppBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2A1A14' },
  body: { flex: 1, paddingHorizontal: SCREEN_PAD, alignItems: 'center', paddingTop: 4 },
  plate: {
    width: 108,
    height: 108,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },
  heroSprite: { width: 84, height: 84, resizeMode: 'contain' },
  headline: {
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: 12,
  },
  delta: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 10,
    lineHeight: 15,
  },
  statsRow: { flexDirection: 'row', alignItems: 'stretch', marginTop: 8 },
  statSlot: { flex: 1 },
  statGap: { width: 12 },
  ctas: { flex: 1, minHeight: 116, justifyContent: 'flex-end', paddingBottom: 16, width: CONTENT_W },
  ctaGap: { height: 10 },
});
