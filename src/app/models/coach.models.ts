export type CoachStatus = 'PENDING' | 'VALIDATED' | 'REJECTED';
export type RosterStatus = 'NOT_SUBMITTED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface CoachSummary {
  id: number;
  coachPseudo: string;
  teamName: string;
  race: string;
  status: CoachStatus;
  rosterStatus: RosterStatus;
}

// Vue admin / profil - CoachDetailDTO
export interface CoachDetail {
  id: number;
  coachPseudo: string;
  teamName: string;
  race: string;
  eating: boolean;
  vegetarian: boolean;
  status: CoachStatus;
  rosterStatus: RosterStatus;
  rosterLink: string | null;
  substitute: boolean;
  userId: number;
  userPseudo: string;
  userEmail: string;
}

// Inscription - CoachCreateDTO
export interface CoachCreate {
  coachPseudo: string;
  teamName: string;
  race: string;
  eating: boolean;
  vegetarian: boolean;
}

// Modification - CoachUpdateDTO
export interface CoachUpdate {
  coachPseudo: string;
  teamName: string;
  race: string;
  eating: boolean;
  vegetarian: boolean;
  rosterLink: string | null;
}

// Modification admin - CoachAdminUpdateDTO
export interface CoachAdminUpdate {
  status: CoachStatus;
  rosterStatus: RosterStatus;
  substitute: boolean;
}
