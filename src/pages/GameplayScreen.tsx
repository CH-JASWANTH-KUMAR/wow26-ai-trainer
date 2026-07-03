import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShieldAlert, Timer, Activity, RefreshCw } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/sound';

export const GameplayScreen: React.FC = () => {
  const {
    shuffledDataset,
    currentIndex,
    metrics,
    timeLeft,
    tickTimer,
    acceptImage,
    rejectImage,
    setScreen
  } = useGameStore();

  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [flash, setFlash] = useState<'success' | 'failure' | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | 'shake' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Timer Tick
  useEffect(() => {
    const timer = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, [tickTimer]);

  const currentImg = shuffledDataset[currentIndex];

  // If time runs out or we finish the dataset, transition to training
  useEffect(() => {
    if (currentIndex >= shuffledDataset.length && shuffledDataset.length > 0 && !isAnimating) {
      sound.playWhoosh();
      setScreen('training');
    }
  }, [currentIndex, shuffledDataset, setScreen, isAnimating]);

  const handleChoice = (accept: boolean) => {
    if (isAnimating || activeHint) return;

    setIsAnimating(true);
    const result = accept ? acceptImage() : rejectImage();

    if (result.isCorrect) {
      sound.playSuccess();
      setFlash('success');
      setSlideDirection(accept ? 'right' : 'left');
      
      // Auto advance after animation
      setTimeout(() => {
        setFlash(null);
        setSlideDirection(null);
        setIsAnimating(false);
      }, 35000 / 100); // 350ms
    } else {
      sound.playFailure();
      setFlash('failure');
      setSlideDirection('shake');
      setActiveHint(result.hint || 'Incorrect data decision.');
      // Do not auto-advance, wait for user to read hint
    }
  };

  const dismissHint = () => {
    sound.playClick();
    setActiveHint(null);
    setFlash(null);
    setSlideDirection(null);
    setIsAnimating(false);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeHint) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          dismissHint();
        }
        return;
      }

      if (e.key === 'a' || e.key === 'A') {
        handleChoice(true);
      } else if (e.key === 'r' || e.key === 'R') {
        handleChoice(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeHint, currentIndex, isAnimating]);

  // Card movement animation variables
  let animateProps = {};
  if (slideDirection === 'right') {
    animateProps = { x: 500, rotate: 15, opacity: 0 };
  } else if (slideDirection === 'left') {
    animateProps = { x: -500, rotate: -15, opacity: 0 };
  } else if (slideDirection === 'shake') {
    animateProps = {
      x: [-10, 10, -10, 10, -5, 5, 0],
      rotate: [-1.5, 1.5, -1.5, 1.5, -0.5, 0.5, 0],
      transition: { duration: 0.4 }
    };
  } else {
    animateProps = { x: 0, rotate: 0, opacity: 1 };
  }

  // Format progress
  const progressPercent = Math.min(100, Math.round((currentIndex / 40) * 100));

  return (
    <div className={`w-full min-h-screen bg-slate-950 flex flex-col items-center justify-between p-4 md:p-8 transition-colors duration-200 ${
      flash === 'success' ? 'bg-brand-green/5' : flash === 'failure' ? 'bg-brand-red/5' : ''
    }`}>
      
      {/* HUD Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        {/* Progress Bar */}
        <div className="flex-1 max-w-xs md:max-w-md mr-6">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
            <span>Dataset Curation Progress</span>
            <span>{currentIndex} / 40 Images</span>
          </div>
          <div className="h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-blue"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-200 font-mono text-sm shadow-md">
          <Timer className={`w-4 h-4 ${timeLeft < 20 ? 'text-brand-red animate-pulse' : 'text-brand-blue'}`} />
          <span className={timeLeft < 20 ? 'text-brand-red font-bold' : ''}>{timeLeft}s</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1">
        
        {/* Left Side: Game Card Deck Container (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center relative min-h-[380px]">
          
          <AnimatePresence mode="wait">
            {currentImg && (
              <motion.div
                key={currentImg.id}
                animate={animateProps}
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                whileInView={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-full max-w-sm aspect-[4/5] bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col justify-between relative overflow-hidden card-glowing"
              >
                {/* Image display */}
                <div className="flex-1 w-full bg-slate-950 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-800">
                  <img
                    src={currentImg.src}
                    alt="Training Subject"
                    className="w-full h-full object-cover select-none pointer-events-none"
                    style={
                      currentImg.id === 'low_res'
                        ? { imageRendering: 'pixelated', filter: 'contrast(1.15) brightness(0.95)' }
                        : {}
                    }
                  />
                  
                  {/* Visual clue label overlay */}
                  <div className="absolute top-3 left-3 bg-slate-950/70 border border-slate-800/80 px-2 py-0.5 rounded text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                    Subject {currentIndex + 1}
                  </div>
                </div>

                {/* Subtext and Action Buttons */}
                <div className="pt-4 flex flex-col space-y-4">
                  <div className="text-center">
                    <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider font-sans m-0">
                      Curator Decision: Include in training set?
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Reject Button */}
                    <button
                      onClick={() => handleChoice(false)}
                      disabled={isAnimating || !!activeHint}
                      className="flex items-center justify-center space-x-2 py-3 bg-slate-800 hover:bg-brand-red/10 border border-slate-700 hover:border-brand-red/40 text-slate-400 hover:text-brand-red rounded-xl font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50 google-button"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject <kbd className="hidden sm:inline-block ml-1 px-1 bg-slate-950 rounded border border-slate-800 font-mono text-[9px]">R</kbd></span>
                    </button>

                    {/* Accept Button */}
                    <button
                      onClick={() => handleChoice(true)}
                      disabled={isAnimating || !!activeHint}
                      className="flex items-center justify-center space-x-2 py-3 bg-slate-800 hover:bg-brand-green/10 border border-slate-700 hover:border-brand-green/40 text-slate-400 hover:text-brand-green rounded-xl font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50 google-button"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept <kbd className="hidden sm:inline-block ml-1 px-1 bg-slate-950 rounded border border-slate-800 font-mono text-[9px]">A</kbd></span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Educational Feedback Overlay */}
          <AnimatePresence>
            {activeHint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-slate-950/90 rounded-2xl border border-brand-red/20 p-6 flex flex-col justify-center items-center text-center space-y-6 z-10"
              >
                <div className="w-12 h-12 rounded-full bg-brand-red/10 border border-brand-red/35 flex items-center justify-center text-brand-red animate-pulse">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-white font-extrabold text-lg m-0">Data Quality Alert!</h4>
                  <p className="text-slate-300 text-sm max-w-sm mx-auto font-sans leading-relaxed">
                    {activeHint}
                  </p>
                </div>
                <button
                  onClick={dismissHint}
                  className="px-6 py-2.5 bg-brand-red hover:bg-red-600 active:scale-95 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Got it, Continue <span className="font-mono ml-1 text-[10px] opacity-70">(Space)</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Metrics Sidebar (col-span-5) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl card-glowing">
          
          {/* Estimated Accuracy Circle Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">Live Pipeline Metrics</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              VAL SET SIZE: 1000
            </div>
          </div>

          {/* Accuracy Metric Box */}
          <div className="py-6 flex items-center justify-between bg-slate-950/40 border border-slate-800/80 rounded-xl px-6 my-4">
            <div>
              <span className="text-xs text-slate-500 font-mono block uppercase">Estimated Accuracy</span>
              <span className="text-4xl font-extrabold tracking-tight text-white font-mono mt-1 block">
                {metrics.estimatedAccuracy}%
              </span>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-brand-blue/30 flex items-center justify-center font-bold text-xs text-brand-blue font-mono">
              VAL
            </div>
          </div>

          {/* Progress Bars Stack */}
          <div className="flex-1 space-y-4">
            
            {/* Dataset Quality */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Dataset Cleanliness</span>
                <span className="text-white font-bold">{metrics.datasetQuality}%</span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  className="h-full bg-brand-green"
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.datasetQuality}%` }}
                />
              </div>
            </div>

            {/* Noise */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Dataset Noise</span>
                <span className={`font-bold ${metrics.noise > 40 ? 'text-brand-red' : 'text-slate-200'}`}>{metrics.noise}%</span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  className="h-full bg-brand-red"
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.noise}%` }}
                />
              </div>
            </div>

            {/* Bias */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Classifier Bias</span>
                <span className={`font-bold ${metrics.bias > 40 ? 'text-brand-yellow' : 'text-slate-200'}`}>{metrics.bias}%</span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  className="h-full bg-brand-yellow"
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.bias}%` }}
                />
              </div>
            </div>

            {/* Class Balance */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Class Balance (Cats vs Dogs)</span>
                <span className="text-white font-bold">{metrics.classBalance}%</span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  className="h-full bg-brand-blue"
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.classBalance}%` }}
                />
              </div>
            </div>

            {/* Precision & Recall Row */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/20 border border-slate-850 p-3 rounded-xl">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Precision</span>
                <span className="text-base font-extrabold text-emerald-500 font-mono mt-0.5 block">
                  {metrics.precision}%
                </span>
              </div>
              <div className="bg-slate-950/20 border border-slate-850 p-3 rounded-xl">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Recall</span>
                <span className="text-base font-extrabold text-violet-500 font-mono mt-0.5 block">
                  {metrics.recall}%
                </span>
              </div>
            </div>

          </div>

          {/* Educational footer reminder */}
          <div className="border-t border-slate-800 pt-4 mt-4 flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Metrics recalculate continuously per click.</span>
          </div>

        </div>

      </div>

    </div>
  );
};
export default GameplayScreen;
