"use client";
import { ClientLoaderWrapper } from "./ClientLoaderWrapper";
import { Module, useNavigationStore } from "../../store/navigationStore";
import { useSyncActiveModule } from "@/hooks/useSyncActiveModule";
import { useState, useEffect } from "react";
import {
  Flame,
  Home,
  Calendar,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  Bell,
  X,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { NavItem } from "@/components/app/navigation";
import { SyncModuleProvider } from "@/components/app/SyncModuleProvider";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useSyncActiveModule(); // sincroniza con pathname actual
  const activeModule = useNavigationStore((s) => s.activeModule);
  const moduleLabels: Record<Module, string> = {
    '': 'Inicio',
    events: 'Eventos',
    combos: 'Combos',
    orders: 'Órdenes',
    payments: 'Pagos',
    users: 'Usuarios',
    settings: 'Configuración',
  }
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { user, logout, isLoading: isAuthLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar la sesión');
    }
  };

  // Utilidad para capitalizar el módulo activo
  const getCapitalizedModule = (mod: string) =>
    mod.charAt(0).toUpperCase() + mod.slice(1);

  return (
    <ClientLoaderWrapper>
      <SyncModuleProvider>
            <div className="min-h-screen bg-gray-50">
        <ProtectedRoute>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        <aside
          className={`fixed top-0 left-0 z-30 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-orange-500" />
              <span className="font-bold text-xl text-orange-500">
                Consagrados
              </span>
            </div>
            <button
              className="p-1 rounded-full hover:bg-gray-100 md:hidden"
              onClick={toggleSidebar}
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <NavItem
                  href="/app"
                  icon={<Home className="h-5 w-5" />}
                  label="Inicio"
                  moduleKey=""

                />
              </li>
              <li>
                <NavItem
                  href="/app/events"
                  icon={<Calendar className="h-5 w-5" />}
                  label="Eventos"
                  moduleKey="events"
                />
              </li>
              <li>
                <NavItem
                  href="/app/combos"
                  icon={<Package className="h-5 w-5" />}
                  label="Combos"
                  moduleKey="combos"
                />
              </li>
              <li>
                <NavItem
                  href="/app/orders"
                  icon={<ShoppingCart className="h-5 w-5" />}
                  label="Órdenes"
                  moduleKey="orders"
                />
              </li>
              <li>
                <NavItem
                  href="/app/pagos"
                  icon={
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  }
                  label="Pagos"
                  moduleKey="payments"
                />
              </li>
              <li>
                <NavItem
                  href="/app/users"
                  icon={<Users className="h-5 w-5" />}
                  label="Usuarios"
                  moduleKey="users"
                />
              </li>
              <li>
                <NavItem
                  href="/app/settings"
                  icon={<Settings className="h-5 w-5" />}
                  label="Configuración"
                  moduleKey="settings"
                />
              </li>
            </ul>

            <div className="pt-8 mt-8 border-t">
              <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
                
                {isAuthLoading ? (
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1 pr-3 transition-colors">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={user.name} />
                          <AvatarFallback className="bg-orange-100 text-orange-600">
                            {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-700">
                          {user.givenName || 'Usuario'}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user.name || 'Usuario'}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/app/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <button
                    onClick={() => router.push('/login')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                  >
                    Iniciar sesión
                  </button>
                )}
              </div>
            </div>
          </nav>
        </aside>

        <div className="md:ml-64">
          <header className="bg-white shadow-lg sticky top-0 z-10">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center">
                <button
                  className="p-1 mr-4 rounded-full hover:bg-gray-100 md:hidden"
                  onClick={toggleSidebar}
                >
                  <Menu className="h-6 w-6 text-gray-500" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">
                {moduleLabels[activeModule]}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <button className="relative p-1 rounded-full hover:bg-gray-100">
                  <Bell className="h-6 w-6 text-gray-500" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </button>

                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
                    J
                  </div>
                  <span className="hidden md:block font-medium">Juan Pérez</span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
        </ProtectedRoute>
      </div>
    </SyncModuleProvider>
    </ClientLoaderWrapper>

  );
}
