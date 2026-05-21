import { AnimatePresence, motion } from "framer-motion";
import type { DijkstraStep, GraphScenario } from "../types";
import { formatCost } from "../utils/format";

interface ExplanationPanelProps {
  scenario: GraphScenario;
  step: DijkstraStep;
}

function neighborText(step: DijkstraStep) {
  if (step.neighborIds.length === 0) {
    return "No neighbors are being checked in this step.";
  }

  return `Neighbors from ${step.currentNode}: ${step.neighborIds.join(", ")}.`;
}

function decisionText(step: DijkstraStep) {
  const update = step.candidateUpdate;

  if (!update) {
    if (step.phase === "select") {
      return step.selectedReason ?? "The smallest temporary cost is selected.";
    }
    return "No distance comparison is happening yet.";
  }

  const previous = formatCost(update.previousCost);
  return update.didImprove
    ? `${update.candidateCost} is smaller than ${previous}, so the neighbor is updated.`
    : `${update.candidateCost} is not smaller than ${previous}, so the table stays the same.`;
}

export function ExplanationPanel({ scenario, step }: ExplanationPanelProps) {
  return (
    <section className="glass-panel rounded-2xl px-4 py-4 sm:px-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-indigo-600">
              Beginner explanation
            </p>
            <h3 className="mt-1 text-lg font-black text-slate-950">{step.title}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 sm:text-base">
              {step.explanation}
            </p>
            <p className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/80 p-3 text-sm font-bold leading-6 text-indigo-950">
              {step.beginnerExplanation}
            </p>
          </div>

          <div className="grid gap-2">
            <div className="rounded-xl border border-slate-200 bg-white/85 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Selected node
              </p>
              <p className="mt-1 text-sm font-black text-slate-950">
                {step.currentNode ?? "Not selected yet"}
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
                {step.selectedReason ?? `The algorithm is preparing the ${scenario.weightLabel} table.`}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white/85 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Neighbor check
              </p>
              <p className="mt-1 text-sm font-bold leading-6 text-slate-700">{neighborText(step)}</p>
              <p className="mt-1 text-sm font-black text-violet-700">{decisionText(step)}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white/85 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Predecessor table
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
                {step.predecessorMeaning}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
