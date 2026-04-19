export interface Menu {
  id: number;
  label: string;
  description: string | null;
}

export interface MenuCreateUpdate {
  label: string;
  description: string | null;
}
