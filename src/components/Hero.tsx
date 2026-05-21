import { motion } from "framer-motion";
import type { SectionId } from "./FuturisticLayout";
import { GlowCard } from "./GlowCard";

interface HeroProps {
  onNavigate: (section: SectionId) => void;
}

const objectives = [
  "Understand how Dijkstra chooses the next node",
  "Read cost and predecessor tables confidently",
  "Connect Smart City data to graph weights",
  "Test your knowledge with instant feedback"
];

const dashboardCards: { title: string; description: string; section: SectionId; accent: string }[] = [
  {
    title: "Learning scenarios",
    description: "Step through the Smart City graph with sensor-derived edge costs.",
    section: "planner",
    accent: "from-cyan-400/20"
  },
  {
    title: "Real-world applications",
    description: "Explore networks, robotics, logistics, transit, games, and cloud routing.",
    section: "applications",
    accent: "from-emerald-400/20"
  },
  {
    title: "Quiz & Practice",
    description: "Answer enriched questions, then try short coding exercises.",
    section: "quiz",
    accent: "from-amber-400/20"
  },
  {
    title: "Course materials",
    description: "Open the lesson slide deck directly from this site.",
    section: "materials",
    accent: "from-pink-400/20"
  }
];

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_0.82fr]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8"
      >
        <div className="absolute right-8 top-8 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-4 left-10 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative">
          <p className="cyber-badge inline-flex">Graph algorithms made clear</p>
          <h2 className="neon-title mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Watch Dijkstra think through the network.
          </h2>
          <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-slate-300 sm:text-lg">
            Dijkstra's algorithm finds the minimum-cost path through a weighted graph.
            In this lab, the Smart City example shows how sensor readings become route
            costs you can inspect, calculate, and explain.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              className="control-button control-button-primary px-5 py-3"
              onClick={() => onNavigate("planner")}
            >
              Start Learning
            </button>
            <button className="control-button px-5 py-3" onClick={() => onNavigate("applications")}>
              Explore Applications
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {objectives.map((objective, index) => (
              <div key={objective} className="rounded-2xl border border-cyan-300/10 bg-slate-900/65 p-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-xs font-black text-cyan-200">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 text-sm font-black leading-6 text-slate-100">{objective}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid gap-3"
      >
        {dashboardCards.map((card, index) => (
          <button key={card.title} onClick={() => onNavigate(card.section)} className="text-left">
            <GlowCard className={`relative overflow-hidden bg-gradient-to-br ${card.accent} to-slate-950/65 p-4`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-black text-white">{card.title}</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-300">{card.description}</p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-sm font-black text-cyan-100">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </GlowCard>
          </button>
        ))}
      </motion.div>
    </section>
  );
}
