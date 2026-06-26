import React, { useEffect, useRef } from 'react';
import {
    View, Animated, StyleSheet, Dimensions, StatusBar,
} from 'react-native';
import { COLORS } from '../utils/Constants';
import { useGame } from '../utils/GameContext';

const { width } = Dimensions.get('window');
const SPLASH_DURATION = 3000;

/**
 *
 * @returns {React.JSX.Element}
 * @constructor
 */
export default function SplashScreen() {
    const { dispatch } = useGame();
    const barWidth   = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoScale   = useRef(new Animated.Value(0.7)).current;
    const subtitleOp  = useRef(new Animated.Value(0)).current;
    const glowAnim    = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Logo entrance
        Animated.parallel([
            Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(logoScale,   { toValue: 1, friction: 5,   useNativeDriver: true }),
        ]).start();

        // Subtitle fade in
        setTimeout(() => {
            Animated.timing(subtitleOp, { toValue: 1, duration: 500, useNativeDriver: true }).start();
        }, 500);

        // Loading bar
        setTimeout(() => {
            Animated.timing(barWidth, {
                toValue: width - 80,
                duration: SPLASH_DURATION - 600,
                useNativeDriver: false,
            }).start();
        }, 600);

        // Glow pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
                Animated.timing(glowAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
            ])
        ).start();

        // Navigate away
        const timer = setTimeout(() => {
            dispatch({ type: 'NAVIGATE', screen: 'MENU' });
        }, SPLASH_DURATION);

        return () => clearTimeout(timer);
    }, [barWidth, dispatch, glowAnim, logoOpacity, logoScale, subtitleOp]);

    const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

            {/* Grid background lines */}
            <View style={styles.grid} pointerEvents="none">
                {Array.from({ length: 10 }).map((_, i) => (
                    <View key={i} style={[styles.gridLine, { top: i * 80 }]} />
                ))}
            </View>

            {/* Corner decorations */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* Logo block */}
            <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
                <Animated.Text style={[styles.logoText, { opacity: glowOpacity }]}>
                    SCRAMBLR
                </Animated.Text>
            </Animated.View>

            <Animated.Text style={[styles.subtitle, { opacity: subtitleOp }]}>
                UNSCRAMBLE THE LETTERS
            </Animated.Text>

            {/* Loading bar */}
            <View style={styles.barTrack}>
                <Animated.View style={[styles.barFill, { width: barWidth }]} />
                <View style={styles.barScanline} />
            </View>

            <Animated.Text style={[styles.loadingLabel, { opacity: subtitleOp }]}>
                LOADING...
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    grid: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.06,
    },
    gridLine: {
        position: 'absolute',
        left: 0, right: 0,
        height: 1,
        backgroundColor: COLORS.neonCyan,
    },
    corner: {
        position: 'absolute',
        width: 24, height: 24,
        borderColor: COLORS.neonCyan,
        opacity: 0.5,
    },
    cornerTL: { top: 24, left: 24, borderTopWidth: 2, borderLeftWidth: 2 },
    cornerTR: { top: 24, right: 24, borderTopWidth: 2, borderRightWidth: 2 },
    cornerBL: { bottom: 24, left: 24, borderBottomWidth: 2, borderLeftWidth: 2 },
    cornerBR: { bottom: 24, right: 24, borderBottomWidth: 2, borderRightWidth: 2 },

    logoWrap: {
        alignItems: 'center',
        marginBottom: 8,
    },
    logoText: {
        fontSize: 64,
        fontWeight: '900',
        fontFamily: 'monospace',
        color: COLORS.neonCyan,
        letterSpacing: 12,
        textShadowColor: COLORS.neonCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    logoBadge: {
        backgroundColor: COLORS.neonYellow,
        paddingHorizontal: 20,
        paddingVertical: 6,
        marginTop: -8,
    },
    logoBadgeText: {
        fontSize: 36,
        fontWeight: '900',
        fontFamily: 'monospace',
        color: COLORS.textDark,
        letterSpacing: 10,
    },
    subtitle: {
        fontSize: 11,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        letterSpacing: 4,
        marginTop: 28,
        marginBottom: 48,
    },
    barTrack: {
        width: width - 80,
        height: 6,
        backgroundColor: COLORS.border,
        borderRadius: 0,
        overflow: 'hidden',
        position: 'relative',
    },
    barFill: {
        height: '100%',
        backgroundColor: COLORS.neonYellow,
        shadowColor: COLORS.neonYellow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 4,
    },
    barScanline: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    loadingLabel: {
        fontSize: 10,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        letterSpacing: 3,
        marginTop: 12,
    },
});