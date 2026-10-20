import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "gold";

const tones: Record<Tone, string> = {
  neutral: "border-border bg-surface text-muted",
  success: "border-primary/30 bg-primary/10 text-primary",
  warning: "border-gold/30 bg-gold/10 text-gold",
  danger: "border-danger/40 bg-danger/10 text-danger",
  gold: "border-gold/30 bg-gold/10 text-gold",
};

export function StatusBadge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-[11px] font-medium",
        tones[tone],
      ].join(" ")}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}

export function DemoBadge({ children = "Data demo" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-gold/30 bg-gold/10 px-2.5 py-1 text-[11px] font-medium text-gold">
      {children}
    </span>
  );
}
