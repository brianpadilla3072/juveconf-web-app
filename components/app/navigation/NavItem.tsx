import Link from "next/link";
import { useNavigationStore } from "@/store/navigationStore";
import type { Module } from "@/store/navigationStore";
import type { ReactNode } from "react";
import clsx from "clsx"; // si no lo usás aún: npm i clsx

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  moduleKey: Module;
  onNavigate?: () => void;
}

export const NavItem = ({ href, icon, label, moduleKey, onNavigate }: NavItemProps) => {
  const activeModule = useNavigationStore((s) => s.activeModule);

  const isActive = activeModule === moduleKey;

  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (

      <Link
        href={href}
        onClick={handleClick}
        className={clsx(
          "flex items-center p-3 rounded-lg transition-colors",
          isActive
            ? "bg-gray-100 text-gray-800 font-semibold"
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        <div className={clsx("mr-3", isActive ? "text-violet-500" : "text-gray-500")}>
          {icon}
        </div>
        <span>{label}</span>
      </Link>
  );
};
