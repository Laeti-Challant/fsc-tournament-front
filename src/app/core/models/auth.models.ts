import { Role } from './user.models';

export interface RegisterDTO {
  email: string;
  pseudo: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  pseudo: string;
  role: Role;
}
