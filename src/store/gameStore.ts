import { create } from 'zustand';
import type { GameScreen, TrainingImage, DatasetMetrics, LeaderboardEntry } from '../types';
import { dataset } from '../data/dataset';
import { calculateMetrics } from '../game-engine/qualityEngine';

interface GameState {
  // Player info
  name: string;
  college: string;
  
  // Game states
  currentScreen: GameScreen;
  shuffledDataset: TrainingImage[];
  currentIndex: number;
  acceptedIds: string[];
  rejectedIds: string[];
  metrics: DatasetMetrics;
  
  // Scoring & achievements
  wrongChoices: string[]; // List of image IDs where user made a mistake
  finalAccuracy: number;
  finalScore: number;
  achievedGoldenDataset: boolean;
  
  // Audio & Timer
  soundEnabled: boolean;
  timeLeft: number;
  timerActive: boolean;
  
  // Leaderboard
  leaderboard: LeaderboardEntry[];
  
  // Actions
  setPlayerInfo: (name: string, college: string) => void;
  setScreen: (screen: GameScreen) => void;
  resetGame: () => void;
  acceptImage: () => { isCorrect: boolean; hint?: string };
  rejectImage: () => { isCorrect: boolean; hint?: string };
  tickTimer: () => void;
  stopTimer: () => void;
  toggleSound: () => void;
  loadLeaderboard: () => void;
  saveLeaderboardEntry: () => void;
}

// Utility to shuffle dataset
const shuffleArray = (array: TrainingImage[]): TrainingImage[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const initialMetrics: DatasetMetrics = {
  estimatedAccuracy: 20,
  datasetQuality: 100,
  noise: 0,
  bias: 0,
  classBalance: 100,
  precision: 100,
  recall: 0
};

export const useGameStore = create<GameState>((set, get) => ({
  name: '',
  college: '',
  currentScreen: 'home',
  shuffledDataset: [],
  currentIndex: 0,
  acceptedIds: [],
  rejectedIds: [],
  metrics: initialMetrics,
  
  wrongChoices: [],
  finalAccuracy: 20,
  finalScore: 0,
  achievedGoldenDataset: false,
  
  soundEnabled: true,
  timeLeft: 90,
  timerActive: false,
  
  leaderboard: [],

  setPlayerInfo: (name, college) => set({ name, college }),
  
  setScreen: (screen) => {
    set({ currentScreen: screen });
    // Handle timer activation
    if (screen === 'gameplay') {
      set({ timerActive: true });
    } else {
      set({ timerActive: false });
    }
  },
  
  resetGame: () => {
    const shuffled = shuffleArray(dataset);
    set({
      shuffledDataset: shuffled,
      currentIndex: 0,
      acceptedIds: [],
      rejectedIds: [],
      metrics: initialMetrics,
      wrongChoices: [],
      finalAccuracy: 20,
      finalScore: 0,
      achievedGoldenDataset: false,
      timeLeft: 90,
      timerActive: false
    });
  },

  acceptImage: () => {
    const { shuffledDataset, currentIndex, acceptedIds, rejectedIds, wrongChoices } = get();
    const currentImg = shuffledDataset[currentIndex];
    
    if (!currentImg) return { isCorrect: true };

    const isCorrect = currentImg.acceptIsCorrect;
    const newAccepted = [...acceptedIds, currentImg.id];
    const newWrongChoices = isCorrect ? wrongChoices : [...wrongChoices, currentImg.id];

    const nextIndex = currentIndex + 1;
    const newMetrics = calculateMetrics(newAccepted, rejectedIds);

    set({
      acceptedIds: newAccepted,
      currentIndex: nextIndex,
      wrongChoices: newWrongChoices,
      metrics: newMetrics
    });

    // Check if we finished the dataset
    if (nextIndex >= shuffledDataset.length) {
      set({ timerActive: false });
    }

    return { isCorrect, hint: currentImg.hint };
  },

  rejectImage: () => {
    const { shuffledDataset, currentIndex, acceptedIds, rejectedIds, wrongChoices } = get();
    const currentImg = shuffledDataset[currentIndex];
    
    if (!currentImg) return { isCorrect: true };

    // Rejecting is correct if accepting is incorrect!
    const isCorrect = !currentImg.acceptIsCorrect;
    const newRejected = [...rejectedIds, currentImg.id];
    const newWrongChoices = isCorrect ? wrongChoices : [...wrongChoices, currentImg.id];

    const nextIndex = currentIndex + 1;
    const newMetrics = calculateMetrics(acceptedIds, newRejected);

    set({
      rejectedIds: newRejected,
      currentIndex: nextIndex,
      wrongChoices: newWrongChoices,
      metrics: newMetrics
    });

    // Check if we finished the dataset
    if (nextIndex >= shuffledDataset.length) {
      set({ timerActive: false });
    }

    return { isCorrect, hint: currentImg.hint };
  },

  tickTimer: () => {
    const { timeLeft, timerActive } = get();
    if (!timerActive) return;
    
    if (timeLeft <= 1) {
      // Time is up! Stop timer and force training screen
      set({ timeLeft: 0, timerActive: false, currentScreen: 'training' });
    } else {
      set({ timeLeft: timeLeft - 1 });
    }
  },

  stopTimer: () => set({ timerActive: false }),

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  loadLeaderboard: () => {
    const stored = localStorage.getItem('wow_ai_leaderboard');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as LeaderboardEntry[];
        // Sort by finalScore desc, then accuracy desc
        const sorted = parsed.sort((a, b) => b.finalScore - a.finalScore || b.accuracy - a.accuracy);
        // Add ranks
        const ranked = sorted.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
        set({ leaderboard: ranked });
      } catch (e) {
        console.error('Failed to parse leaderboard', e);
      }
    } else {
      // Initialize with default high scores for tech event feel
      const defaultLeaderboard: LeaderboardEntry[] = [
        { id: '1', rank: 1, name: 'Alex Chen', college: 'Stanford', accuracy: 98, finalScore: 1105, date: '2026-07-03', goldenDataset: true },
        { id: '2', rank: 2, name: 'Devon Patel', college: 'MIT', accuracy: 95, finalScore: 1045, date: '2026-07-03', goldenDataset: true },
        { id: '3', rank: 3, name: 'Sora Takahashi', college: 'IIT Bombay', accuracy: 92, finalScore: 990, date: '2026-07-03', goldenDataset: false }
      ];
      localStorage.setItem('wow_ai_leaderboard', JSON.stringify(defaultLeaderboard));
      set({ leaderboard: defaultLeaderboard });
    }
  },

  saveLeaderboardEntry: () => {
    const { name, college, metrics, timeLeft, acceptedIds, rejectedIds, leaderboard } = get();
    
    // Calculate final stats
    const finalAccuracy = metrics.estimatedAccuracy;
    
    // 1. Accuracy Score: Accuracy * 10
    const accuracyScore = finalAccuracy * 10;
    
    // 2. Dataset Bonus: perfect dataset curation = +100
    // No bad images accepted, no good images rejected
    const badAccepted = dataset.filter((img) => !img.acceptIsCorrect && acceptedIds.includes(img.id)).length;
    const goodRejected = dataset.filter((img) => img.acceptIsCorrect && rejectedIds.includes(img.id)).length;
    const datasetBonus = (badAccepted === 0 && goodRejected === 0) ? 100 : 0;
    
    // 3. Speed Bonus: timeLeft * 0.5
    const speedBonus = Math.round(timeLeft * 0.5);
    
    // 4. Bias Penalty
    const biasPenalty = Math.round(metrics.bias * 1.5);
    
    // 5. Noise Penalty
    const noisePenalty = Math.round(metrics.noise * 1.5);
    
    const finalScore = Math.max(0, accuracyScore + datasetBonus + speedBonus - biasPenalty - noisePenalty);

    // Achievement check
    // Golden Dataset Award: 95%+ accuracy, zero bad images accepted, balanced dataset (classBalance = 100)
    const achievedGoldenDataset = 
      finalAccuracy >= 95 && 
      badAccepted === 0 && 
      metrics.classBalance === 100;

    set({ finalAccuracy, finalScore, achievedGoldenDataset });

    // Avoid saving if name is empty (replay without registration)
    if (!name.trim()) return;

    const newEntry: LeaderboardEntry = {
      id: Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      college: college.trim() || 'Independent',
      accuracy: finalAccuracy,
      finalScore,
      date: new Date().toISOString().split('T')[0],
      goldenDataset: achievedGoldenDataset
    };

    const updatedList = [...leaderboard, newEntry];
    localStorage.setItem('wow_ai_leaderboard', JSON.stringify(updatedList));

    // Reload and rank
    const sorted = updatedList.sort((a, b) => b.finalScore - a.finalScore || b.accuracy - a.accuracy);
    const ranked = sorted.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    
    set({ leaderboard: ranked });
  }
}));
