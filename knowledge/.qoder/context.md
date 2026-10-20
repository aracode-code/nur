# L0 — Active Context

**Session:** SESSION-2026-10-20-1
**Command:** IMPLEMENT (default decisions)
**Autonomy:** L1
**Task:** Phase 2 — Backend Foundation + UX Gate A
**Status:** PARTIAL — fondasi API + shell frontend berjalan; fitur produk belum

## Objective

Menyediakan fondasi backend FastAPI dan shell frontend yang dapat dijalankan, diuji, dan diperluas per fitur.

## Implementasi saat ini

| Area | Status |
|---|---|
| `packages/design-tokens` | Token CSS + TS; dipakai studio |
| `apps/studio` | Preview shell UX Gate A (bukan Creator Studio final): AppShell, sidebar desktop, bottom nav mobile, 5 halaman, komponen inti |
| `backend/app` | Settings, JSON logging, request ID, error envelope, health/ready, mock auth, permission dependency, `GET /api/v1/me` |
| `backend/tests` | 14 test lulus |

## Verifikasi aktual

- `corepack pnpm --filter @nur/studio build` → tsc + vite sukses.
- Browser (dev server): Beranda, Jelajahi (filter Kisah = 2 item), Tersimpan, Profil; console hanya debug/info.
- Tablet 1046px: sidebar tampil, grid 2 kolom.
- Mobile harness 375px: bottom nav, grid 2 kolom, `scrollWidth 360 <= 375` (tanpa overflow).
- `pytest` → **14 passed**, 1 warning deprecation dari Starlette/httpx (bukan kegagalan).
- Uvicorn live: `/health` ok; `/ready` degraded (jujur); `/api/v1/me` reviewer mengembalikan role/permission; 404 status 404.

## Keputusan teknis sesi ini

1. pnpm 10.18.0 diaktifkan via corepack (pnpm 12 cache rusak).
2. Sidebar muncul mulai `md` (760px), bottom nav di bawahnya — sesuai UX spec (tablet = sidebar).
3. Search topbar tampil mulai `lg` (1120px) untuk menghindari overflow di tablet.
4. Mock auth memakai token `dev-*`; bukan secret; mode non-mock → 503.
5. `/ready` mengembalikan `degraded` selama DB/provider belum dikonfigurasi.
6. Index kode: `LIGHTWEIGHT_GREP` / `DEGRADED` (tanpa SQLite).

## Gap yang masih terbuka

- BE-008: OpenAPI contract test.
- BE-010/011/012/016: identity nyata, provisioning, multi-role, status akun.
- Halaman frontend masih memakai data demo berlabel; belum ada API client.
- Mobile visual dicek via iframe 375px (tool tidak menyediakan resize viewport native).
- Warning `httpx`/Starlette deprecation (upstream) belum ditangani.

## Next action

1. BE-008 OpenAPI contract test.
2. BE-010–BE-012 identity + role dari database.
3. BE-020–BE-027 katalog/feed/search.
4. Jangan integrasi vendor sebelum OD-02/OD-03/OD-04.
