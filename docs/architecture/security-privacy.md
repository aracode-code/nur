# NUR — Security & Privacy Baseline

**Status:** baseline Phase 1 (2026-10-20)
**Sumber:** HLD §12/§13, LLD §12, ADR-0004/0005/0006

> Dokumen ini adalah threat model awal, bukan penilaian keamanan final. Wajib diperbarui sebelum beta publik.

## 1. Aset yang dilindungi

1. Akun dan sesi pengguna/kreator/admin.
2. Konten draft, metadata hak, dan catatan review internal.
3. Status editorial/publikasi (integritas keputusan).
4. Audit log (integritas dan retensi).
5. Data analytics dan laporan pengguna.
6. Kredensial provider auth/video dan signed URL.
7. Biaya video (abuse playback/upload).

## 2. Threat model awal

| # | Ancaman | Permukaan | Dampak | Kontrol | Bukti uji |
|---|---|---|---|---|---|
| T1 | Upload file berbahaya/format invalid | upload intent, webhook | eksekusi/penyalahgunaan storage | validasi tipe/ukuran/durasi via provider; signed upload; tidak memproses file lokal | test upload invalid |
| T2 | Creator menyiasati review | endpoint creator/publish | konten belum layak tayang | permission terpisah; publish eksplisit; creator tanpa `publish:execute` | negative test |
| T3 | Akses draft/rejected via ID langsung | feed/detail/playback | kebocoran konten | query gate di repository; 404 untuk non-publik | IDOR test |
| T4 | Laporan massal palsu | `POST /reports` | moderasi kewalahan | rate limit, dedup, risk triage | test rate limit |
| T5 | Pencurian kredensial/admin takeover | login, session | kontrol penuh | managed auth, MFA admin, sesi pendek, audit | auth negative test |
| T6 | Webhook palsu/replay | webhook provider | status media palsu | signature pada raw body, timestamp/nonce, dedup event ID | signature test |
| T7 | Scraping katalog/abuse API | feed/search | biaya & data leakage | rate limit, cursor, bot controls | load/abuse test |
| T8 | Pelanggaran hak cipta | upload | risiko hukum/takedown | rights declaration wajib; evidence; workflow takedown | workflow test |
| T9 | Takedown tidak terpropagasi | cache/CDN | konten bermasalah tetap tampil | DB sebagai source of truth; outbox purge job; verifikasi | propagation test |
| T10 | Kebocoran PII via log/analytics | logging, events | privasi | redaksi, allowlist event, no raw PII | log review |
| T11 | Biaya video melonjak | playback/upload abuse | unit economics gagal | rate limit, signed playback, monitoring biaya | cost alert drill |
| T12 | IDOR pada resource creator | creator endpoints | data lintas kreator | ownership check di service | IDOR test |
| T13 | Conflict of interest reviewer | review decision | keputusan tidak adil | larangan approve konten sendiri; deklarasi konflik; audit | policy test |
| T14 | Manipulasi versi/dua reviewer | decision endpoints | overwrite diam-diam | `expected_version`, 409 | concurrency test |

## 3. Kontrol minimum (wajib)

- TLS untuk semua koneksi eksternal.
- Secrets hanya dari secret manager/environment; `.env` tidak di-commit.
- Managed auth; token divalidasi server-side; role dari database.
- RBAC + least privilege; default deny; permission dicek di service.
- Validasi input/output; sanitasi teks (tanpa HTML mentah).
- Rate limit pada auth, report, upload intent, analytics, search.
- CORS allowlist; CSRF protection sesuai pola auth web.
- Signed upload/playback reference bila provider mendukung.
- Webhook signature + idempotency.
- Backup terenkripsi + restore drill.
- Structured logs dengan `request_id`; redaksi token/PII.
- Dependency scanning + secret scanning di CI.
- Audit log append-only untuk aksi sensitif.

## 4. Audit event minimum

`user.role_changed` · `content.submitted` · `content.review_decided` · `content.approved` · `content.published` · `content.restricted` · `content.taken_down` · `report.created` · `case.decided` · `appeal.decided` · `correction.published` · `creator.status_changed` · `admin.export_requested`.

Setiap event: actor, action, entity, reason_code, request_id, timestamp, metadata aman.

## 5. Privasi

**Default (provisional):**

- Data minimization: hanya field yang dibutuhkan produk.
- Analytics memakai `anonymous_id`/pseudonim; tanpa email/telepon/token.
- Retensi event analytics: **90 hari raw**, agregat lebih lama — menunggu OD-08.
- Retensi laporan/moderasi/audit: mengikuti kebutuhan audit/legal — menunggu OD-08.
- Penghapusan akun: soft-delete + workflow `pending_deletion`; audit dipertahankan sesuai kebijakan.
- Analyst hanya menerima agregat; akses raw event dibatasi dan dicatat.

**Belum boleh diinventarisasi sebagai final:** usia minimum, dasar pemrosesan, consent, data residency, legal entity (OD-05, OD-08).

## 6. Release gate

Rilis DITOLAK bila:

- Ada secret di repository.
- Endpoint admin tanpa permission test.
- Video belum approved bisa tampil di feed/search/playback.
- Webhook dapat dipalsukan.
- Takedown tidak hilang dari discovery.
- Backup/restore belum pernah diuji sebelum production.
- Workflow report/moderasi belum berfungsi untuk beta publik.

## 7. Open items

- OD-05 umur minimum/child safety.
- OD-07 SLA laporan/takedown/banding.
- OD-08 privacy/retention/consent/residency.
- OD-11 SLO/RPO/RTO.
- Threat model final + review keamanan independen sebelum public pilot.
