import { useLocation } from "react-router-dom";
import { Icon } from "./Icon";

const labels: Record<string, string> = {
  "/": "Beranda",
  "/jelajahi": "Jelajahi",
  "/serial": "Serial",
  "/tersimpan": "Tersimpan",
  "/profil": "Profil",
};

export default function Topbar() {
  const { pathname } = useLocation();
  const current = labels[pathname] ?? "Beranda";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <span className="text-subtle">NUR</span>
          <span className="text-subtle" aria-hidden="true">
            /
          </span>
          <span className="truncate font-medium text-text" aria-current="page">
            {current}
          </span>
        </div>

        <button
          type="button"
          disabled
          aria-label="Pencarian katalog belum aktif pada gate ini"
          className="ml-auto hidden h-10 w-full max-w-sm items-center gap-2 rounded-control border border-border bg-surface px-3 text-left text-sm text-subtle lg:flex"
        >
          <Icon name="search" className="size-4" />
          <span className="truncate">Cari judul, topik, kreator</span>
          <span className="ml-auto rounded-pill border border-border px-2 py-0.5 text-[10px]">
            Phase 3
          </span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-pill border border-border px-2.5 py-1 text-[10px] font-medium text-gold sm:inline">
            Data demo
          </span>
          <div className="flex items-center gap-2 rounded-pill border border-border bg-surface px-2 py-1.5">
            <span className="grid size-7 place-items-center rounded-full bg-surface-raised text-xs font-semibold">
              T
            </span>
            <span className="hidden text-xs text-muted sm:inline">Tamu</span>
          </div>
        </div>
      </div>
    </header>
  );
}
