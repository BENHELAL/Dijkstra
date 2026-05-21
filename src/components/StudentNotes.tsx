import { useEffect, useState } from "react";
import type { GraphScenario } from "../types";
import { Button } from "./ui/Button";
import { PremiumCard } from "./ui/PremiumCard";
import { SectionHeader } from "./ui/SectionHeader";

interface StudentNotesProps {
  scenario: GraphScenario;
}

const keyForScenario = (scenarioId: string) => `dijkstra-notes-${scenarioId}`;

export function StudentNotes({ scenario }: StudentNotesProps) {
  const [notes, setNotes] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(keyForScenario(scenario.id)) ?? "";
    setNotes(stored);
    setSavedAt(stored ? "Loaded from this browser" : null);
  }, [scenario.id]);

  const updateNotes = (value: string) => {
    setNotes(value);
    window.localStorage.setItem(keyForScenario(scenario.id), value);
    setSavedAt(value.trim() ? new Date().toLocaleTimeString() : null);
  };

  const clearNotes = () => {
    setNotes("");
    window.localStorage.removeItem(keyForScenario(scenario.id));
    setSavedAt(null);
  };

  return (
    <PremiumCard className="p-5">
      <SectionHeader
        eyebrow="Your notes"
        title={`Your notes for ${scenario.shortTitle}`}
        description="Your notes are saved locally in this browser and organized by scenario."
        action={<Button onClick={clearNotes} disabled={!notes.trim()}>Clear notes</Button>}
      />

      <textarea
        className="dark-input mt-4 min-h-[170px] w-full resize-y rounded-2xl p-4 text-sm font-semibold leading-6"
        value={notes}
        onChange={(event) => updateNotes(event.target.value)}
        placeholder={`Prompts: What does ${scenario.weightLabel} mean? Why was the final route chosen? What would change if one edge became more expensive?`}
      />
      <p className="mt-2 text-xs font-bold text-slate-500">
        {savedAt ? `Saved locally: ${savedAt}` : "Start typing to save notes locally."}
      </p>
    </PremiumCard>
  );
}
