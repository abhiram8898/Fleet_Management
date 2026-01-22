"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bus,
  Route as RouteIcon,
  Map,
  Users,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Students", href: "/students" },
  { icon: User, label: "Teachers", href: "/teachers" },
  { icon: Bus, label: "Buses", href: "/buses" },
  { icon: RouteIcon, label: "Routes", href: "/routes" },
  { icon: Map, label: "Map Tracking", href: "/tracking" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 z-30 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80  transition-all duration-300">
      {/* Header */}
      <div className="mb-4 p-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
            <Bus size={18} fill="currentColor" className="text-white/90" />
          </span>
          School Fleet
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="px-2 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Main Menu
        </div>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></div>
              )}

              <Icon
                size={20}
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                }`}
              />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-2 bg-gray-50/50 dark:bg-gray-800/10">
        {/* User card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white ring-2 ring-white dark:ring-gray-800 shadow-sm">
            {user?.name?.[0]?.toUpperCase() || <User size={18} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {user?.name || "User Administrator"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.role || "Fleet Manager"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
