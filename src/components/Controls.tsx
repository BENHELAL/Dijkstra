import type { ChangeEvent } from "react";

interface ControlsProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  isPlaying: boolean;
  isFinalStep: boolean;
  showDetails: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSpeedChange: (speed: number) => void;
  onRestartFinalRoute: () => void;
  onToggleDetails: (show: boolean) => void;
}

export function Controls({
  canGoPrevious,
  canGoNext,
  isPlaying,
  isFinalStep,
  showDetails,
  speed,
  onPlay,
  onPause,
  onReset,
  onNext,
  onPrevious,
  onSpeedChange,
  onRestartFinalRoute,
  onToggleDetails
}: ControlsProps) {
  const handleSpeedChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSpeedChange(Number(event.target.value));
  };

  const handleDetailsChange = (event: ChangeEvent<HTMLInputElement>) => {
    onToggleDetails(event.target.checked);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      onPause();
      return;
    }
    onPlay();
  };

  return (
    <section className="rounded-2xl border border-teal-100 bg-white/90 p-4 shadow-[0_18px_52px_rgba(15,118,110,0.10)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-700">
            Controls
          </p>
          <h3 className="mt-1 text-lg font-black text-slate-950">Run the simulation</h3>
        </div>
        <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-black text-teal-800">
          {speed.toFixed(2)}x
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="control-button" onClick={onPrevious} disabled={!canGoPrevious}>
          Previous
        </button>
        <button className="control-button" onClick={onNext} disabled={!canGoNext}>
          Next
        </button>
        <button
          className="control-button control-button-primary col-span-2"
          onClick={togglePlayback}
          disabled={!isPlaying && !canGoNext}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button className="control-button" onClick={onReset}>
          Reset
        </button>
        <button className="control-button" onClick={onRestartFinalRoute} disabled={!isFinalStep}>
          Replay route
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        <label className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-black text-slate-700">Playback speed</span>
            <span className="text-sm font-black text-teal-700">{speed.toFixed(2)}x</span>
          </div>
          <input
            className="h-2 w-full accent-teal-700"
            type="range"
            min="0.5"
            max="1.75"
            step="0.25"
            value={speed}
            onChange={handleSpeedChange}
          />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3 text-sm font-black text-slate-700">
          <span>Show sensor details</span>
          <input
            type="checkbox"
            className="h-5 w-5 accent-cyan-600"
            checked={showDetails}
            onChange={handleDetailsChange}
          />
        </label>
      </div>
    </section>
  );
}
