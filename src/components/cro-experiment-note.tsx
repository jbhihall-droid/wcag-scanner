type CroExperimentNoteProps = {
  variantLabel: string;
};

export function CroExperimentNote({ variantLabel }: CroExperimentNoteProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-6 text-slate-300">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold text-cyan-200">Live CRO experiment · {variantLabel}</span>
        <span className="text-slate-400">Decision rule: minimum 200 visitors per variant and ≥15% uplift before calling a winner.</span>
      </div>
    </div>
  );
}
