import api from "@/lib/axios";
import { LoginRequest, AuthResponse, RegisterRequest, RegisterResponse } from "@/types/auth";
import { API_ROUTES } from "../../../../shared/routes";

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials);
    return response.data;
  },
  register: async (data: RegisterRequest ): Promise<RegisterResponse> => {
    // Contrato de AuthController: usuario, clave, rol, nombres, apellidos.
    const payload = {
      usuario: data.username,
      clave: data.password,
      rol: data.role,
      nombres: data.nombres,
      apellidos: data.apellidos,
    };

    const response = await api.post<RegisterResponse>(API_ROUTES.AUTH.REGISTER, payload);
    return response.data;
  }
};
