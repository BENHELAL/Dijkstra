const legendItems = [
  { label: "Start", color: "bg-emerald-500" },
  { label: "Target", color: "bg-red-500" },
  { label: "Current", color: "bg-blue-600" },
  { label: "Visited", color: "bg-sky-300" },
  { label: "Evaluated edge", color: "bg-violet-600" },
  { label: "Optimal route", color: "bg-amber-500" }
];

export function Legend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 rounded-xl border border-slate-200 bg-white/85 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
      {legendItems.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
