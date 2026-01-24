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
    <aside className="w-64 bg-gradient-primary text-white flex flex-col h-screen shadow-2xl fixed left-0 top-0 z-30">
      {/* Header */}
      <div className="p-3 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Bus className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">School Fleet</h1>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 ">
        <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4 px-3">
          Main Menu
        </p>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    relative flex items-center gap-3 px-4 py-3.5 rounded-2xl
                    transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-white text-primary shadow-xl font-semibold"
                        : "text-white/90 hover:bg-white/15 hover:translate-x-1"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-primary rounded-r-full" />
                  )}
                  <Icon
                    className={`w-5 h-5 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 space-y-3 border-t border-white/20">
        {/* User card */}
        <div className="bg-white/15  rounded-2xl p-2 shadow-lg">
          <div className="flex items-center justify-between gap-1">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user?.name?.[0]?.toUpperCase() || <User className="w-6 h-6" />}
            </div>

            <p className="font-semibold text-white truncate">
              {user?.name || "Admin User"}
            </p>

            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 p-2 rounded-2xl
                   bg-white/10 hover:bg-red-500 text-white
                   transition-all duration-200 font-medium hover:shadow-lg group"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
