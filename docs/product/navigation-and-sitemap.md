# NUR — Navigation & Sitemap

**Status:** baseline Phase 1 (2026-10-20)
**Sumber:** HLD §26, HLD §28.4, LLD §13, ADR-0008

Setiap node diberi status `MVP`, `POST-MVP`, atau `OPEN`. Node bukan janji implementasi sprint; scope tetap mengikuti HLD.

## 1. Keputusan navigasi (konflik HLD diselesaikan)

HLD §26.1 mengusulkan `Beranda, Shorts, Kelas & Kajian, Tersimpan, Profil`; HLD §28.4 (referensi visual yang disetujui, bagian lebih baru) menetapkan bottom navigation `Beranda, Jelajahi, Serial, Tersimpan, Profil`.

**Keputusan default:** ikuti **§28.4**.

| Tab | Route | Alasan |
|---|---|---|
| Beranda | `/` | feed pilihan + lanjutkan serial |
| Jelajahi | `/jelajahi` | katalog + filter + search entry |
| Serial | `/serial` | learning journey |
| Tersimpan | `/tersimpan` | retensi |
| Profil | `/profil` | akun, preferensi, bantuan |

Search bukan tab utama; diakses dari header Beranda/Jelajahi. "Shorts" dan "Kelas & Kajian" melebur ke Beranda/Jelajahi/Serial.

## 2. Mobile app

| Node | Route | Status | Akses | Sumber data |
|---|---|---|---|---|
| Beranda | `/` | MVP | publik | `GET /feed`, `GET /series` |
| Jelajahi | `/jelajahi` | MVP | publik | `GET /feed?category_id`, `GET /categories`, `GET /search` |
| Pencarian | `/jelajahi?q=` | MVP | publik | `GET /search` |
| Serial | `/serial` | MVP | publik | `GET /series` |
| Detail serial | `/serial/[id]` | MVP | publik | `GET /series/{id}` |
| Video/player | `/video/[id]` | MVP | publik (published) | `GET /videos/{id}`, `/playback` |
| Profil kreator | `/kreator/[id]` | MVP | publik | `GET /videos/{id}` → creator, atau endpoint kreator publik (OPEN) |
| Tersimpan | `/tersimpan` | MVP | user | `GET /me/saved-videos` |
| Profil | `/profil` | MVP | user | `GET /me` |
| Preferensi | `/profil/preferensi` | MVP | user | `PATCH /me/profile`, `PATCH /me/preferences` |
| Laporan | `/laporkan/[videoId]` | MVP | user | `POST /videos/{id}/reports` |
| Login/onboarding | `/masuk` | MVP | publik | provider auth |
| Riwayat tontonan | `/riwayat` | OPEN | user | `GET /me/watch-progress` |
| Notifikasi | `/notifikasi` | POST-MVP | user | ADR-0010 |
| Unduhan offline | — | POST-MVP | — | — |

**Acceptance per node:** route+permission ditetapkan; loading/empty/error/unauthorized; tidak overflow pada 320px; data dari API, bukan statis.

## 3. Creator Studio

| Node | Route | Status | Akses | Sumber data |
|---|---|---|---|---|
| Login | `/login` | MVP | publik | provider auth |
| Dashboard | `/dashboard` | MVP | creator | `GET /creator/videos`, `GET /creator/analytics/summary` |
| Konten saya | `/konten` | MVP | creator | `GET /creator/videos` |
| Detail konten | `/konten/[id]` | MVP | creator (own) | `GET /creator/videos/{id}/status` |
| Unggah | `/unggah` | MVP | creator | `POST /creator/videos`, `/upload-intent` |
| Metadata & sumber/hak | `/unggah` (step) | MVP | creator | `PATCH /creator/videos/{id}` |
| Pratinjau & submit | `/unggah` (step) | MVP | creator | `POST /submit-review` |
| Analitik | `/analitik` | MVP | creator | `GET /creator/analytics/summary` |
| Pengaturan | `/pengaturan` | MVP | creator | `PATCH /me/profile` |

Aturan: kreator hanya melihat kontennya; tidak ada tombol/endpoint publish; draft tidak dapat diakses via URL publik.

## 4. Admin & Moderation Console

| Node | Route | Status | Permission | Sumber data |
|---|---|---|---|---|
| Login + MFA | `/login` | MVP | publik | provider auth |
| Dashboard | `/dashboard` | MVP | `review:read`/`moderation:read` | queue + report summary |
| Review queue | `/review` | MVP | `review:read` | `GET /admin/review-queue` |
| Detail review | `/review/[id]` | MVP | `review:read` | `GET /admin/videos/{id}/review-context` |
| Keputusan review | `/review/[id]/keputusan` | MVP | `review:decide` | `POST /review-decision` |
| Publikasi | `/review/[id]/publikasi` | MVP | `publish:execute` | `POST /publish` |
| Laporan | `/reports` | MVP | `moderation:read` | `GET /admin/reports` |
| Detail kasus | `/kasus/[id]` | MVP | `moderation:read` | `GET /moderation-cases/{id}` |
| Tindakan | `/kasus/[id]/tindakan` | MVP | `moderation:restrict` | `POST /restrict`, `/decision` |
| Banding | `/banding/[id]` | MVP | `appeal:decide` | `POST /appeals/{id}/decision` |
| Koreksi | `/koreksi` | MVP | `correction:write` | `POST /corrections` |
| Katalog | `/katalog` | MVP | `review:read` | katalog admin (OPEN endpoint) |
| Serial | `/serial` | MVP | `review:read` | serial admin (OPEN endpoint) |
| Kreator | `/kreator` | MVP | `creator:manage` | `POST /creators/{id}/status` |
| Pengguna & role | `/pengguna` | MVP | `user:read`/`role:manage` | `GET /admin/users` |
| Kategori & tag | `/kategori` | MVP | admin | `categories` |
| Audit log | `/audit` | MVP | `audit:read` | `GET /admin/audit-logs` |
| Metrik | `/metrik` | MVP | `analytics:read` | agregat |

## 5. Website publik & SEO

**Tidak termasuk MVP** (ADR-0008). Tidak ada sitemap XML, robots, canonical, atau landing page. Ditinjau ulang sebelum public pilot.

## 6. Mapping ke kode

- Route constants/types tinggal di `packages/contracts` (web) dan `apps/mobile/src/app`.
- Jangan menduplikasi daftar route di banyak tempat; satu sumber definisi per aplikasi.
- Permission map di `route-permission-matrix.md`; route guard hanya UX, backend tetap kontrol.
- Acceptance test menyalin node MVP di atas sebagai test case navigasi.

## 7. Open items

- Endpoint publik profil kreator & katalog admin belum dirinci di LLD §8 (perlu ditambahkan saat Phase 3/6).
- Riwayat tontonan, unduhan offline, notifikasi: menunggu keputusan scope.
- OD-13 (website/SEO) ditutup default post-MVP; bukan final selamanya.
