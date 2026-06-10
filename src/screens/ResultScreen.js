import React, { useRef, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { COLORS, MAX_ROUND_WORDS, POINTS_PER_WORD } from '../constants';
import { useGame } from '../utils/GameContext';

const { width } = Dimensions.get('window');
const PERFECT = MAX_ROUND_WORDS * POINTS_PER_WORD;

function getRank(score) {
    const pct = score / PERFECT;
    if (pct >= 0.9) return { label: 'S RANK', color: COLORS.neonYellow, desc: 'LEGENDARY' };
    if (pct >= 0.7) return { label: 'A RANK', color: COLORS.neonGreen,  desc: 'EXCELLENT' };
    if (pct >= 0.5) return { label: 'B RANK', color: COLORS.neonCyan,   desc: 'SOLID'     };
    if (pct >= 0.3) return { label: 'C RANK', color: COLORS.neonOrange, desc: 'DECENT'    };
    return           { label: 'D RANK', color: COLORS.neonPink,   desc: 'KEEP TRYING' };
}

export default function ResultScreen() {
    const { state, dispatch } = useGame();
    const { score, lives, wordIndex } = state;
    const rank = getRank(score);

    const scaleAnim   = useRef(new Animated.Value(0)).current;
    const fadeAnim    = useRef(new Animated.Value(0)).current;
    const slideAnim   = useRef(new Animated.Value(40)).current;
    const rankGlow    = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
                Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
            Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(rankGlow, { toValue: 1,   duration: 800, useNativeDriver: true }),
                Animated.timing(rankGlow, { toValue: 0.5, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, [fadeAnim, rankGlow, scaleAnim, slideAnim]);

    const wordsCompleted = Math.min(wordIndex, MAX_ROUND_WORDS);
    const survived       = lives > 0;

    return (
        <View style={styles.container}>
            {/* Corner decorations */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />

            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>

                {/* Outcome header */}
                <Text style={[styles.outcomeText, { color: survived ? COLORS.neonGreen : COLORS.neonPink }]}>
                    {survived ? 'ROUND CLEAR!' : 'GAME OVER'}
                </Text>

                {/* Rank badge */}
                <Animated.View style={[styles.rankBadge, { borderColor: rank.color, opacity: rankGlow }]}>
                    <Text style={[styles.rankLabel, { color: rank.color }]}>{rank.label}</Text>
                    <Text style={[styles.rankDesc,  { color: rank.color }]}>{rank.desc}</Text>
                </Animated.View>

            </Animated.View>

            {/* Stats */}
            <Animated.View style={[styles.statsBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <StatRow label="FINAL SCORE"  value={score}                     accent={COLORS.neonYellow} />
                <StatRow label="WORDS DONE"   value={`${wordsCompleted}/${MAX_ROUND_WORDS}`} accent={COLORS.neonCyan} />
                <StatRow label="LIVES LEFT"   value={'♥'.repeat(Math.max(0, lives)) || '—'} accent={COLORS.neonPink} />
            </Animated.View>

            {/* Actions */}
            <Animated.View style={[styles.btns, { opacity: fadeAnim }]}>
                <TouchableOpacity
                    style={[styles.btn, styles.btnPrimary]}
                    onPress={() => dispatch({ type: 'START_GAME' })}
                >
                    <Text style={[styles.btnText, { color: COLORS.textDark }]}>PLAY AGAIN ▶</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.btn, styles.btnSecondary]}
                    onPress={() => dispatch({ type: 'NAVIGATE', screen: 'MENU' })}
                >
                    <Text style={[styles.btnText, { color: COLORS.textMuted }]}>MAIN MENU</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

function StatRow({ label, value, accent }) {
    return (
        <View style={stat.row}>
            <Text style={stat.label}>{label}</Text>
            <Text style={[stat.value, { color: accent }]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingHorizontal: 28,
        paddingTop: 80,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    corner: {
        position: 'absolute',
        width: 24, height: 24,
        borderColor: COLORS.neonCyan,
        opacity: 0.4,
    },
    cornerTL: { top: 24, left: 24, borderTopWidth: 2, borderLeftWidth: 2 },
    cornerTR: { top: 24, right: 24, borderTopWidth: 2, borderRightWidth: 2 },
    content: {
        alignItems: 'center',
        marginBottom: 32,
    },
    outcomeText: {
        fontSize: 32,
        fontWeight: '900',
        fontFamily: 'monospace',
        letterSpacing: 4,
        marginBottom: 32,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 16,
    },
    rankBadge: {
        borderWidth: 2,
        paddingVertical: 20,
        paddingHorizontal: 48,
        alignItems: 'center',
    },
    rankLabel: {
        fontSize: 40,
        fontWeight: '900',
        fontFamily: 'monospace',
        letterSpacing: 6,
    },
    rankDesc: {
        fontSize: 11,
        fontFamily: 'monospace',
        letterSpacing: 4,
        marginTop: 6,
    },
    statsBlock: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
        paddingVertical: 20,
        gap: 16,
    },
    btns: {
        gap: 12,
    },
    btn: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    btnPrimary: {
        backgroundColor: COLORS.neonYellow,
    },
    btnSecondary: {
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    btnText: {
        fontSize: 15,
        fontWeight: '900',
        fontFamily: 'monospace',
        letterSpacing: 4,
    },
});

const stat = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 11,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        letterSpacing: 3,
    },
    value: {
        fontSize: 18,
        fontWeight: '900',
        fontFamily: 'monospace',
        letterSpacing: 2,
    },
});