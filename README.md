# 💥 Scramblr

> A mobile word unscramble game built with React Native — drag letter tiles into the correct order to solve each puzzle. Features a retro neon arcade aesthetic, difficulty levels, lives system, and smooth drag-and-drop interactions.

---

## 📱 Screens

| Screen | Description |
|---|---|
| **Splash** | Animated logo with 3s loading bar |
| **Menu** | Play, Settings, About, Quit |
| **Game** | Drag-and-drop letter tiles into answer slots |
| **Result** | Score, rank (S→D), play again or return to menu |

## 🎮 Gameplay

- Scrambled letter tiles appear at the top
- Drag each tile into the correct answer slot below
- Tap a filled slot to return its tile to the source row
- Hit **CHECK** when all slots are filled
- Wrong answer? Lose a life and try again
- Use **SKIP** to jump to the next word (costs a life)
- Earn bonus points for speed

## ⚙️ Difficulty Modes

| Mode | Max Letters | Lives | Time Bonus |
|---|---|---|---|
| Easy   | 4 | 3 | 10s window |
| Medium | 6 | 3 | 20s window |
| Hard   | 9 | 2 | 40s window |

## 🏆 Scoring

- **100 pts** per correct word
- **+5 pts** per second remaining under the time window
- Final rank: S / A / B / C / D

## 🗂 Project Structure

```
WordBlast/
├── App.js                        # Root navigator
├── src/
│   ├── constants.js              # Theme, colors, config
│   ├── data/
│   │   └── words.js              # Word bank (60 words, 3 difficulties)
│   ├── utils/
│   │   └── GameContext.js        # Global state (Context + useReducer)
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── MenuScreen.js         # Includes Settings & About modals
│   │   ├── GameScreen.js         # Core drag-and-drop game loop
│   │   └── ResultScreen.js
│   └── components/
│       ├── LetterTile.js         # Draggable tile (PanResponder)
│       └── AnswerSlot.js         # Drop target slot
└── package.json
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start Expo
npm start

# Run on device
npm run android   # Android
npm run ios       # iOS
```

> Requires [Expo CLI](https://docs.expo.dev/get-started/installation/) and the Expo Go app on your device.

## 🎨 Design

Retro neon arcade aesthetic — dark background, vivid neon tile colors, chunky monospace typography, scanline effects, and smooth spring animations throughout.

## 📦 Tech Stack

- **React Native** (0.74)
- **Expo** (~51)
- `PanResponder` for drag-and-drop
- `Animated` API for all transitions
- `Context + useReducer` for state management
- Zero third-party UI libraries
