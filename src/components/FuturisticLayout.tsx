import { motion } from "framer-motion";
import type { ReactNode } from "react";

export type SectionId = "dashboard" | "planner" | "applications" | "quiz" | "materials";

interface FuturisticLayoutProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  children: ReactNode;
}

const navItems: { id: SectionId; label: string; short: string }[] = [
  { id: "dashboard", label: "Dashboard", short: "Home" },
  { id: "planner", label: "Learning Scenarios", short: "Scenarios" },
  { id: "applications", label: "Applications", short: "Apps" },
  { id: "quiz", label: "Quiz & Practice", short: "Practice" },
  { id: "materials", label: "Materials", short: "Slides" }
];

const CONTACT_EMAIL = "mehdi-salim.benhelal@u-paris.fr";

export function FuturisticLayout({
  activeSection,
  onNavigate,
  children
}: FuturisticLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-[linear-gradient(120deg,rgba(15,118,110,0.12),transparent_45%,rgba(14,165,233,0.10))]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-48 bg-[linear-gradient(0deg,rgba(251,191,36,0.10),transparent)]" />

      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <button className="group text-left" onClick={() => onNavigate("dashboard")}>
            <h1 className="text-xl font-black text-slate-950 sm:text-2xl">
              <span className="neon-title">Dijkstra</span> Learning Lab
            </h1>
          </button>

          <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white/85 p-1 shadow-sm">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative min-w-fit overflow-hidden rounded-xl px-3 py-2 text-sm font-black transition ${
                    isActive ? "text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-pill"
                      className="absolute inset-0 rounded-xl bg-teal-700 shadow-[0_12px_26px_rgba(15,118,110,0.25)]"
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 hidden sm:inline">{item.label}</span>
                  <span className="relative z-10 sm:hidden">{item.short}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>

      <footer className="relative z-10 mx-auto max-w-[1500px] px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/75 px-5 py-4 text-sm font-semibold text-slate-500 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <span>
            Dijkstra Learning Lab - interactive graph algorithms, scenarios, quiz practice, and local study materials.
          </span>
          <a
            className="font-black text-teal-700 transition hover:text-teal-950"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            Questions? Dr. BENHELAL - {CONTACT_EMAIL}
          </a>
        </div>
      </footer>
    </main>
  );
}
