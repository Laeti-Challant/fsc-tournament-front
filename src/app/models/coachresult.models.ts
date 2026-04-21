import { MatchResult } from './match.models';
import { CoachParticipant } from './coach.models';

export interface CoachResult {
  id: number;
  result: MatchResult;
  touchdowns: number;
  casualties: number;
  objectives: number;
  bonusObjective: boolean;
  passes: number;
  foulActions: number;
  coach: CoachParticipant;
}

export interface CoachResultCreate {
  result: MatchResult;
  touchdowns: number;
  casualties: number;
  objectives: number;
  bonusObjective: boolean;
  passes: number;
  foulActions: number;
  coachId: number;
}

export interface MatchResultCreate {
  coach1Result: CoachResultCreate;
  coach2Result: CoachResultCreate;
}
