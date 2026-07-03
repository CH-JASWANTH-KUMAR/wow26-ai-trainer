import React from 'react';
import { useGameStore } from './store/gameStore';
import HomeScreen from './pages/HomeScreen';
import BriefScreen from './pages/BriefScreen';
import GameplayScreen from './pages/GameplayScreen';
import TrainingScreen from './pages/TrainingScreen';
import ResultScreen from './pages/ResultScreen';

const App: React.FC = () => {
  const { currentScreen } = useGameStore();

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'brief' && <BriefScreen />}
      {currentScreen === 'gameplay' && <GameplayScreen />}
      {currentScreen === 'training' && <TrainingScreen />}
      {currentScreen === 'result' && <ResultScreen />}
    </div>
  );
};

export default App;
