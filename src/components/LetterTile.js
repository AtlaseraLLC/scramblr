import React, { useRef, useEffect } from 'react';
import {
    Animated, PanResponder, Text, StyleSheet, View,
} from 'react-native';
import { COLORS, TILE_SIZE, TILE_COLORS } from '../constants';

/**
 * LetterTile
 * Props:
 *   letter       – string character
 *   colorIndex   – int, picks from TILE_COLORS
 *   tileKey      – unique identifier
 *   onDrop       – callback(tileKey, pageX, pageY) called when finger lifts
 *   isPlaced     – bool: tile is in an answer slot (hidden from source row)
 *   initialX     – layout x for home position
 *   initialY     – layout y for home position
 */
export default function LetterTile({
                                       letter,
                                       colorIndex,
                                       tileKey,
                                       onDrop,
                                       isPlaced,
                                       style,
                                   }) {
    const pan        = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const scale      = useRef(new Animated.Value(1)).current;
    const zIndex     = useRef(new Animated.Value(1)).current;
    const popAnim    = useRef(new Animated.Value(0)).current;
    const tileColor  = TILE_COLORS[colorIndex % TILE_COLORS.length];

    // Pop-in on mount
    useEffect(() => {
        Animated.spring(popAnim, {
            toValue: 1, friction: 5, tension: 120, useNativeDriver: true,
        }).start();
    }, [popAnim]);

    // Reset to home when isPlaced goes false (tile returned)
    useEffect(() => {
        if (!isPlaced) {
            Animated.spring(pan, {
                toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: true,
            }).start();
        }
    }, [isPlaced, pan]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder:  () => true,

            onPanResponderGrant: () => {
                // Lift tile on grab
                Animated.parallel([
                    Animated.spring(scale,  { toValue: 1.15, useNativeDriver: true }),
                    Animated.timing(zIndex, { toValue: 99,   duration: 0, useNativeDriver: false }),
                ]).start();
                pan.setOffset({ x: pan.x._value, y: pan.y._value });
                pan.setValue({ x: 0, y: 0 });
            },

            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),

            onPanResponderRelease: (evt) => {
                pan.flattenOffset();
                // Drop back to rest scale
                Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
                Animated.timing(zIndex, { toValue: 1, duration: 0, useNativeDriver: false }).start();

                // Notify parent of drop location
                if (onDrop) {
                    onDrop(tileKey, evt.nativeEvent.pageX, evt.nativeEvent.pageY);
                }
            },

            onPanResponderTerminate: () => {
                pan.flattenOffset();
                Animated.spring(pan,   { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: true }).start();
                Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
            },
        })
    ).current;

    if (isPlaced) {
        return <View style={{ width: TILE_SIZE, height: TILE_SIZE }} />;
    }

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.tile,
                {
                    backgroundColor: tileColor,
                    zIndex,
                    transform: [
                        { scale: Animated.multiply(popAnim, scale) },
                        { translateX: pan.x },
                        { translateY: pan.y },
                    ],
                    shadowColor: tileColor,
                },
                style,
            ]}
        >
            <Text style={styles.letter}>{letter}</Text>
            {/* Gloss overlay */}
            <View style={styles.gloss} pointerEvents="none" />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    tile: {
        width:  TILE_SIZE,
        height: TILE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 8,
        borderBottomWidth: 4,
        borderBottomColor: 'rgba(0,0,0,0.35)',
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