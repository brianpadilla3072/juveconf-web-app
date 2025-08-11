# API Documentation - Consagrados a Jesús

## Overview

This documentation describes the API architecture and configuration for the Consagrados a Jesús application, a Next.js-based event management system for religious events.

## Table of Contents

1. [Architecture](#architecture)
2. [Environment Configuration](#environment-configuration)
3. [Authentication System](#authentication-system)
4. [API Configuration](#api-configuration)
5. [Available Endpoints](#available-endpoints)
6. [Custom Hooks](#custom-hooks)
7. [Development Mode](#development-mode)

## Architecture

The application uses a RESTful API architecture with the following key components:

- **Frontend**: Next.js 14 with React 18
- **HTTP Client**: Axios with custom interceptors
- **Authentication**: JWT Bearer tokens
- **Payment Integration**: MercadoPago
- **State Management**: React Context + Custom Hooks

## Environment Configuration

### Environment Variables

The application uses multiple environment files:

#### `.env.local` / `.env`
```bash
# API Configuration for Development
NEXT_PUBLIC_API_URL=http://localhost:3072
SERVER_API=http://localhost:3072
NODE_ENV=development

# For production, use:
# NEXT_PUBLIC_API_URL=https://api.consagradosajesus.com
# SERVER_API=https://api.consagradosajesus.com
```

#### Next.js Configuration

Environment variables are exposed through `next.config.mjs`:

```javascript
const nextConfig = {
  env: {
    SERVER_API: process.env.SERVER_API,
  },
}
```

### API Base URLs

- **Development**: `http://localhost:3072`
- **Production**: `https://api.consagradosajesus.com`

## Authentication System

### JWT Token Management

The authentication system uses JWT tokens stored in localStorage with the following features:

#### AuthService (`lib/auth.service.ts`)

```typescript
const AuthService = {
  setToken(token: string): void
  getToken(): string | null
  removeToken(): void
  isAuthenticated(): boolean
  getUserFromToken(): any | null
  isTokenExpiringSoon(thresholdMinutes = 5): boolean
  updateProfile(userData: Partial<User>): Promise<User>
}
```

#### User Type Definition

```typescript
type User = {
  id: string;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  dni: string;
  role: string;
  provider: string;
  emailVerified: boolean;
}
```

#### AuthContext (`contexts/AuthContext.tsx`)

Provides global authentication state management:

```typescript
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<User>;
}
```

### Authentication Flow

1. **Login**: POST `/auth/login` → Returns `access_token`
2. **Token Storage**: Stored in localStorage as `auth_token`
3. **Auto-refresh**: Interceptor handles token refresh on 401 errors
4. **Profile Verification**: GET `/auth/profile` to validate token

## API Configuration

### Primary Instance (`lib/axios.config.ts`)

```typescript
const api = axios.create({
  baseURL: process.env.SERVER_API || 'https://api.consagradosajesus.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  timeout: 10000,
});
```

#### Features:
- **Automatic Token Injection**: Adds Bearer token to all requests
- **Token Refresh**: Automatically refreshes expired tokens
- **Error Handling**: Redirects to login on authentication failures

### Secondary Instance (`config/axiosInstance.ts`)

```typescript
const api = axios.create({
  baseURL: process.env.SERVER_API || "https://api.consagradosajesus.com",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});
```

#### Development Mode Fallback:
- Returns mock data when API is unavailable in development
- Provides sample data for `/combos` and `/events/current`

## Available Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PATCH /auth/profile` - Update user profile
- `POST /auth/refresh-token` - Refresh JWT token

### Events
- `GET /events/current` - Get current active events

### Combos
- `GET /combos` - Get available combo packages

### Orders
- `GET /orders/review` - Get orders pending review (requires auth)
- `PUT /orders/{orderId}/approve` - Approve an order (requires auth)

### Payments
- `POST /mercadopago/preference` - Create MercadoPago payment preference

### Transfers
- `POST /transfers/create-transfer-order` - Create transfer order

## Custom Hooks

### Event Management

#### `useQueryEvents()`
```typescript
const { events, isLoading, error } = useQueryEvents();
```
Fetches current events from `/events/current`.

### Combo Management

#### `useQueryCombos()`
```typescript
const { combos, isLoading, error } = useQueryCombos();
```
Fetches available combo packages from `/combos`.

### Order Management

#### `useOrdersInReview()`
```typescript
const { orders, loading, error, refetch } = useOrdersInReview();
```
Fetches orders pending review. Requires authentication.

#### `useApproveOrder()`
```typescript
const { approveOrder, isLoading, error, isSuccess, reset } = useApproveOrder();
```
Approves orders by ID. Requires authentication.

### Payment Integration

#### `useMercadoPago()`
```typescript
const { createPreference, loading, error } = useMercadoPago();
```
Creates MercadoPago payment preferences.

#### Payment Payload Interface:
```typescript
interface PaymentPayload {
  id: string;
  email: string;
  title: string;
  unit_price: number;
  quantity: number;
  minPersons: number;
  maxPersons?: number;
  attendees: Attendee[];
  eventId?: string;
}
```

### Transfer Management

#### `useTransferOrder()`
```typescript
const { createTransferOrder, loading, error, success } = useTransferOrder();
```
Creates transfer orders for event tickets.

## Development Mode

### Mock Data System

When the API is unavailable in development mode (`NODE_ENV=development`), the system provides fallback mock data:

#### Mock Combos:
```javascript
[
  { id: "1", name: "Combo Básico", minPersons: 1, maxPersons: 2, price: 500 },
  { id: "2", name: "Combo Familiar", minPersons: 2, maxPersons: 5, price: 1200 },
  { id: "3", name: "Combo Grupo", minPersons: 5, maxPersons: 10, price: 2000 }
]
```

#### Mock Event:
```javascript
{
  id: "event-2025",
  name: "Consagrados a Jesús 2025",
  startDate: "2025-09-19T09:00:00",
  endDate: "2025-09-20T21:00:00",
  isActive: true,
  venue: "Centro de Convenciones Bahía Blanca"
}
```

### Running in Development

```bash
npm run dev
```

The application will attempt to connect to `http://localhost:3072` but will fallback to mock data if the API is unavailable.

## Error Handling

### Global Error Handling

All API calls include comprehensive error handling:

1. **Network Errors**: Detected and handled with user-friendly messages
2. **Authentication Errors**: Automatic token refresh or redirect to login
3. **Validation Errors**: Server validation messages passed to UI
4. **Timeout Errors**: 10-second timeout on all requests

### Error Response Format

```typescript
interface ErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
}
```

## Security Features

1. **JWT Token Security**: Tokens stored in localStorage with expiration checks
2. **Automatic Token Refresh**: Prevents session timeouts
3. **Request Timeout**: 10-second timeout prevents hanging requests
4. **HTTPS Enforcement**: Production API uses HTTPS
5. **CORS Configuration**: Configured for specific origins

## Dependencies

### Core Dependencies
- `axios`: ^1.9.0 - HTTP client
- `js-cookie`: ^3.0.5 - Cookie management
- `next`: 14.2.16 - React framework
- `react`: ^18 - UI library

### Payment Dependencies
- `@mercadopago/sdk-react`: ^0.0.24 - MercadoPago integration
- `mercadopago`: ^2.5.0 - MercadoPago SDK

## Support

For API-related issues:
1. Check environment variables configuration
2. Verify API server is running on correct port
3. Check browser network tab for failed requests
4. Review console logs for detailed error messages

---

*Last updated: August 2025*