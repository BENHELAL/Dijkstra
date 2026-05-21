import type { GraphScenario } from "../types";
import { Badge } from "./ui/Badge";
import { Callout } from "./ui/Callout";
import { PremiumCard } from "./ui/PremiumCard";

interface ScenarioContextProps {
  scenario: GraphScenario;
}

export function ScenarioContext({ scenario }: ScenarioContextProps) {
  return (
    <PremiumCard className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{scenario.domain}</Badge>
        <Badge tone={scenario.difficulty === "Beginner" ? "emerald" : scenario.difficulty === "Intermediate" ? "blue" : "violet"}>
          {scenario.difficulty}
        </Badge>
      </div>

      <h2 className="mt-4 text-xl font-black leading-tight text-slate-950">{scenario.title}</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{scenario.description}</p>

      <div className="mt-4 grid gap-3">
        <Callout title="Objective" tone="indigo">
          {scenario.objective}
        </Callout>
        <Callout title="Learning goal" tone="emerald">
          {scenario.learningGoal}
        </Callout>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Think like a graph</p>
          <dl className="mt-3 grid gap-3 text-sm font-semibold leading-6 text-slate-700">
            <div>
              <dt className="font-black text-indigo-700">Nodes</dt>
              <dd>{scenario.nodesMeaning}</dd>
            </div>
            <div>
              <dt className="font-black text-blue-700">Edges</dt>
              <dd>{scenario.edgesMeaning}</dd>
            </div>
            <div>
              <dt className="font-black text-violet-700">Weights</dt>
              <dd>{scenario.weightsMeaning}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-700">Real-life interpretation</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
            {scenario.realLifeExample}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {scenario.tags.map((tag) => (
            <Badge key={tag} tone="slate">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </PremiumCard>
  );
}
