import React, { useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, TILE_SIZE, TILE_COLORS } from '../utils/Constants';

/**
 * @param param0
 * @param param0.letter
 * @param param0.colorIndex
 * @param param0.tileKey
 * @param param0.onTap
 * @param param0.isPlaced
 * @returns {React.JSX.Element}
 * @constructor
 */
export default function LetterTile({ letter, colorIndex, tileKey, onTap, isPlaced }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const tileColor = TILE_COLORS[colorIndex % TILE_COLORS.length];

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1, friction: 5, tension: 120, useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: isPlaced ? 0.7 : 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isPlaced]);

  const handlePress = () => {
    if (isPlaced) return;
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.85, useNativeDriver: false }),
      Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: false }),
    ]).start();
    onTap(tileKey);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={isPlaced ? 1 : 0.8} disabled={isPlaced}>
      <Animated.View
        style={[
          styles.tile,
          isPlaced && styles.tilePlaced,
          {
            backgroundColor: isPlaced ? COLORS.border : tileColor,
            transform: [{ scale: scaleAnim }],
            shadowColor: isPlaced ? 'transparent' : tileColor,
          },
        ]}
      >
        {!isPlaced && (
          <>
            <Text style={styles.letter}>{letter}</Text>
            <View style={styles.gloss} pointerEvents="none" />
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width:  TILE_SIZE,
    height: TILE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  tilePlaced: {
    borderBottomWidth: 0,
    opacity: 0.3,
  },
  letter: {
    fontSize: 26,
    fontWeight: '900',
    fontFamily: 'monospace',
    color: '#0A0A0F',
  },
  gloss: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
});
