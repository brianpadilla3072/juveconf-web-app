# Sistema de Autenticación

Este documento describe el sistema de autenticación implementado en la aplicación.

## Características

- Autenticación basada en JWT (JSON Web Tokens)
- Almacenamiento seguro de tokens en cookies HTTP-Only
- Protección de rutas
- Renovación automática de tokens
- Manejo de sesiones seguras

## Configuración

### Variables de Entorno

Copia el archivo `.env.local.example` a `.env.local` y configura las siguientes variables:

```env
# URL base de la API
NEXT_PUBLIC_API_URL=http://localhost:3072

# Configuración de cookies
NEXT_PUBLIC_AUTH_COOKIE_NAME=auth_token
NEXT_PUBLIC_AUTH_COOKIE_DOMAIN=localhost
NEXT_PUBLIC_AUTH_COOKIE_SECURE=false # Cambiar a true en producción con HTTPS
NEXT_PUBLIC_AUTH_COOKIE_SAME_SITE=strict
```

## Componentes Principales

### `AuthService`

Servicio que maneja toda la lógica de autenticación:

- `setToken(token, expiresInDays)`: Almacena el token JWT en una cookie segura
- `getToken()`: Obtiene el token JWT de las cookies
- `removeToken()`: Elimina el token de las cookies
- `isAuthenticated()`: Verifica si hay un token válido
- `getUserFromToken()`: Decodifica el token JWT para obtener los datos del usuario
- `isTokenExpiringSoon()`: Verifica si el token está próximo a expirar

### `ProtectedRoute`

Componente que protege las rutas que requieren autenticación:

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      {/* Contenido protegido */}
    </ProtectedRoute>
  );
}
```

### `useAuth` Hook

Hook personalizado para manejar la autenticación en componentes:

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { isAuthenticated } = useAuth();
  // ...
}
```

## Flujo de Autenticación

1. **Inicio de Sesión**
   - El usuario envía sus credenciales a `/auth/login`
   - El servidor valida las credenciales y devuelve un JWT
   - El token se almacena en una cookie HTTP-Only segura

2. **Solicitudes Autenticadas**
   - El interceptor de Axios añade automáticamente el token a las cabeceras
   - Si el token está próximo a expirar, se intenta renovar automáticamente

3. **Cierre de Sesión**
   - Se elimina el token de las cookies
   - Se redirige al usuario a la página de inicio de sesión

## Seguridad

- **HTTP-Only Cookies**: Previene el acceso al token desde JavaScript
- **SameSite=Strict**: Previene ataques CSRF
- **Secure Flag**: Obliga a usar HTTPS en producción
- **Renovación Automática**: Renueva el token antes de que expire
- **Protección de Rutas**: Impide el acceso a rutas protegidas sin autenticación
