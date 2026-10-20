import { useMemo, useState } from "react";
import { demoVideos } from "../../lib/demo-data";
import { DemoBadge } from "../../components/ui/Badges";
import { VideoPosterCard } from "../../components/ui/Cards";
import { Button } from "../../components/ui/Button";
import { EmptyState, InlineNote, PageHeader } from "../../components/ui/States";

const categories = ["Semua", "Ilmu Praktis", "Kisah", "Serial"] as const;
type Category = (typeof categories)[number];

export default function DiscoverPage() {
  const [active, setActive] = useState<Category>("Semua");

  const filtered = useMemo(
    () => (active === "Semua" ? demoVideos : demoVideos.filter((v) => v.category === active)),
    [active],
  );

  return (
    <>
      <PageHeader
        title="Jelajahi"
        description="Filter kategori bekerja di sisi klien untuk gate ini; API katalog aktif pada Phase 3."
        actions={<DemoBadge />}
      />

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter kategori">
        {categories.map((category) => {
          const selected = active === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(category)}
              className={[
                "h-9 rounded-pill border px-3 text-sm transition-colors",
                selected
                  ? "border-primary/40 bg-primary/15 font-semibold text-primary"
                  : "border-border bg-surface text-muted hover:bg-surface-hover hover:text-text",
              ].join(" ")}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            title="Belum ada video pada kategori ini"
            description="Coba kategori lain. Empty state ini sengaja dipertahankan agar perilaku data kosong teruji."
            action={
              <Button variant="secondary" onClick={() => setActive("Semua")}>
                Tampilkan semua
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((video) => (
              <VideoPosterCard
                key={video.id}
                title={video.title}
                category={video.category}
                creator={video.creator}
                duration={video.duration}
                accent={video.accent}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <InlineNote>
          Pencarian dan filter server-side belum aktif. Tombol pencarian di topbar dinonaktifkan
          secara sengaja sampai endpoint <code>GET /api/v1/search</code> tersedia.
        </InlineNote>
      </div>
    </>
  );
}
