import { CoachSummary } from './coach.models';

export type MatchStatus = 'PENDING' | 'FINISHED';
export type MatchResult = 'WIN' | 'LOSS' | 'DRAW';

export interface Match {
  id: number;
  status: MatchStatus;
  coach1: CoachSummary;
  coach2: CoachSummary;
}

export interface MatchCreate {
  coach1Id: number;
  coach2Id: number;
}
