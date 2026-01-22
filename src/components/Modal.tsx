"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 ">
      <div
        className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/60 "
        onClick={onClose}
      ></div>
      <div className="relative glass bg-white dark:bg-background w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border border-border animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-3 border-b border-border shrink-0">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-3 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}
