# DONE — Arsip Task Selesai

## 2026-10-20 — Phase 0: Repository Bootstrap

**Status:** selesai (menunggu review owner)

**Hasil:**

- HLD (NUR-HLD-001 v1.1, 1588 baris) dan LLD (NUR-LLD-001 v1.0, 1163 baris) dibaca penuh.
- Baseline repo: `README.md`, `.qoder/project-rules.md`.
- Register keputusan: `docs/architecture/decisions/OPEN-DECISIONS.md` (OD-01…OD-17) dan `ADR-0000-template.md`.
- Knowledge OS: `knowledge/00_INDEX.md`, `01_PROJECT.md`, `.qoder/state.json`, `.qoder/context.md`, `.qoder/memory.md`, `.qoder/index/index-state.json`, `tasks/CURRENT.md`, `BACKLOG.md`, `DONE.md`.
- Index kode dicatat `UNAVAILABLE` (belum ada kode) — bukan kegagalan, sesuai kondisi aktual.

**Tidak termasuk:** kode aplikasi, schema final, UI, pemilihan vendor, konfigurasi lint/test.

## 2026-10-20 — Phase 1: Architecture Validation & Design Spec

**Status:** dokumentasi selesai (PARTIAL — scaffold & approval belum)

**Hasil:**

- 10 ADR default: modular monolith, frontend stack, backend/DB, video adapter, auth adapter, deployment, analytics, website/SEO, publish authority, notifications.
- `OPEN-DECISIONS.md`: OD-01/09/13/14/15/16 → DEFAULT; OD-02/03/04 → PARTIAL (adapter-first); item legal/beta tetap OPEN.
- `route-permission-matrix.md`: role, permission, route UI/API, 12 negative test.
- `data-model.md`: ERD, constraint, delete policy, index, state machine, aturan migrasi.
- `api-overview.md`: konvensi, error envelope, peta endpoint, rate limit, versioning.
- `security-privacy.md`: 14 ancaman + kontrol + audit event + release gate.
- `navigation-and-sitemap.md`: sitemap mobile/studio/admin; konflik navigasi HLD §26.1 vs §28.4 diselesaikan ke §28.4.
- `user-journeys.md`: 6 journey dengan API, state, jalur gagal.
- `UX_UI_IMPLEMENTATION_SPEC.md`: token, tipografi, spacing, komponen, AppShell, state matrix, acceptance.

**Belum:** scaffold kode, OpenAPI generated, visual review, approval owner.

## 2026-10-20 — Phase 2: UX Gate A + Backend Foundation

**Status:** PARTIAL (fondasi terverifikasi; fitur produk belum)

**Frontend:**

- pnpm workspace (`apps/*`, `packages/*`), lockfile.
- `packages/design-tokens`: CSS variables + TS tokens.
- `apps/studio`: AppShell, sidebar desktop, topbar, mobile bottom nav, 5 halaman, komponen Button/Badge/Card/States.
- Data demo diberi label; tombol non-fitur dinonaktifkan (tidak ada success palsu).

**Backend:**

- FastAPI app factory, settings, JSON logging, request ID middleware, error envelope (400/401/403/404/422/500), health/ready.
- Mock auth + permission dependency (default deny), `GET /api/v1/me`.
- 14 test: health, readiness, error envelope, request ID, validation, 500 redaction, auth 401, permission 403.

**Verifikasi aktual:**

- `pnpm --filter @nur/studio build` → lulus.
- Browser: 4 route, filter, console bersih; tablet sidebar; 375px tanpa overflow.
- `pytest` → 14 passed (1 warning upstream).
- Uvicorn live: health/ready/me/404 sesuai.

**Tidak termasuk:** database, migration, endpoint produk, API client, OpenAPI contract test.
