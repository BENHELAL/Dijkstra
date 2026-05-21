import type { GraphScenario } from "../types";
import { Badge } from "./ui/Badge";
import { SectionHeader } from "./ui/SectionHeader";

interface ScenarioSelectorProps {
  selectedScenario: GraphScenario;
}

export function ScenarioSelector({ selectedScenario }: ScenarioSelectorProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-teal-100 bg-white/85 p-5 shadow-[0_22px_70px_rgba(15,118,110,0.10)] backdrop-blur-2xl">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-800 via-cyan-500 to-amber-400" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
        <SectionHeader
          eyebrow="Learning scenario"
          title={selectedScenario.title}
          description={selectedScenario.description}
          action={<Badge tone="teal">Smart City example</Badge>}
        />

        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-2">
          <div className="grid grid-cols-3 divide-x divide-slate-200 overflow-hidden rounded-xl bg-white">
            <div className="px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-teal-700">
                Start
              </p>
              <p className="mt-1 text-2xl font-black text-slate-950">{selectedScenario.startNode}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-rose-700">
                Target
              </p>
              <p className="mt-1 text-2xl font-black text-slate-950">{selectedScenario.targetNode}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-700">
                Level
              </p>
              <p className="mt-1 text-base font-black text-slate-950">{selectedScenario.difficulty}</p>
            </div>
          </div>
          <p className="mt-3 px-2 text-sm font-bold leading-6 text-slate-600">
            Edge weight: <span className="text-teal-800">{selectedScenario.weightLabel}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {selectedScenario.learningFocus.slice(0, 3).map((focus) => (
          <span
            key={focus}
            className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-950"
          >
            {focus}
          </span>
        ))}
      </div>
    </section>
  );
}
