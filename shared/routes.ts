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
  DESTINATARIOS: '/api/destinatarios',
  TERMINALES: '/api/terminales',
  CITAS: {
    BASE: '/api/citas',
    DETALLES: '/api/citas/detalles',
    GUARDAR: '/api/citas/guardar',
    ACTUALIZAR_ESTADO: (idDetalle: number) => `/api/citas/${idDetalle}/estado`,
  }
};

export default API_ROUTES;
