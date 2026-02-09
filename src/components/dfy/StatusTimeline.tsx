const steps = ["new", "onboarding", "queued", "in_progress", "live"];

interface StatusTimelineProps {
  status: string;
}

export default function StatusTimeline({ status }: StatusTimelineProps) {
  const idx = Math.max(0, steps.indexOf(status));

  return (
    <div className="grid grid-cols-5 gap-2">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`border rounded-2xl p-3 text-center ${
            i <= idx ? "bg-black text-white" : "bg-white"
          }`}
        >
          <div className="text-xs uppercase tracking-wide opacity-80">
            {s.replace("_", " ")}
          </div>
        </div>
      ))}
    </div>
  );
}
