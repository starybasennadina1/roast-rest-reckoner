import { useCallback, useEffect, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import { TICK_MS } from '../constants/config';
import { Step } from '../game/schedule';

export interface CookTimerApi {
  index: number;
  remainingSec: number;
  totalSec: number;
  running: boolean;
  flashing: boolean;
  elapsedMin: number;
  toggleRun: () => void;
  advance: () => void;
  addFive: () => void;
  skip: () => void;
}

/**
 * Drives Cook Mode. Mutable values live in refs so the 1000 ms interval
 * callback never goes stale (rule #8) — state is only the render mirror.
 */
export function useCookTimer(steps: Step[], onFinish: (elapsedMin: number) => void): CookTimerApi {
  const [index, setIndex] = useState(0);
  const [remainingSec, setRemainingSec] = useState(0);
  const [running, setRunning] = useState(true);
  const [flashing, setFlashing] = useState(false);

  const indexRef = useRef(0);
  const remainingRef = useRef(0);
  const runningRef = useRef(true);
  const elapsedRef = useRef(0);
  const stepsRef = useRef(steps);
  const finishRef = useRef(onFinish);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  stepsRef.current = steps;
  finishRef.current = onFinish;

  const spanSec = useCallback((i: number) => {
    const s = stepsRef.current[i];
    return s ? Math.max(1, s.spanMin) * 60 : 60;
  }, []);

  const [totalSec, setTotalSec] = useState(() => (steps[0] ? steps[0].spanMin * 60 : 60));

  const pulse = useCallback(() => {
    setFlashing(true);
    Vibration.vibrate([0, 220, 120, 220]);
    if (flashTimer.current) {
      clearTimeout(flashTimer.current);
    }
    flashTimer.current = setTimeout(() => setFlashing(false), 520);
  }, []);

  const goTo = useCallback(
    (nextIndex: number) => {
      const list = stepsRef.current;
      if (nextIndex >= list.length) {
        runningRef.current = false;
        setRunning(false);
        finishRef.current(Math.round(elapsedRef.current / 60));
        return;
      }
      indexRef.current = nextIndex;
      remainingRef.current = spanSec(nextIndex);
      setIndex(nextIndex);
      setTotalSec(spanSec(nextIndex));
      setRemainingSec(remainingRef.current);
    },
    [spanSec],
  );

  // boot
  useEffect(() => {
    indexRef.current = 0;
    elapsedRef.current = 0;
    remainingRef.current = steps[0] ? steps[0].spanMin * 60 : 60;
    runningRef.current = true;
    setIndex(0);
    setRunning(true);
    setTotalSec(remainingRef.current);
    setRemainingSec(remainingRef.current);
    // steps are rebuilt only when the plan changes, which restarts the cook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (!runningRef.current) {
        return;
      }
      elapsedRef.current += TICK_MS / 1000;
      remainingRef.current -= TICK_MS / 1000;
      if (remainingRef.current <= 0) {
        pulse();
        goTo(indexRef.current + 1);
        return;
      }
      setRemainingSec(remainingRef.current);
    }, TICK_MS);
    return () => {
      clearInterval(id);
      if (flashTimer.current) {
        clearTimeout(flashTimer.current);
      }
    };
  }, [goTo, pulse]);

  const toggleRun = useCallback(() => {
    runningRef.current = !runningRef.current;
    setRunning(runningRef.current);
  }, []);

  const advance = useCallback(() => {
    pulse();
    goTo(indexRef.current + 1);
  }, [goTo, pulse]);

  const skip = useCallback(() => {
    goTo(indexRef.current + 1);
  }, [goTo]);

  const addFive = useCallback(() => {
    remainingRef.current += 300;
    setRemainingSec(remainingRef.current);
    setTotalSec(prev => Math.max(prev, remainingRef.current));
  }, []);

  return {
    index,
    remainingSec: Math.max(0, Math.round(remainingSec)),
    totalSec: Math.max(1, Math.round(totalSec)),
    running,
    flashing,
    elapsedMin: Math.round(elapsedRef.current / 60),
    toggleRun,
    advance,
    addFive,
    skip,
  };
}
