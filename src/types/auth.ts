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
    nombres?: string;
    apellidos?: string;
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: string;
  nombres: string;
  apellidos: string;
}

export interface RegisterResponse {
  message: string;
}

export interface User {
  username: string;
  role: string;
}
