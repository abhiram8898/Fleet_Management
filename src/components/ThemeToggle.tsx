"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="p-2.5 w-10 h-10 rounded-xl glass border border-transparent" />
    );

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl glass border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 group shadow-sm bg-white dark:bg-slate-900"
      aria-label="Toggle Theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun
          size={20}
          className="text-yellow-400 group-hover:rotate-45 transition-transform duration-500"
        />
      ) : (
        <Moon
          size={20}
          className="text-blue-600 group-hover:-rotate-12 transition-transform duration-500"
        />
      )}
    </button>
  );
}
