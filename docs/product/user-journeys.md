# NUR — User Journeys

**Status:** baseline Phase 1 (2026-10-20)
**Sumber:** HLD §7/§26, LLD §9, `route-permission-matrix.md`

Setiap journey mencantumkan langkah, API, state UI, dan jalur gagal yang wajib diuji.

## J1 — Menemukan dan menonton

**Aktor:** visitor/user
**Prasyarat:** ada video `approved+published`.

1. Buka Beranda → `GET /feed?limit=10`.
2. Scroll → cursor berikutnya.
3. Pilih video → `GET /videos/{id}` + `GET /playback`.
4. Player memuat media dari provider/CDN.
5. Client mengirim `video_started`, `video_progress` (throttled), `video_completed`.

**State UI:** loading skeleton feed; empty ("belum ada konten"); error + retry; playback error + retry; unauthorized tidak berlaku (publik).
**Gagal:** video tidak published → `404`; playback ref kedaluwarsa → refetch; provider down → pesan + retry, bukan success palsu.

## J2 — Simpan dan bagikan

**Aktor:** user
**Prasyarat:** login.

1. Tekan Simpan → `PUT /me/saved-videos/{id}`.
2. UI menunggu respons; baru menampilkan status tersimpan.
3. Buka Tersimpan → `GET /me/saved-videos`.
4. Bagikan → share sheet dengan deep link; tanpa data pribadi.

**State:** submitting, saved, error, unauthorized (arahkan login).
**Gagal:** `409`/network → rollback optimistic UI; unsave idempotent.

## J3 — Melanjutkan serial

**Aktor:** user
**Prasyarat:** serial dan episode published.

1. Dari video, buka `GET /series/{id}`.
2. Lihat daftar episode + progress (`GET /me/watch-progress`).
3. Selesaikan episode → `PUT /me/watch-progress/{video_id}`.
4. CTA "Lanjutkan" → episode berikutnya yang published.
5. Event `series_episode_completed`, `series_continuation`.

**State:** progress loading, episode terkunci (bila konsep disetujui), empty, error.
**Gagal:** episode berikutnya belum published → CTA "Segera hadir", bukan link mati.

## J4 — Upload sampai publikasi (kreator + reviewer)

**Aktor:** creator, reviewer, admin
**Prasyarat:** creator aktif; media provider adapter tersedia (mock di dev).

1. Creator `POST /creator/videos` (draft).
2. Isi metadata, kategori, sumber, deklarasi hak → `PATCH`.
3. `POST /upload-intent` → upload langsung ke provider.
4. Webhook provider (signature) → status media `ready_for_review`.
5. `POST /submit-review` dengan `expected_version`.
6. Reviewer membuka queue → `GET /review-context`.
7. Keputusan `approve|request_revision|reject|escalate`.
8. Publish eksplisit oleh `publish:execute`.
9. Video muncul di feed/search.

**State creator:** draft, uploading, processing, ready, submitted, revision, approved, published, rejected, taken_down.
**Gagal:** media gagal → retry; webhook invalid → ditolak; metadata kurang → 422 dengan field; versi konflik → 409; creator tidak pernah bisa publish.

## J5 — Laporan, takedown, banding

**Aktor:** user, moderator, creator

1. User `POST /videos/{id}/reports` (reason code).
2. Risk triage → case dibuat/ditautkan.
3. Severity tinggi → restrict sementara.
4. Moderator memutuskan: no violation / correct / restrict / takedown.
5. Perubahan publication status + outbox purge dalam satu transaksi.
6. Creator menerima status in-app dan dapat mengajukan banding.
7. Reviewer berbeda memutuskan banding.

**State:** report submitted, case open/investigating/restricted/resolved, appeal submitted/under_review/upheld/overturned/closed.
**Gagal:** report spam → rate limit; takedown purge gagal → alert + retry; keputusan tanpa reason code → 422.

## J6 — Status kreator & analitik

**Aktor:** creator

1. Buka dashboard → `GET /creator/videos` + `GET /creator/analytics/summary`.
2. Lihat status review dan alasan revisi.
3. Perbaiki draft → submit ulang.
4. Ringkasan performa hanya data milik sendiri dan agregat.

**State:** loading, empty ("belum ada konten"), error, unauthorized.
**Gagal:** data analytics tertunda → tampilkan "diperbarui <waktu>", bukan angka palsu.

## Matriks cakupan journey → phase

| Journey | Phase | Gate |
|---|---|---|
| J1 Menonton | 3–4 | hanya published bisa diputar |
| J2 Simpan/bagikan | 4 | E2E core journey |
| J3 Serial | 4 | continuation terukur |
| J4 Upload→publish | 5–6 | creator tidak bisa publish |
| J5 Report→appeal | 6 | audit + least privilege |
| J6 Status kreator | 5 | status dari backend |

## Aturan lintas journey

- Tidak ada toast sukses sebelum API berhasil.
- Setiap layar pengambil data punya loading/empty/error/unauthorized.
- Data mock hanya di dev/storybook dengan label.
- Semua aksi sensitif diaudit dan diperiksa backend.
