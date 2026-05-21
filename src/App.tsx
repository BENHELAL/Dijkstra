import { useEffect, useMemo, useState, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ApplicationCards } from "./components/ApplicationCards";
import { Controls } from "./components/Controls";
import { CourseMaterials } from "./components/CourseMaterials";
import { Dashboard } from "./components/Dashboard";
import { ExplanationPanel } from "./components/ExplanationPanel";
import { FuturisticLayout, type SectionId } from "./components/FuturisticLayout";
import { Legend } from "./components/Legend";
import { Quiz } from "./components/Quiz";
import { RoadNetwork } from "./components/RoadNetwork";
import { RouteSummary } from "./components/RouteSummary";
import { ScenarioSelector } from "./components/ScenarioSelector";
import { SidePanel } from "./components/SidePanel";
import { defaultScenarioId, getScenarioById } from "./data/scenarios";
import { buildDijkstraSteps } from "./lib/dijkstra";

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");
  const scenario = useMemo(() => getScenarioById(defaultScenarioId), []);
  const steps = useMemo(() => buildDijkstraSteps(scenario), [scenario]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [routeReplayKey, setRouteReplayKey] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const currentStep = steps[stepIndex] ?? steps[0];
  const isFinalStep = currentStep.phase === "final";

  useEffect(() => {
    setIsPlaying(false);
    setStepIndex(0);
    setRouteReplayKey((key) => key + 1);
  }, [scenario.id]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setStepIndex((index) => Math.min(index + 1, steps.length - 1));
    }, 3000 / speed);

    return () => window.clearTimeout(timeout);
  }, [isPlaying, speed, stepIndex, steps.length]);

  const goNext = () => {
    setIsPlaying(false);
    setStepIndex((index) => Math.min(index + 1, steps.length - 1));
  };

  const goPrevious = () => {
    setIsPlaying(false);
    setStepIndex((index) => Math.max(index - 1, 0));
  };

  const reset = () => {
    setIsPlaying(false);
    setStepIndex(0);
    setRouteReplayKey((key) => key + 1);
  };

  const restartFinalRoute = () => {
    setIsPlaying(false);
    setStepIndex(steps.length - 1);
    setRouteReplayKey((key) => key + 1);
  };

  const renderPlanner = () => {
    const progress = Math.round((stepIndex / Math.max(steps.length - 1, 1)) * 100);
    const finalStep = steps[steps.length - 1];
    const previewRoute =
      finalStep?.finalPathNodes.length > 0
        ? finalStep.finalPathNodes.join(" -> ")
        : `${scenario.startNode} -> ${scenario.targetNode}`;
    const visitedLabel = currentStep.visited.length > 0 ? currentStep.visited.join(", ") : "None yet";

    return (
      <section className="grid gap-5">
        <ScenarioSelector selectedScenario={scenario} />

        <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="grid min-w-0 gap-5">
            <div className="relative overflow-hidden rounded-3xl border border-teal-100 bg-[linear-gradient(135deg,#f0fdfa_0%,#ffffff_45%,#ecfeff_100%)] p-3 shadow-[0_30px_90px_rgba(15,118,110,0.13)] sm:p-4">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-800 via-cyan-500 to-amber-400" />
              <div className="mb-4 flex flex-col gap-3 pt-2 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-700">
                    Smart City simulation
                  </p>
                  <h2 className="mt-1 text-2xl font-black leading-tight text-teal-950 sm:text-3xl">
                    Interactive weighted graph workspace
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
                    Watch Dijkstra choose the lowest battery-cost route while the table, edge
                    comparison, and final path update together.
                  </p>
                </div>
                <Legend />
              </div>

              <div className="rounded-[1.35rem] border border-white/80 bg-white/70 p-2 shadow-inner">
                <RoadNetwork
                  scenario={scenario}
                  step={currentStep}
                  playbackSpeed={speed}
                  routeReplayKey={routeReplayKey}
                  showDetails={showDetails}
                />
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-teal-100 bg-white/85 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-teal-700">
                    Lesson progress
                  </p>
                  <p className="mt-1 text-2xl font-black text-teal-950">{progress}%</p>
                </div>
                <div className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-700">
                    Visited nodes
                  </p>
                  <p className="mt-1 text-base font-black text-slate-950">{visitedLabel}</p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">
                    Target route
                  </p>
                  <p className="mt-1 text-base font-black text-slate-950">{previewRoute}</p>
                </div>
              </div>
            </div>

            <ExplanationPanel scenario={scenario} step={currentStep} />
          </div>

          <div className="grid content-start gap-4 2xl:sticky 2xl:top-28">
            <Controls
              canGoPrevious={stepIndex > 0}
              canGoNext={stepIndex < steps.length - 1}
              isPlaying={isPlaying}
              isFinalStep={isFinalStep}
              speed={speed}
              showDetails={showDetails}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onReset={reset}
              onNext={goNext}
              onPrevious={goPrevious}
              onSpeedChange={setSpeed}
              onRestartFinalRoute={restartFinalRoute}
              onToggleDetails={setShowDetails}
            />
            <SidePanel
              scenario={scenario}
              step={currentStep}
              stepIndex={stepIndex}
              totalSteps={steps.length}
              showDetails={showDetails}
            />
          </div>
        </section>

        <RouteSummary scenario={scenario} step={currentStep} />
      </section>
    );
  };

  const contentBySection: Record<SectionId, ReactElement> = {
    dashboard: (
      <Dashboard
        scenario={scenario}
        currentStep={currentStep}
        stepIndex={stepIndex}
        totalSteps={steps.length}
        onNavigate={setActiveSection}
      />
    ),
    planner: renderPlanner(),
    applications: <ApplicationCards />,
    quiz: <Quiz />,
    materials: <CourseMaterials />
  };

  return (
    <FuturisticLayout activeSection={activeSection} onNavigate={setActiveSection}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
        >
          {contentBySection[activeSection]}
        </motion.div>
      </AnimatePresence>
    </FuturisticLayout>
  );
}
