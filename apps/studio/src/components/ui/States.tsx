import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-[28px] font-bold leading-[34px] tracking-tight">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? <p className="mt-0.5 text-xs text-subtle">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function InlineNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-control border border-border bg-surface px-3 py-2 text-[11px] leading-relaxed text-subtle">
      {children}
    </p>
  );
}
