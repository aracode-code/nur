import { Button } from "../../components/ui/Button";
import { EmptyState, InlineNote, PageHeader } from "../../components/ui/States";

export default function SavedPage() {
  return (
    <>
      <PageHeader
        title="Tersimpan"
        description="Koleksi video yang Anda simpan untuk ditonton kembali."
      />

      <EmptyState
        title="Belum ada video tersimpan"
        description="Masuk untuk menyimpan video. Daftar tersimpan akan diambil dari GET /api/v1/me/saved-videos."
        action={<Button disabled>Masuk — Phase 2</Button>}
      />

      <div className="mt-6">
        <InlineNote>
          Halaman ini menampilkan state kosong yang jujur. Tidak ada data simpanan palsu dan tidak
          ada tombol yang mengaku berhasil tanpa API.
        </InlineNote>
      </div>
    </>
  );
}
