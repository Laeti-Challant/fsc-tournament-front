export interface AllowedInducement {
  id?: number;
  name: string;
  minQty: number;
  maxQty: number;
}

export interface RosterCategory {
  id?: number;
  raceName: string;
  categoryValue: number;
  isMinus: boolean;
}

export interface TournamentRules {
  id?: number;
  budgetPo: number;
  pspPool: number;
  maxSkillsPerPlayer: number;
  resurrectionMode: boolean;
  mogettePspValue: number;
  mogettePoValue: number;
  notesText?: string;
  rosterText?: string;
  inducements: AllowedInducement[];
  rosterCategories: RosterCategory[];
}

export interface TournamentRulesCreateUpdate extends Omit<TournamentRules, 'id'> {}