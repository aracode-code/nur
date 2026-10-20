# NUR — Project Rules untuk Coding Agent

Berlaku bersama `AGENTS.md` (OS agent) serta `docs/architecture/HLD.md` dan `LLD.md` (kontrak produk).
Bila aturan ini bertabrakan dengan kode/konfigurasi aktual, kondisi aktual menang dan aturan ditandai `NEED_SYNC`.

## 1. Urutan baca sebelum menyentuh kode

1. `AGENTS.md`
2. `.qoder/project-rules.md` (dokumen ini)
3. `docs/architecture/HLD.md` — scope, batas sistem, keamanan
4. `docs/architecture/LLD.md` — struktur, data model, API, state machine
5. `docs/architecture/decisions/` — ADR dan `OPEN-DECISIONS.md`
6. Dokumen domain/route/desain yang relevan

## 2. Open decisions

- `docs/architecture/decisions/OPEN-DECISIONS.md` adalah satu-satunya register keputusan terbuka.
- DILARANG memilih vendor auth, video, analytics, hosting, platform target, atau kebijakan legal tanpa ADR dan persetujuan owner.
- Sampai keputusan ditutup: implementasikan interface adapter + mock yang jelas ditandai.

## 3. Server adalah sumber kebenaran

- Role, permission, editorial status, dan publication status diperiksa di backend.
- Feed, search, detail, dan playback hanya mengembalikan `editorial_status=approved` **dan** `publication_status=published`.
- Default deny untuk permission yang tidak dikenal.
- Menyembunyikan tombol di frontend bukan kontrol keamanan.
- Creator hanya mengakses konten miliknya; reviewer tidak menyetujui konten sendiri.

## 4. Upload bukan publikasi

- Upload/transcode sukses tidak berarti konten boleh tampil.
- Publish adalah aksi eksplisit, permission-gated, dan diaudit.
- Webhook provider hanya memperbarui status media; tidak menyetujui editorial.
- Semua callback: verifikasi signature, idempotent, dedup provider event ID.

## 5. Audit

- Aksi sensitif menulis `audit_logs`: actor, action, entity, reason_code, request_id, timestamp.
- `audit_logs` append-only; tidak ada endpoint update/delete.
- Role change, review decision, takedown, appeal, correction, dan publish wajib diaudit.

## 6. Data

- UUID untuk ID; `timestamptz` UTC; API ISO 8601; enum `snake_case` tervalidasi.
- Tidak menyimpan binary video di PostgreSQL.
- Optimistic concurrency via `version`/`expected_version`.
- Save/unsave, upload intent, webhook: idempotent.
- Migration dapat direview; migration destruktif butuh backup + rollback plan (expand-migrate-contract).

## 7. Keamanan

- Tidak ada secret di repo; `.env` tidak di-commit; log tanpa token, signed URL, atau PII.
- TLS, CORS allowlist, rate limit pada login/report/upload-intent/analytics/search.
- Validasi file berdasarkan status provider, bukan MIME/nama file client.
- Dependency dan secret scanning di CI.

## 8. Frontend

- `docs/design/NUR_UX_UI_Design_Prototype.html` adalah acuan visual; DILARANG redesign generik atau mengganti palet.
- Warna, radius, spacing, breakpoint berasal dari design tokens terpusat.
- Setiap layar punya state: idle, loading, success, empty, error, unauthorized.
- Data mock wajib diberi label dan tidak boleh menyamar sebagai data produksi.
- Responsive check: 320, 375, 768, 1024, 1280, 1440px.

## 9. Testing dan klaim

- Jangan mengklaim test lulus tanpa perintah dan hasil aktual.
- DILARANG melemahkan atau menghapus test agar hijau.
- Acceptance minimum: draft/rejected/restricted/taken-down tidak bocor; creator tidak bisa publish; reviewer tidak approve konten sendiri; webhook signature invalid ditolak; takedown hilang dari feed/search.

## 10. Fase

- Kerjakan satu phase / vertical slice; jangan melewati exit gate.
- Phase aktif dan handoff: `knowledge/tasks/CURRENT.md`.
- Jangan membuat file kosong hanya untuk melengkapi struktur.

## 11. Penutupan sesi

Ikuti pipeline `AGENTS.md` §11.2 (CLOSE) atau §11.3 (CHECKPOINT).
State proyek: `knowledge/.qoder/state.json`; konteks: `knowledge/.qoder/context.md`.
