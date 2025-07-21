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
   cd auth0frontend
   ```
2. Instala las dependencias:
   ```bash
   yarn install
   # o
   npm install
   ```
3. Configura las variables de entorno necesarias en un archivo `.env`:
   - `VITE_AUTH0_DOMAIN`
   - `VITE_AUTH0_CLIENT_ID`
   - `VITE_AUTH0_CALLBACK_URL`
   - `VITE_AUTH0_AUDIENCE`
   - `VITE_API_SERVER_URL`

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
