/**
 * RoastRestReckoner — state machine only (no gameplay lives here).
 * loader -> menu -> planner -> game -> gameover -> (menu | planner)
 */

import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import PlannerScreen from './src/screens/PlannerScreen';
import GameScreen, { CookResult } from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import { OVEN_FACTOR_START, SavedPlan } from './src/constants/config';
import { ThemeMode } from './src/constants/theme';
import { ThemeProvider } from './src/hooks/useTheme';
import { usePlan } from './src/hooks/usePlan';

type Screen = 'loader' | 'menu' | 'planner' | 'game' | 'gameover';

export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [ovenFactor, setOvenFactor] = useState(OVEN_FACTOR_START);
  const [roastsCooked, setRoastsCooked] = useState(18);
  const [result, setResult] = useState<CookResult>({ lateMin: 0, plannedOvenMin: 120 });
  const [cookKey, setCookKey] = useState(0);

  const plan = usePlan(ovenFactor);

  const toMenu = useCallback(() => setScreen('menu'), []);
  const toPlanner = useCallback(() => setScreen('planner'), []);

  const startCook = useCallback(() => {
    setCookKey(k => k + 1);
    setScreen('game');
  }, []);

  const loadPlan = useCallback(
    (saved: SavedPlan) => {
      plan.loadSaved(saved);
      setScreen('planner');
    },
    [plan],
  );

  const handleGameOver = useCallback((r: CookResult) => {
    setResult(r);
    setRoastsCooked(prev => prev + 1);
    setScreen('gameover');
  }, []);

  const cookAgain = useCallback((factor: number) => {
    setOvenFactor(factor);
    setScreen('planner');
  }, []);

  const saveAndMenu = useCallback((factor: number) => {
    setOvenFactor(factor);
    setScreen('menu');
  }, []);

  return (
    <ThemeProvider mode={mode}>
      <View style={styles.root}>
        {screen === 'loader' ? <LoaderScreen onDone={toMenu} /> : null}

        {screen === 'menu' ? (
          <MenuScreen
            ovenFactor={ovenFactor}
            roastsCooked={roastsCooked}
            onStart={toPlanner}
            onLoadPlan={loadPlan}
            onToggleMode={setMode}
          />
        ) : null}

        {screen === 'planner' ? (
          <PlannerScreen plan={plan} onBack={toMenu} onStartCook={startCook} />
        ) : null}

        {screen === 'game' ? (
          <GameScreen
            key={cookKey}
            plan={plan}
            onGameOver={handleGameOver}
            onBack={toPlanner}
          />
        ) : null}

        {screen === 'gameover' ? (
          <GameOverScreen
            lateMin={result.lateMin}
            plannedOvenMin={result.plannedOvenMin}
            ovenFactor={ovenFactor}
            roastsCooked={roastsCooked}
            onCookAgain={cookAgain}
            onMenu={saveAndMenu}
          />
        ) : null}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1B100B' },
});
