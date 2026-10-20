import { NavLink } from "react-router-dom";
import { Icon, type IconName } from "./Icon";

const items: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: "/", label: "Beranda", icon: "home", end: true },
  { to: "/jelajahi", label: "Jelajahi", icon: "compass" },
  { to: "/serial", label: "Serial", icon: "layers" },
  { to: "/tersimpan", label: "Tersimpan", icon: "bookmark" },
  { to: "/profil", label: "Profil", icon: "user" },
];

export default function MobileBottomNav() {
  return (
    <nav
      aria-label="Navigasi utama mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-xl items-stretch justify-between px-2">
        {items.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center gap-1 px-1 py-2.5 text-[11px] transition-colors",
                  isActive ? "font-semibold text-primary" : "text-muted hover:text-text",
                ].join(" ")
              }
            >
              <Icon name={item.icon} className="size-5" />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
