import { useMemo } from "react";
import type { DijkstraStep, GraphScenario, NodeId } from "../types";
import { formatCost } from "../utils/format";
import { Badge } from "./ui/Badge";
import { PremiumCard } from "./ui/PremiumCard";
import { SectionHeader } from "./ui/SectionHeader";

interface RouteSummaryProps {
  scenario: GraphScenario;
  step: DijkstraStep;
}

interface PathCandidate {
  nodes: NodeId[];
  cost: number;
}

function enumeratePaths(scenario: GraphScenario, limit = 8): PathCandidate[] {
  const paths: PathCandidate[] = [];

  const walk = (node: NodeId, nodes: NodeId[], cost: number) => {
    if (paths.length >= limit) return;
    if (node === scenario.targetNode) {
      paths.push({ nodes, cost });
      return;
    }

    const outgoing = scenario.edges.filter((edge) => edge.from === node);
    for (const edge of outgoing) {
      if (nodes.includes(edge.to)) continue;
      walk(edge.to, [...nodes, edge.to], cost + edge.weight);
    }
  };

  walk(scenario.startNode, [scenario.startNode], 0);
  return paths.sort((a, b) => a.cost - b.cost).slice(0, 3);
}

export function RouteSummary({ scenario, step }: RouteSummaryProps) {
  const activeEdge = scenario.edges.find((edge) => edge.id === step.activeEdgeId);
  const routeCandidates = useMemo(() => enumeratePaths(scenario), [scenario]);
  const finalRoute = step.finalPathNodes.length > 0 ? step.finalPathNodes.join(" -> ") : "Run to final step";

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <PremiumCard className="p-5">
        <SectionHeader
          eyebrow="Route summary"
          title="How the shortest path compares"
          description="Compare candidate routes and see why Dijkstra prefers the lowest total weight, even when another path looks direct."
        />
        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">Current final route</p>
            <p className="mt-2 text-lg font-black text-slate-950">{finalRoute}</p>
            <p className="mt-1 text-sm font-bold text-slate-600">
              Total {scenario.weightLabel}: {formatCost(step.finalCost ?? Infinity)}
            </p>
          </div>

          <div className="grid gap-2">
            {routeCandidates.map((candidate, index) => (
              <div key={candidate.nodes.join("-")} className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-black text-slate-900">
                    {candidate.nodes.join(" -> ")}
                  </p>
                  <Badge tone={index === 0 ? "emerald" : "slate"}>
                    cost {candidate.cost}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PremiumCard>

      <PremiumCard className="p-5">
        <SectionHeader
          eyebrow="Edge telemetry"
          title={activeEdge ? `${activeEdge.from} -> ${activeEdge.to}` : "No edge selected"}
          description="When an edge is evaluated, its metadata explains what the edge weight means in this scenario."
        />
        {activeEdge ? (
          <div className="mt-4">
            <p className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-4 text-sm font-semibold leading-6 text-slate-700">
              {activeEdge.interpretation}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {Object.entries(activeEdge.metadata).map(([key, value]) => (
                <div key={key} className="rounded-xl border border-slate-100 bg-white p-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{key}</p>
                  <p className="mt-1 text-sm font-black text-slate-800">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm font-semibold leading-6 text-slate-600">
            Start the algorithm or move to an edge relaxation step to inspect edge-specific context.
          </div>
        )}
      </PremiumCard>
    </section>
  );
}
