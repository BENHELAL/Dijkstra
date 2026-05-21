import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { DijkstraApplication } from "../data/applications";
import { Badge } from "./ui/Badge";

interface ApplicationDetailProps {
  application: DijkstraApplication;
}

function DetailBlock({
  title,
  children,
  tone = "indigo"
}: {
  title: string;
  children: ReactNode;
  tone?: "indigo" | "blue" | "cyan" | "emerald" | "amber" | "pink" | "violet";
}) {
  const colors = {
    indigo: "border-indigo-100 bg-indigo-50/75 text-indigo-700",
    blue: "border-blue-100 bg-blue-50/75 text-blue-700",
    cyan: "border-cyan-100 bg-cyan-50/75 text-cyan-700",
    emerald: "border-emerald-100 bg-emerald-50/75 text-emerald-700",
    amber: "border-amber-100 bg-amber-50/75 text-amber-700",
    pink: "border-rose-100 bg-rose-50/75 text-rose-700",
    violet: "border-violet-100 bg-violet-50/75 text-violet-700"
  };

  return (
    <div className={`rounded-2xl border p-4 ${colors[tone]}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.18em]">{title}</p>
      <div className="mt-2 text-sm font-semibold leading-6 text-slate-700">{children}</div>
    </div>
  );
}

export function ApplicationDetail({ application }: ApplicationDetailProps) {
  return (
    <motion.article
      key={application.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="glass-panel overflow-hidden rounded-3xl"
    >
      <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-blue-50 to-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-xl bg-white px-3 py-2 text-xs font-black text-indigo-700 shadow-sm ring-1 ring-indigo-100">
                {application.icon}
              </span>
              <Badge tone={application.difficulty === "Beginner" ? "emerald" : application.difficulty === "Intermediate" ? "blue" : "violet"}>
                {application.difficulty}
              </Badge>
              {application.tags.map((tag) => (
                <Badge key={tag} tone="slate">
                  {tag}
                </Badge>
              ))}
            </div>
            <h3 className="mt-3 text-3xl font-black text-slate-950">{application.title}</h3>
            <p className="mt-3 max-w-4xl text-sm font-semibold leading-6 text-slate-600">
              {application.shortExplanation}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 xl:grid-cols-[1fr_1fr]">
        <DetailBlock title="Key idea" tone="indigo">
          <p>{application.keyIdea}</p>
        </DetailBlock>

        <DetailBlock title="Beginner analogy" tone="violet">
          <p>{application.analogy}</p>
        </DetailBlock>

        <DetailBlock title="Where it is used" tone="emerald">
          <ul className="grid gap-2 sm:grid-cols-2">
            {application.whereUsed.map((use) => (
              <li key={use} className="rounded-xl border border-white/80 bg-white/80 px-3 py-2 shadow-sm">
                {use}
              </li>
            ))}
          </ul>
        </DetailBlock>

        <DetailBlock title="Real-life example" tone="amber">
          <p>{application.realLifeExample}</p>
        </DetailBlock>

        <DetailBlock title="Think like a graph" tone="blue">
          <p>{application.thinkLikeGraph}</p>
          <div className="mt-3 grid gap-2">
            <p>
              <span className="font-black text-blue-800">Nodes:</span> {application.graphModel.nodes}
            </p>
            <p>
              <span className="font-black text-blue-800">Edges:</span> {application.graphModel.edges}
            </p>
            <p>
              <span className="font-black text-blue-800">Weights:</span> {application.graphModel.weights}
            </p>
          </div>
        </DetailBlock>

        <DetailBlock title="Why Dijkstra helps" tone="cyan">
          <p>{application.whyUseful}</p>
        </DetailBlock>

        <DetailBlock title="Limitations" tone="pink">
          <p>{application.limitations}</p>
        </DetailBlock>

        <DetailBlock title="Mini challenge" tone="amber">
          <p>{application.miniChallenge}</p>
          <p className="mt-3 rounded-xl border border-amber-100 bg-white/75 p-3 font-black text-amber-800">
            Check your understanding: {application.checkPrompt}
          </p>
        </DetailBlock>
      </div>

      <div className="border-t border-slate-100 p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          Further reading
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {application.sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
            >
              {source.title}
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
