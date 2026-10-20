import { NavLink } from "react-router-dom";
import { Icon, type IconName } from "./Icon";

type NavItem = {
  to: string;
  label: string;
  icon: IconName;
  end?: boolean;
};

const learnItems: NavItem[] = [
  { to: "/", label: "Beranda", icon: "home", end: true },
  { to: "/jelajahi", label: "Jelajahi", icon: "compass" },
  { to: "/serial", label: "Serial", icon: "layers" },
];

const accountItems: NavItem[] = [
  { to: "/tersimpan", label: "Tersimpan", icon: "bookmark" },
  { to: "/profil", label: "Profil", icon: "user" },
];

function SidebarLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-control px-3 py-2.5 text-sm transition-colors",
          isActive
            ? "bg-surface-hover font-semibold text-text"
            : "text-muted hover:bg-surface hover:text-text",
        ].join(" ")
      }
    >
      <Icon name={item.icon} className="size-5 shrink-0" />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function DesktopSidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[var(--nur-layout-sidebar)] shrink-0 flex-col border-r border-border bg-surface/60 px-4 py-6 md:flex">
      <div className="flex items-center gap-3 px-2">
        <div className="grid size-10 place-items-center rounded-control bg-primary text-base font-bold text-primary-ink">
          N
        </div>
        <div className="leading-tight">
          <p className="text-base font-semibold tracking-wide">NUR</p>
          <p className="text-[11px] text-subtle">Platform belajar</p>
        </div>
      </div>

      <nav aria-label="Navigasi utama" className="mt-8 flex flex-col gap-6">
        <div>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">
            Ruang Belajar
          </p>
          <div className="flex flex-col gap-1">
            {learnItems.map((item) => (
              <SidebarLink key={item.to} item={item} />
            ))}
          </div>
        </div>

        <div>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">
            Ruang Kreator
          </p>
          <div
            className="flex items-center gap-3 rounded-control px-3 py-2.5 text-sm text-subtle"
            aria-disabled="true"
          >
            <Icon name="upload" className="size-5 shrink-0" />
            <span className="flex-1">Creator Studio</span>
            <span className="rounded-pill border border-border px-2 py-0.5 text-[10px]">
              Phase 5
            </span>
          </div>
        </div>

        <div>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">
            Akun
          </p>
          <div className="flex flex-col gap-1">
            {accountItems.map((item) => (
              <SidebarLink key={item.to} item={item} />
            ))}
          </div>
        </div>
      </nav>

      <div className="mt-auto rounded-card border border-border bg-surface p-3">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Icon name="spark" className="size-4 text-gold" />
          <span>UX Gate A — prototipe</span>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-subtle">
          Data demo, bukan produksi.
        </p>
      </div>
    </aside>
  );
}
