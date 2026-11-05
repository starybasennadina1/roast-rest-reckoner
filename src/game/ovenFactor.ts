import { OVEN_FACTOR_MAX, OVEN_FACTOR_MIN } from '../constants/config';

export type LogDoneness = 'under' | 'perfect' | 'over' | 'wayover';

export const LOG_DONENESS_ORDER: LogDoneness[] = ['under', 'perfect', 'over', 'wayover'];

export const LOG_DONENESS_LABEL: Record<LogDoneness, string> = {
  under: 'UNDER',
  perfect: 'PERFECT',
  over: 'OVER',
  wayover: 'WAY OVER',
};

export function clampFactor(f: number): number {
  return Math.min(OVEN_FACTOR_MAX, Math.max(OVEN_FACTOR_MIN, f));
}

/**
 * Nudge the oven factor after a logged roast.
 * UNDER +0.03 · PERFECT ±0.01 toward the measured time · OVER -0.03 · WAY OVER -0.06
 */
export function nextFactor(
  current: number,
  doneness: LogDoneness,
  plannedMin: number,
  actualMin: number,
): number {
  let delta = 0;
  if (doneness === 'under') {
    delta = 0.03;
  } else if (doneness === 'over') {
    delta = -0.03;
  } else if (doneness === 'wayover') {
    delta = -0.06;
  } else if (plannedMin > 0) {
    const drift = actualMin - plannedMin;
    if (drift > 2) {
      delta = 0.01;
    } else if (drift < -2) {
      delta = -0.01;
    }
  }
  return clampFactor(Math.round((current + delta) * 100) / 100);
}

export function formatFactor(f: number): string {
  return f.toFixed(2);
}
