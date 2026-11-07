import { TournamentRules } from './rules.models';

export type TournamentStatus = 'PLANNED' | 'REGISTRATION_CLOSED' | 'IN_PROGRESS' | 'FINISHED';

export const TOURNAMENT_STATUS_LABELS: Record<TournamentStatus, string> = {
  PLANNED: 'Planifié',
  REGISTRATION_CLOSED: 'Inscriptions fermées',
  IN_PROGRESS: 'En cours',
  FINISHED: 'Terminé',
};

export interface TournamentSummary {
  id: number;
  name: string;
  eventDate: string;
  status: TournamentStatus;
}

export interface TournamentDetail extends TournamentSummary {
  registrationDeadline: string;
  maxParticipants: number;
  nbRounds: number;
  location?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  featured: boolean;
  rules?: TournamentRules;
}

export interface TournamentCreateUpdate {
  name: string;
  eventDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  nbRounds: number;
  location?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  featured?: boolean;
}
