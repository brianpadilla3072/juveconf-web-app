"use client";
import { ClientLoaderWrapper } from "./ClientLoaderWrapper";
import { Module, useNavigationStore } from "../../store/navigationStore";
import { useSyncActiveModule } from "@/hooks/useSyncActiveModule";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Calendar,
  Package,
  ShoppingCart,
  Users,
  UserCheck,
  Settings,
  Menu,
  X,
  Mail,
  DollarSign,
  Tag,
  Utensils,
  Trophy,
  QrCode,
} from "lucide-react";
import { NavItem } from "@/components/app/navigation";
import { SyncModuleProvider } from "@/components/app/SyncModuleProvider";
import { UserMenu } from "@/components/app/UserMenu";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Logo } from "../components/Logo/Logo";
import { getBrandColor, ORG_NAME } from "@/lib/constants";
import { DrawerProvider } from "@/contexts/DrawerContext";
import GlobalDrawer from "@/components/GlobalDrawer/GlobalDrawer";
import { BuffetShell } from "@/components/meals/BuffetShell";
import { GlobalYearSelector } from "@/components/app/GlobalYearSelector";
import { GlobalEventSelector } from "@/components/app/GlobalEventSelector";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentEvent } from "@/hooks/Events/useCurrentEvent";
import {
  BUFFET_HOME_PATH,
  isBuffetOnlyRole,
  isBuffetPath,
  isMealsAdminRole,
} from "@/lib/roles";

const FullScreenSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
  </div>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSyncActiveModule(); // sincroniza con pathname actual
  const activeModule = useNavigationStore((s) => s.activeModule);
  const moduleLabels: Record<Module, string> = {
    '': 'Inicio',
    events: 'Eventos',
    combos: 'Combos',
    presales: 'Preventas',
    orders: 'Órdenes',
    payments: 'Pagos',
    invitees: 'Invitados',
    comidas: 'Comidas',
    equipos: 'Equipos',
    emails: 'Emails',
    finanzas: 'Finanzas',
    users: 'Usuarios',
    settings: 'Configuración',
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Comidas: se muestra según el rol (los admin siempre, para poder configurar los menús).
  // Buffet (colaboradores): solo si el evento actual tiene la configuración de comidas.
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading: isAuthLoading } = useAuth();
  const role = user?.role ?? null;
  const isBuffetOnly = isBuffetOnlyRole(role);
  const canSeeMealsNav = isMealsAdminRole(role);
  const canSeeBuffetNav = role === 'COLLABORATOR';
  const { hasMealConfig } = useCurrentEvent({ enabled: canSeeBuffetNav });

  // El rol BUFFET solo puede estar en el modo buffet
  useEffect(() => {
    if (isBuffetOnly && !isBuffetPath(pathname)) {
      router.replace(BUFFET_HOME_PATH);
    }
  }, [isBuffetOnly, pathname, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Espera al perfil para no mostrar el menú completo a un usuario BUFFET
  if (isAuthLoading) {
    return (
      <ClientLoaderWrapper>
        <FullScreenSpinner />
      </ClientLoaderWrapper>
    );
  }

  // Layout mínimo para BUFFET: sin sidebar, solo encabezado con cierre de sesión
  if (isBuffetOnly) {
    return (
      <ClientLoaderWrapper>
        <ProtectedRoute>
          <BuffetShell>
            {isBuffetPath(pathname) ? children : <FullScreenSpinner />}
          </BuffetShell>
        </ProtectedRoute>
      </ClientLoaderWrapper>
    );
  }

  return (
    <ClientLoaderWrapper>
      <SyncModuleProvider>
        <DrawerProvider>
          <div className="min-h-screen bg-gray-50">
            <ProtectedRoute>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}

        <aside
          className={`fixed top-0 left-0 z-30 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
          aria-label="Menú lateral"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Logo size={40} />
              <span className="font-bold text-xl" style={{ color: getBrandColor('accent') }}>
                {ORG_NAME}
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
                  onNavigate={closeSidebar}
                />
              </li>
              <li>
                <NavItem
                  href="/app/events"
                  icon={<Calendar className="h-5 w-5" />}
                  label="Eventos"
                  moduleKey="events"
                  onNavigate={closeSidebar}
                />
              </li>
              <li>
                <NavItem
                  href="/app/combos"
                  icon={<Package className="h-5 w-5" />}
                  label="Combos"
                  moduleKey="combos"
                  onNavigate={closeSidebar}
                />
              </li>
              <li>
                <NavItem
                  href="/app/presales"
                  icon={<Tag className="h-5 w-5" />}
                  label="Preventas"
                  moduleKey="presales"
                  onNavigate={closeSidebar}
                />
              </li>
              <li>
                <NavItem
                  href="/app/orders"
                  icon={<ShoppingCart className="h-5 w-5" />}
                  label="Órdenes"
                  moduleKey="orders"
                  onNavigate={closeSidebar}
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
                  onNavigate={closeSidebar}
                />
              </li>
              <li>
                <NavItem
                  href="/app/invitados"
                  icon={<UserCheck className="h-5 w-5" />}
                  label="Invitados"
                  moduleKey="invitees"
                  onNavigate={closeSidebar}
                />
              </li>
              {canSeeMealsNav && (
                <li>
                  <NavItem
                    href="/app/comidas"
                    icon={<Utensils className="h-5 w-5" />}
                    label="Comidas"
                    moduleKey="comidas"
                    onNavigate={closeSidebar}
                  />
                </li>
              )}
              {canSeeMealsNav && (
                <li>
                  <NavItem
                    href="/app/equipos"
                    icon={<Trophy className="h-5 w-5" />}
                    label="Equipos"
                    moduleKey="equipos"
                    onNavigate={closeSidebar}
                  />
                </li>
              )}
              {hasMealConfig && canSeeBuffetNav && (
                <li>
                  <NavItem
                    href="/app/comidas/buffet"
                    icon={<QrCode className="h-5 w-5" />}
                    label="Buffet"
                    moduleKey="comidas"
                    onNavigate={closeSidebar}
                  />
                </li>
              )}
              <li>
                <NavItem
                  href="/app/emails"
                  icon={<Mail className="h-5 w-5" />}
                  label="Emails"
                  moduleKey="emails"
                  onNavigate={closeSidebar}
                />
              </li>
              <li>
                <NavItem
                  href="/app/finanzas"
                  icon={<DollarSign className="h-5 w-5" />}
                  label="Finanzas"
                  moduleKey="finanzas"
                  onNavigate={closeSidebar}
                />
              </li>
              <li>
                <NavItem
                  href="/app/users"
                  icon={<Users className="h-5 w-5" />}
                  label="Usuarios"
                  moduleKey="users"
                  onNavigate={closeSidebar}
                />
              </li>
              <li>
                <NavItem
                  href="/app/settings"
                  icon={<Settings className="h-5 w-5" />}
                  label="Configuración"
                  moduleKey="settings"
                  onNavigate={closeSidebar}
                />
              </li>
            </ul>

            <div className="pt-8 mt-8 border-t">
              {/* Menú de usuario removido del menú lateral */}
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
                <div className="hidden md:flex items-center gap-2">
                  <GlobalYearSelector />
                  <GlobalEventSelector />
                </div>
                <button className="relative p-1 rounded-full hover:bg-gray-100 opacity-50 cursor-not-allowed" disabled>
                  <svg
                    className="h-6 w-6 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <span className="absolute top-0 right-0 w-4 h-4 bg-gray-400 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </button>
                <UserMenu />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
        </ProtectedRoute>
          <GlobalDrawer />
      </div>
        </DrawerProvider>
    </SyncModuleProvider>
    </ClientLoaderWrapper>

  );
}
