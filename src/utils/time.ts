const DAY = 24 * 60;

/** Wrap minutes-since-midnight into [0, 1440). */
export function wrapMin(min: number): number {
  const m = Math.round(min) % DAY;
  return m < 0 ? m + DAY : m;
}

/** 870 -> "14:30" (24h, zero padded). */
export function formatClock(minOfDay: number): string {
  const m = wrapMin(minOfDay);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h < 10 ? '0' : ''}${h}:${mm < 10 ? '0' : ''}${mm}`;
}

/** 190 -> "3H 10M", 55 -> "55M". */
export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h <= 0) {
    return `${m}M`;
  }
  return `${h}H ${m < 10 ? '0' : ''}${m}M`;
}

/** 2530 seconds -> "42:10". */
export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm < 10 ? '0' : ''}${mm}:${ss < 10 ? '0' : ''}${ss}`;
}

export function addMinutes(minOfDay: number, delta: number): number {
  return wrapMin(minOfDay + delta);
}

export function formatWeight(kg: number): string {
  return kg.toFixed(1);
}
