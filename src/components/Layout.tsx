import { motion } from "framer-motion";
import type { ReactNode } from "react";

export type SectionId = "dashboard" | "planner" | "applications" | "quiz" | "materials";

interface LayoutProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  children: ReactNode;
}

const navItems: { id: SectionId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "planner", label: "Learning Scenarios" },
  { id: "applications", label: "Applications" },
  { id: "quiz", label: "Quiz & Practice" },
  { id: "materials", label: "Materials" }
];

export function Layout({ activeSection, onNavigate, children }: LayoutProps) {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <button className="text-left" onClick={() => onNavigate("dashboard")}>
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-blue-600">
              Interactive learning tool
            </p>
            <h1 className="text-xl font-black text-slate-950 sm:text-2xl">
              Dijkstra Learning Lab
            </h1>
          </button>

          <nav className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-black transition ${
                    isActive ? "text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-pill"
                      className="absolute inset-0 rounded-full bg-slate-950"
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
}
