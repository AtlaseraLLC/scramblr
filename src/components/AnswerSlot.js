import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS, TILE_SIZE, TILE_COLORS } from '../utils/Constants';

/**
 * AnswerSlot
 * Props:
 *   index – slot position (0-based)
 *   letter – placed letter string | null
 *   colorIndex   – tile color index for the placed letter
 *   isCorrect    – bool: this slot has the right letter
 *   isRevealing  – bool: animate a correct reveal
 *   onRef        – callback(index, ref) so GameScreen can measure position
 */
export default function AnswerSlot({ index, letter, colorIndex, isCorrect, isRevealing, onRef }) {
    const viewRef     = useRef(null);
    const shakeAnim   = useRef(new Animated.Value(0)).current;
    const scaleAnim   = useRef(new Animated.Value(1)).current;
    const glowAnim    = useRef(new Animated.Value(0)).current;

    // Pass ref up to parent for measuring
    useEffect(() => {
        if (onRef && viewRef.current) {
            onRef(index, viewRef.current);
        }
    }, [index, onRef]);

    // Pop + glow when letter placed
    useEffect(() => {
        if (letter) {
            Animated.sequence([
                Animated.spring(scaleAnim, { toValue: 1.12, friction: 4, useNativeDriver: true }),
                Animated.spring(scaleAnim, { toValue: 1,    friction: 5, useNativeDriver: true }),
            ]).start();
        }
    }, [letter, scaleAnim]);

    // Glow when correct
    useEffect(() => {
        if (isCorrect) {
            Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: false }).start();
        } else {
            Animated.timing(glowAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
        }
    }, [glowAnim, isCorrect]);

    // Shake on wrong answer
    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue:  8, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue:  6, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue:  0, duration: 60, useNativeDriver: true }),
        ]).start();
    };

    const tileColor   = letter ? TILE_COLORS[colorIndex % TILE_COLORS.length] : null;
    const borderColor = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.border, COLORS.neonGreen],
    });

    return (
        <Animated.View
            ref={viewRef}
            style={[
                styles.slot,
                letter && styles.slotFilled,
                {
                    borderColor,
                    transform: [
                        { translateX: shakeAnim },
                        { scale: scaleAnim },
                    ],
                    shadowColor:   isCorrect ? COLORS.neonGreen : 'transparent',
                    shadowOpacity: isCorrect ? 0.7 : 0,
                    shadowRadius:  isCorrect ? 8 : 0,
                },
            ]}
            onLayout={() => {
                if (onRef && viewRef.current) {
                    onRef(index, viewRef.current);
                }
            }}
        >
            {letter ? (
                <>
                    <View style={[styles.filledTile, { backgroundColor: tileColor }]}>
                        <Text style={styles.filledLetter}>{letter}</Text>
                        <View style={styles.gloss} pointerEvents="none" />
                    </View>
                    {isCorrect && <View style={styles.correctDot} />}
                </>
            ) : (
                <Text style={styles.placeholder}>{index + 1}</Text>
            )}
        </Animated.View>
    );
}

// Expose shake for parent to call imperatively
AnswerSlot.shake = null; // parent will use ref

const styles = StyleSheet.create({
    slot: {
        width:  TILE_SIZE,
        height: TILE_SIZE,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.slotEmpty,
        position: 'relative',
    },
    slotFilled: {
        borderStyle: 'solid',
        borderColor: COLORS.border,
    },
    filledTile: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 4,
        borderBottomColor: 'rgba(0,0,0,0.3)',
    },
    filledLetter: {
        fontSize: 24,
        fontWeight: '900',
        fontFamily: 'monospace',
        color: '#0A0A0F',
    },
    gloss: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '45%',
        backgroundColor: 'rgba(255,255,255,0.16)',
    },
    placeholder: {
        fontSize: 11,
        fontFamily: 'monospace',
        color: COLORS.border,
    },
    correctDot: {
        position: 'absolute',
        bottom: 4, right: 4,
        width: 6, height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.neonGreen,
    },
});