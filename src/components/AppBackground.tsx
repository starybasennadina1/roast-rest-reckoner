import React, { memo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { bgGame } from '../assets';
import { useTheme } from '../hooks/useTheme';

export type OverlayKind = 'loader' | 'menu' | 'game' | 'gameover';

interface Props {
  overlay: OverlayKind;
  children: React.ReactNode;
  /** draw the two warm decor blobs behind the content */
  blobs?: boolean;
}

function AppBackground({ overlay, children, blobs = true }: Props) {
  const t = useTheme();
  const colors =
    overlay === 'loader'
      ? t.overlayLoader
      : overlay === 'menu'
      ? t.overlayMenu
      : overlay === 'game'
      ? t.overlayGame
      : t.overlayOver;

  return (
    <ImageBackground source={bgGame} style={styles.root} resizeMode="cover">
      <LinearGradient
        colors={colors}
        locations={[0, 0.52, 1]}
        style={StyleSheet.absoluteFill}
      />
      {blobs ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <View style={[styles.blobWarm, { backgroundColor: t.glowOrange }]} />
          <View style={[styles.blobHerb, { backgroundColor: t.glowHerb }]} />
        </View>
      ) : null}
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1B100B' },
  blobWarm: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    top: 90,
    alignSelf: 'center',
  },
  blobHerb: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    bottom: 150,
    left: -46,
  },
});

export default memo(AppBackground);
