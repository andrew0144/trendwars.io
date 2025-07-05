export type Player = {
  id: number;
  username: string;
  ready: boolean;
  score: number;
  rank: number;
  wordSubmittedThisTurn: boolean;
  bestWord: string;
  variant?: AvatarVariants;
  host: boolean;
  pointInc: number;
};

export enum AvatarVariants {
  MARBLE = 'marble',
  BEAM = 'beam',
  PIXEL = 'pixel',
  SUNSET = 'sunset',
  RING = 'ring',
  BAUHAUS = 'bauhaus',
}
