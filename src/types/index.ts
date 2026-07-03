export interface TrainingImage {
  id: string;
  src: string;
  label: 'cat' | 'dog' | 'reject';
  quality: {
    clarity: number; // 0-100
    relevance: number; // 0-100
    noise: number; // 0-100
    biasContribution: number; // 0-100 (e.g. imbalance contribution)
  };
  acceptIsCorrect: boolean;
  hint?: string;
}

export interface DatasetMetrics {
  estimatedAccuracy: number; // 20-98%
  datasetQuality: number; // 0-100%
  noise: number; // 0-100%
  bias: number; // 0-100%
  classBalance: number; // 0-100%
  precision: number; // 0-100%
  recall: number; // 0-100%
}

export interface LeaderboardEntry {
  id: string;
  rank?: number;
  name: string;
  college: string;
  accuracy: number; // percentage, e.g. 92
  finalScore: number;
  date: string;
  goldenDataset: boolean;
}

export type GameScreen =
  | 'home'
  | 'brief'
  | 'gameplay'
  | 'training'
  | 'result'
  | 'leaderboard';
