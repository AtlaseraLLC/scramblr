export const WORD_BANK = {
    EASY: [
        { word: 'CAT',  hint: 'A furry feline pet',         category: 'Animals' },
        { word: 'DOG',  hint: "Man's best friend",           category: 'Animals' },
        { word: 'SUN',  hint: 'It rises in the east',        category: 'Nature'  },
        { word: 'MAP',  hint: 'Used for navigation',         category: 'Objects' },
        { word: 'JAR',  hint: 'Glass container with a lid',  category: 'Objects' },
        { word: 'OAK',  hint: 'A sturdy tree',               category: 'Nature'  },
        { word: 'BEE',  hint: 'Makes honey',                 category: 'Animals' },
        { word: 'ICE',  hint: 'Frozen water',                category: 'Nature'  },
        { word: 'FOX',  hint: 'Cunning orange animal',       category: 'Animals' },
        { word: 'AXE',  hint: 'Woodcutter\'s tool',          category: 'Objects' },
        { word: 'CAKE', hint: 'Birthday dessert',            category: 'Food'    },
        { word: 'FISH', hint: 'Lives in water',              category: 'Animals' },
        { word: 'LAMP', hint: 'Gives off light',             category: 'Objects' },
        { word: 'MOON', hint: 'Orbits the Earth',            category: 'Nature'  },
        { word: 'ROSE', hint: 'A thorny flower',             category: 'Nature'  },
        { word: 'BEAR', hint: 'Loves honey',                 category: 'Animals' },
        { word: 'SHIP', hint: 'Sails the ocean',             category: 'Objects' },
        { word: 'FROG', hint: 'Jumps and croaks',            category: 'Animals' },
        { word: 'DRUM', hint: 'You hit it to make music',    category: 'Music'   },
        { word: 'STAR', hint: 'Shines at night',             category: 'Nature'  },
    ],

    MEDIUM: [
        { word: 'TIGER',  hint: 'Striped big cat',               category: 'Animals' },
        { word: 'LEMON',  hint: 'Sour yellow fruit',             category: 'Food'    },
        { word: 'PIANO',  hint: 'Has 88 keys',                   category: 'Music'   },
        { word: 'BREAD',  hint: 'Baked from dough',              category: 'Food'    },
        { word: 'CLOUD',  hint: 'Floats in the sky',             category: 'Nature'  },
        { word: 'SWORD',  hint: 'Medieval weapon',               category: 'Objects' },
        { word: 'CACTUS', hint: 'Desert spiky plant',            category: 'Nature'  },
        { word: 'BRIDGE', hint: 'Spans over water',              category: 'Places'  },
        { word: 'CANDLE', hint: 'Burns with a flame',            category: 'Objects' },
        { word: 'ROCKET', hint: 'Goes to outer space',           category: 'Objects' },
        { word: 'SPIDER', hint: 'Eight-legged arachnid',         category: 'Animals' },
        { word: 'CASTLE', hint: 'Where a king lives',            category: 'Places'  },
        { word: 'GUITAR', hint: 'Six-stringed instrument',       category: 'Music'   },
        { word: 'FOREST', hint: 'Dense area of trees',           category: 'Nature'  },
        { word: 'BUTTER', hint: 'Spread it on toast',            category: 'Food'    },
        { word: 'DONKEY', hint: 'Stubborn pack animal',          category: 'Animals' },
        { word: 'MIRROR', hint: 'Shows your reflection',         category: 'Objects' },
        { word: 'FROZEN', hint: 'Turned to ice',                 category: 'Nature'  },
        { word: 'PLANET', hint: 'Orbits a star',                 category: 'Nature'  },
        { word: 'LIZARD', hint: 'Scaly reptile',                 category: 'Animals' },
        { word: 'PLANET',   hint: 'Orbits a star',              category: 'Space' },
    ],

    HARD: [
        { word: 'BLANKET',   hint: 'Keeps you warm at night',      category: 'Objects' },
        { word: 'DOLPHIN',   hint: 'Intelligent marine mammal',    category: 'Animals' },
        { word: 'KINGDOM',   hint: 'Land ruled by a king',         category: 'Places'  },
        { word: 'PUMPKIN',   hint: 'Carved at Halloween',          category: 'Food'    },
        { word: 'COMPASS',   hint: 'Points to the north',          category: 'Objects' },
        { word: 'CHIMNEY',   hint: 'Smoke rises through it',       category: 'Objects' },
        { word: 'PENGUIN',   hint: 'Flightless Antarctic bird',    category: 'Animals' },
        { word: 'PYRAMID',   hint: 'Ancient Egyptian structure',   category: 'Places'  },
        { word: 'LANTERN',   hint: 'Portable light source',        category: 'Objects' },
        { word: 'BUFFALO',   hint: 'Large horned bovine',          category: 'Animals' },
        { word: 'VOLCANO',   hint: 'Erupts with lava',             category: 'Nature'  },
        { word: 'ECLIPSE',   hint: 'Moon blocks the sun',          category: 'Nature'  },
        { word: 'GORILLA',   hint: 'Largest great ape',            category: 'Animals' },
        { word: 'TRIUMPH',   hint: 'A great victory',              category: 'Other'   },
        { word: 'PHANTOM',   hint: 'A ghost or apparition',        category: 'Other'   },
        { word: 'LIBRARY',   hint: 'Full of books',                category: 'Places'  },
        { word: 'THUNDER',   hint: 'Follows lightning',            category: 'Nature'  },
        { word: 'LOBSTER',   hint: 'Red crustacean',               category: 'Animals' },
        { word: 'CRYSTAL',   hint: 'Clear mineral structure',      category: 'Nature'  },
        { word: 'EMPEROR',   hint: 'Ruler of an empire',           category: 'Other'   },
    ],
};

export function getWordsForDifficulty(difficulty, count = 5) {
    const pool = [...WORD_BANK[difficulty]];
    const selected = [];
    while (selected.length < count && pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        selected.push(pool.splice(idx, 1)[0]);
    }
    return selected;
}

export function scrambleWord(word) {
    const letters = word.split('');
    // Guarantee it's not the same as the original
    let scrambled;
    let attempts = 0;
    do {
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        scrambled = letters.join('');
        attempts++;
    } while (scrambled === word && attempts < 20);
    return scrambled;
}