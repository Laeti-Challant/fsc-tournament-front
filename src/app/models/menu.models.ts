export interface Menu {
  id: number;
  label: string;
  description: string | null;
  displayOrder: number;
}

export interface MenuCreateUpdate {
  label: string;
  description: string | null;
  displayOrder?: number;
}
