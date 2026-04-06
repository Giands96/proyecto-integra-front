export interface LoginRequest {
  usuario: string;
  clave: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  usuario?: string;
  user?: {
    usuario?: string;
    username?: string;
    nombreCompleto?: string;
    email?: string;
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: string;
}

export interface User {
  username: string;
  role: string;
}
