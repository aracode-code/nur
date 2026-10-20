# CURRENT — Task Aktif

**Updated:** 2026-10-20T16:33:04+07:00
**Phase:** 2 — Backend Foundation + UX Gate A
**Status:** PARTIAL (fondasi jalan; fitur produk belum)
**Autonomy:** L1

## Objective

Fondasi backend FastAPI + shell frontend yang dapat dijalankan, diuji, dan diperluas.

## Checklist

- [x] Root pnpm workspace + lockfile
- [x] `@nur/design-tokens` (CSS + TS)
- [x] Studio: AppShell, sidebar, topbar, mobile bottom nav
- [x] Studio: Button, badges, cards, states
- [x] Studio: Beranda, Jelajahi, Serial, Tersimpan, Profil (data demo berlabel)
- [x] Responsive: sidebar ≥760, bottom nav <760; 375px tanpa overflow
- [x] Backend: settings, JSON logging, request ID, error envelope
- [x] Backend: health/ready, mock auth, permission dependency, `/api/v1/me`
- [x] Backend tests: 14 passed
- [x] Live server check: health/ready/me/404
- [x] Git init + commit `e9e3b32` + push `origin/main`
- [x] `docs/product/backlog-fastapi.md`
- [ ] BE-008 OpenAPI contract test
- [ ] BE-010/011/012/016 identity nyata + status akun
- [ ] BE-020–BE-027 catalog/feed/search
- [ ] API client typed di studio (setelah OpenAPI stabil)

## Known issues

- `StarletteDeprecationWarning` menyarankan `httpx2` untuk TestClient — warning upstream, bukan kegagalan.
- Mobile visual diverifikasi dengan iframe 375px karena tool browser tidak menyediakan resize viewport.
- `/ready` masih `degraded` (DB & provider belum dikonfigurasi) — disengaja.

## Blockers

- Tidak ada blocker teknis.
- Integrasi vendor menunggu OD-02/OD-03/OD-04.

## Team Scope

Tidak ada gelombang aktif. `open_wave = null`. Single-writer.

## Next Session Handoff

1. Baca `state.json` → `context.md` → `memory.md` → `CURRENT.md`.
2. Lanjut BE-008 (contract test) lalu BE-010–012.
3. Jalankan `pytest` dan `pnpm build` sebelum menutup sesi.
4. Jangan menambah dependensi baru tanpa mencatat alasannya.
