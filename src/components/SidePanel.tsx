import { AnimatePresence, motion } from "framer-motion";
import type { DijkstraStep, GraphScenario, NodeId } from "../types";
import { formatCost } from "../utils/format";
import { Badge } from "./ui/Badge";

interface SidePanelProps {
  scenario: GraphScenario;
  step: DijkstraStep;
  stepIndex: number;
  totalSteps: number;
  showDetails: boolean;
}

function edgeLabel(edgeId?: string) {
  return edgeId ? edgeId.replace("-", " -> ") : "-";
}

function statusForNode(nodeId: NodeId, step: DijkstraStep) {
  if (step.currentNode === nodeId) return "current";
  if (step.finalPathNodes.includes(nodeId)) return "path";
  if (step.visited.includes(nodeId)) return "visited";
  if (step.updatedNode === nodeId) return "updated";
  return "open";
}

function rowClass(status: string) {
  if (status === "current") return "#dbeafe";
  if (status === "updated") return "#ecfdf5";
  if (status === "path") return "#fffbeb";
  if (status === "visited") return "#f0f9ff";
  return "#ffffff";
}

function updateMessage(step: DijkstraStep) {
  const update = step.candidateUpdate;

  if (!update) {
    if (step.phase === "final") {
      return "Follow predecessor links backward from the target to reconstruct the route.";
    }
    return "No edge is being relaxed in this step.";
  }

  const previous = formatCost(update.previousCost);

  if (step.phase === "relax-update") {
    return `Update: cost(${update.to}) = ${update.candidateCost}, previous(${update.to}) = ${update.from}`;
  }

  if (step.phase === "relax-skip") {
    return `No update: ${update.candidateCost} is not smaller than ${previous}.`;
  }

  return update.didImprove
    ? `Candidate improves the current cost of ${update.to}.`
    : `Candidate does not improve the current cost of ${update.to}.`;
}

function pipelineStage(step: DijkstraStep) {
  if (step.phase === "intro" || step.phase === "initialize") return 0;
  if (step.phase === "select" || step.phase === "explore") return 1;
  if (step.phase === "relax-update" || step.phase === "relax-skip") return 2;
  return 3;
}

const stageLabels = ["Start", "Select", "Compare", "Route"];

export function SidePanel({
  scenario,
  step,
  stepIndex,
  totalSteps,
  showDetails
}: SidePanelProps) {
  const activeEdge = scenario.edges.find((edge) => edge.id === step.activeEdgeId);
  const visitedText = step.visited.length > 0 ? step.visited.join(", ") : "None";
  const progress = Math.round((stepIndex / Math.max(totalSteps - 1, 1)) * 100);
  const activeStage = pipelineStage(step);

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-[0_18px_52px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-700">
            Learning feedback
          </p>
          <h2 className="mt-1 text-lg font-black leading-tight text-slate-950">
            Step {stepIndex + 1} / {totalSteps}
          </h2>
        </div>
        <Badge tone="teal">{step.phase.replace("-", " ")}</Badge>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-teal-800 via-cyan-500 to-amber-400"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {stageLabels.map((label, index) => (
          <div
            key={label}
            className={`rounded-xl border px-2 py-2 text-center text-[10px] font-black uppercase tracking-[0.1em] ${
              index <= activeStage
                ? "border-teal-100 bg-teal-50 text-teal-800"
                : "border-slate-100 bg-slate-50 text-slate-400"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={step.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24 }}
          className="mt-4 rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-3"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
            What happens now?
          </p>
          <p className="mt-2 text-base font-black leading-6 text-slate-950">
            {step.title}
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
            {step.beginnerExplanation}
          </p>
        </motion.section>
      </AnimatePresence>

      <section className="mt-3 rounded-2xl border border-cyan-100 bg-cyan-50/80 p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-700">
          Calculation
        </p>
        <p className="mt-2 font-mono text-sm font-black leading-6 text-teal-950">
          {step.calculation ?? step.selectedReason ?? "Select the unvisited node with the smallest known cost."}
        </p>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{updateMessage(step)}</p>
      </section>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-slate-200 bg-white/85 px-3 py-2">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
            Node
          </p>
          <p className="mt-1 text-xl font-black text-teal-700">{step.currentNode ?? "-"}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white/85 px-3 py-2">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
            Edge
          </p>
          <p className="mt-1 text-sm font-black text-violet-700">{edgeLabel(step.activeEdgeId)}</p>
        </div>
      </div>

      {showDetails && activeEdge && (
        <motion.section
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-xl border border-cyan-100 bg-cyan-50/80 p-3"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-700">
            Telemetry for {activeEdge.from} {"->"} {activeEdge.to}
          </p>
          <p className="mt-2 text-xs font-semibold leading-5 text-slate-700">
            {activeEdge.interpretation}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
            {Object.entries(activeEdge.metadata).map(([key, value]) => (
              <span key={key}>
                {key}: {value}
              </span>
            ))}
            <span>Edge weight: {activeEdge.weight}</span>
          </div>
        </motion.section>
      )}

      <section className="mt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-sm font-black text-slate-950">Cost table</h3>
          <span className="text-xs font-bold text-slate-500">Visited: {visitedText}</span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/90">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-3 py-2.5">Node</th>
                <th className="px-3 py-2.5">Minimum cost</th>
                <th className="px-3 py-2.5">Previous</th>
              </tr>
            </thead>
            <tbody>
              {scenario.nodes.map((node) => {
                const status = statusForNode(node.id, step);

                return (
                  <motion.tr
                    key={node.id}
                    layout
                    animate={{ backgroundColor: rowClass(status) }}
                    transition={{ duration: 0.28 }}
                    className="border-t border-slate-100"
                  >
                    <td className="px-3 py-2 font-black text-slate-900">{node.id}</td>
                    <td className="px-3 py-2 font-black text-slate-900">
                      {formatCost(step.costs[node.id])}
                    </td>
                    <td className="px-3 py-2 font-black text-slate-700">
                      {step.predecessors[node.id] ?? "-"}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {step.phase === "final" && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
            Final route
          </p>
          <p className="mt-2 text-base font-black text-slate-950">
            {step.finalPathNodes.join(" -> ")}
          </p>
          <p className="mt-1 font-mono text-sm font-black text-slate-800">
            Total {scenario.weightLabel}: {formatCost(step.finalCost ?? Infinity)}
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
            {scenario.finalInsight}
          </p>
        </motion.section>
      )}
    </aside>
  );
}
