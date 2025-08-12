"use client";
import { ClientLoaderWrapper } from "./ClientLoaderWrapper";
import { Module, useNavigationStore } from "../../store/navigationStore";
import { useSyncActiveModule } from "@/hooks/useSyncActiveModule";
import { useState } from "react";
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
} from "lucide-react";
import { NavItem } from "@/components/app/navigation";
import { SyncModuleProvider } from "@/components/app/SyncModuleProvider";
import { UserMenu } from "@/components/app/UserMenu";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Logo } from "../components/Logo/Logo";

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
    orders: 'Órdenes',
    payments: 'Pagos',
    invitees: 'Invitados',
    users: 'Usuarios',
    settings: 'Configuración',
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ClientLoaderWrapper>
      <SyncModuleProvider>
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
                  href="/app/invitados"
                  icon={<UserCheck className="h-5 w-5" />}
                  label="Invitados"
                  moduleKey="invitees"
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
      </div>
    </SyncModuleProvider>
    </ClientLoaderWrapper>

  );
}
