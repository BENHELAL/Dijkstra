import type { ReactNode } from "react";

interface CalloutProps {
  title: string;
  children: ReactNode;
  tone?: "indigo" | "blue" | "cyan" | "emerald" | "amber" | "violet";
}

const toneClasses = {
  indigo: "border-indigo-100 bg-indigo-50/80 text-indigo-950",
  blue: "border-blue-100 bg-blue-50/80 text-blue-950",
  cyan: "border-cyan-100 bg-cyan-50/80 text-cyan-950",
  emerald: "border-emerald-100 bg-emerald-50/80 text-emerald-950",
  amber: "border-amber-100 bg-amber-50/80 text-amber-950",
  violet: "border-violet-100 bg-violet-50/80 text-violet-950"
};

export function Callout({ title, children, tone = "indigo" }: CalloutProps) {
  return (
    <div className={`rounded-2xl border p-4 ${toneClasses[tone]}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-70">{title}</p>
      <div className="mt-2 text-sm font-semibold leading-6">{children}</div>
    </div>
  );
}
