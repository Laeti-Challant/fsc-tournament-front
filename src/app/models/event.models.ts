export type EventStatus = 'PLANNED' | 'REGISTRATION_CLOSED' | 'IN_PROGRESS' | 'FINISHED';

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  PLANNED: 'Planifié',
  REGISTRATION_CLOSED: 'Inscriptions fermées',
  IN_PROGRESS: 'En cours',
  FINISHED: 'Terminé'
};

export interface EventSummary {
  id: number;
  name: string;
  eventDate: string;
  status: EventStatus;
}

export interface EventDetail extends EventSummary {
  registrationDeadline: string;
  maxParticipants: number;
  nbRounds: number;
  rules?: TournamentRules;
}

export interface EventCreateUpdate {
  name: string;
  eventDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  nbRounds: number;
}