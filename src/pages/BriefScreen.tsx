import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Keyboard } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/sound';

export const BriefScreen: React.FC = () => {
  const { setScreen } = useGameStore();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleStart = () => {
    sound.playClick();
    setScreen('gameplay');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center py-10 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl flex flex-col space-y-8"
      >
        {/* Title */}
        <div className="text-center">
          <div className="text-[10px] bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-mono font-bold px-3 py-1 rounded inline-block uppercase tracking-widest mb-3">
            Mission Briefing
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white m-0">
            Lead AI Data Engineer
          </h2>
          <p className="text-slate-400 text-sm font-mono mt-1">
            Assigned to: Classifier Pipeline (Cat vs Dog)
          </p>
        </div>

        {/* Core Message */}
        <div className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl text-center">
          <p className="text-slate-300 text-sm leading-relaxed m-0 font-sans">
            Your mission is to curate the training dataset for our neural network. 
            <span className="text-brand-blue font-semibold"> Better data creates better AI models.</span> 
            Accept high-quality targets, and reject corrupted or out-of-domain data.
          </p>
        </div>

        {/* Rules Layout (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Accept Block */}
          <div className="p-5 border border-brand-green/20 bg-brand-green/5 rounded-xl space-y-4 card-glowing">
            <h3 className="text-brand-green font-bold text-sm tracking-wider uppercase flex items-center space-x-2 m-0">
              <Check className="w-4 h-4" />
              <span>✅ Accept into Dataset</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 pl-4 list-disc font-sans leading-relaxed">
              <li>
                <strong className="text-white">Clear Cat Images:</strong> High resolution and well-lit.
              </li>
              <li>
                <strong className="text-white">Clear Dog Images:</strong> Sharp, centered subject.
              </li>
              <li>
                <strong className="text-white">Varied Angles:</strong> Good for generalization.
              </li>
            </ul>
          </div>

          {/* Reject Block */}
          <div className="p-5 border border-brand-red/20 bg-brand-red/5 rounded-xl space-y-4 card-glowing">
            <h3 className="text-brand-red font-bold text-sm tracking-wider uppercase flex items-center space-x-2 m-0">
              <X className="w-4 h-4" />
              <span>❌ Reject from Dataset</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 pl-4 list-disc font-sans leading-relaxed">
              <li>
                <strong className="text-white">Blurry/Out-of-Focus:</strong> Introduces noise to the filters.
              </li>
              <li>
                <strong className="text-white">Internet Memes:</strong> Text overlays confuse convolutional layers.
              </li>
              <li>
                <strong className="text-white">Unrelated Objects:</strong> e.g., kitchen appliances skew classification bias.
              </li>
            </ul>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-3 border-y border-slate-800/80 text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-4 h-4 text-brand-blue" />
            <span>Kiosk Hotkeys:</span>
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="px-2 py-1 bg-slate-800 border border-slate-700 text-white rounded font-bold">A</span>
              <span>Accept</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="px-2 py-1 bg-slate-800 border border-slate-700 text-white rounded font-bold">R</span>
              <span>Reject</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleStart}
            disabled={countdown > 0}
            className={`flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg google-button ${
              countdown > 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-brand-blue hover:bg-blue-600 text-white cursor-pointer hover:shadow-brand-blue/20 active:scale-[0.98]'
            }`}
          >
            {countdown > 0 ? (
              <span className="font-mono">Review Guidelines ({countdown}s)...</span>
            ) : (
              <>
                <span>Start Curation</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
export default BriefScreen;
