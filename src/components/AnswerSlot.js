import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { COLORS, TILE_SIZE, TILE_COLORS } from '../utils/Constants';

/**
 * AnswerSlot — shows a placed letter. Tap to return it to the source row.
 */
export default function AnswerSlot({ index, letter, colorIndex, isCorrect, onPress }) {
    const scaleAnim = useRef(new Animated.Value(letter ? 1 : 1)).current;
    const glowAnim  = useRef(new Animated.Value(0)).current;
    const tileColor = letter ? TILE_COLORS[colorIndex % TILE_COLORS.length] : null;

    // Pop when letter placed
    useEffect(() => {
        if (letter) {
            Animated.sequence([
                Animated.spring(scaleAnim, { toValue: 1.12, friction: 4, useNativeDriver: true }),
                Animated.spring(scaleAnim, { toValue: 1,    friction: 5, useNativeDriver: true }),
            ]).start();
        }
    }, [letter]);

    // Glow when correct
    useEffect(() => {
        Animated.timing(glowAnim, {
            toValue: isCorrect ? 1 : 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [isCorrect]);

    const borderColor = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.border, COLORS.neonGreen],
    });

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={letter ? 0.7 : 1} disabled={!letter}>
            <Animated.View
                style={[
                    styles.slot,
                    letter && styles.slotFilled,
                    {
                        borderColor,
                        transform: [{ scale: scaleAnim }],
                        shadowColor:   isCorrect ? COLORS.neonGreen : 'transparent',
                        shadowOpacity: isCorrect ? 0.8 : 0,
                        shadowRadius:  isCorrect ? 8 : 0,
                    },
                ]}
            >
                {letter ? (
                    <View style={[styles.filledTile, { backgroundColor: tileColor }]}>
                        <Text style={styles.filledLetter}>{letter}</Text>
                        <View style={styles.gloss} pointerEvents="none" />
                        {isCorrect && <View style={styles.correctDot} />}
                    </View>
                ) : (
                    <Text style={styles.placeholder}>{index + 1}</Text>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    slot: {
        width:  TILE_SIZE,
        height: TILE_SIZE,
        borderWidth: 2,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.slotEmpty,
    },
    slotFilled: {
        borderStyle: 'solid',
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
    correctDot: {
        position: 'absolute',
        bottom: 4, right: 4,
        width: 6, height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.neonGreen,
    },
    placeholder: {
        fontSize: 11,
        fontFamily: 'monospace',
        color: COLORS.border,
    },
});