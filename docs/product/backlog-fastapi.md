# NUR — Backend User Story Backlog (FastAPI)

**Status:** baseline Phase 2 (2026-10-20)
**Sumber:** HLD §7–§18, LLD §5–§19, `route-permission-matrix.md`, ADR-0001…0010
**Cakupan:** backend API saja. Frontend/UX backlog terpisah.

## 1. Cara membaca

- **Prioritas:** `P0` = fondasi/blocker, `P1` = MVP, `P2` = hardening/beta.
- **Phase:** mengikuti LLD §17. Jangan mulai phase berikutnya sebelum gate phase berjalan.
- **Status:** `Done`, `Next`, `Todo`. Status hanya berubah setelah test/verifikasi aktual.
- **Permission:** kode permission dari `route-permission-matrix.md`.
- **DoR:** endpoint/kontrak jelas, permission jelas, data model jelas, kriteria negatif diketahui.
- **DoD:** LLD §19 + permission test + error envelope + audit (bila sensitif) + idempotency (bila async) + dokumentasi OpenAPI.

## 2. Definition of Done (ringkas)

1. Schema request/response di OpenAPI.
2. Otorisasi server-side (bukan hanya UI).
3. Validasi input + error envelope seragam.
4. Unit + integration/API test lulus (angka aktual dilaporkan).
5. Aksi sensitif menulis audit log.
6. Operasi async idempotent + retry.
7. Tidak ada secret/PII di log.
8. Dokumentasi kontrak diperbarui.

---

## E0 — Foundation (P0)

| ID | User story | Acceptance criteria | Endpoint/permission | Phase | Status |
|---|---|---|---|---|---|
| BE-001 | Sebagai engineer, saya ingin settings bertipe dan tervalidasi agar konfigurasi salah gagal lebih awal. | Env prefix `NUR_`; default lokal; nilai invalid gagal saat startup; test konfigurasi. | — | 2 | Done |
| BE-002 | Sebagai client, saya ingin error yang konsisten agar dapat menangani kegagalan. | Envelope `{error:{code,message,request_id,details}}`; 4xx/5xx konsisten; tidak membocorkan stack/SQL. | semua | 2 | Done |
| BE-003 | Sebagai operator, saya ingin request ID agar bisa menelusuri satu request. | ID valid di-echo; ID invalid diganti; header ada di semua response; test. | semua | 2 | Done |
| BE-004 | Sebagai operator, saya ingin log JSON agar mudah di-query. | Field timestamp/level/logger/message/request_id/method/path/status/duration; tanpa token/PII. | — | 2 | Done |
| BE-005 | Sebagai platform, saya ingin health/readiness agar deployment tahu status. | `/health` 200; `/ready` jujur `degraded` selama dependency belum dikonfigurasi. | publik | 2 | Done |
| BE-006 | Sebagai engineer, saya ingin auth adapter + mock agar pengembangan tidak menunggu vendor. | 401 tanpa/invalid token; role dari sumber internal; mode non-mock → 503 jelas. | — | 2 | Done |
| BE-007 | Sebagai security engineer, saya ingin permission dependency dengan default deny. | User tanpa permission → 403; admin pun ditolak untuk permission tak dikenal; test. | — | 2 | Done |
| BE-008 | Sebagai engineer, saya ingin OpenAPI digenerate dan diuji agar kontrak tidak basi. | Spec tersedia di `/api/v1/openapi.json`; contract test membandingkan response; CI gagal bila mismatch. | — | 2 | Next |

## E1 — Identity, profile, account (P0/P1)

| ID | User story | Acceptance criteria | Endpoint/permission | Phase | Status |
|---|---|---|---|---|---|
| BE-010 | Sebagai pengguna, saya ingin masuk lewat managed auth agar tidak membuat password sendiri. | Token diverifikasi server; tidak ada password storage; sesi mengikuti provider; 401 aman. | provider auth | 2/4 | Todo |
| BE-011 | Sebagai sistem, saya ingin memetakan identitas auth ke user internal. | `auth_subject` unik; provisioning idempotent; status default `active`. | — | 2 | Todo |
| BE-012 | Sebagai admin, saya ingin multi-role agar hak akses tidak digabung asal. | Tabel `user_roles`; role aktif dari DB; `revoked_at` dihormati; role client diabaikan. | — | 2 | Todo |
| BE-013 | Sebagai pengguna, saya ingin melihat profil dan hak saya. | `GET /me` mengembalikan profil, role, permission; 401 tanpa sesi. | `GET /me` | 2 | Done |
| BE-014 | Sebagai pengguna, saya ingin mengubah profil sendiri. | Allowlist field; self-only; 422 untuk field invalid; tidak bisa mengubah role. | `PATCH /me/profile` | 4 | Todo |
| BE-015 | Sebagai pengguna, saya ingin menghapus akun dengan aman. | `DELETE /me` → `pending_deletion`; job penghapusan; audit; bukan hard-delete langsung. | `DELETE /me` | 6 | Todo |
| BE-016 | Sebagai sistem, saya ingin menolak akun suspended/deleted. | Status dicek di auth dependency; 403 dengan kode jelas. | semua terautentikasi | 2 | Todo |
| BE-017 | Sebagai admin, saya ingin MFA agar akun istimewa lebih aman. | MFA bila provider mendukung; bila tidak, mitigasi + risiko terdokumentasi. | provider auth | 2 | Todo |

## E2 — Catalog, feed, search (P1)

| ID | User story | Acceptance criteria | Endpoint/permission | Phase | Status |
|---|---|---|---|---|---|
| BE-020 | Sebagai visitor, saya ingin feed berisi konten layak tayang. | Hanya `approved+published`; draft/rejected/restricted/takedown tidak pernah muncul; cursor. | `GET /feed` | 3 | Todo |
| BE-021 | Sebagai visitor, saya ingin detail video publik. | 404 untuk konten non-publik; metadata sesuai kontrak; tanpa catatan internal. | `GET /videos/{id}` | 3 | Todo |
| BE-022 | Sebagai visitor, saya ingin playback yang aman. | Cek status sebelum ref; ref berumur pendek; provider gagal → 503, bukan sukses palsu. | `GET /videos/{id}/playback` | 3 | Todo |
| BE-023 | Sebagai visitor, saya ingin daftar kategori aktif. | Hanya kategori aktif; cache terkontrol; tanpa data internal. | `GET /categories` | 3 | Todo |
| BE-024 | Sebagai visitor, saya ingin mencari katalog. | FTS title/description; exclude non-publik; filter kategori; query kosong ditangani. | `GET /search` | 3 | Todo |
| BE-025 | Sebagai product, saya ingin ranking sederhana yang transparan. | Editorial pin, freshness, relevansi kategori, diversifikasi; deterministik; bukan ML. | feed service | 3 | Todo |
| BE-026 | Sebagai client, saya ingin pagination cursor yang stabil. | Cursor opaque; tidak ada duplikat/hilang saat data berubah wajar; cursor invalid → 422. | feed/list | 3 | Todo |
| BE-027 | Sebagai engineer, saya ingin feed memenuhi target latency awal. | P95 < 500 ms di staging dengan dataset uji; query plan diperiksa; index sesuai data model. | feed/search | 3 | Todo |

## E3 — Series & playlist (P1)

| ID | User story | Acceptance criteria | Endpoint/permission | Phase | Status |
|---|---|---|---|---|---|
| BE-030 | Sebagai admin, saya ingin mengelola serial. | Create/edit/publish/archive; slug unik; audit untuk publish/arsip. | `GET /series`, admin | 3 | Todo |
| BE-031 | Sebagai editor, saya ingin mengatur urutan episode. | `(series_id, episode_number)` unik; episode non-published tidak tampil; validasi video published. | `series_episodes` | 3 | Todo |
| BE-032 | Sebagai visitor, saya ingin melihat detail serial. | Hanya serial published; episode published; metadata progres jika login. | `GET /series/{id}` | 3 | Todo |
| BE-033 | Sebagai user, saya ingin melanjutkan serial. | Progress per video; CTA episode berikutnya published; completion tervalidasi. | `GET/PUT /me/watch-progress` | 4 | Todo |

## E4 — Engagement (P1)

| ID | User story | Acceptance criteria | Endpoint/permission | Phase | Status |
|---|---|---|---|---|---|
| BE-040 | Sebagai user, saya ingin menyimpan video. | `PUT` idempotent; unik `(user_id,video_id)`; video harus published; 401 tanpa sesi. | `PUT /me/saved-videos/{id}` | 4 | Todo |
| BE-041 | Sebagai user, saya ingin membatalkan simpan. | `DELETE` idempotent; 204/200 konsisten; tidak error bila belum tersimpan. | `DELETE /me/saved-videos/{id}` | 4 | Todo |
| BE-042 | Sebagai user, saya ingin melihat daftar tersimpan. | Cursor; hanya milik sendiri; metadata video ringkas. | `GET /me/saved-videos` | 4 | Todo |
| BE-043 | Sebagai user, saya ingin progres tonton tersimpan. | Upsert; posisi di-clamp ≥0; completion tidak dipercaya mentah dari client; self-only. | `PUT/GET /me/watch-progress` | 4 | Todo |
| BE-044 | Sebagai user, saya ingin melaporkan konten. | Reason code valid; rate limit; status report dikembalikan; tidak membocorkan data pelapor. | `POST /videos/{id}/reports` | 4/6 | Todo |
| BE-045 | Sebagai trust & safety, saya ingin reason code terkonfigurasi. | Daftar reason code tervalidasi server; perubahan tercatat; tidak hardcode di client. | config | 4 | Todo |
| BE-046 | Sebagai user, saya ingin membagikan tautan tanpa data pribadi. | Share payload tanpa ID sensitif; tidak ada token di URL; policy deep link jelas. | client + API | 4 | Todo |
| BE-047 | Sebagai analyst, saya ingin event klien tervalidasi. | Allowlist event; schema version; batas ukuran; idempotent `event_id`; tanpa PII. | `POST /analytics/events` | 4 | Todo |

## E5 — Creator operations (P1)

| ID | User story | Acceptance criteria | Endpoint/permission | Phase | Status |
|---|---|---|---|---|---|
| BE-050 | Sebagai admin, saya ingin mengundang kreator. | Status `invited/active/paused/revoked`; audit; hanya role berwenang. | `creator:manage` | 5 | Todo |
| BE-051 | Sebagai kreator, saya ingin melihat konten saya. | Hanya milik sendiri; 404 untuk konten kreator lain; pagination. | `GET /creator/videos` | 5 | Todo |
| BE-052 | Sebagai kreator, saya ingin membuat draft. | Status `draft`; creator aktif; metadata minimal; audit create. | `POST /creator/videos` | 5 | Todo |
| BE-053 | Sebagai kreator, saya ingin mengedit metadata. | Allowlist field; `expected_version`; 409 saat konflik; tidak bisa mengubah status editorial. | `PATCH /creator/videos/{id}` | 5 | Todo |
| BE-054 | Sebagai kreator, saya ingin mendeklarasikan sumber dan hak. | Sumber/hak wajib sebelum submit; tipe enum valid; bukti izin tersimpan sebagai referensi. | creator service | 5 | Todo |
| BE-055 | Sebagai kreator, saya ingin upload yang aman. | Upload intent idempotent; hanya draft milik sendiri; file tidak diproxy API; signed upload. | `POST .../upload-intent` | 5 | Todo |
| BE-056 | Sebagai kreator, saya ingin mengirim konten untuk review. | Media `ready_for_review`; sumber/hak lengkap; deklarasi dikonfirmasi; transisi status valid. | `POST .../submit-review` | 5 | Todo |
| BE-057 | Sebagai kreator, saya ingin melihat status review. | Status + alasan revisi/penolakan; hanya milik sendiri; tanpa catatan internal moderator. | `GET .../status` | 5 | Todo |
| BE-058 | Sebagai kreator, saya ingin ringkasan performa saya. | Agregat milik sendiri; tanpa data personal penonton; periode jelas. | `GET /creator/analytics/summary` | 6 | Todo |

## E6 — Video lifecycle & provider (P1, vendor-dependent)

| ID | User story | Acceptance criteria | Endpoint/permission | Phase | Status |
|---|---|---|---|---|---|
| BE-060 | Sebagai engineer, saya ingin interface provider agar vendor mudah diganti. | Protocol `VideoProvider`; tidak ada nama vendor di domain; adapter terisolasi. | — | 3 | Todo |
| BE-061 | Sebagai developer, saya ingin mock provider agar bisa bekerja tanpa vendor. | Mock mendukung intent/status/playback/webhook; hanya dev/test; tidak aktif di production. | — | 3 | Todo |
| BE-062 | Sebagai kreator, saya ingin signed upload. | Intent berumur pendek; scope video tertentu; retry tidak menggandakan aset. | `upload-intent` | 3/5 | Todo |
| BE-063 | Sebagai platform, saya ingin webhook terverifikasi. | Signature pada raw body; timestamp/replay ditolak; 401/403 tanpa perubahan status. | `POST /webhooks/video-provider` | 3 | Todo |
| BE-064 | Sebagai platform, saya ingin webhook idempotent. | Dedup provider event ID; duplikat tidak membuat asset/event ganda; test. | webhook | 3 | Todo |
| BE-065 | Sebagai sistem, saya ingin status media akurat. | Transisi `initiated→uploading→processing→ready_for_review`; `failed` + retry; audit. | worker | 3 | Todo |
| BE-066 | Sebagai engineer, saya ingin metadata aset tersimpan. | Provider asset ID unik; durasi/resolusi/thumbnail; tanpa binary di PostgreSQL. | `video_assets` | 3 | Todo |
| BE-067 | Sebagai operator, saya ingin rekonsiliasi status. | Job berkala membandingkan provider vs DB; idempotent; alert bila drift. | job | 3/7 | Todo |
| BE-068 | Sebagai moderator, saya ingin purge aset. | Restrict/takedown memicu purge; retry backoff; gagal → alert; tidak menghapus metadata audit. | job | 6 | Todo |

## E7 — Review & publish (P1)

| ID | User story | Acceptance criteria | Endpoint/permission | Phase | Status |
|---|---|---|---|---|---|
| BE-070 | Sebagai reviewer, saya ingin antrean review. | Hanya item `submitted/in_review`; urutan + filter; permission `review:read`. | `GET /admin/review-queue` | 6 | Todo |
| BE-071 | Sebagai reviewer, saya ingin konteks review lengkap. | Metadata, sumber, hak, riwayat versi; tanpa data berlebih; `review:read`. | `GET .../review-context` | 6 | Todo |
| BE-072 | Sebagai reviewer, saya ingin keputusan dengan alasan. | Enum decision; reason code wajib; notes; transisi valid; audit. | `review:decide` | 6 | Todo |
| BE-073 | Sebagai platform, saya ingin mencegah konflik kepentingan. | Reviewer tidak bisa memutuskan konten sendiri; deklarasi konflik; test 403/409. | `review:decide` | 6 | Todo |
| BE-074 | Sebagai product, saya ingin publish terpisah dari approval. | `publish:execute` terpisah; `approved` tidak otomatis published; dua audit event. | `publish:execute` | 6 | Todo |
| BE-075 | Sebagai reviewer, saya ingin perubahan aman dari tabrakan. | `expected_version`; 409 eksplisit; tidak ada overwrite diam-diam. | decision/publish | 6 | Todo |
| BE-076 | Sebagai editor, saya ingin perubahan material memicu re-review. | Perubahan sumber/hak/substansi setelah approval → `in_review`; audit; publikasi ditarik bila perlu. | creator/catalog | 6 | Todo |
| BE-077 | Sebagai auditor, saya ingin semua keputusan tercatat. | Event approve/publish/restrict dengan actor, reason, request ID, timestamp. | audit | 6 | Todo |

## E8 — Moderation, appeal, correction (P1)

| ID | User story | Acceptance criteria | Endpoint/permission | Phase | Status |
|---|---|---|---|---|---|
| BE-080 | Sebagai moderator, saya ingin triage laporan. | Severity; dedup laporan sejenis; status `open/triaged`; rate limit pelapor. | `moderation:read` | 6 | Todo |
| BE-081 | Sebagai moderator, saya ingin kasus dengan penanggung jawab. | Case dibuat/ditautkan; assignee; status enum; audit. | `moderation:decide` | 6 | Todo |
| BE-082 | Sebagai moderator, saya ingin restrict/takedown. | Publication status berubah; outbox purge; hilang dari feed/search segera; audit. | `moderation:restrict` | 6 | Todo |
| BE-083 | Sebagai kreator, saya ingin banding. | Appeal terhubung case; status; diputuskan pihak berbeda bila memungkinkan; audit. | `appeal:decide` | 6 | Todo |
| BE-084 | Sebagai editor, saya ingin koreksi publik. | Koreksi punya status dan riwayat; tidak menghapus keputusan lama; tampil di detail. | `correction:write` | 6 | Todo |
| BE-085 | Sebagai kreator, saya ingin status in-app. | Status keputusan terlihat di studio; tanpa catatan internal; ADR-0010. | creator status | 6 | Todo |
| BE-086 | Sebagai auditor, saya ingin jejak moderasi lengkap. | Actor, entity, reason, request ID, before/after bila relevan. | audit | 6 | Todo |
| BE-087 | Sebagai platform, saya ingin takedown terpropagasi. | DB source of truth; purge job; verifikasi hilang dari discovery; alert bila gagal. | worker | 6/7 | Todo |

## E9 — Admin & audit (P1)

| ID | User story | Acceptance criteria | Endpoint/permission | Phase | Status |
|---|---|---|---|---|---|
| BE-090 | Sebagai admin, saya ingin daftar pengguna terfilter. | Pagination; filter status/role; tanpa data sensitif berlebih; `user:read`. | `GET /admin/users` | 6 | Todo |
| BE-091 | Sebagai admin, saya ingin mengelola role. | Grant/revoke; tidak bisa menghapus role terakhir admin; audit; `role:manage`. | admin service | 6 | Todo |
| BE-092 | Sebagai auditor, saya ingin audit log read-only. | Filter actor/entity/waktu; tanpa endpoint update/delete; `audit:read`. | `GET /admin/audit-logs` | 6 | Todo |
| BE-093 | Sebagai admin, saya ingin ekspor dibatasi. | Ekspor permission-gated; dicatat; rate limit; tanpa PII berlebih. | admin | 6 | Todo |
| BE-094 | Sebagai admin, saya ingin mengelola kategori/serial. | CRUD; slug unik; publish/arsip; audit. | admin | 3/6 | Todo |
| BE-095 | Sebagai admin, saya ingin mengubah status kreator. | `invited/active/paused/revoked`; efek pada akses; audit; `creator:manage`. | `POST /admin/creators/{id}/status` | 6 | Todo |
| BE-096 | Sebagai security engineer, saya ingin negative permission suite. | Seluruh endpoint sensitif punya test 403/404; CI gagal bila ada endpoint tanpa permission test. | tests | 6 | Todo |

## E10 — Analytics & metrics (P1/P2)

| ID | User story | Acceptance criteria | Endpoint/permission | Phase | Status |
|---|---|---|---|---|---|
| BE-100 | Sebagai analyst, saya ingin event schema berversi. | Allowlist; `schema_version`; validasi properti; tanpa PII; dokumentasi. | events | 6 | Todo |
| BE-101 | Sebagai platform, saya ingin ingestion idempotent. | `event_id` unik; batch; dedup; batas ukuran/rate. | `POST /analytics/events` | 6 | Todo |
| BE-102 | Sebagai product, saya ingin agregasi terjadwal. | Window-based upsert; idempotent; retry; waktu proses terpantau. | job | 6 | Todo |
| BE-103 | Sebagai product, saya ingin metrik meaningful session. | Definisi ADR-0007; dedup; dapat dihitung ulang; angka aktual dilaporkan. | aggregation | 6 | Todo |
| BE-104 | Sebagai product, saya ingin dashboard metrik inti. | Retention, completion, save/share, continuation, review turnaround; akses role. | analytics read | 6/7 | Todo |
| BE-105 | Sebagai finance, saya ingin biaya video terpantau. | Cost per watch hour/storage/transcode; alert; sumber data jelas. | ops | 7 | Todo |
| BE-106 | Sebagai privacy owner, saya ingin tanpa PII di analytics. | Test payload terlarang; review log; retensi sesuai OD-08. | tests | 6 | Todo |

## E11 — Jobs, outbox, reliability (P1/P2)

| ID | User story | Acceptance criteria | Endpoint/permission | Phase | Status |
|---|---|---|---|---|---|
| BE-110 | Sebagai engineer, saya ingin outbox transaksional. | Event ditulis dalam transaksi yang sama; worker mengirim; idempotent. | — | 6 | Todo |
| BE-111 | Sebagai operator, saya ingin retry aman. | Exponential backoff + jitter; batas retry; tidak menggandakan efek. | worker | 6 | Todo |
| BE-112 | Sebagai operator, saya ingin kegagalan terlihat. | Dead-letter/error report; alert; runbook. | worker | 6/7 | Todo |
| BE-113 | Sebagai engineer, saya ingin job idempotent. | Semua job aman dijalankan ulang; unique key; test. | jobs | 6 | Todo |
| BE-114 | Sebagai operator, saya ingin penjadwalan. | Scheduler terpisah; overlap dicegah; monitoring. | ops | 7 | Todo |

## E12 — Quality, CI, observability (P1/P2)

| ID | User story | Acceptance criteria | Endpoint/permission | Phase | Status |
|---|---|---|---|---|---|
| BE-120 | Sebagai QA, saya ingin strategi test tertulis. | Unit/integration/contract/security/E2E; data uji; environment. | — | 2 | Todo |
| BE-121 | Sebagai engineer, saya ingin contract test. | OpenAPI vs response; CI gagal saat mismatch. | — | 2/3 | Todo |
| BE-122 | Sebagai security engineer, saya ingin permission suite. | Semua endpoint sensitif; 401/403/404; IDOR. | tests | 6 | Todo |
| BE-123 | Sebagai engineer, saya ingin load test. | Skenario feed/event; target dari HLD §14; hasil aktual. | ops | 7 | Todo |
| BE-124 | Sebagai operator, saya ingin restore drill. | Backup terjadwal; restore teruji; RPO/RTO setelah OD-11. | ops | 7 | Todo |
| BE-125 | Sebagai operator, saya ingin alert minimum. | 5xx, provider down, webhook gagal, worker backlog, DB limit, biaya. | ops | 7 | Todo |
| BE-126 | Sebagai engineer, saya ingin CI lengkap. | lint, typecheck, unit, integration, build, migration check, secret/dependency scan. | CI | 2 | Todo |

---

## 3. Urutan eksekusi yang disarankan

1. **BE-008** (OpenAPI contract) → **BE-010/011/012/016** (identity nyata) → **BE-014** profil.
2. **BE-020–BE-027** katalog/feed/search + **BE-030–BE-032** serial.
3. **BE-040–BE-045** engagement + **BE-052–BE-057** draft/submit.
4. **BE-060–BE-067** video adapter/webhook (setelah OD-02 PoC).
5. **BE-070–BE-077** review/publish → **BE-080–BE-087** moderasi.
6. **BE-090–BE-096** admin/audit → **BE-100–BE-106** analytics → **BE-110–BE-114** jobs.
7. **BE-120–BE-126** hardening dan closed-beta gate.

Aturan: jangan mengerjakan endpoint vendor-dependent sebelum PoC; jangan menutup Phase 6 sebelum negative permission suite hijau.

## 4. Di luar backlog ini

Live streaming · open upload · chat · marketplace/pembayaran · ML recommendation · website publik/SEO (ADR-0008) · membership (Phase 8).

## 5. Catatan status

- BE-001…BE-007 sudah diimplementasikan di `backend/app/` dan lulus 14 test (2026-10-20).
- BE-013 (`GET /api/v1/me`) memakai mock principal; baru final setelah BE-010/BE-011.
- BE-008 belum: OpenAPI tersedia, contract test belum.
