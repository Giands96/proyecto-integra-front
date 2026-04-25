export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
  },
  CAMIONES: '/api/camiones',
  CARGAS: '/api/cargas',
  CHOFERES: '/api/empleados/chofer',
  EMPLEADOS: '/api/empleados/',
  OPERADORES: '/api/empleados/operador',
  CLIENTES: '/api/clientes',
  CLIENTES_PAGINADO: '/api/clientes/',
  CLIENTES_LISTAR: '/api/clientes/listar',
  CLIENTES_CREAR: '/api/clientes/crear',
  DESTINATARIOS: '/api/destinatarios',
  TERMINALES: '/api/terminales',
  CITAS: {
    BASE: '/api/citas',
    GUARDAR: '/api/citas/guardar',
    ACTUALIZAR_ESTADO: (idCita: number) => `/api/citas/${idCita}/estado`,
  }
};

export default API_ROUTES;
