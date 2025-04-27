export type UserRole = 0 | 1;

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  tipo: UserRole;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}