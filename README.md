# NUR — Short Islamic Video Platform

Platform video pendek Islami untuk Indonesia. MVP curated-first: feed vertikal, serial, pencarian, simpan/bagikan, Creator Studio untuk kreator undangan, review editorial, moderasi, dan analytics dasar.

**Status:** Phase 2 — Backend foundation + UX Gate A scaffold (2026-10-20). Fondasi API dan shell frontend sudah berjalan; fitur produk belum.

## Yang sudah ada

| Path | Isi |
|---|---|
| `apps/studio` | Preview shell UX Gate A: AppShell, sidebar desktop, bottom nav mobile, 5 halaman, komponen inti (bukan Creator Studio final) |
| `packages/design-tokens` | Token warna/radius/spacing/tipografi/layout (satu sumber) |
| `backend` | FastAPI foundation: settings, JSON logging, request ID, error envelope, health/readiness, mock auth, permission dependency, `/api/v1/me` |
| `backend/tests` | 14 test (health, error, request ID, auth, permission) |

## Menjalankan

```bash
# Frontend (port 5173)
corepack pnpm install
corepack pnpm --filter @nur/studio dev

# Backend (port 8000)
cd backend
python -m venv .venv
.venv/Scripts/python -m pip install -e ".[dev]"
.venv/Scripts/python -m uvicorn app.main:app --reload --port 8000
```

Test backend: `.venv/Scripts/python -m pytest` (dari `backend/`).
Build frontend: `corepack pnpm --filter @nur/studio build`.

## Dokumen otoritatif

| Dokumen | Peran |
|---|---|
| `docs/architecture/HLD.md` (NUR-HLD-001 v1.1) | Scope produk, batas sistem, keamanan, permission, acuan UX |
| `docs/architecture/LLD.md` (NUR-LLD-001 v1.0) | Struktur kode, data model, kontrak API, state machine, testing |
| `docs/design/NUR_UX_UI_Design_Prototype.html` | Acuan visual yang disetujui — reference, bukan kode produksi |
| `docs/architecture/decisions/` | ADR default + register keputusan terbuka |
| `docs/product/backlog-fastapi.md` | User story backlog backend |
| `knowledge/` | State, memori, konteks, dan task agent |

Urutan otoritas: **kondisi aktual (kode/config/test)** → HLD/LLD → prototype (visual saja).

## Scope MVP

Feed & discovery, search, detail/playback, serial & progress, simpan/bagikan/lapor, Creator Studio (draft → upload → review), Admin Console (review, reports, takedown, appeal, koreksi, audit), analytics dasar, closed beta.

**Non-goals:** live streaming, open upload, chat, marketplace/pembayaran kompleks, ML recommendation, website publik/SEO (ADR-0008), aplikasi desktop native.

## Aturan kerja

Baca `AGENTS.md` dan `.qoder/project-rules.md` sebelum menyentuh kode. Kerjakan per phase sesuai exit gate di HLD §19. Jangan memilih vendor atau mengisi `OPEN DECISION` tanpa ADR dan persetujuan owner. Mock auth (`dev-*`) hanya untuk development.
