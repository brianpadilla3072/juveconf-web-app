'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/app/components/Logo/Logo';
import { useAuth } from '@/contexts/AuthContext';

/** Layout mínimo para el rol BUFFET: sin sidebar, solo un encabezado con cierre de sesión */
export function BuffetShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-neutral-950/95 px-4 py-3 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <Logo size={32} />
          <span className="text-lg font-bold">Buffet</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden max-w-[160px] truncate text-sm text-white/60 sm:block">
            {user?.givenName || user?.name}
          </span>
          <Button
            variant="outline"
            className="h-10 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-xl p-3">{children}</main>
    </div>
  );
}

export default BuffetShell;
