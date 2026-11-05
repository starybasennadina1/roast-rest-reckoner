import React, { createContext, useContext, useMemo } from 'react';
import { DARK, ThemeMode, Tokens, tokensFor } from '../constants/theme';

interface ThemeValue {
  mode: ThemeMode;
  t: Tokens;
}

const ThemeContext = createContext<ThemeValue>({ mode: 'dark', t: DARK });

export function ThemeProvider({
  mode,
  children,
}: {
  mode: ThemeMode;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ mode, t: tokensFor(mode) }), [mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Pull only the tokens — components never subscribe to app/game state. */
export function useTheme(): Tokens {
  return useContext(ThemeContext).t;
}

export function useThemeMode(): ThemeMode {
  return useContext(ThemeContext).mode;
}
