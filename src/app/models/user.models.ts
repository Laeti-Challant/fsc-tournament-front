export type Role = 'USER' | 'ADMIN';

export interface UserDTO {
  id: number;
  email?: string;
  pseudo: string;
  role: Role;
  active: boolean;
}

export interface UserAdminUpdateDTO {
  role: Role;
  active: boolean;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
