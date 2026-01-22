"use client";

import { Bus, Route, Users, Clock, User2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data
const buses = [
  { number: "101", status: "On Route", lastUpdated: "2 mins ago" },
  { number: "202", status: "Idle", lastUpdated: "5 mins ago" },
];

const routes = [
  { name: "North Campus", studentCount: 28 },
  { name: "South Campus", studentCount: 22 },
];

const students = Array(245).fill(null);
const teachers = Array(42).fill(null);

export default function DashboardPage() {
  const router = useRouter();

  const stats = [
    {
      label: "Total Buses",
      value: buses.length,
      icon: Bus,
      color: "text-cyan-400",
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      glowColor: "shadow-cyan-500/50",
      href: "/buses",
    },
    {
      label: "Total Routes",
      value: routes.length,
      icon: Route,
      color: "text-purple-400",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      glowColor: "shadow-purple-500/50",
      href: "/routes",
    },
    {
      label: "Total Students",
      value: students.length,
      icon: Users,
      color: "text-emerald-400",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      glowColor: "shadow-emerald-500/50",
      href: "/students",
    },
    {
      label: "Total Teachers",
      value: teachers.length,
      icon: User2,
      color: "text-amber-400",
      gradient: "from-amber-500 via-orange-500 to-red-500",
      glowColor: "shadow-amber-500/50",
      href: "/teachers",
    },
    {
      label: "Active Buses",
      value: buses.filter((b) => b.status === "On Route").length,
      icon: Zap,
      color: "text-pink-400",
      gradient: "from-pink-500 via-fuchsia-500 to-purple-500",
      glowColor: "shadow-pink-500/50",
      href: "/tracking",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Fleet Overview
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Real-time status of your school transportation
            </p>
          </div>

          <div className="text-right hidden md:block bg-linear-to-br from-indigo-500/20 to-purple-500/20  p-2 rounded-2xl border border-gray-200/20">
            <p className="text-lg font-black text-transparent bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text">
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-bold uppercase tracking-widest">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          {stats.map((stat, index) => (
            <button
              key={index}
              onClick={() => router.push(stat.href)}
              style={{ animationDelay: `${index * 100}ms` }}
              className="group relative overflow-hidden rounded-2xl p-3 shadow-lg bg-white dark:bg-gray-900/80  border border-gray-200 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            >
              {/* Gradient Background on Hover */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
              ></div>

              {/* Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

              <div className="relative z-10">
                <div
                  className={`inline-flex p-3 rounded-xl bg-linear-to-br ${stat.gradient} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 mb-4 shadow-lg ${stat.glowColor}`}
                >
                  <stat.icon size={20} className="text-white" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p
                    className={`text-4xl font-black ${stat.color} group-hover:scale-110 transition-transform duration-300 inline-block`}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>

              {/* Corner Accent */}
              <div
                className={`absolute top-0 right-0 w-20 h-20 bg-linear-to-br ${stat.gradient} opacity-10 rounded-bl-full`}
              ></div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Recent Activity */}
          <div className="shadow-lg relative overflow-hidden rounded-2xl p-2 bg-white dark:bg-gray-900/80  border border-gray-200">
            <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Recent Activity
                </h3>
                <button
                  onClick={() => router.push("/buses")}
                  className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {buses.map((bus, i) => (
                  <div
                    key={i}
                    style={{ animationDelay: `${i * 100}ms` }}
                    className="flex items-center space-x-4 p-3 rounded-xl bg-linear-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-700/50  border border-gray-200/10 hover:shadow-lg transition-all duration-300 hover:scale-102 animate-in fade-in slide-in-from-left-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                      <Clock size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        Bus{" "}
                        <span className="text-transparent bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text">
                          {bus.number}
                        </span>{" "}
                        updated status
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {bus.lastUpdated}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-lg ${
                        bus.status === "On Route"
                          ? "bg-linear-to-r from-emerald-400 to-teal-500 text-white shadow-emerald-500/50"
                          : bus.status === "Idle"
                            ? "bg-linear-to-r from-amber-400 to-orange-500 text-white shadow-amber-500/50"
                            : "bg-linear-to-r from-red-400 to-pink-500 text-white shadow-red-500/50"
                      }`}
                    >
                      {bus.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Route Insights */}
          <div className="relative overflow-hidden rounded-2xl p-2 bg-white dark:bg-gray-900/80  border border-gray-200 shadow-xl">
            <div className="absolute top-0 left-0 w-40 h-40 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-center gap-3 mb-4">
                <h3 className="text-lg font-black bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Route Insights
                </h3>

                <button
                  onClick={() => router.push("/routes")}
                  className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  View All
                </button>
              </div>

              <div className="space-y-5">
                {routes.map((route, i) => (
                  <div
                    key={i}
                    style={{ animationDelay: `${i * 100}ms` }}
                    className="space-y-3 p-3 rounded-xl bg-linear-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-700/50  border border-gray-200/10 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-right-4"
                  >
                    <div className="flex justify-between items-center">
                      <span
                        onClick={() => router.push("/routes")}
                        className="font-bold text-gray-900 dark:text-white hover:text-transparent hover:bg-linear-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text cursor-pointer transition-all duration-300"
                      >
                        {route.name}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white text-xs font-black shadow-lg shadow-indigo-500/50">
                        {route.studentCount} Students
                      </span>
                    </div>
                    <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="absolute inset-y-0 left-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg transition-all duration-1000 ease-out"
                        style={{ width: `${(route.studentCount / 30) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
