'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    const checkAuth = () => {
      if (!AuthService.isAuthenticated()) {
        router.push(redirectTo);
      }
    };

    checkAuth();
  }, [redirectTo, router]);

  // Mostrar un loader mientras se verifica la autenticación
  if (typeof window !== 'undefined' && !AuthService.isAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
