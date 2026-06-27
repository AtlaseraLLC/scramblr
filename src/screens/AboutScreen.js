import React, { useRef, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView,
} from 'react-native';
import { COLORS } from '../utils/Constants';
import { useGame } from '../utils/GameContext';

const FEATURES = [
    { icon: '⬛', label: 'TAP TO PLACE',   desc: 'Tap scrambled letters to fill the answer slots in order' },
    { icon: '♥',  label: '3 LIVES',        desc: 'Each wrong answer or skip costs a life' },
    { icon: '⭐', label: 'SPEED BONUS',    desc: 'Faster answers earn extra points on top of the base score' },
    { icon: '★',  label: '3 DIFFICULTIES', desc: 'Easy (4 letters), Medium (6), Hard (9)' },
    { icon: '📦', label: '60 WORDS',       desc: 'Across Animals, Food, Nature, Places, Music and more' },
];

function FeatureRow({ icon, label, desc, delay }) {
    const slideAnim = useRef(new Animated.Value(30)).current;
    const fadeAnim  = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
                Animated.timing(fadeAnim,  { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();
        }, delay);
    }, []);

    return (
        <Animated.View style={[styles.featureRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.featureIcon}>{icon}</Text>
            <View style={styles.featureText}>
                <Text style={styles.featureLabel}>{label}</Text>
                <Text style={styles.featureDesc}>{desc}</Text>
            </View>
        </Animated.View>
    );
}

export default function AboutScreen() {
    const { dispatch } = useGame();
    const headerAnim  = useRef(new Animated.Value(0)).current;
    const glowAnim    = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 1,   duration: 1000, useNativeDriver: true }),
                Animated.timing(glowAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            <TouchableOpacity
                style={styles.backBtn}
                onPress={() => dispatch({ type: 'NAVIGATE', screen: 'MENU' })}
            >
                <Text style={styles.backText}>◀ BACK</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Animated.View style={[styles.logoWrap, { opacity: headerAnim }]}>
                    <Animated.Text style={[styles.logoWord, { opacity: glowAnim }]}>WORD</Animated.Text>
                    <View style={styles.logoBadge}>
                        <Text style={styles.logoBlast}>BLAST</Text>
                    </View>
                </Animated.View>

                <Animated.Text style={[styles.tagline, { opacity: headerAnim }]}>
                    UNSCRAMBLE THE LETTERS
                </Animated.Text>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>HOW TO PLAY</Text>
                {FEATURES.map((f, i) => (
                    <FeatureRow key={f.label} {...f} delay={200 + i * 80} />
                ))}

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>SCORING</Text>
                <View style={styles.scoreTable}>
                    <ScoreRow label="Correct word"  value="+100 pts" color={COLORS.neonGreen}  />
                    <ScoreRow label="Speed bonus"   value="+5 pts/s" color={COLORS.neonYellow} />
                    <ScoreRow label="Wrong answer"  value="−1 life"  color={COLORS.neonPink}   />
                    <ScoreRow label="Skip word"     value="−1 life"  color={COLORS.neonPink}   />
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>CREDITS</Text>
                <Text style={styles.creditText}>
                    Built with React Native + Expo{'\n'}
                    Version 1.0.0{'\n\n'}
                    Made by AtlaseraLLC
                </Text>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

function ScoreRow({ label, value, color }) {
    return (
        <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>{label}</Text>
            <Text style={[styles.scoreValue, { color }]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingTop: 48,
    },
    corner: {
        position: 'absolute',
        width: 20, height: 20,
        borderColor: COLORS.neonCyan,
        opacity: 0.3,
        zIndex: 1,
    },
    cornerTL: { top: 16, left: 16, borderTopWidth: 2, borderLeftWidth: 2 },
    cornerTR: { top: 16, right: 16, borderTopWidth: 2, borderRightWidth: 2 },
    cornerBL: { bottom: 16, left: 16, borderBottomWidth: 2, borderLeftWidth: 2 },
    cornerBR: { bottom: 16, right: 16, borderBottomWidth: 2, borderRightWidth: 2 },
    backBtn: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    backText: {
        fontSize: 11,
        fontFamily: 'monospace',
        color: COLORS.neonCyan,
        letterSpacing: 3,
    },
    scroll: {
        paddingHorizontal: 24,
    },
    logoWrap: {
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 4,
    },
    logoWord: {
        fontSize: 52,
        fontWeight: '900',
        fontFamily: 'monospace',
        color: COLORS.neonCyan,
        letterSpacing: 10,
        textShadowColor: COLORS.neonCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 16,
    },
    logoBadge: {
        backgroundColor: COLORS.neonYellow,
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginTop: -6,
    },
    logoBlast: {
        fontSize: 26,
        fontWeight: '900',
        fontFamily: 'monospace',
        color: COLORS.textDark,
        letterSpacing: 8,
    },
    tagline: {
        textAlign: 'center',
        fontSize: 9,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        letterSpacing: 4,
        marginTop: 12,
        marginBottom: 24,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 24,
        opacity: 0.5,
    },
    sectionTitle: {
        fontSize: 10,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        letterSpacing: 4,
        marginBottom: 16,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        gap: 14,
    },
    featureIcon: {
        fontSize: 18,
        width: 28,
        textAlign: 'center',
        marginTop: 1,
    },
    featureText: {
        flex: 1,
    },
    featureLabel: {
        fontSize: 12,
        fontWeight: '900',
        fontFamily: 'monospace',
        color: COLORS.textPrimary,
        letterSpacing: 2,
        marginBottom: 3,
    },
    featureDesc: {
        fontSize: 11,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        lineHeight: 17,
    },
    scoreTable: {
        gap: 12,
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 10,
    },
    scoreLabel: {
        fontSize: 12,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        letterSpacing: 1,
    },
    scoreValue: {
        fontSize: 13,
        fontWeight: '900',
        fontFamily: 'monospace',
        letterSpacing: 2,
    },
    creditText: {
        fontSize: 12,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        lineHeight: 22,
        letterSpacing: 1,
    },
});