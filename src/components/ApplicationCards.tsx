import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { applications } from "../data/applications";
import { ApplicationDetail } from "./ApplicationDetail";
import { Badge } from "./ui/Badge";
import { PremiumCard } from "./ui/PremiumCard";
import { SectionHeader } from "./ui/SectionHeader";

const filters = ["All", "Smart City", "Networks", "Mobility", "AI", "Robotics", "Cloud"] as const;

export function ApplicationCards() {
  const [selectedId, setSelectedId] = useState(applications[0].id);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");

  const filteredApplications = useMemo(() => {
    if (activeFilter === "All") return applications;
    return applications.filter((application) => application.tags.includes(activeFilter));
  }, [activeFilter]);

  const selectedApplication =
    applications.find((application) => application.id === selectedId) ?? applications[0];

  return (
    <section className="grid gap-5">
      <div className="glass-panel rounded-3xl p-5">
        <SectionHeader
          eyebrow="Real-world applications"
          title="Shortest paths are everywhere."
          description="Each application explains the graph model, real-life use, limitations, mini challenge, and reliable sources."
        />

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full border px-3 py-2 text-xs font-black transition ${
                activeFilter === filter
                  ? "border-indigo-600 bg-indigo-600 text-white shadow-[0_14px_28px_rgba(79,70,229,0.22)]"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="grid max-h-[980px] gap-3 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-1">
          {filteredApplications.map((application, index) => {
            const isSelected = selectedApplication.id === application.id;

            return (
              <motion.button
                key={application.id}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.025 }}
                onClick={() => setSelectedId(application.id)}
                className="text-left"
              >
                <PremiumCard
                  className={`p-4 ${
                    isSelected ? "border-indigo-300 bg-indigo-50/70 shadow-[0_20px_48px_rgba(79,70,229,0.16)]" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xs font-black text-indigo-700 ring-1 ring-indigo-100">
                      {application.icon}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-black text-slate-950">{application.title}</p>
                        <Badge tone={application.difficulty === "Beginner" ? "emerald" : application.difficulty === "Intermediate" ? "blue" : "violet"}>
                          {application.difficulty}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                        {application.shortExplanation}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {application.tags.map((tag) => (
                          <Badge key={tag} tone="slate" className="px-2 py-0.5 text-[10px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </PremiumCard>
              </motion.button>
            );
          })}
        </div>

        <ApplicationDetail application={selectedApplication} />
      </div>
    </section>
  );
}
