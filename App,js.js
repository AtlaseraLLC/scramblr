import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { GameProvider, useGame } from './src/utils/GameContext';
import { COLORS } from './src/constants';

import SplashScreen  from './src/screens/SplashScreen';
import MenuScreen    from './src/screens/MenuScreen';
import GameScreen    from './src/screens/GameScreen';
import ResultScreen  from './src/screens/ResultScreen';

function Navigator() {
    const { state } = useGame();

    switch (state.screen) {
        case 'SPLASH':  return <SplashScreen />;
        case 'MENU':    return <MenuScreen />;
        case 'GAME':    return <GameScreen />;
        case 'RESULT':  return <ResultScreen />;
        default:        return <MenuScreen />;
    }
}

export default function App() {
    return (
        <GameProvider>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
            <SafeAreaView style={styles.root}>
                <Navigator />
            </SafeAreaView>
        </GameProvider>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
});