import { z } from "zod";

export const choferSchema = z.object({
  username: z
    .string()
    .min(3, "Usuario requiere al menos 3 caracteres")
    .max(50, "Usuario no debe exceder 50 caracteres"),
  nombres: z
    .string()
    .min(1, "Nombres es requerido")
    .max(100, "Nombres no debe exceder 100 caracteres"),
  apellidos: z
    .string()
    .min(1, "Apellidos es requerido")
    .max(100, "Apellidos no debe exceder 100 caracteres"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(255, "La contraseña no debe exceder 255 caracteres")
    .optional()
    .or(z.literal("")),
});
