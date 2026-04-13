export type CoachStatus = 'PENDING' | 'VALIDATED' | 'REJECTED';
export type RosterStatus = 'NOT_SUBMITTED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface CoachSummary {
  id: number;
  coachPseudo: string;
  teamName: string;
  race: string;
}

// Vue admin / profil — CoachDetailDTO
export interface CoachDetail {
  id: number;
  coachPseudo: string;
  teamName: string;
  race: string;
  eating: string;
  vegetarian: boolean;
  status: CoachStatus;
  rosterStatus: RosterStatus;
  userId: number;
  userPseudo: string;
  userEmail: string;
}

// Inscription — CoachCreateDTO
export interface CoachCreate {
  coachPseudo: string;
  teamName: string;
  race: string;
  eating: string;
  vegetarian: boolean;
}

// Modification admin — CoachUpdateDTO
export interface CoachUpdate {
  coachPseudo: string;
  teamName: string;
  race: string;
  eating: string;
  vegetarian: boolean;
}
