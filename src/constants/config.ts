import { Dimensions } from 'react-native';

export const SCREEN_W = Dimensions.get('window').width;
export const SCREEN_H = Dimensions.get('window').height;

/** Splash duration — rule #13: EXACTLY 8000 ms. */
export const LOADER_DURATION_MS = 8000;

export const TICK_MS = 1000;
export const PREHEAT_MIN = 18;

export const OVEN_FACTOR_MIN = 0.8;
export const OVEN_FACTOR_MAX = 1.25;
export const OVEN_FACTOR_START = 1.06;

export type DonenessKey = 'rare' | 'mr' | 'med' | 'well';

export const DONENESS_ORDER: DonenessKey[] = ['rare', 'mr', 'med', 'well'];
export const DONENESS_LABEL: Record<DonenessKey, string> = {
  rare: 'RARE',
  mr: 'MEDIUM RARE',
  med: 'MEDIUM',
  well: 'WELL',
};

export interface Cut {
  id: string;
  name: string;
  spriteKey: 'sprite1' | 'sprite2' | 'sprite4' | 'sprite5';
  /** minutes per kg, per doneness. A missing key means that doneness is not allowed. */
  minPerKg: Partial<Record<DonenessKey, number>>;
  targetC: Partial<Record<DonenessKey, number>>;
  baseMin: number;
  restMin: number;
  ovenC: number;
  prepMin: number;
}

export const CUTS: Cut[] = [
  {
    id: 'beef',
    name: 'BEEF RIB',
    spriteKey: 'sprite1',
    minPerKg: { rare: 32, mr: 38, med: 44, well: 52 },
    targetC: { rare: 52, mr: 57, med: 63, well: 68 },
    baseMin: 20,
    restMin: 25,
    ovenC: 190,
    prepMin: 15,
  },
  {
    id: 'lamb',
    name: 'LAMB LEG',
    spriteKey: 'sprite5',
    minPerKg: { rare: 34, mr: 40, med: 46, well: 54 },
    targetC: { rare: 54, mr: 60, med: 65, well: 70 },
    baseMin: 20,
    restMin: 20,
    ovenC: 190,
    prepMin: 15,
  },
  {
    id: 'pork',
    name: 'PORK LOIN',
    spriteKey: 'sprite4',
    minPerKg: { med: 50, well: 58 },
    targetC: { med: 63, well: 71 },
    baseMin: 25,
    restMin: 20,
    ovenC: 180,
    prepMin: 15,
  },
  {
    id: 'chicken',
    name: 'CHICKEN',
    spriteKey: 'sprite2',
    minPerKg: { well: 45 },
    targetC: { well: 75 },
    baseMin: 20,
    restMin: 15,
    ovenC: 200,
    prepMin: 10,
  },
];

export interface SideDish {
  id: string;
  name: string;
  durationMin: number;
  needsOven: boolean;
}

export const ALL_SIDES: SideDish[] = [
  { id: 'potatoes', name: 'ROAST POTATOES', durationMin: 55, needsOven: true },
  { id: 'yorkshires', name: 'YORKSHIRES', durationMin: 22, needsOven: true },
  { id: 'carrots', name: 'CARROTS', durationMin: 35, needsOven: true },
  { id: 'gravy', name: 'GRAVY', durationMin: 15, needsOven: false },
];

export const DEFAULT_SIDE_IDS = ['potatoes', 'yorkshires', 'gravy'];
export const MAX_SIDES = 4;

/** Weight wheel */
export const WEIGHT_MIN = 0.5;
export const WEIGHT_MAX = 7.0;
export const WEIGHT_STEP = 0.1;
export const WHEEL_ROW_H = 52;
export const WHEEL_W = 128;

/** Serving time: minutes since midnight. */
export const DEFAULT_SERVE_MIN = 14 * 60;
export const SERVE_STEP_MIN = 15;

/** Saved demo plans shown on the Menu sheet. */
export interface SavedPlan {
  id: string;
  spriteKey: 'sprite1' | 'sprite2' | 'sprite3';
  title: string;
  meta: string;
  total: string;
  cutId: string;
  weightKg: number;
  doneness: DonenessKey;
  serveMin: number;
}

export const SAVED_PLANS: SavedPlan[] = [
  {
    id: 'p1',
    spriteKey: 'sprite1',
    title: 'BEEF RIB · 2.4 KG',
    meta: 'SERVE 14:00 · 3 SIDES',
    total: '3H 10M',
    cutId: 'beef',
    weightKg: 2.4,
    doneness: 'mr',
    serveMin: 14 * 60,
  },
  {
    id: 'p2',
    spriteKey: 'sprite2',
    title: 'CHICKEN · 1.8 KG',
    meta: 'SERVE 13:30 · 2 SIDES',
    total: '2H 05M',
    cutId: 'chicken',
    weightKg: 1.8,
    doneness: 'well',
    serveMin: 13 * 60 + 30,
  },
  {
    id: 'p3',
    spriteKey: 'sprite3',
    title: 'LAMB LEG · 2.0 KG',
    meta: 'SERVE 18:00 · 3 SIDES',
    total: '2H 45M',
    cutId: 'lamb',
    weightKg: 2.0,
    doneness: 'med',
    serveMin: 18 * 60,
  },
];

export const TEMP_GUIDE_ROWS = [
  { id: 't1', name: 'BEEF RARE', tempC: 52, dot: '#D96A4D' },
  { id: 't2', name: 'BEEF MEDIUM RARE', tempC: 57, dot: '#E08E45' },
  { id: 't3', name: 'BEEF MEDIUM', tempC: 63, dot: '#D9B36C' },
  { id: 't4', name: 'PORK', tempC: 63, dot: '#C9AE9B' },
  { id: 't5', name: 'LAMB', tempC: 60, dot: '#A7C957' },
  { id: 't6', name: 'CHICKEN', tempC: 75, dot: '#FBEFE2' },
];

/** Geometry guard — rules #4/#5. */
export const PANEL_PAD = 16;
export const PANEL_BORDER = 1;
export const FRAME = PANEL_PAD + PANEL_BORDER;
export const PANEL_MAX_W = Math.min(SCREEN_W - 32, 380);
export const CUT_COLS = 4;
export const CUT_GAP = 9;
export const CUT_TILE_W = Math.floor(
  (PANEL_MAX_W - 2 * PANEL_BORDER - CUT_GAP * (CUT_COLS - 1)) / CUT_COLS,
);
export const CUT_TILE_H = 100;

export const SCREEN_PAD = 18;
export const CONTENT_W = SCREEN_W - SCREEN_PAD * 2;
export const HALF_W = Math.floor((CONTENT_W - 12) / 2);

export const HEADER_TOP_PAD = 44;
export const HEADER_H = 72;

/** Cook-mode timeline */
export const PILL_H = 58;
export const PILL_GAP = 9;
export const PILL_ROW_H = PILL_H + PILL_GAP;
export const RAIL_LEFT = 40;
