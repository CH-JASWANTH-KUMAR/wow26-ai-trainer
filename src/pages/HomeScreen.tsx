import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, Users, ShieldAlert } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { NeuralNetwork } from '../components/NeuralNetwork';
import { LeaderboardModal } from '../components/LeaderboardModal';
import { sound } from '../utils/sound';

export const HomeScreen: React.FC = () => {
  const {
    name,
    college,
    setPlayerInfo,
    setScreen,
    resetGame,
    loadLeaderboard,
    leaderboard
  } = useGameStore();

  const [localName, setLocalName] = useState(name);
  const [localCollege, setLocalCollege] = useState(college);
  const [showError, setShowError] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Load leaderboard entries
  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localName.trim()) {
      setShowError(true);
      sound.playFailure();
      return;
    }

    sound.playClick();
    setPlayerInfo(localName.trim(), localCollege.trim());
    resetGame();
    setScreen('brief');
  };

  const openFullLeaderboard = () => {
    sound.playClick();
    setIsLeaderboardOpen(true);
  };

  // Extract top 3 entries
  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center py-10 px-4 md:px-8 overflow-y-auto">
      {/* Upper Logo / Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl flex justify-between items-center mb-8 border-b border-slate-900 pb-4"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center font-bold text-white text-lg tracking-wider">
            W
          </div>
          <span className="font-mono text-xs font-bold tracking-widest text-slate-400">WOW 2026</span>
        </div>
        <div className="text-[10px] bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-mono font-bold px-2.5 py-1 rounded">
          AI RESEARCH LAB
        </div>
      </motion.div>

      {/* Hero Content & Visual */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
        
        {/* Left Side: Call to Action & Inputs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 flex flex-col space-y-6"
        >
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white text-left m-0">
              Train an AI.<br />
              <span className="text-brand-blue">Build the Dataset.</span><br />
              Beat the Leaderboard.
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed text-left m-0">
              Can you build a better AI model than everyone else at WOW 2026? Crate high-quality training sets, avoid noise, and optimize validation accuracy.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleStart} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-wider uppercase text-slate-400">
                Engineer Name <span className="text-brand-red">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={localName}
                onChange={(e) => {
                  setLocalName(e.target.value);
                  if (showError) setShowError(false);
                }}
                className={`w-full px-4 py-3 bg-slate-900 border ${
                  showError ? 'border-brand-red' : 'border-slate-800'
                } rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all`}
              />
              {showError && (
                <div className="flex items-center space-x-1 text-xs text-brand-red mt-1 font-mono">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Name is required to register ranking.</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-wider uppercase text-slate-400">
                University / College
              </label>
              <input
                type="text"
                placeholder="Enter your college (optional)"
                value={localCollege}
                onChange={(e) => setLocalCollege(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3.5 bg-brand-blue hover:bg-blue-600 active:scale-[0.98] text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-brand-blue/20 google-button"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Training Session</span>
            </button>
          </form>
        </motion.div>

        {/* Right Side: Interactive SVG Neural Network in Idle Mode */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-7"
        >
          <div className="text-center mb-2">
            <span className="inline-block px-2.5 py-1 rounded bg-slate-900 text-slate-500 text-[10px] font-mono tracking-widest uppercase">
              Visualizer: Neural Network Idle Mode
            </span>
          </div>
          <NeuralNetwork mode="idle" />
        </motion.div>
      </div>

      {/* Leaderboard Segment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-5xl border-t border-slate-900 pt-10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2 m-0">
              <Trophy className="w-6 h-6 text-brand-yellow" />
              <span>AI Hall of Fame</span>
            </h2>
            <p className="text-slate-400 text-xs font-mono mt-1">
              Top performing dataset curators at WOW 2026.
            </p>
          </div>
          <button
            onClick={openFullLeaderboard}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer text-xs font-bold font-mono"
          >
            <Users className="w-4 h-4" />
            <span>View Full Rankings</span>
          </button>
        </div>

        {/* Top 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {top3.map((entry, idx) => {
            const colors = [
              { border: 'border-brand-yellow/30 bg-amber-950/10', text: 'text-brand-yellow', rank: '🏆 Rank 1' },
              { border: 'border-slate-400/20 bg-slate-800/10', text: 'text-slate-300', rank: '🥈 Rank 2' },
              { border: 'border-amber-700/20 bg-amber-900/5', text: 'text-amber-600', rank: '🥉 Rank 3' }
            ];
            const currentTheme = colors[idx] || colors[2];

            return (
              <motion.div
                key={entry.id}
                whileHover={{ y: -4 }}
                className={`p-6 border rounded-xl flex flex-col justify-between ${currentTheme.border} relative overflow-hidden card-glowing`}
              >
                {/* Ranking Tag */}
                <div className={`text-[10px] font-bold tracking-widest font-mono uppercase mb-4 ${currentTheme.text}`}>
                  {currentTheme.rank}
                </div>

                {/* Score / Accuracy */}
                <div className="mb-4">
                  <div className="text-3xl font-extrabold tracking-tight text-white font-mono">
                    {entry.accuracy}%
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    Score: <span className="text-brand-blue font-bold">{entry.finalScore}</span>
                  </div>
                </div>

                {/* Name / College */}
                <div>
                  <div className="text-sm font-bold text-slate-200 truncate">
                    {entry.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {entry.college}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {top3.length === 0 && (
            <div className="col-span-3 text-center py-10 bg-slate-900/20 border border-slate-900 rounded-xl text-slate-500 font-mono text-sm">
              No entries in the Hall of Fame yet. Start training!
            </div>
          )}
        </div>
      </motion.div>

      {/* Leaderboard Modal Dialog */}
      <LeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />
    </div>
  );
};
export default HomeScreen;
