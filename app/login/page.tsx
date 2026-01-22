"use client";

import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Bus, ShieldCheck } from "lucide-react";
import LoginBackground from "./components/LoginBackground";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-all duration-500">
      <LoginBackground />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.25 }}
        className="w-full max-w-md p-2 z-10"
      >
        <div className="relative bg-linear-to-br from-white to-white/90 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl border-2 border-gray-200/30 dark:border-gray-700/30  overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-purple-500"></div>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>

          <div className="p-3">
            {/* Logo section with animation */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center mb-4"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="relative"
                >
                  <div className="w-12 h-12 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Bus className="w-6 h-6 text-white" />
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
                </motion.div>
                <h1 className="text-4xl font-black bg-linear-to-r from-indigo-600 via-purple-600 to-purple-600 bg-clip-text text-transparent">
                  SCHOOL FLEET
                </h1>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-semibold text-gray-600 dark:text-gray-300 bg-linear-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent"
              >
                Power Up Your School Transportation!
              </motion.p>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Real-time tracking • Secure • Efficient</span>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-4">
                  <span className="flex items-center gap-2">
                    <span className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                      📧
                    </span>
                    Email Address
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none text-gray-800 dark:text-white placeholder:text-gray-400 shadow-lg hover:shadow-xl"
                    placeholder="admin@school.com"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-4">
                  <span className="flex items-center gap-2">
                    <span className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
                      🔒
                    </span>
                    Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 outline-none text-gray-800 dark:text-white placeholder:text-gray-400 shadow-lg hover:shadow-xl"
                    placeholder="••••••••"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <ShieldCheck className="w-4 h-4 text-purple-500" />
                  </div>
                </div>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-linear-to-r from-red-500/10 to-pink-500/10 border-2 border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold text-center "
                  >
                    ⚡ {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-linear-to-r from-indigo-600 via-purple-600 to-purple-700 hover:from-indigo-700 hover:via-purple-700 hover:to-purple-800 text-white font-black rounded-2xl transition-all duration-300 disabled:opacity-50 shadow-2xl shadow-indigo-500/30 relative overflow-hidden group"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <span className="flex items-center justify-center gap-3 relative z-10">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      LOGGING IN...
                    </>
                  ) : (
                    <>
                      <motion.span
                        animate={{ rotate: isHovered ? 360 : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        🚀
                      </motion.span>
                      Login
                      <motion.span
                        animate={{ x: isHovered ? 5 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        →
                      </motion.span>
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Credentials section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Demo Credentials:
                </p>
                <div className="text-xs font-mono bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                  admin@school.com / admin123
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
