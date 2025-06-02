"use client";
import { ClientLoaderWrapper } from "./ClientLoaderWrapper";
import { Module, useNavigationStore } from "../../store/navigationStore";
import { useSyncActiveModule } from "@/hooks/useSyncActiveModule";
import type React from "react";
import { useState } from "react";
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { NavItem } from "@/components/app/navigation";
import { SyncModuleProvider } from "@/components/app/SyncModuleProvider";

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

  const handleLogout = () => {
    router.push("/login");
  };

  // Utilidad para capitalizar el módulo activo
  const getCapitalizedModule = (mod: string) =>
    mod.charAt(0).toUpperCase() + mod.slice(1);

  return (
    <ClientLoaderWrapper>
      <SyncModuleProvider>
            <div className="min-h-screen bg-gray-50">
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
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 text-orange-500 rounded-lg hover:bg-orange-50"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span className="font-medium">Cerrar sesión</span>
              </button>
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
      </div>
    </SyncModuleProvider>
    </ClientLoaderWrapper>

  );
}
