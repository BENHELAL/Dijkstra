import { Badge } from "./ui/Badge";
import { PremiumCard } from "./ui/PremiumCard";
import { SectionHeader } from "./ui/SectionHeader";

const slideDeck = {
  name: "Dijkstra.pptx",
  url: "materials/Dijkstra.pptx",
  size: "4.1 MB",
  type: "PowerPoint"
};

export function CourseMaterials() {
  return (
    <section className="max-w-3xl">
      <PremiumCard className="p-5">
        <SectionHeader
          eyebrow="Course materials"
          title="Your slide deck"
          description="Open the lesson PowerPoint here whenever you need the slides."
        />

        <div className="mt-5 rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="teal">Ready</Badge>
            <Badge tone="violet">{slideDeck.type}</Badge>
            <Badge tone="slate">{slideDeck.size}</Badge>
          </div>
          <h3 className="mt-4 text-2xl font-black text-slate-950">{slideDeck.name}</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            Use this deck alongside the simulator to review the idea, follow the example,
            and come back to the graph when you are ready to practice.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a className="control-button control-button-primary" href={slideDeck.url} download={slideDeck.name}>
              Download
            </a>
          </div>
        </div>
      </PremiumCard>
    </section>
  );
}
