# CineApp

## Integrantes del grupo
- Joaquín Flores Fiorenza

## Requisitos para su ejecución
- Node.js (recomendado v16+)
- Yarn o npm
- Variables de entorno configuradas para Auth0 y la API backend

## Instrucciones de instalación y ejecución
1. Clona este repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd FinalSDFrontend
   ```
2. Instala las dependencias:
   ```bash
   yarn install
   # o
   npm install
   ```
3. Configura las variables de entorno necesarias en un archivo `.env`:

   - `VITE_AUTH0_DOMAIN`: Dominio de tu tenant de Auth0. Lo encuentras en el panel de Auth0, sección de aplicaciones, en la configuración de tu aplicación.

   - `VITE_AUTH0_CLIENT_ID`: ID de cliente de la aplicación registrada en Auth0. Disponible en la configuración de la aplicación en Auth0.

   - `VITE_AUTH0_CALLBACK_URL`: URL a la que Auth0 redirige después de autenticarse. Debe coincidir con la URL configurada en Auth0 (por ejemplo, `http://localhost:5173/callback` para desarrollo local).

   - `VITE_AUTH0_AUDIENCE`: Identificador de la API configurada en Auth0. Se usa para obtener tokens válidos para acceder a recursos protegidos. Lo defines al crear una API en Auth0.

   - `VITE_API_SERVER_URL`: URL base del backend/API que provee los datos de películas. Por ejemplo, `http://localhost:3000` si el backend corre localmente.

**¿Dónde obtener los valores?**
    - Todos los valores de Auth0 (`DOMAIN`, `CLIENT_ID`, `CALLBACK_URL`, `AUDIENCE`) se obtienen desde el dashboard de Auth0, en la sección de aplicaciones y APIs.
    - El valor de `VITE_API_SERVER_URL` depende de la URL donde esté corriendo tu backend (puede ser local o en la nube).

4. Ejecuta el proyecto en modo desarrollo:
   ```bash
   yarn dev
   # o
   npm run dev
   ```

## Tecnologías utilizadas
- React 18
- TypeScript
- Vite
- Auth0 (autenticación)
- React Router DOM
- Axios
- TailwindCSS
- ESLint

## Funcionalidades principales
- Autenticación de usuarios con Auth0.
- Roles de usuario: ADMIN y CLIENTE.
- Visualización de un catálogo público de películas.
- Los usuarios pueden gestionar su propia lista privada de películas.
- Los administradores pueden crear, editar y eliminar películas (panel de administración).
- Página de perfil de usuario.
- Navegación protegida según el rol.
- Interfaz moderna y responsiva.
