import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ChevronLeft, Info, Play, Plus } from 'lucide-react-native';
import AppBackground from '../components/AppBackground';
import Chip from '../components/Chip';
import CutTile from '../components/CutTile';
import IconButton from '../components/IconButton';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import SideRow from '../components/SideRow';
import TempGuideModal from '../components/TempGuideModal';
import TimeStepper from '../components/TimeStepper';
import WeightWheel from '../components/WeightWheel';
import { SPRITES } from '../assets';
import {
  CONTENT_W,
  CUTS,
  CUT_GAP,
  DONENESS_LABEL,
  DONENESS_ORDER,
  DonenessKey,
  MAX_SIDES,
  SCREEN_PAD,
  SideDish,
  WHEEL_W,
} from '../constants/config';
import { PlanApi } from '../hooks/usePlan';
import { useTheme, useThemeMode } from '../hooks/useTheme';
import { formatClock, formatDuration } from '../utils/time';

interface Props {
  plan: PlanApi;
  onBack: () => void;
  onStartCook: () => void;
}

const RIGHT_W = CONTENT_W - WHEEL_W - 12;
const DONE_CHIP_W = Math.floor((RIGHT_W - 8) / 2);

export default function PlannerScreen({ plan, onBack, onStartCook }: Props) {
  const t = useTheme();
  const mode = useThemeMode();
  const [guideOpen, setGuideOpen] = useState(false);

  const openGuide = useCallback(() => setGuideOpen(true), []);
  const closeGuide = useCallback(() => setGuideOpen(false), []);

  const { cut, selectCut, doneness, setDoneness, weightKg, changeWeight } = plan;

  const renderSide = useCallback(
    ({ item }: ListRenderItemInfo<SideDish>) => (
      <SideRow
        id={item.id}
        name={item.name}
        durationMin={item.durationMin}
        needsOven={item.needsOven}
        onRemove={plan.removeSide}
      />
    ),
    [plan.removeSide],
  );

  const keyExtractor = useCallback((item: SideDish) => item.id, []);

  const cutTiles = useMemo(
    () =>
      CUTS.map((c, i) => (
        <View key={c.id} style={i > 0 ? styles.tileGap : null}>
          <CutTile
            id={c.id}
            sprite={SPRITES[c.spriteKey]}
            name={c.name}
            hint={`${c.minPerKg[doneness] ?? c.minPerKg.well ?? 45} M/KG`}
            active={c.id === cut.id}
            onPress={selectCut}
          />
        </View>
      )),
    [cut.id, doneness, selectCut],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
      <AppBackground overlay="game">
        <ScreenHeader
          title="PLAN THE ROAST"
          leftSlot={<IconButton Icon={ChevronLeft} onPress={onBack} label="Back to plans" />}
          rightSlot={
            <View style={[styles.servePill, { backgroundColor: t.primary + '2E', borderColor: t.primary + '73' }]}>
              <Text style={[styles.serveText, { color: t.primary }]}>
                SERVE {formatClock(plan.serveMin)}
              </Text>
            </View>
          }
        />

        <View style={styles.body}>
          {/* Block A — the cut */}
          <Text style={[styles.blockLabel, { color: t.textSecondary }]}>CHOOSE THE CUT</Text>
          <View style={styles.cutRow}>{cutTiles}</View>

          {/* Block B — weight + doneness */}
          <View style={styles.blockB}>
            <WeightWheel value={weightKg} onChange={changeWeight} />

            <View style={styles.rightCol}>
              <View style={styles.chipGrid}>
                {DONENESS_ORDER.map((d: DonenessKey, i) => {
                  const allowed = cut.minPerKg[d] != null;
                  return (
                    <View
                      key={d}
                      style={[styles.chipSlot, i % 2 === 1 ? styles.chipSlotRight : null]}>
                      <Chip
                        label={DONENESS_LABEL[d]}
                        active={allowed && d === doneness}
                        disabled={!allowed}
                        onPress={() => setDoneness(d)}
                        width={DONE_CHIP_W}
                        height={42}
                      />
                    </View>
                  );
                })}
              </View>

              <View style={[styles.target, { backgroundColor: t.bgDeep, borderColor: t.hairline }]}>
                <View style={styles.targetCell}>
                  <Text style={[styles.targetValue, { color: t.primary }]}>
                    {plan.est.targetC}°C
                  </Text>
                  <Text style={[styles.targetLabel, { color: t.textSecondary }]}>TARGET CORE</Text>
                </View>
                <View style={[styles.targetDivider, { backgroundColor: t.hairline }]} />
                <View style={styles.targetCell}>
                  <Text style={[styles.targetValue, { color: t.accentText }]}>
                    {plan.est.restMin}M
                  </Text>
                  <Text style={[styles.targetLabel, { color: t.textSecondary }]}>REST</Text>
                </View>
                <IconButton Icon={Info} onPress={openGuide} label="Temperature guide" />
              </View>
            </View>
          </View>

          {/* Block C — sides */}
          <View style={styles.blockC}>
            <View style={styles.sidesHead}>
              <Text style={[styles.blockLabel, { color: t.textSecondary }]}>
                SIDES · {formatDuration(plan.est.ovenMin)} IN THE OVEN
              </Text>
              <SecondaryButton
                label="ADD SIDE"
                Icon={Plus}
                onPress={plan.addSide}
                tone="accent"
                height={34}
                width={118}
              />
            </View>

            <FlatList
              data={plan.sides}
              renderItem={renderSide}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              style={styles.sidesList}
              initialNumToRender={MAX_SIDES}
              windowSize={3}
            />

            <Text style={[styles.sidesHint, { color: t.textMuted }]}>
              OVEN SIDES SHARE THE RESTING WINDOW
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TimeStepper serveMin={plan.serveMin} onShift={plan.shiftServe} />
            <View style={styles.footerSpacer} />
            <PrimaryButton
              label="START COOK MODE"
              Icon={Play}
              onPress={onStartCook}
              height={56}
              width={CONTENT_W}
            />
          </View>
        </View>
      </AppBackground>

      <TempGuideModal visible={guideOpen} onClose={closeGuide} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2A1A14' },
  body: { flex: 1, paddingHorizontal: SCREEN_PAD, paddingTop: 10 },
  servePill: {
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serveText: { fontSize: 11, fontWeight: '800', letterSpacing: 1, fontVariant: ['tabular-nums'] },
  blockLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.6, marginBottom: 7 },
  cutRow: { flexDirection: 'row', alignItems: 'center' },
  tileGap: { marginLeft: CUT_GAP },
  blockB: { flexDirection: 'row', alignItems: 'stretch', marginTop: 12 },
  rightCol: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  chipSlot: { marginBottom: 8 },
  chipSlotRight: { marginLeft: 8 },
  target: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  targetCell: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  targetDivider: { width: 1, height: 30 },
  targetValue: { fontSize: 18, fontWeight: '900', fontVariant: ['tabular-nums'], lineHeight: 22 },
  targetLabel: { fontSize: 8, fontWeight: '700', letterSpacing: 1, marginTop: 2 },
  blockC: { flex: 1, minHeight: 0, marginTop: 14 },
  sidesHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  sidesList: { flex: 1 },
  sidesHint: { fontSize: 9, fontWeight: '700', letterSpacing: 1.1, marginTop: 2 },
  footer: { paddingTop: 10, paddingBottom: 16 },
  footerSpacer: { height: 10 },
});
