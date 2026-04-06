# Resumen de Cambios - Proyecto Integrador Ransa

## Backend (Spring Boot)

### Entidades y Modelos
- **Carga**: Se añadió el campo `codigo_seguimiento` para permitir el rastreo público de envíos.
- **Roles**: Se normalizaron los nombres de roles a `ADMIN`, `OPERADOR` y `CHOFER` para consistencia.

### Controladores REST (Nuevos)
- **ClienteController**: CRUD completo para la gestión de clientes.
- **CamionController**: CRUD completo para la gestión de camiones.
- **TerminalController**: CRUD completo para la gestión de terminales.
- **ChoferController**: CRUD completo para la gestión de choferes.
- **CargaController**: CRUD completo para la gestión de cargas (genera automáticamente el código de seguimiento).
- **PublicController**: Punto de enlace público `/api/public/tracking/{codigo}/{documento}` para el chatbot/rastreador.

### Seguridad (JWT)
- Se actualizó `SecurityConfig` para permitir acceso público a los endpoints de autenticación y al rastreador.
- Se normalizó el flujo de autenticación y se eliminaron los prefijos `ROLE_` en la lógica de seguridad para simplificar.

## Frontend (Next.js 14)

### Estructura del Proyecto
- Se implementó una **Arquitectura Modular** basada en características (Auth, Clientes, Cargas, etc.).
- Uso de **Zustand** para la persistencia del estado de autenticación (JWT).
- **Axios** configurado con interceptores para inyectar el token Bearer automáticamente.

### Páginas Implementadas
- **Login**: Formulario validado con Zod y shadcn/ui.
- **Dashboard Layout**: Sistema de navegación (Sidebar) protegido por autenticación.
- **Página de Tracking**: Interfaz pública para que los clientes consulten el estado de sus cargas usando su código y DNI/RUC.

### Tecnologías Clave
- Next.js 14 (App Router)
- React 18
- TypeScript
- Zod & React Hook Form
- Tailwind CSS & shadcn/ui
- Axios 1.13.5 (Específico)
