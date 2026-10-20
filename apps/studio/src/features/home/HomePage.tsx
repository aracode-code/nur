import { Link } from "react-router-dom";
import { demoSeries, demoStats, demoVideos } from "../../lib/demo-data";
import { buttonClasses } from "../../components/ui/Button";
import { DemoBadge } from "../../components/ui/Badges";
import { SeriesCard, StatCard, VideoPosterCard } from "../../components/ui/Cards";
import { InlineNote, PageHeader, SectionHeader } from "../../components/ui/States";

export default function HomePage() {
  return (
    <>
      <PageHeader
        title="Beranda"
        description="Ruang belajar singkat: temukan, tonton, simpan, lalu lanjutkan serial."
        actions={<DemoBadge />}
      />

      <section
        className="relative overflow-hidden rounded-hero border border-border bg-surface p-6 md:p-8"
        style={{
          backgroundImage:
            "radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--nur-color-primary) 18%, transparent), transparent 58%)",
        }}
      >
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.08em] text-gold">
            NUR — belajar bertahap
          </p>
          <h2 className="mt-3 text-[32px] font-bold leading-[38px] tracking-tight">
            Satu video pendek, satu langkah belajar.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Konten terkurasi dengan sumber dan konteks. Mulai dari adab harian, lalu lanjutkan
            serial sesuai ritme Anda.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/jelajahi" className={buttonClasses("primary")}>
              Jelajahi katalog
            </Link>
            <Link to="/serial" className={buttonClasses("secondary")}>
              Lihat serial
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {demoStats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
        ))}
      </section>

      <section className="mt-8">
        <SectionHeader
          title="Lanjutkan serial"
          description="Progres akan tersambung ke API setelah autentikasi aktif."
          action={<DemoBadge />}
        />
        <div className="grid gap-3 md:grid-cols-2">
          {demoSeries.slice(0, 2).map((series) => (
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
      </section>

      <section className="mt-8">
        <SectionHeader
          title="Pilihan untuk Anda"
          description="Rekomendasi masih sederhana dan editorial, bukan ML."
          action={<DemoBadge />}
        />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {demoVideos.slice(0, 4).map((video) => (
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
        <div className="mt-4">
          <InlineNote>
            Konten di atas adalah data demo untuk memeriksa shell dan komponen. Tidak ada video,
            kreator, atau statistik produksi pada gate ini.
          </InlineNote>
        </div>
      </section>
    </>
  );
}
