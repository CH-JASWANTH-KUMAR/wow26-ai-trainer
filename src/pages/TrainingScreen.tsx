import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { NeuralNetwork } from '../components/NeuralNetwork';

export const TrainingScreen: React.FC = () => {
  const { metrics, setScreen, saveLeaderboardEntry } = useGameStore();
  const [statusText, setStatusText] = useState('Initializing pipeline...');

  // Cycle through realistic ML training phases
  useEffect(() => {
    const p1 = setTimeout(() => setStatusText('Analyzing dataset curation composition...'), 1000);
    const p2 = setTimeout(() => setStatusText('Feeding inputs & propagating forward...'), 2500);
    const p3 = setTimeout(() => setStatusText('Optimizing parameters (ADAM learning rate = 0.005)...'), 4000);
    const p4 = setTimeout(() => setStatusText('Evaluating generalization loss on test validation sets...'), 6000);
    
    // Complete training after 8 seconds
    const end = setTimeout(() => {
      saveLeaderboardEntry();
      setScreen('result');
    }, 8000);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(p4);
      clearTimeout(end);
    };
  }, [saveLeaderboardEntry, setScreen]);

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center py-10 px-4">
      {/* Title Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="flex items-center justify-center space-x-2 text-brand-blue font-mono text-xs uppercase tracking-widest">
          <Cpu className="w-4 h-4 animate-pulse" />
          <span>Active Learning Pipeline</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white m-0">
          Training Neural Network
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Optimizing convolutional weight filters based on your curated training dataset.
        </p>
      </div>

      {/* Main Centerpiece Visualization */}
      <div className="w-full max-w-4xl mb-8">
        <NeuralNetwork
          mode="training"
          targetAccuracy={metrics.estimatedAccuracy}
          classBalance={metrics.classBalance}
        />
      </div>

      {/* Status Bar */}
      <motion.div
        key={statusText}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3 px-6 py-3 bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-lg"
      >
        <Activity className="w-4 h-4 text-brand-green animate-pulse" />
        <span className="text-slate-300 font-mono text-xs truncate select-none">
          {statusText}
        </span>
      </motion.div>
    </div>
  );
};
export default TrainingScreen;
