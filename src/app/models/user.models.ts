export type Role = 'PLAYER' | 'ADMIN';

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

export interface UserUpdateEmailDTO {
  email: string;
  confirmPassword: string; //pas envoyé au back, juste pour la validation côté client
}

export interface UserUpdatePasswordDTO {
  newPassword: string;
  confirmPassword: string; //pas envoyé au back, juste pour la validation côté client
}

export interface UserUpdatePseudoDTO {
  pseudo: string;
}
