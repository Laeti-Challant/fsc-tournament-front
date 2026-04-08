export type Role = 'USER' | 'ADMIN';

export interface UserDTO {
  id: number;
  email: string;
  pseudo: string;
  role: Role;
  active: boolean;
}

export interface UserAdminUpdateDTO {
  role: Role;
  active: boolean;
}
