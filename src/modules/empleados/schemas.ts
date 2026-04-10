import { z } from "zod";

export const empleadoSchema = z.object({
  nombres: z.string().min(1, "Nombres es requerido"),
  apellidos: z.string().min(1, "Apellidos es requerido"),
  username: z.string().min(3, "Usuario es requerido"),
  password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres"),
  rol: z.enum(["ADMINISTRADOR", "OPERADOR", "CHOFER"], {
    message: "Rol es requerido",
  }),
});
