import * as React from "react";
import { cn } from "../../lib/utils";

type BadgeTone = "neutral" | "cyan" | "green" | "amber" | "red" | "violet";

const tones: Record<BadgeTone, string> = {
  neutral: "border-white/10 bg-white/[0.06] text-slate-300",
  cyan: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100",
  green: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  amber: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  red: "border-rose-300/25 bg-rose-400/10 text-rose-100",
  violet: "border-violet-300/25 bg-violet-400/10 text-violet-100",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}
