import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth.service';

export function useAuth(redirectTo = '/login') {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    const checkAuth = () => {
      const authenticated = AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (!authenticated && redirectTo) {
        router.push(redirectTo);
      }
    };

    checkAuth();
  }, [redirectTo, router]);

  return { isAuthenticated };
}

export function useAuthRedirect(redirectPath = '/app') {
  const router = useRouter();

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    if (AuthService.isAuthenticated()) {
      router.push(redirectPath);
    }
  }, [redirectPath, router]);
}
