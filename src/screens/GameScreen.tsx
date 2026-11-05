import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItemInfo,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Check, Play, SkipForward, Thermometer, TimerReset } from 'lucide-react-native';
import AppBackground from '../components/AppBackground';
import IconButton from '../components/IconButton';
import InstructionCard from '../components/InstructionCard';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatStrip from '../components/StatStrip';
import StepPill, { PillState } from '../components/StepPill';
import TempGuideModal from '../components/TempGuideModal';
import TimelineRail from '../components/TimelineRail';
import { iconPause } from '../assets';
import { CONTENT_W, HALF_W, PILL_ROW_H, SCREEN_PAD } from '../constants/config';
import { Step } from '../game/schedule';
import { useCookTimer } from '../hooks/useCookTimer';
import { PlanApi } from '../hooks/usePlan';
import { useTheme, useThemeMode } from '../hooks/useTheme';
import { formatClock } from '../utils/time';

export interface CookResult {
  lateMin: number;
  plannedOvenMin: number;
}

interface Props {
  plan: PlanApi;
  onGameOver: (result: CookResult) => void;
  onBack: () => void;
}

const getItemLayout = (_d: ArrayLike<Step> | null | undefined, index: number) => ({
  length: PILL_ROW_H,
  offset: PILL_ROW_H * index,
  index,
});

const keyExtractor = (item: Step) => item.id;

const BACK_HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export default function GameScreen({ plan, onGameOver, onBack }: Props) {
  const t = useTheme();
  const mode = useThemeMode();
  const [guideOpen, setGuideOpen] = useState(false);
  const [railH, setRailH] = useState(240);
  const addedRef = useRef(0);

  const { steps, est, cut } = plan;

  const finish = useCallback(
    (_elapsedMin: number) => {
      onGameOver({ lateMin: addedRef.current, plannedOvenMin: est.ovenMin });
    },
    [est.ovenMin, onGameOver],
  );

  const timer = useCookTimer(steps, finish);
  const { index, remainingSec, totalSec, running, flashing } = timer;

  const current = steps[Math.min(index, steps.length - 1)];
  const progress =
    steps.length > 1
      ? Math.min(1, (index + (1 - remainingSec / Math.max(1, totalSec))) / steps.length)
      : 0;

  const onRailLayout = useCallback((e: LayoutChangeEvent) => {
    setRailH(e.nativeEvent.layout.height);
  }, []);

  const openGuide = useCallback(() => setGuideOpen(true), []);
  const closeGuide = useCallback(() => setGuideOpen(false), []);

  const addFive = useCallback(() => {
    addedRef.current += 5;
    timer.addFive();
  }, [timer]);

  const renderStep = useCallback(
    ({ item, index: i }: ListRenderItemInfo<Step>) => {
      const state: PillState = i < index ? 'done' : i === index ? 'active' : 'pending';
      return (
        <StepPill
          index={i}
          kind={item.kind}
          at={item.at}
          label={item.label}
          action={item.action}
          durationMin={item.durationMin}
          sharesOven={item.sharesOven}
          state={state}
        />
      );
    },
    [index],
  );

  const isLast = index >= steps.length - 1;

  return (
    <View style={styles.root}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
      <AppBackground overlay="game" blobs={false}>
        <ScreenHeader
          subtitle="COOK MODE"
          title={`SERVE ${formatClock(plan.serveMin)}`}
          leftSlot={
            running ? (
              <IconButton image={iconPause} onPress={timer.toggleRun} label="Pause the cook" />
            ) : (
              <IconButton Icon={Play} onPress={timer.toggleRun} label="Resume the cook" />
            )
          }
          rightSlot={<IconButton Icon={Thermometer} onPress={openGuide} label="Temperature guide" />}
        />

        <View style={styles.cardWrap}>
          <InstructionCard
            action={current ? current.label : 'SERVE IT UP'}
            atLabel={current ? formatClock(current.at) : formatClock(plan.serveMin)}
            remainingSec={remainingSec}
            totalSec={totalSec}
            flashing={flashing}
            paused={!running}
          />
        </View>

        <View style={styles.timeline} onLayout={onRailLayout}>
          <TimelineRail progress={progress} height={railH} />
          <FlatList
            data={steps}
            renderItem={renderStep}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            extraData={index}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            initialNumToRender={6}
            windowSize={5}
          />
        </View>

        <StatStrip ovenC={cut.ovenC} coreC={est.targetC} restMin={est.restMin} />

        <View style={[styles.controls, { backgroundColor: t.surfaceRaised, borderTopColor: t.hairline }]}>
          <View style={styles.controlRow}>
            <SecondaryButton
              label="ADD 5 MIN"
              Icon={TimerReset}
              onPress={addFive}
              width={HALF_W}
              height={46}
            />
            <View style={styles.controlGap} />
            <SecondaryButton
              label="SKIP STEP"
              Icon={SkipForward}
              onPress={timer.skip}
              width={HALF_W}
              height={46}
            />
          </View>

          <View style={styles.ctaWrap}>
            <PrimaryButton
              label={isLast ? 'SERVE IT UP' : 'DONE · NEXT STEP'}
              Icon={Check}
              onPress={timer.advance}
              height={56}
              width={CONTENT_W}
            />
          </View>

          <Pressable
            onPress={onBack}
            hitSlop={BACK_HIT}
            accessibilityRole="button"
            accessibilityLabel="Back to the plan"
            style={styles.backPress}>
            <Text style={[styles.back, { color: t.textMuted }]}>BACK TO THE PLAN</Text>
          </Pressable>
        </View>
      </AppBackground>

      <TempGuideModal visible={guideOpen} onClose={closeGuide} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2A1A14' },
  cardWrap: { paddingHorizontal: SCREEN_PAD, paddingTop: 10, paddingBottom: 6 },
  timeline: { flex: 1, minHeight: 0 },
  listContent: { paddingTop: 10, paddingBottom: 10 },
  controls: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: SCREEN_PAD,
  },
  controlRow: { flexDirection: 'row', alignItems: 'center' },
  controlGap: { width: 12 },
  ctaWrap: { marginTop: 10 },
  backPress: {
    width: CONTENT_W,
    height: 26,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  back: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.6,
    textAlign: 'center',
  },
});
