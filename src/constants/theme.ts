/**
 * RoastRestReckoner — visual tokens.
 * Preset: WARM_EARTHY (design-system/preset.ts) with the brief's
 * "kitchen at dusk" hex overrides. The preset `name` is kept verbatim.
 */

export type ThemeMode = 'dark' | 'light';

export interface Tokens {
  bgDeep: string;
  bg: string;
  surface: string;
  surfaceRaised: string;
  surfaceHigh: string;
  primary: string;
  primaryDark: string;
  accent: string;
  accentText: string;
  danger: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  onPrimary: string;
  hairline: string;
  hairlineStrong: string;
  shadow: string;
  overlayLoader: [string, string, string];
  overlayMenu: [string, string, string];
  overlayGame: [string, string, string];
  overlayOver: [string, string, string];
  glowOrange: string;
  glowHerb: string;
}

export const DARK: Tokens = {
  bgDeep: '#1B100B',
  bg: '#2A1A14',
  surface: '#3A251E',
  surfaceRaised: '#46302A',
  surfaceHigh: '#5A3E35',
  primary: '#E08E45',
  primaryDark: '#C2702F',
  accent: '#A7C957',
  accentText: '#A7C957',
  danger: '#D96A4D',
  textPrimary: '#FBEFE2',
  textSecondary: '#C9AE9B',
  textMuted: '#7A6A5C',
  onPrimary: '#2A1A14',
  hairline: 'rgba(251,239,226,0.12)',
  hairlineStrong: 'rgba(251,239,226,0.22)',
  shadow: '#000000',
  overlayLoader: ['rgba(16,9,6,0.93)', 'rgba(42,26,20,0.88)', 'rgba(11,6,4,0.96)'],
  overlayMenu: ['rgba(42,26,20,0.18)', 'rgba(42,26,20,0.55)', '#2A1A14'],
  overlayGame: ['rgba(11,6,4,0.82)', 'rgba(42,26,20,0.88)', 'rgba(11,6,4,0.92)'],
  overlayOver: ['rgba(42,26,20,0.80)', 'rgba(42,26,20,0.88)', 'rgba(11,6,4,0.94)'],
  glowOrange: 'rgba(224,142,69,0.14)',
  glowHerb: 'rgba(167,201,87,0.08)',
};

export const LIGHT: Tokens = {
  bgDeep: '#FBEFE2',
  bg: '#F6E7D6',
  surface: '#FFFFFF',
  surfaceRaised: '#F2E0CC',
  surfaceHigh: '#EAD6BE',
  primary: '#E08E45',
  primaryDark: '#C2702F',
  accent: '#A7C957',
  accentText: '#5F7F28',
  danger: '#C2552F',
  textPrimary: '#2A1A14',
  textSecondary: '#6B5243',
  textMuted: '#9A8372',
  onPrimary: '#2A1A14',
  hairline: 'rgba(42,26,20,0.12)',
  hairlineStrong: 'rgba(42,26,20,0.22)',
  shadow: '#6B5243',
  overlayLoader: ['rgba(16,9,6,0.93)', 'rgba(42,26,20,0.88)', 'rgba(11,6,4,0.96)'],
  overlayMenu: ['rgba(246,231,214,0.10)', 'rgba(246,231,214,0.62)', '#F6E7D6'],
  overlayGame: ['rgba(246,231,214,0.86)', 'rgba(246,231,214,0.90)', 'rgba(234,214,190,0.94)'],
  overlayOver: ['rgba(246,231,214,0.82)', 'rgba(246,231,214,0.90)', 'rgba(234,214,190,0.96)'],
  glowOrange: 'rgba(224,142,69,0.18)',
  glowHerb: 'rgba(167,201,87,0.14)',
};

export const THEME = {
  name: 'warm-earthy',
  modes: { dark: DARK, light: LIGHT },
  gradients: {
    button: ['#E08E45', '#C2702F'] as [string, string],
    rail: ['#E08E45', '#A7C957'] as [string, string],
    progress: ['#E08E45', '#F2B277'] as [string, string],
  },
  typography: {
    hero: { fontSize: 34, fontWeight: '900' as const, letterSpacing: 3 },
    huge: { fontSize: 27, fontWeight: '900' as const, letterSpacing: 0.6 },
    title: { fontSize: 23, fontWeight: '800' as const, letterSpacing: 0.4 },
    value: { fontSize: 20, fontWeight: '700' as const },
    body: { fontSize: 15, fontWeight: '600' as const },
    caption: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.6 },
    micro: { fontSize: 9, fontWeight: '700' as const, letterSpacing: 1.2 },
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 22, xxl: 30 },
};

export function tokensFor(mode: ThemeMode): Tokens {
  return mode === 'light' ? LIGHT : DARK;
}

/** Hex + alpha suffix helper, e.g. alpha('#E08E45', '22') */
export function alpha(hex: string, suffix: string): string {
  return hex + suffix;
}

export default THEME;
