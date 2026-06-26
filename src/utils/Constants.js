// ─── THEME ───────────────────────────────────────────────────────────────────
export const COLORS = {
    bg:          '#0A0A0F',
    bgCard:      '#12121A',
    bgTile:      '#1C1C2E',
    border:      '#2A2A3E',

    neonYellow:  '#F5E642',
    neonCyan:    '#00F5FF',
    neonPink:    '#FF2D78',
    neonGreen:   '#39FF14',
    neonOrange:  '#FF6B00',

    textPrimary: '#F0EAD6',
    textMuted:   '#6B6B8A',
    textDark:    '#0A0A0F',

    slotEmpty:   '#1A1A2E',
    slotFilled:  '#1C2E1C',
    slotBorder:  '#2A3A2A',

    success:     '#39FF14',
    error:       '#FF2D78',
    warning:     '#F5E642',
};

export const FONTS = {
    display: 'monospace',   // bold arcade headers
    body:    'monospace',
};

// ─── DIFFICULTY ──────────────────────────────────────────────────────────────
export const DIFFICULTY = {
    EASY:   'EASY',
    MEDIUM: 'MEDIUM',
    HARD:   'HARD',
};

/**
 *
 * @type {{[DIFFICULTY.EASY]: {maxLetters: number, lives: number, timeBonus: number, label: string, color: string}, [DIFFICULTY.MEDIUM]: {maxLetters: number, lives: number, timeBonus: number, label: string, color: string}, [DIFFICULTY.HARD]: {maxLetters: number, lives: number, timeBonus: number, label: string, color: string}}}
 */
export const DIFFICULTY_CONFIG = {
    [DIFFICULTY.EASY]:   { maxLetters: 4, lives: 5, timeBonus: 10, label: 'EASY',   color: '#39FF14' },
    [DIFFICULTY.MEDIUM]: { maxLetters: 6, lives: 3, timeBonus: 20, label: 'MEDIUM', color: '#F5E642' },
    [DIFFICULTY.HARD]:   { maxLetters: 9, lives: 2, timeBonus: 40, label: 'HARD',   color: '#FF2D78' },
};

// ─── SCORING ─────────────────────────────────────────────────────────────────
export const POINTS_PER_WORD   = 100;
export const POINTS_TIME_BONUS = 5;   // per second remaining
export const MAX_ROUND_WORDS   = 5;

// ─── TILE ────────────────────────────────────────────────────────────────────
export const TILE_SIZE     = 56;
export const TILE_GAP      = 8;
export const TILE_COLORS   = [
    '#F5E642', '#00F5FF', '#FF2D78', '#39FF14', '#FF6B00',
    '#A855F7', '#22D3EE', '#F97316',
];