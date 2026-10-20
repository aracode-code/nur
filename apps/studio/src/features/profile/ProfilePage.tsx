import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/Badges";
import { InlineNote, PageHeader } from "../../components/ui/States";

const preferences = ["Ilmu Praktis", "Kisah", "Serial", "Bahasa Indonesia"];

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Profil"
        description="Identitas, preferensi minat, dan pengaturan privasi."
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-card border border-border bg-surface p-5">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-full bg-surface-raised text-lg font-semibold">
              T
            </div>
            <div>
              <h2 className="text-base font-semibold">Tamu</h2>
              <p className="mt-0.5 text-xs text-subtle">Belum masuk</p>
            </div>
            <div className="ml-auto">
              <StatusBadge tone="neutral">Tanpa sesi</StatusBadge>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button disabled>Masuk — Phase 2</Button>
            <Button variant="secondary" disabled>
              Buat akun
            </Button>
          </div>

          <div className="mt-5">
            <InlineNote>
              Autentikasi memakai managed auth melalui adapter (ADR-0005). Sampai provider dipilih,
              tidak ada form login palsu atau token demo yang disimpan di browser.
            </InlineNote>
          </div>
        </section>

        <section className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-base font-semibold">Preferensi minat</h2>
          <p className="mt-1 text-xs text-subtle">
            Preferensi akan disimpan melalui PATCH /api/v1/me/profile.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {preferences.map((item) => (
              <span
                key={item}
                className="rounded-pill border border-border bg-surface-raised px-3 py-1.5 text-xs text-muted"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-5">
            <Button variant="secondary" disabled>
              Simpan preferensi — Phase 4
            </Button>
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-card border border-border bg-surface p-5">
        <h2 className="text-base font-semibold">Keamanan & privasi</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>• Role dan permission diperiksa di backend, bukan dari tampilan.</li>
          <li>• Admin wajib MFA bila provider mendukung (ADR-0005).</li>
          <li>• Kebijakan retensi dan penghapusan akun menunggu OD-08.</li>
        </ul>
      </section>
    </>
  );
}
