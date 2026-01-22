"use client";

import React, { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Bus, ShieldCheck } from "lucide-react";

interface Particle {
  id: number;
  initial: { y: number; x: number };
  animate: { y: number[]; x: number[] };
  transition: { duration: number; repeat: number; delay: number };
}

const LoginBackground = () => {
  const [activeIcon, setActiveIcon] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Rotate icons for visual interest
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIcon((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const icons = [
    { icon: <Bus className="w-6 h-6" />, color: "text-blue-500" },
    { icon: <ShieldCheck className="w-6 h-6" />, color: "text-green-500" },
    { icon: <Sparkles className="w-6 h-6" />, color: "text-purple-500" },
  ];

  return (
    <>
      {/* Dynamic background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            initial={particle.initial}
            animate={particle.animate}
            transition={particle.transition}
          />
        ))}
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-linear-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-linear-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-1000 pointer-events-none"></div>
      <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-linear-to-r from-green-400 to-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse animation-delay-2000 pointer-events-none"></div>

      {/* Floating icons */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-10 right-10 p-3 bg-white/80 rounded-2xl shadow-2xl border border-gray-200/20 pointer-events-none"
      >
        <div className={icons[activeIcon].color}>{icons[activeIcon].icon}</div>
      </motion.div>

      {/* Bottom wave effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none"></div>
    </>
  );
};

export default memo(LoginBackground);
