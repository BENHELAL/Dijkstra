import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="break-words text-xs font-black uppercase tracking-[0.16em] text-indigo-600 sm:tracking-[0.22em]">
          {eyebrow}
        </p>
        <h2 className="mt-2 break-words text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-3xl break-words text-sm font-semibold leading-6 text-slate-600 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
