export type PairingType = 'RANDOM' | 'SWISS';
export type RoundStatus = 'PENDING' | 'IN_PROGRESS' | 'FINISHED';

export interface Round {
  id: number;
  roundNumber: number;
  pairingType: PairingType;
  status: RoundStatus;
}

export interface RoundUpdate {
  status: RoundStatus;
}
