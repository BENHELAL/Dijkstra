import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "indigo" | "blue" | "cyan" | "emerald" | "amber" | "slate" | "violet" | "teal" | "rose";
  className?: string;
}

const tones = {
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  slate: "border-slate-200 bg-slate-50 text-slate-600",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  teal: "border-teal-200 bg-teal-50 text-teal-800",
  rose: "border-rose-200 bg-rose-50 text-rose-700"
};

export function Badge({ children, tone = "indigo", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
