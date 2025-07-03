export type Player = {
  id: number;
  username: string;
  ready: boolean;
  score: number;
  rank: number;
  wordSubmittedThisTurn: boolean;
  bestWord: string;
  variant?: 'marble' | 'beam' | 'pixel' | 'sunset' | 'ring' | 'bauhaus';
  host: boolean
};
