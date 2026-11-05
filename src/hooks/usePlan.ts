import { useCallback, useMemo, useState } from 'react';
import {
  ALL_SIDES,
  CUTS,
  Cut,
  DEFAULT_SERVE_MIN,
  DEFAULT_SIDE_IDS,
  DonenessKey,
  MAX_SIDES,
  SavedPlan,
  SideDish,
  WEIGHT_MAX,
  WEIGHT_MIN,
} from '../constants/config';
import { buildSchedule, estimate, Plan, resolveDoneness } from '../game/schedule';
import { addMinutes } from '../utils/time';

const DEFAULT_SIDES: SideDish[] = ALL_SIDES.filter(s => DEFAULT_SIDE_IDS.indexOf(s.id) >= 0);

export function usePlan(ovenFactor: number) {
  const [cutId, setCutId] = useState<string>(CUTS[0].id);
  const [weightKg, setWeightKg] = useState<number>(2.4);
  const [doneness, setDonenessRaw] = useState<DonenessKey>('mr');
  const [serveMin, setServeMin] = useState<number>(DEFAULT_SERVE_MIN);
  const [sides, setSides] = useState<SideDish[]>(DEFAULT_SIDES);

  const cut: Cut = useMemo(
    () => CUTS.find(c => c.id === cutId) ?? CUTS[0],
    [cutId],
  );

  const effectiveDoneness = useMemo(
    () => resolveDoneness(cut, doneness),
    [cut, doneness],
  );

  const plan: Plan = useMemo(
    () => ({ cut, weightKg, doneness: effectiveDoneness, serveMin, sides }),
    [cut, weightKg, effectiveDoneness, serveMin, sides],
  );

  const steps = useMemo(() => buildSchedule(plan, ovenFactor), [plan, ovenFactor]);
  const est = useMemo(() => estimate(plan, ovenFactor), [plan, ovenFactor]);

  const selectCut = useCallback((id: string) => setCutId(id), []);

  const setDoneness = useCallback((d: DonenessKey) => setDonenessRaw(d), []);

  const changeWeight = useCallback((kg: number) => {
    const clamped = Math.min(WEIGHT_MAX, Math.max(WEIGHT_MIN, kg));
    setWeightKg(Math.round(clamped * 10) / 10);
  }, []);

  const shiftServe = useCallback((delta: number) => {
    setServeMin(prev => addMinutes(prev, delta));
  }, []);

  const removeSide = useCallback((id: string) => {
    setSides(prev => prev.filter(s => s.id !== id));
  }, []);

  const addSide = useCallback(() => {
    setSides(prev => {
      if (prev.length >= MAX_SIDES) {
        return prev;
      }
      const next = ALL_SIDES.find(s => prev.every(p => p.id !== s.id));
      return next ? prev.concat(next) : prev;
    });
  }, []);

  const loadSaved = useCallback((saved: SavedPlan) => {
    setCutId(saved.cutId);
    setWeightKg(saved.weightKg);
    setDonenessRaw(saved.doneness);
    setServeMin(saved.serveMin);
    setSides(DEFAULT_SIDES);
  }, []);

  return {
    cut,
    cutId,
    weightKg,
    doneness: effectiveDoneness,
    requestedDoneness: doneness,
    serveMin,
    sides,
    plan,
    steps,
    est,
    selectCut,
    setDoneness,
    changeWeight,
    shiftServe,
    addSide,
    removeSide,
    loadSaved,
  };
}

export type PlanApi = ReturnType<typeof usePlan>;
