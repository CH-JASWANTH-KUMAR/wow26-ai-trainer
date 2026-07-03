import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Award } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/sound';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const { leaderboard } = useGameStore();

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center space-x-3">
                <Trophy className="w-6 h-6 text-brand-yellow" />
                <h2 className="text-xl font-bold tracking-tight text-white m-0">AI Hall of Fame</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Table */}
            <div className="flex-1 overflow-y-auto p-6">
              {leaderboard.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-mono">
                  No records yet. Be the first to train the model!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                        <th className="py-3 px-4 font-medium text-center w-16">Rank</th>
                        <th className="py-3 px-4 font-medium">Engineer</th>
                        <th className="py-3 px-4 font-medium">College</th>
                        <th className="py-3 px-4 font-medium text-center">Accuracy</th>
                        <th className="py-3 px-4 font-medium text-right">Score</th>
                        <th className="py-3 px-4 font-medium text-center">Achievements</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {leaderboard.map((entry) => {
                        const isTop3 = entry.rank && entry.rank <= 3;
                        let rankBg = 'text-slate-400';
                        if (entry.rank === 1) rankBg = 'text-brand-yellow font-extrabold';
                        else if (entry.rank === 2) rankBg = 'text-slate-300 font-bold';
                        else if (entry.rank === 3) rankBg = 'text-amber-600 font-bold';

                        return (
                          <tr
                            key={entry.id}
                            className={`hover:bg-slate-800/30 transition-colors text-sm ${
                              isTop3 ? 'bg-slate-800/10' : ''
                            }`}
                          >
                            <td className="py-4 px-4 text-center font-mono">
                              <span className={rankBg}>
                                #{entry.rank}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-medium text-slate-200">
                              {entry.name}
                            </td>
                            <td className="py-4 px-4 text-slate-400">
                              {entry.college}
                            </td>
                            <td className="py-4 px-4 text-center font-mono font-bold text-brand-green">
                              {entry.accuracy}%
                            </td>
                            <td className="py-4 px-4 text-right font-mono text-brand-blue font-bold">
                              {entry.finalScore}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex justify-center">
                                {entry.goldenDataset ? (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-brand-yellow border border-amber-500/30">
                                    <Award className="w-3.5 h-3.5" />
                                    <span>🏆 Golden Dataset</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-600 font-mono text-xs">-</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-center text-xs text-slate-500 font-mono">
              WOW 2026 Live AI Dataset Engineering Leaderboard
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
