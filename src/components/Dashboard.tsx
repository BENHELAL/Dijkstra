import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { applications } from "../data/applications";
import { quizQuestions } from "../data/quizQuestions";
import type { DijkstraStep, GraphScenario } from "../types";
import type { SectionId } from "./FuturisticLayout";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { PremiumCard } from "./ui/PremiumCard";
import { SectionHeader } from "./ui/SectionHeader";

interface DashboardProps {
  scenario: GraphScenario;
  currentStep: DijkstraStep;
  stepIndex: number;
  totalSteps: number;
  onNavigate: (section: SectionId) => void;
}

const quickCards: {
  title: string;
  icon: string;
  description: string;
  action: string;
  section?: SectionId;
  href?: string;
  tone: string;
  iconTone: string;
}[] = [
  {
    title: "Learning Scenarios",
    icon: "Map",
    description: "Study one focused Smart City example and run Dijkstra step by step.",
    action: "Open scenario",
    section: "planner",
    tone: "from-teal-50",
    iconTone: "bg-teal-700 text-white"
  },
  {
    title: "Real-World Applications",
    icon: "Use",
    description: "Connect the algorithm to networks, games, robotics, logistics, and transit.",
    action: "Explore cases",
    section: "applications",
    tone: "from-sky-50",
    iconTone: "bg-sky-600 text-white"
  },
  {
    title: "Quiz & Practice",
    icon: "Quiz",
    description: "Check understanding with instant feedback and explanations.",
    action: "Start quiz",
    section: "quiz",
    tone: "from-amber-50",
    iconTone: "bg-amber-500 text-slate-950"
  },
  {
    title: "Course Materials",
    icon: "File",
    description: "Open the slide deck for the Dijkstra lesson.",
    action: "Open slides",
    section: "materials",
    tone: "from-emerald-50",
    iconTone: "bg-emerald-600 text-white"
  },
  {
    title: "Questions & Support",
    icon: "Mail",
    description: "Ask course questions or send clarifications directly to Dr. BENHELAL.",
    action: "Email Dr. BENHELAL",
    href: "mailto:mehdi-salim.benhelal@u-paris.fr",
    tone: "from-cyan-50",
    iconTone: "bg-cyan-700 text-white"
  }
];

const CONTACT_EMAIL = "mehdi-salim.benhelal@u-paris.fr";
const focusTones = [
  "border-teal-100 bg-teal-50/80 text-teal-950",
  "border-sky-100 bg-sky-50/80 text-sky-950",
  "border-amber-100 bg-amber-50/80 text-amber-950",
  "border-violet-100 bg-violet-50/80 text-violet-950"
];

function readBestScoreLabel() {
  const rawScore = window.localStorage.getItem("dijkstra-best-score");
  const rawTotal = window.localStorage.getItem("dijkstra-best-total");

  if (!rawScore || Number(rawTotal) !== quizQuestions.length) {
    return null;
  }

  return `${rawScore}/${quizQuestions.length}`;
}

export function Dashboard({
  scenario,
  currentStep,
  stepIndex,
  totalSteps,
  onNavigate
}: DashboardProps) {
  const [bestScore, setBestScore] = useState<string | null>(null);
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);
  const previewApplications = useMemo(() => applications.slice(0, 3), []);

  useEffect(() => {
    setBestScore(readBestScoreLabel());
  }, []);

  return (
    <section className="grid gap-6">
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-teal-100 bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_45%,#fff7ed_100%)] p-6 shadow-[0_30px_90px_rgba(15,118,110,0.14)] sm:p-8"
        >
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-700 via-cyan-500 to-amber-400" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,118,110,0.08)_0%,transparent_34%,rgba(251,191,36,0.10)_100%)]" />
          <div className="relative">
            <Badge tone="teal">Interactive learning dashboard</Badge>
            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-teal-950 sm:text-6xl">
              Learn Dijkstra through clear simulations and real use cases.
            </h2>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-slate-600 sm:text-lg">
              Explore a weighted Smart City graph, watch each algorithm decision, connect
              sensor data to graph costs, and keep course materials in one
              polished learning workspace.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => onNavigate("planner")}>
                Open learning scenario
              </Button>
              <Button onClick={() => onNavigate("applications")}>Browse applications</Button>
              <a
                className="control-button border-teal-200 bg-teal-50/90 text-teal-900 hover:border-teal-300 hover:bg-white hover:text-teal-950"
                href={`mailto:${CONTACT_EMAIL}`}
              >
                Ask Dr. BENHELAL
              </a>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4">
          <PremiumCard className="border-teal-100 bg-gradient-to-br from-white via-teal-50/45 to-cyan-50/70 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">
              Continue learning
            </p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">{scenario.title}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Current step: <span className="font-black text-slate-950">{currentStep.title}</span>
            </p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-teal-700 via-cyan-500 to-indigo-500"
                initial={false}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-teal-100 bg-teal-50 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-teal-700">Progress</p>
                <p className="mt-1 text-xl font-black text-teal-900">{progress}%</p>
              </div>
              <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-600">Slides</p>
                <p className="mt-1 text-xl font-black text-cyan-700">Ready</p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-600">Quiz</p>
                <p className="mt-1 text-xl font-black text-amber-700">{bestScore ?? "Ready"}</p>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard className="border-emerald-100 bg-gradient-to-br from-white via-emerald-50/45 to-amber-50/60 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
              What you will practice
            </p>
            <div className="mt-3 grid gap-2">
              {scenario.learningFocus.map((focus, index) => (
                <div
                  key={focus}
                  className={`rounded-xl border p-3 text-sm font-bold ${
                    focusTones[index % focusTones.length]
                  }`}
                >
                  {focus}
                </div>
              ))}
            </div>
          </PremiumCard>
        </div>
      </div>

      <div>
        <SectionHeader
          eyebrow="Quick access"
          title="Choose your next learning action"
          description="Each module is connected: learn the concept, run the Smart City scenario, read applications, then practice."
        />
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <PremiumCard className={`h-full bg-gradient-to-br ${card.tone} to-white p-5`}>
                <div className="flex h-full flex-col">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-black shadow-sm ${card.iconTone}`}>
                    {card.icon}
                  </span>
                  <h3 className="mt-4 text-lg font-black text-slate-950">{card.title}</h3>
                  <p className="mt-2 flex-1 text-sm font-semibold leading-6 text-slate-600">
                    {card.description}
                  </p>
                  {card.href ? (
                    <a className="control-button mt-4 w-fit" href={card.href}>
                      {card.action}
                    </a>
                  ) : (
                    <Button className="mt-4 w-fit" onClick={() => card.section && onNavigate(card.section)}>
                      {card.action}
                    </Button>
                  )}
                </div>
              </PremiumCard>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <PremiumCard className="p-5">
          <SectionHeader
            eyebrow="Learning scenario preview"
            title={scenario.shortTitle}
            description={scenario.learningGoal}
            action={<Button onClick={() => onNavigate("planner")}>Open scenario</Button>}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Nodes</p>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{scenario.nodesMeaning}</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-600">Edges</p>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{scenario.edgesMeaning}</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-600">Weights</p>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{scenario.weightsMeaning}</p>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="p-5">
          <SectionHeader
            eyebrow="Application preview"
            title="See where Dijkstra appears"
            action={<Button onClick={() => onNavigate("applications")}>View all</Button>}
          />
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {previewApplications.map((application) => (
              <div key={application.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <Badge tone="blue">{application.difficulty}</Badge>
                <p className="mt-3 text-base font-black text-slate-950">{application.title}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  {application.shortExplanation}
                </p>
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>
    </section>
  );
}
