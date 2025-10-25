# JuveConf - Juventud en Conferencia

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

-Preventa 
  1-Mayo  => Junio  : $16.000    // individual
 Promos    
- 3 entradas por $45.000 : 48.000
- 4 entradas por $58.000 : 64.000
- 5 entradas por $72.000 : 80.000
- 6 entradas + 1 gratis  : 96.000 (sin entrada de regalo $112.000)


 -Junio  => en adelante  : $18.000 // individual
-  Promos    
- 3 entradas por $50.000 : 54.000
- 4 entradas por $65.000 : 72.000
- 5 entradas por $82.000 : 90.000
- 6 entradas + 1 gratis  : 108.000 (sin entrada de regalo $126.000)


Accesos especiales
Acceso a "casa de oracion" : Gratis
acceso a " Plenaria Noche": $10.000
- - - - - - - - -  - - $ 15.000 X1 noche 
- - - - - - - - -  - - $ 18.000 X2 noches 