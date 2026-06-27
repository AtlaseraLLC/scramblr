import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GameProvider, useGame } from './src/utils/GameContext';
import { COLORS } from './src/utils/Constants';

import SplashScreen  from './src/screens/SplashScreen';
import MenuScreen    from './src/screens/MenuScreen';
import GameScreen    from './src/screens/GameScreen';
import ResultScreen  from './src/screens/ResultScreen';
import AboutScreen   from './src/screens/AboutScreen';

function Navigator() {
    const { state } = useGame();
    switch (state.screen) {
        case 'SPLASH':  return <SplashScreen />;
        case 'MENU':    return <MenuScreen />;
        case 'GAME':    return <GameScreen />;
        case 'RESULT':  return <ResultScreen />;
        case 'ABOUT':   return <AboutScreen />;
        default:        return <MenuScreen />;
    }
}

export default function App() {
    return (
        <SafeAreaProvider>
            <GameProvider>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
                <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
                    <Navigator />
                </SafeAreaView>
            </GameProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
});