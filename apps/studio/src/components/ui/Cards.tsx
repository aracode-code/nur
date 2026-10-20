import type { CSSProperties } from "react";

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <p className="text-xs text-subtle">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-muted">{hint}</p> : null}
    </div>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-pill bg-surface-hover"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label={label ?? "Progres"}
    >
      <div className="h-full rounded-pill bg-primary" style={{ width: `${clamped}%` }} />
    </div>
  );
}

type Accent = "primary" | "gold" | "danger";

const accents: Record<Accent, string> = {
  primary: "var(--nur-color-primary)",
  gold: "var(--nur-color-gold)",
  danger: "var(--nur-color-danger)",
};

export function VideoPosterCard({
  title,
  category,
  creator,
  duration,
  accent = "primary",
}: {
  title: string;
  category: string;
  creator: string;
  duration: string;
  accent?: Accent;
}) {
  const posterStyle: CSSProperties = {
    backgroundImage: `radial-gradient(circle at 28% 18%, color-mix(in srgb, ${accents[accent]} 22%, transparent), transparent 62%)`,
  };

  return (
    <article className="group rounded-card border border-border bg-surface p-3 transition-colors hover:bg-surface-hover">
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-[14px] border border-border bg-surface-raised"
        style={posterStyle}
        role="img"
        aria-label={`Poster demo untuk ${title}`}
      >
        <span className="absolute left-3 top-3 rounded-pill bg-bg/70 px-2 py-0.5 text-[10px] text-muted">
          {category}
        </span>
        <span className="absolute bottom-3 right-3 rounded-pill bg-bg/80 px-2 py-0.5 text-[10px] text-text">
          {duration}
        </span>
        <span className="absolute bottom-3 left-3 text-[10px] text-subtle">Player: Phase 4</span>
      </div>

      <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug">{title}</h3>
      <p className="mt-1 text-xs text-subtle">{creator}</p>
    </article>
  );
}

export function SeriesCard({
  title,
  description,
  episodes,
  completed,
  category,
}: {
  title: string;
  description: string;
  episodes: number;
  completed: number;
  category: string;
}) {
  const progress = episodes > 0 ? (completed / episodes) * 100 : 0;

  return (
    <article className="rounded-card border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.08em] text-subtle">{category}</p>
          <h3 className="mt-1 text-base font-semibold">{title}</h3>
        </div>
        <span className="rounded-pill border border-border px-2 py-0.5 text-[10px] text-muted">
          {episodes} episode
        </span>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-muted">{description}</p>

      <div className="mt-4 flex items-center gap-3">
        <ProgressBar value={progress} label={`Progres ${title}`} />
        <span className="shrink-0 text-[11px] text-subtle">
          {completed}/{episodes}
        </span>
      </div>
    </article>
  );
}
