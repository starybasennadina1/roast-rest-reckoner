import {
  Cut,
  DonenessKey,
  PREHEAT_MIN,
  SideDish,
} from '../constants/config';

export type StepKind = 'prep' | 'oven' | 'meat' | 'side' | 'rest' | 'serve';

export interface Plan {
  cut: Cut;
  weightKg: number;
  doneness: DonenessKey;
  serveMin: number;
  sides: SideDish[];
}

export interface Step {
  id: string;
  /** minutes since midnight when this step starts */
  at: number;
  label: string;
  action: string;
  /** the nominal length of the thing this step starts */
  durationMin: number;
  /** distance to the next step — what Cook Mode counts down */
  spanMin: number;
  kind: StepKind;
  sharesOven: boolean;
}

export interface Estimate {
  ovenMin: number;
  restMin: number;
  targetC: number;
  ovenC: number;
  prepMin: number;
  totalMin: number;
  prepStart: number;
  ovenOn: number;
  meatIn: number;
  meatOut: number;
}

/** Fall back to the nearest allowed doneness for the cut. */
export function resolveDoneness(cut: Cut, doneness: DonenessKey): DonenessKey {
  if (cut.minPerKg[doneness] != null) {
    return doneness;
  }
  const order: DonenessKey[] = ['rare', 'mr', 'med', 'well'];
  for (let i = order.length - 1; i >= 0; i -= 1) {
    if (cut.minPerKg[order[i]] != null) {
      return order[i];
    }
  }
  return 'well';
}

export function estimate(plan: Plan, ovenFactor: number): Estimate {
  const { cut, weightKg, serveMin } = plan;
  const d = resolveDoneness(cut, plan.doneness);
  const perKg = cut.minPerKg[d] ?? 45;
  const ovenMin = Math.round(weightKg * perKg * ovenFactor) + cut.baseMin;
  const restMin = cut.restMin;
  const meatOut = serveMin - restMin;
  const meatIn = meatOut - ovenMin;
  const ovenOn = meatIn - PREHEAT_MIN;
  const prepStart = ovenOn - cut.prepMin;

  return {
    ovenMin,
    restMin,
    targetC: cut.targetC[d] ?? 70,
    ovenC: cut.ovenC,
    prepMin: cut.prepMin,
    totalMin: serveMin - prepStart,
    prepStart,
    ovenOn,
    meatIn,
    meatOut,
  };
}

/**
 * Backward schedule: everything is derived from the moment the food hits the
 * table, then sorted ascending so the earliest step renders at the top.
 */
export function buildSchedule(plan: Plan, ovenFactor: number): Step[] {
  const e = estimate(plan, ovenFactor);
  const { cut, serveMin, sides } = plan;

  const raw: Omit<Step, 'spanMin'>[] = [
    {
      id: 'prep',
      at: e.prepStart,
      label: 'PREP THE JOINT',
      action: `SEASON · ${cut.name}`,
      durationMin: e.prepMin,
      kind: 'prep',
      sharesOven: false,
    },
    {
      id: 'oven',
      at: e.ovenOn,
      label: 'HEAT THE OVEN',
      action: `OVEN ON · ${cut.ovenC}°C`,
      durationMin: PREHEAT_MIN,
      kind: 'oven',
      sharesOven: false,
    },
    {
      id: 'meat',
      at: e.meatIn,
      label: 'MEAT IN THE OVEN',
      action: `ROAST FOR ${e.ovenMin} MIN`,
      durationMin: e.ovenMin,
      kind: 'meat',
      sharesOven: false,
    },
    {
      id: 'rest',
      at: e.meatOut,
      label: 'REST THE MEAT',
      action: `COVER · ${e.restMin} MIN REST`,
      durationMin: e.restMin,
      kind: 'rest',
      sharesOven: false,
    },
    {
      id: 'serve',
      at: serveMin,
      label: 'SERVE IT UP',
      action: 'CARVE AND PLATE',
      durationMin: 0,
      kind: 'serve',
      sharesOven: false,
    },
  ];

  sides.forEach(side => {
    const at = serveMin - side.durationMin;
    raw.push({
      id: `side-${side.id}`,
      at,
      label: `${side.name} IN`,
      action: side.needsOven ? `OVEN · ${side.durationMin} MIN` : `HOB · ${side.durationMin} MIN`,
      durationMin: side.durationMin,
      kind: 'side',
      sharesOven: side.needsOven && at >= e.meatOut,
    });
  });

  const order: Record<StepKind, number> = {
    prep: 0,
    oven: 1,
    meat: 2,
    side: 3,
    rest: 4,
    serve: 5,
  };

  raw.sort((a, b) => (a.at === b.at ? order[a.kind] - order[b.kind] : a.at - b.at));

  return raw.map((s, i) => {
    const next = raw[i + 1];
    const spanMin = next ? Math.max(1, next.at - s.at) : Math.max(1, s.durationMin || 5);
    return { ...s, spanMin };
  });
}

export function plannedTotalMin(steps: Step[]): number {
  if (steps.length < 2) {
    return 0;
  }
  return steps[steps.length - 1].at - steps[0].at;
}
