import { demoSeries } from "../../lib/demo-data";
import { DemoBadge } from "../../components/ui/Badges";
import { Button } from "../../components/ui/Button";
import { SeriesCard } from "../../components/ui/Cards";
import { InlineNote, PageHeader } from "../../components/ui/States";

export default function SeriesPage() {
  return (
    <>
      <PageHeader
        title="Serial"
        description="Rangkaian episode untuk belajar bertahap. Progres tersimpan setelah login aktif."
        actions={<DemoBadge />}
      />

      <div className="grid gap-3 md:grid-cols-2">
        {demoSeries.map((series) => (
          <SeriesCard
            key={series.id}
            title={series.title}
            description={series.description}
            episodes={series.episodes}
            completed={series.completed}
            category={series.category}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button disabled>Mulai serial — Phase 4</Button>
        <InlineNote>
          Tombol dinonaktifkan karena player dan progres serial belum terhubung ke API. Tidak ada
          aksi demo yang mengaku berhasil.
        </InlineNote>
      </div>
    </>
  );
}
