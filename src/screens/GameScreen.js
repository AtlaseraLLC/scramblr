import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions,
} from 'react-native';
import {
    COLORS, TILE_SIZE, TILE_GAP,
    DIFFICULTY_CONFIG, POINTS_PER_WORD, POINTS_TIME_BONUS, MAX_ROUND_WORDS,
} from '../utils/Constants';
import { useGame } from '../utils/GameContext';
import LetterTile from '../components/LetterTile';
import AnswerSlot from '../components/AnswerSlot';

const { width } = Dimensions.get('window');

/**
 *
 * @returns {React.JSX.Element|null}
 * @constructor
 */
export default function GameScreen() {
    const { state, dispatch } = useGame();
    const currentWordObj = state.words[state.wordIndex];
    const difficulty     = DIFFICULTY_CONFIG[state.difficulty];

    // tiles: { key, letter, colorIndex, isPlaced }
    const [tiles,      setTiles]      = useState([]);
    // slots: { letter|null, tileKey|null, colorIndex|null }
    const [slots,      setSlots]      = useState([]);
    const [feedback,   setFeedback]   = useState(null); // 'correct' | 'wrong' | null
    const [showHint,   setShowHint]   = useState(false);
    const [elapsedSec, setElapsedSec] = useState(0);

    const timerRef     = useRef(null);
    const wordStartT   = useRef(Date.now());
    const feedbackAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(
        state.wordIndex / MAX_ROUND_WORDS
    )).current;

    // ── Init word ────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!currentWordObj) return;
        const scrambled = currentWordObj.scrambled;

        setTiles(
            scrambled.split('').map((letter, i) => ({
                key:        `tile-${i}-${letter}-${Date.now()}`,
                letter,
                colorIndex: i,
                isPlaced:   false,
            }))
        );
        setSlots(
            Array.from({ length: currentWordObj.word.length }, () => ({
                letter: null, tileKey: null, colorIndex: null,
            }))
        );
        setFeedback(null);
        setShowHint(false);
        setElapsedSec(0);
        wordStartT.current = Date.now();

        Animated.timing(progressAnim, {
            toValue: (state.wordIndex + 1) / MAX_ROUND_WORDS,
            duration: 400,
            useNativeDriver: false,
        }).start();

        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setElapsedSec(s => s + 1), 1000);
        return () => clearInterval(timerRef.current);
    }, [state.wordIndex, currentWordObj]);

    // ── Tap a source tile → place in next empty slot ─────────────────────────────
    const handleTileTap = useCallback((tileKey) => {
        const tile = tiles.find(t => t.key === tileKey);
        if (!tile || tile.isPlaced) return;

        const nextEmptyIdx = slots.findIndex(s => s.letter === null);
        if (nextEmptyIdx === -1) return; // all slots full

        setSlots(prev => {
            const next = [...prev];
            next[nextEmptyIdx] = { letter: tile.letter, tileKey: tile.key, colorIndex: tile.colorIndex };
            return next;
        });
        setTiles(prev => prev.map(t => t.key === tileKey ? { ...t, isPlaced: true } : t));
    }, [tiles, slots]);

    // ── Tap a filled slot → return tile to source row ────────────────────────────
    const handleSlotTap = useCallback((slotIdx) => {
        const slot = slots[slotIdx];
        if (!slot.tileKey) return;

        setTiles(prev => prev.map(t =>
            t.key === slot.tileKey ? { ...t, isPlaced: false } : t
        ));
        setSlots(prev => {
            const next = [...prev];
            next[slotIdx] = { letter: null, tileKey: null, colorIndex: null };
            return next;
        });
    }, [slots]);

    // ── Check answer ──────────────────────────────────────────────────────────────
    const handleCheck = useCallback(() => {
        const allFilled = slots.every(s => s.letter !== null);
        if (!allFilled) return;

        const attempt = slots.map(s => s.letter).join('');
        const correct  = attempt === currentWordObj.word;

        setFeedback(correct ? 'correct' : 'wrong');

        Animated.sequence([
            Animated.timing(feedbackAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
            Animated.delay(correct ? 600 : 400),
            Animated.timing(feedbackAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        ]).start(() => {
            if (correct) {
                clearInterval(timerRef.current);
                const secs   = Math.floor((Date.now() - wordStartT.current) / 1000);
                const bonus  = Math.max(0, difficulty.timeBonus - secs) * POINTS_TIME_BONUS;
                dispatch({ type: 'WORD_CORRECT', points: POINTS_PER_WORD + bonus });
            } else {
                setFeedback(null);
                dispatch({ type: 'WORD_WRONG' });
                // Clear slots, return all tiles
                setSlots(prev => prev.map(() => ({ letter: null, tileKey: null, colorIndex: null })));
                setTiles(prev => prev.map(t => ({ ...t, isPlaced: false })));
            }
        });
    }, [slots, currentWordObj, difficulty]);

    // ── Skip ──────────────────────────────────────────────────────────────────────
    const handleSkip = () => {
        clearInterval(timerRef.current);
        dispatch({ type: 'SKIP_WORD' });
    };

    if (!currentWordObj) return null;

    const allFilled    = slots.every(s => s.letter !== null);
    const correctSlots = slots.map((s, i) => s.letter === currentWordObj.word[i]);

    return (
        <View style={styles.container}>

            {/* ── Header ── */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.levelLabel}>WORD {state.wordIndex + 1}/{MAX_ROUND_WORDS}</Text>
                    <Text style={styles.scoreLabel}>
                        SCORE: <Text style={styles.scoreNum}>{state.score}</Text>
                    </Text>
                </View>
                <View style={styles.livesRow}>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Text key={i} style={[styles.heart, i >= state.lives && styles.heartLost]}>♥</Text>
                    ))}
                </View>
            </View>

            {/* ── Progress ── */}
            <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, {
                    width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                }]} />
            </View>

            {/* ── Meta ── */}
            <View style={styles.metaRow}>
                <Text style={styles.categoryTag}>★ {currentWordObj.category}</Text>
                <Text style={styles.timerText}>⏱ {elapsedSec}s</Text>
            </View>

            {/* ── Hint ── */}
            <View style={styles.hintWrap}>
                {showHint
                    ? <Text style={styles.hintText}>💡 {currentWordObj.hint}</Text>
                    : (
                        <TouchableOpacity onPress={() => setShowHint(true)} style={styles.hintBtn}>
                            <Text style={styles.hintBtnText}>SHOW HINT</Text>
                        </TouchableOpacity>
                    )
                }
            </View>

            {/* ── Answer slots (tap to return) ── */}
            <View style={styles.slotsArea}>
                <Text style={styles.areaLabel}>YOUR ANSWER</Text>
                <View style={styles.tilesRow}>
                    {slots.map((slot, i) => (
                        <AnswerSlot
                            key={i}
                            index={i}
                            letter={slot.letter}
                            colorIndex={slot.colorIndex}
                            isCorrect={slot.letter !== null && correctSlots[i]}
                            onPress={() => handleSlotTap(i)}
                        />
                    ))}
                </View>
            </View>

            {/* ── Divider ── */}
            <View style={styles.divider} />

            {/* ── Scrambled tiles (tap to place) ── */}
            <View style={styles.tilesArea}>
                <Text style={styles.areaLabel}>TAP TO PLACE</Text>
                <View style={styles.tilesRow}>
                    {tiles.map(tile => (
                        <LetterTile
                            key={tile.key}
                            tileKey={tile.key}
                            letter={tile.letter}
                            colorIndex={tile.colorIndex}
                            isPlaced={tile.isPlaced}
                            onTap={handleTileTap}
                        />
                    ))}
                </View>
            </View>

            {/* ── Feedback flash ── */}
            {feedback && (
                <Animated.View style={[
                    styles.feedbackBanner,
                    {
                        opacity: feedbackAnim,
                        backgroundColor: feedback === 'correct' ? COLORS.neonGreen : COLORS.neonPink,
                    },
                ]}>
                    <Text style={styles.feedbackText}>
                        {feedback === 'correct' ? '✓ CORRECT!' : '✗ WRONG!'}
                    </Text>
                </Animated.View>
            )}

            {/* ── Actions ── */}
            <View style={styles.actionsRow}>
                <TouchableOpacity
                    style={[styles.checkBtn, !allFilled && styles.checkBtnDisabled]}
                    onPress={handleCheck}
                    disabled={!allFilled}
                >
                    <Text style={[styles.checkBtnText, !allFilled && styles.checkBtnTextDisabled]}>
                        CHECK ▶
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                    <Text style={styles.skipBtnText}>SKIP ↷</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.diffBadge, { color: difficulty.color }]}>
                {state.difficulty}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingHorizontal: 20,
        paddingTop: 48,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    levelLabel: {
        fontSize: 10,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        letterSpacing: 3,
    },
    scoreLabel: {
        fontSize: 13,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        letterSpacing: 2,
        marginTop: 2,
    },
    scoreNum: {
        color: COLORS.neonYellow,
        fontWeight: '900',
    },
    livesRow: {
        flexDirection: 'row',
        gap: 6,
    },
    heart: {
        fontSize: 20,
        color: COLORS.neonPink,
    },
    heartLost: {
        color: COLORS.border,
    },
    progressTrack: {
        height: 3,
        backgroundColor: COLORS.border,
        marginBottom: 16,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.neonCyan,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    categoryTag: {
        fontSize: 10,
        fontFamily: 'monospace',
        color: COLORS.neonCyan,
        letterSpacing: 2,
    },
    timerText: {
        fontSize: 10,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        letterSpacing: 2,
    },
    hintWrap: {
        minHeight: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    hintBtn: {
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    hintBtnText: {
        fontSize: 10,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        letterSpacing: 3,
    },
    hintText: {
        fontSize: 12,
        fontFamily: 'monospace',
        color: COLORS.neonYellow,
        letterSpacing: 1,
        textAlign: 'center',
    },
    areaLabel: {
        fontSize: 9,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        letterSpacing: 3,
        marginBottom: 14,
        textAlign: 'center',
    },
    slotsArea: {
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: 24,
        opacity: 0.4,
    },
    tilesArea: {
        marginBottom: 32,
    },
    tilesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: TILE_GAP,
        minHeight: TILE_SIZE,
    },
    feedbackBanner: {
        position: 'absolute',
        top: '42%',
        left: 40, right: 40,
        paddingVertical: 14,
        alignItems: 'center',
        zIndex: 100,
    },
    feedbackText: {
        fontSize: 22,
        fontWeight: '900',
        fontFamily: 'monospace',
        color: COLORS.textDark,
        letterSpacing: 4,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
    },
    checkBtn: {
        backgroundColor: COLORS.neonYellow,
        paddingVertical: 16,
        paddingHorizontal: 32,
        flex: 1,
        alignItems: 'center',
    },
    checkBtnDisabled: {
        backgroundColor: COLORS.border,
    },
    checkBtnText: {
        fontSize: 15,
        fontWeight: '900',
        fontFamily: 'monospace',
        color: COLORS.textDark,
        letterSpacing: 3,
    },
    checkBtnTextDisabled: {
        color: COLORS.textMuted,
    },
    skipBtn: {
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    skipBtnText: {
        fontSize: 13,
        fontFamily: 'monospace',
        color: COLORS.textMuted,
        letterSpacing: 2,
    },
    diffBadge: {
        textAlign: 'center',
        fontSize: 9,
        fontFamily: 'monospace',
        letterSpacing: 3,
        marginTop: 16,
        opacity: 0.5,
    },
});