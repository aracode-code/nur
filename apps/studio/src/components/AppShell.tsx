import { Outlet } from "react-router-dom";
import DesktopSidebar from "./DesktopSidebar";
import MobileBottomNav from "./MobileBottomNav";
import Topbar from "./Topbar";

export default function AppShell() {
  return (
    <div className="min-h-dvh bg-bg text-text">
      <a
        href="#konten"
        className="sr-only rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Lewati ke konten
      </a>

      <div className="flex">
        <DesktopSidebar />

        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
          <Topbar />
          <main
            id="konten"
            className="flex-1 px-4 pb-28 pt-6 md:px-6 md:pb-10 lg:px-10 lg:pb-10"
          >
            <div className="mx-auto w-full max-w-[1280px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}
