import React, { useRef, useEffect, useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    Animated, Dimensions, Modal, ScrollView, BackHandler,
} from 'react-native';
import { COLORS, DIFFICULTY, DIFFICULTY_CONFIG } from '../utils/Constants';
import { useGame } from '../utils/GameContext';

const { width } = Dimensions.get('window');

// ─── ABOUT MODAL ─────────────────────────────────────────────────────────────
function AboutModal({ visible, onClose }) {
    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
            <View style={modal.overlay}>
                <View style={modal.box}>
                    <View style={modal.header}>
                        <Text style={modal.title}>ABOUT</Text>
                        <TouchableOpacity onPress={onClose} style={modal.closeBtn}>
                            <Text style={modal.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{ maxHeight: 320 }}>
                        <Text style={modal.body}>
                            WORDBLAST is a fast-paced letter unscramble game.{'\n\n'}
                            Drag each letter tile into the correct slot to form the hidden word before you run out of lives.{'\n\n'}
                            {'▸'} 3 difficulty modes{'\n'}
                            {'▸'} 5 words per round{'\n'}
                            {'▸'} Bonus points for speed{'\n'}
                            {'▸'} Themed word categories{'\n\n'}
                            Built with React Native.{'\n'}
                            Version 1.0.0
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

// ─── SETTINGS MODAL ──────────────────────────────────────────────────────────
function SettingsModal({ visible, onClose }) {
    const { state, dispatch } = useGame();

    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
            <View style={modal.overlay}>
                <View style={modal.box}>
                    <View style={modal.header}>
                        <Text style={modal.title}>SETTINGS</Text>
                        <TouchableOpacity onPress={onClose} style={modal.closeBtn}>
                            <Text style={modal.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={modal.sectionLabel}>DIFFICULTY</Text>
                    <View style={settings.diffRow}>
                        {Object.values(DIFFICULTY).map(d => {
                            const cfg     = DIFFICULTY_CONFIG[d];
                            const active  = state.difficulty === d;
                            return (
                                <TouchableOpacity
                                    key={d}
                                    style={[settings.diffBtn, active && { borderColor: cfg.color, backgroundColor: cfg.color + '22' }]}
                                    onPress={() => dispatch({ type: 'SET_DIFFICULTY', difficulty: d })}
                                >
                                    <Text style={[settings.diffLabel, { color: active ? cfg.color : COLORS.textMuted }]}>
                                        {cfg.label}
                                    </Text>
                                    <Text style={[settings.diffSub, { color: active ? cfg.color : COLORS.textMuted }]}>
                                        {d === DIFFICULTY.EASY ? '≤4 LETTERS' : d === DIFFICULTY.MEDIUM ? '≤6 LETTERS' : '≤9 LETTERS'}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text style={modal.sectionLabel}>SOUND</Text>
                    <TouchableOpacity
                        style={[settings.toggle, state.soundEnabled && settings.toggleOn]}
                        onPress={() => dispatch({ type: 'TOGGLE_SOUND' })}
                    >
                        <Text style={settings.toggleText}>
                            {state.soundEnabled ? '🔊  SOUND ON' : '🔇  SOUND OFF'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

// ─── MENU BUTTON ─────────────────────────────────────────────────────────────
function MenuButton({ label, accent, onPress, delay }) {
    const translateX = useRef(new Animated.Value(-60)).current;
    const opacity    = useRef(new Animated.Value(0)).current;
    const scaleAnim  = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        setTimeout(() => {
            Animated.parallel([
                Animated.spring(translateX, { toValue: 0, friction: 6, useNativeDriver: true }),
                Animated.timing(opacity,    { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();
        }, delay);
    }, [delay, opacity, translateX]);

    const onPressIn  = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
    const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true }).start();

    return (
        <Animated.View style={{ opacity, transform: [{ translateX }, { scale: scaleAnim }], width: '100%' }}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={[styles.menuBtn, { borderLeftColor: accent }]}
            >
                <View style={[styles.menuBtnAccent, { backgroundColor: accent }]} />
                <Text style={styles.menuBtnText}>{label}</Text>
                <Text style={[styles.menuBtnArrow, { color: accent }]}>▶</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

// ─── MAIN MENU ────────────────────────────────────────────────────────────────
export default function MenuScreen() {
    const { state, dispatch } = useGame();
    const [showAbout,    setShowAbout]    = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const titleOp  = useRef(new Animated.Value(0)).current;
    const scanlineY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(titleOp, { toValue: 1, duration: 600, useNativeDriver: true }).start();

        Animated.loop(
            Animated.timing(scanlineY, { toValue: 1, duration: 3000, useNativeDriver: true })
        ).start();
    }, [scanlineY, titleOp]);

    const handleQuit = () => BackHandler.exitApp();

    return (
        <View style={styles.container}>
            {/* Scanline effect */}
            <Animated.View
                pointerEvents="none"
                style={[styles.scanline, {
                    transform: [{
                        translateY: scanlineY.interpolate({
                            inputRange: [0, 1], outputRange: [-20, 900],
                        }),
                    }],
                }]}
            />

            {/* Title */}
            <Animated.View style={[styles.titleWrap, { opacity: titleOp }]}>
                <Text style={styles.titleWord}>WORD</Text>
                <View style={styles.titleBadge}>
                    <Text style={styles.titleBlast}>BLAST</Text>
                </View>
                <Text style={styles.diffTag}>
                    MODE: <Text style={{ color: DIFFICULTY_CONFIG[state.difficulty].color }}>
                    {state.difficulty}
                </Text>
                </Text>
            </Animated.View>

            {/* Buttons */}
            <View style={styles.btnList}>
                <MenuButton label="PLAY"     accent={COLORS.neonGreen}  onPress={() => dispatch({ type: 'START_GAME' })} delay={100} />
                <MenuButton label="SETTINGS" accent={COLORS.neonYellow} onPress={() => setShowSettings(true)}           delay={200} />
                <MenuButton label="ABOUT"    accent={COLORS.neonCyan}   onPress={() => setShowAbout(true)}              delay={300} />
                <MenuButton label="QUIT"     accent={COLORS.neonPink}   onPress={handleQuit}                            delay={400} />
            </View>

            {/* Decorative ticker */}
            <Text style={styles.ticker}>
                ★ DRAG TILES ★ FORM WORDS ★ BEAT THE CLOCK ★ WORDBLAST ★
            </Text>

            <AboutModal    visible={showAbout}    onClose={() => setShowAbout(false)} />
            <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
        </View>
    );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingHorizontal: 28,
        paddingTop: 60,
        overflow: 'hidden',
    },
    scanline: {
        position: 'absolute',
        left: 0, right: 0,
        height: 2,
        backgroundColor: 'rgba(0,245,255,0.06)',
    },
    titleWrap: {
        alignItems: 'flex-start',
        marginBottom: 48,
    },
    titleWord: {
        fontSize: 56,
        fontWeight: '900',
        fontFamily: 'monospace',
        color: COLORS.neonCyan,
        letterSpacing: 8,
        textShadowColor: COLORS.neonCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 16,
        lineHeight: 60,
    },
    titleBadge: {
        backgroundColor: COLORS.neonYellow,
        paddingHorizontal: 12,
        paddingVertical: 2,
        marginTop: -4,
        marginBottom: 12,
    },
    titleBlast: {
        fontSize: 28,
        fontWeight: '900',
        fontFamily: 'monospace',
        color: COLORS.textDark,
        letterSpacing: 6,
    },
    diffTag: {
        fontSize: 11,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        letterSpacing: 2,
    },
    btnList: {
        gap: 14,
    },
    menuBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bgCard,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderLeftWidth: 3,
        paddingVertical: 18,
        paddingHorizontal: 20,
    },
    menuBtnAccent: {
        width: 4,
        height: 20,
        marginRight: 16,
        opacity: 0.8,
    },
    menuBtnText: {
        flex: 1,
        fontSize: 18,
        fontWeight: '900',
        fontFamily: 'monospace',
        color: COLORS.textPrimary,
        letterSpacing: 4,
    },
    menuBtnArrow: {
        fontSize: 14,
        fontFamily: 'monospace',
    },
    ticker: {
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 9,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        letterSpacing: 2,
    },
});

const modal = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    box: {
        width: '100%',
        backgroundColor: COLORS.bgCard,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '900',
        fontFamily: 'monospace',
        color: COLORS.neonCyan,
        letterSpacing: 4,
    },
    closeBtn: {
        padding: 4,
    },
    closeText: {
        fontSize: 16,
        color: COLORS.textMuted,
        fontFamily: 'monospace',
    },
    body: {
        fontSize: 13,
        fontFamily: 'monospace',
        color: COLORS.textPrimary,
        lineHeight: 22,
    },
    sectionLabel: {
        fontSize: 10,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        letterSpacing: 3,
        marginBottom: 10,
        marginTop: 8,
    },
});

const settings = StyleSheet.create({
    diffRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    diffBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 10,
        alignItems: 'center',
    },
    diffLabel: {
        fontSize: 12,
        fontWeight: '900',
        fontFamily: 'monospace',
        letterSpacing: 2,
    },
    diffSub: {
        fontSize: 8,
        fontFamily: 'monospace',
        letterSpacing: 1,
        marginTop: 4,
    },
    toggle: {
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 14,
        alignItems: 'center',
    },
    toggleOn: {
        borderColor: COLORS.neonGreen,
        backgroundColor: COLORS.neonGreen + '15',
    },
    toggleText: {
        fontSize: 13,
        fontFamily: 'monospace',
        color: COLORS.textPrimary,
        letterSpacing: 2,
    },
});