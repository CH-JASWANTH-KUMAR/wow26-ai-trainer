import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Home, RefreshCw, AlertTriangle, CheckCircle, Award, Database } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { dataset } from '../data/dataset';
import { LeaderboardModal } from '../components/LeaderboardModal';
import { sound } from '../utils/sound';

// Count-up helper component
const CountUp: React.FC<{ value: number; suffix?: string; prefix?: string; isPenalty?: boolean }> = ({
  value,
  suffix = '',
  prefix = '',
  isPenalty = false
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const duration = 1000; // 1s
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: easeOutCubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      setCurrent(Math.round(easedProgress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className={isPenalty && current > 0 ? 'text-brand-red' : ''}>
      {prefix}
      {current}
      {suffix}
    </span>
  );
};

export const ResultScreen: React.FC = () => {
  const {
    metrics,
    timeLeft,
    acceptedIds,
    rejectedIds,
    finalAccuracy,
    finalScore,
    achievedGoldenDataset,
    wrongChoices,
    resetGame,
    setScreen
  } = useGameStore();

  const [loadingPhase, setLoadingPhase] = useState(0);
  const [revealComplete, setRevealComplete] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // loading phase sequence (Total 3.2 seconds)
  useEffect(() => {
    const t1 = setTimeout(() => setLoadingPhase(1), 800);
    const t2 = setTimeout(() => setLoadingPhase(2), 1600);
    const t3 = setTimeout(() => setLoadingPhase(3), 2400);
    const t4 = setTimeout(() => {
      setLoadingPhase(4);
      setRevealComplete(true);
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleReplay = () => {
    sound.playClick();
    resetGame();
    setScreen('brief');
  };

  const handleReturnHome = () => {
    sound.playClick();
    setScreen('home');
  };

  // Star calculation
  // 95%+ : 3 Stars, 80-94%: 2 Stars, 60-79%: 1 Star, <60%: 0 Stars
  const starsCount = finalAccuracy >= 95 ? 3 : finalAccuracy >= 80 ? 2 : finalAccuracy >= 60 ? 1 : 0;
  
  let ratingTitle = 'Needs More Training';
  if (starsCount === 3) ratingTitle = 'Expert AI Engineer';
  else if (starsCount === 2) ratingTitle = 'Promising Researcher';
  else if (starsCount === 1) ratingTitle = 'Data Science Trainee';

  // Calculate detailed score items
  const accuracyScore = finalAccuracy * 10;
  const badAccepted = dataset.filter((img) => !img.acceptIsCorrect && acceptedIds.includes(img.id)).length;
  const goodRejected = dataset.filter((img) => img.acceptIsCorrect && rejectedIds.includes(img.id)).length;
  const datasetBonus = (badAccepted === 0 && goodRejected === 0) ? 100 : 0;
  const speedBonus = Math.round(timeLeft * 0.5);
  const biasPenalty = Math.round(metrics.bias * 1.5);
  const noisePenalty = Math.round(metrics.noise * 1.5);

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center py-10 px-4 md:px-8 relative overflow-y-auto">
      
      {/* 1. Dramatic Loader Screen */}
      <AnimatePresence>
        {!revealComplete && (
          <motion.div
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-slate-950 flex flex-col items-center justify-center space-y-6"
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Outer spinning ring */}
              <div className="absolute inset-0 border-4 border-slate-800 border-t-brand-blue rounded-full animate-spin" style={{ animationDuration: '1s' }} />
              <Database className="w-8 h-8 text-brand-blue animate-pulse" />
            </div>

            {/* Sequence Texts */}
            <div className="h-8 overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                {loadingPhase === 0 && (
                  <motion.span
                    key="p0"
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    className="font-mono text-xs text-slate-400 tracking-wider"
                  >
                    Analyzing Dataset Quality...
                  </motion.span>
                )}
                {loadingPhase === 1 && (
                  <motion.span
                    key="p1"
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    className="font-mono text-xs text-brand-yellow tracking-wider"
                  >
                    Optimizing Decision Boundaries...
                  </motion.span>
                )}
                {loadingPhase === 2 && (
                  <motion.span
                    key="p2"
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    className="font-mono text-xs text-brand-blue tracking-wider"
                  >
                    Evaluating Model Generalization...
                  </motion.span>
                )}
                {loadingPhase === 3 && (
                  <motion.span
                    key="p3"
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    className="font-mono text-xs text-brand-green tracking-wider animate-pulse"
                  >
                    Running Cross-Validation Tests...
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Revealed Results Panel */}
      {revealComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* Left Column: Star Rating, Accuracy, Score Breakdown (col-span-6) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl card-glowing">
            <div className="text-center space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-brand-blue uppercase bg-brand-blue/10 border border-brand-blue/20 px-3 py-1 rounded inline-block">
                Final Evaluation
              </span>

              {/* Large accuracy reveal */}
              <div className="relative inline-flex items-center justify-center flex-col">
                <div className="text-7xl font-extrabold tracking-tight text-white font-mono leading-none">
                  <CountUp value={finalAccuracy} suffix="%" />
                </div>
                <div className="text-xs text-slate-500 font-mono mt-2 uppercase tracking-widest">
                  Model Generalization Accuracy
                </div>
              </div>

              {/* Star Rating Group */}
              <div className="flex flex-col items-center space-y-2 mt-4">
                <div className="flex space-x-2">
                  {[1, 2, 3].map((starIdx) => {
                    const active = starIdx <= starsCount;
                    return (
                      <motion.div
                        key={starIdx}
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 120,
                          delay: 0.2 + starIdx * 0.15
                        }}
                      >
                        <Star
                          className={`w-8 h-8 ${
                            active ? 'text-brand-yellow fill-brand-yellow filter drop-shadow-[0_0_8px_rgba(251,188,5,0.4)]' : 'text-slate-700'
                          }`}
                        />
                      </motion.div>
                    );
                  })}
                </div>
                <span className="text-sm font-extrabold tracking-wide uppercase text-slate-200">
                  {ratingTitle}
                </span>
              </div>

              {/* Golden Dataset Award Achievement badge */}
              {achievedGoldenDataset && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', delay: 0.8 }}
                  className="mx-auto max-w-sm flex items-center justify-center space-x-2 px-4 py-2 bg-amber-500/10 border border-brand-yellow/30 rounded-xl text-brand-yellow text-xs font-bold"
                >
                  <Award className="w-5 h-5 text-brand-yellow animate-pulse" />
                  <span className="font-sans">🏆 Golden Dataset Award: Perfect selection!</span>
                </motion.div>
              )}
            </div>

            {/* Score Breakdown Table */}
            <div className="border-t border-slate-800 pt-6">
              <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-4">
                Score Breakdown
              </h3>
              <div className="space-y-3 font-mono text-xs">
                
                <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                  <span className="text-slate-400">Accuracy Score ({finalAccuracy}% × 10)</span>
                  <span className="text-white font-bold">
                    <CountUp value={accuracyScore} prefix="+" />
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                  <span className="text-slate-400">Dataset Curation Bonus (Perfect curation)</span>
                  <span className={`font-bold ${datasetBonus > 0 ? 'text-brand-green' : 'text-slate-600'}`}>
                    <CountUp value={datasetBonus} prefix="+" />
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                  <span className="text-slate-400">Speed Bonus ({timeLeft}s remaining × 0.5)</span>
                  <span className={`font-bold ${speedBonus > 0 ? 'text-brand-green' : 'text-slate-600'}`}>
                    <CountUp value={speedBonus} prefix="+" />
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                  <span className="text-slate-400">Classifier Bias Penalty</span>
                  <span className="font-bold text-brand-red">
                    <CountUp value={biasPenalty} prefix="-" isPenalty />
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                  <span className="text-slate-400">Dataset Noise Penalty</span>
                  <span className="font-bold text-brand-red">
                    <CountUp value={noisePenalty} prefix="-" isPenalty />
                  </span>
                </div>

                {/* Final Total Score */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-200">Final Score</span>
                  <span className="text-2xl font-extrabold text-brand-blue">
                    <CountUp value={finalScore} />
                  </span>
                </div>

              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={handleReplay}
                className="flex items-center justify-center space-x-2 py-3 bg-brand-blue hover:bg-blue-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-brand-blue/20 google-button"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Train Again</span>
              </button>
              <button
                onClick={() => setIsLeaderboardOpen(true)}
                className="flex items-center justify-center space-x-2 py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer google-button"
              >
                <Trophy className="w-4 h-4 text-brand-yellow" />
                <span>AI Hall of Fame</span>
              </button>
            </div>
            <button
              onClick={handleReturnHome}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-950/40 hover:bg-slate-800 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer google-button"
            >
              <Home className="w-4 h-4" />
              <span>Return to Lobby</span>
            </button>
          </div>

          {/* Right Column: Educational Debrief (col-span-6) */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-2xl card-glowing">
            
            {/* Header */}
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold tracking-tight text-white m-0">
                {wrongChoices.length > 0 ? 'What Hurt Your Model?' : 'Data Pipeline Analysis'}
              </h3>
              <p className="text-slate-400 text-xs font-mono mt-1 leading-normal">
                {wrongChoices.length > 0
                  ? 'Accepted noise and missing targets reduced validation accuracy.'
                  : 'Your curated training dataset matches the pristine validation criteria.'}
              </p>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto max-h-[360px] my-6 space-y-4 pr-2">
              {wrongChoices.length > 0 ? (
                wrongChoices.map((imgId) => {
                  const target = dataset.find((img) => img.id === imgId);
                  if (!target) return null;

                  const isBadImage = !target.acceptIsCorrect;

                  return (
                    <div
                      key={target.id}
                      className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center space-x-4"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-16 h-16 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <img
                          src={target.src}
                          alt="Pipeline Error Sample"
                          className="w-full h-full object-cover"
                          style={target.id === 'low_res' ? { imageRendering: 'pixelated' } : {}}
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-brand-red/10 border border-brand-red/20 text-brand-red">
                            {isBadImage ? 'Accepted Noise' : 'Rejected Good Target'}
                          </span>
                          <span className="text-xs font-bold text-slate-300 capitalize">
                            {target.id.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans m-0">
                          {isBadImage 
                            ? target.hint 
                            : 'Good training targets are required. Rejecting clean data reduces the classifier recall.'}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center text-brand-green">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-slate-200 font-bold text-sm m-0">100% Curation Cleanliness</h4>
                    <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
                      You curating all 10 good dog/cat images and successfully filtered all blurry images, memes, and unrelated objects. Flawless!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Educational take-away summary box */}
            <div className="p-4 bg-slate-950/20 border border-slate-800/80 rounded-xl flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Key Educational Lesson</span>
                <p className="text-[11px] text-slate-400 leading-normal m-0">
                  ML accuracy is bounded by data quality. Feeding blurry objects increases dataset noise, skews class balance, and causes high generalization errors. Quality dataset curation is the key parameter of real AI systems.
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* Leaderboard Modal Dialog */}
      <LeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />
    </div>
  );
};
export default ResultScreen;
