# NUR — Knowledge Index

**Root:** `F:/Qoder/NUR`
**Status:** Phase 0 — Repository Bootstrap (2026-10-20)
**Agent OS:** `AGENTS.md` (AGY-QODER OS v4.3)

## 1. Mulai dari sini

| Kebutuhan | Dokumen |
|---|---|
| Profil proyek, scope, modul, fase | `knowledge/01_PROJECT.md` |
| Status sesi & langkah berikutnya | `knowledge/tasks/CURRENT.md` |
| State mesin | `knowledge/.qoder/state.json` |
| Konteks aktif (L0) | `knowledge/.qoder/context.md` |
| Memori proyek (L1) | `knowledge/.qoder/memory.md` |
| Status index kode | `knowledge/.qoder/index/index-state.json` |

## 2. Dokumen produk & arsitektur (kanonik)

| Dokumen | Peran |
|---|---|
| `docs/architecture/HLD.md` | NUR-HLD-001 v1.1 — scope, batas sistem, keamanan, permission, UX reference |
| `docs/architecture/LLD.md` | NUR-LLD-001 v1.0 — struktur kode, data model, API, state machine, testing |
| `docs/design/NUR_UX_UI_Design_Prototype.html` | Acuan visual yang disetujui (referensi, bukan kode produksi) |
| `docs/design/README.md` | Aturan penggunaan prototype |
| `docs/architecture/decisions/OPEN-DECISIONS.md` | Register keputusan terbuka (OD-01…OD-17) + status default |
| `docs/architecture/decisions/` | ADR-0001…0010: keputusan default arsitektur (monolith, stack, video, auth, deploy, analytics, SEO, publish, notifikasi) |
| `docs/architecture/decisions/ADR-0000-template.md` | Template Architecture Decision Record |
| `docs/architecture/route-permission-matrix.md` | Route, permission, dan negative test |
| `docs/architecture/data-model.md` | ERD, constraint, index, state machine |
| `docs/architecture/api-overview.md` | Konvensi API, endpoint map, error, rate limit |
| `docs/architecture/security-privacy.md` | Threat model awal, kontrol, privasi |
| `docs/product/navigation-and-sitemap.md` | Sitemap per aplikasi + status MVP |
| `docs/product/user-journeys.md` | 6 journey inti + state + jalur gagal |
| `docs/product/backlog-fastapi.md` | User story backlog backend (epic, AC, permission, phase) |
| `docs/design/UX_UI_IMPLEMENTATION_SPEC.md` | Tokens, komponen, AppShell, state matrix, acceptance |
| `.qoder/project-rules.md` | Aturan kerja coding agent |

## 3. Implementasi

| Path | Isi |
|---|---|
| `apps/studio` | Shell React + Vite: AppShell, sidebar, bottom nav, 5 halaman, komponen |
| `packages/design-tokens` | Token desain (CSS + TS) |
| `backend` | FastAPI foundation + tests (`backend/README.md`) |
| `pnpm-workspace.yaml` | Workspace `apps/*`, `packages/*` |

## 3. Peta cepat domain

- **Produk:** video pendek Islami, curated-first, closed beta Indonesia.
- **Loop MVP:** Temukan → Tonton → Simpan/Bagikan → Lanjutkan serial.
- **Backend:** FastAPI + PostgreSQL, modular monolith, 12 domain module.
- **Frontend:** mobile (React Native/Expo), Creator Studio, Admin Console.
- **Gate publikasi:** `editorial_status=approved` **dan** `publication_status=published`.

## 4. Tasks

- `knowledge/tasks/CURRENT.md` — Phase 0 (aktif)
- `knowledge/tasks/BACKLOG.md` — Phase 1–8 + gap dokumentasi
- `knowledge/tasks/DONE.md` — arsip

## 5. Aturan index

- `knowledge/` menyimpan state/index agent; `docs/` menyimpan dokumen produk.
- Isi HLD/LLD **tidak** disalin ke `knowledge/` — dirujuk, bukan diduplikasi.
- Index kode belum tersedia (`UNAVAILABLE`) sampai `backend/` dan `apps/` diinisialisasi.
