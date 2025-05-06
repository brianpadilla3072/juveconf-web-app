# consagradosajesus

```
src/
│
├── app/                          # App Router (Next.js)
│   ├── (public)/landing/         # Landing pública del congreso
│   ├── (auth)/login/             # Autenticación
│   ├── (dashboard)/admin/        # Pantalla para ADMINs y superiores
│   ├── (dashboard)/user/         # Pantalla para USER y similares
│   └── layout.tsx                # Layout principal
│
├── screens/                      # Vistas agrupadas por contexto
│   ├── dashboard/                # Vistas para admin, user, etc.
│   ├── landing/                  # Vistas públicas
│   └── shared/                   # Pantallas comunes
│
├── entities/                     # Entidades del dominio (User, Entry, Donation)
│
├── use-cases/                   # Lógica de negocio desacoplada
│   ├── auth/
│   ├── payments/
│   └── entries/
│
├── infrastructure/              # Comunicación externa (APIs, Prisma, etc.)
│   ├── api/mercadopago/
│   ├── db/                      # Prisma o cualquier ORM
│   └── mail/                    # Envíos de correo
│
├── adapters/                    # Adaptadores entre infraestructura y casos de uso
│
├── services/                    # Servicios compartidos (auth, permisos, etc.)
│
├── middleware/                  # Middlewares para validación, roles, etc.
│
├── constants/                   # Constantes generales (roles, rutas, etc.)
│
├── types/                       # Tipado global (DTOs, interfaces)
│
└── utils/                       # Utilidades puras
``` 