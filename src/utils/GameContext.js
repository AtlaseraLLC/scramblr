import React, { createContext, useContext, useReducer } from 'react';
import { DIFFICULTY, MAX_ROUND_WORDS } from '../constants';
import { getWordsForDifficulty, scrambleWord } from '../data/Words';

// ─── STATE SHAPE ─────────────────────────────────────────────────────────────
const initialState = {
    screen:       'SPLASH',   // SPLASH | MENU | GAME | RESULT | ABOUT | SETTINGS
    difficulty:   DIFFICULTY.MEDIUM,
    soundEnabled: true,

    // game session
    words:        [],
    wordIndex:    0,
    lives:        3,
    score:        0,
    startTime:    null,
};

// ─── REDUCER ─────────────────────────────────────────────────────────────────
function reducer(state, action) {
    switch (action.type) {

        case 'NAVIGATE':
            return { ...state, screen: action.screen };

        case 'SET_DIFFICULTY':
            return { ...state, difficulty: action.difficulty };

        case 'TOGGLE_SOUND':
            return { ...state, soundEnabled: !state.soundEnabled };

        case 'START_GAME': {
            const words = getWordsForDifficulty(action.difficulty || state.difficulty, MAX_ROUND_WORDS)
                .map(w => ({ ...w, scrambled: scrambleWord(w.word) }));
            const config = require('../constants').DIFFICULTY_CONFIG[state.difficulty];
            return {
                ...state,
                screen:    'GAME',
                words,
                wordIndex: 0,
                lives:     config.lives,
                score:     0,
                startTime: Date.now(),
            };
        }

        case 'WORD_CORRECT': {
            const newScore = state.score + action.points;
            const nextIndex = state.wordIndex + 1;
            if (nextIndex >= state.words.length) {
                return { ...state, score: newScore, screen: 'RESULT', wordIndex: nextIndex };
            }
            return { ...state, score: newScore, wordIndex: nextIndex };
        }

        case 'WORD_WRONG': {
            const newLives = state.lives - 1;
            if (newLives <= 0) {
                return { ...state, lives: 0, screen: 'RESULT' };
            }
            return { ...state, lives: newLives };
        }

        case 'SKIP_WORD': {
            const newLives = state.lives - 1;
            const nextIndex = state.wordIndex + 1;
            if (newLives <= 0 || nextIndex >= state.words.length) {
                return { ...state, lives: Math.max(0, newLives), screen: 'RESULT', wordIndex: nextIndex };
            }
            return { ...state, lives: newLives, wordIndex: nextIndex };
        }

        default:
            return state;
    }
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const GameContext = createContext(null);

export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}