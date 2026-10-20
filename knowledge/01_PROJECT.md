# 01 — NUR Platform Project Profile

**Produk:** NUR — Short Islamic Video Platform (Indonesia)
**Status:** Phase 0 — Repository Bootstrap (2026-10-20)
**Dokumen kanonik:** `docs/architecture/HLD.md` (NUR-HLD-001 v1.1), `docs/architecture/LLD.md` (NUR-LLD-001 v1.0)

## 1. Ringkasan

NUR adalah platform video pendek Islami untuk audiens Indonesia. MVP membuktikan loop:

**Temukan → Tonton → Simpan/Bagikan → Lanjutkan serial.**

Tiga pilar konten: **Ilmu Praktis**, **Kisah & Inspirasi**, **Serial Terstruktur**.
Format target: video vertikal 15–90 detik; serial 5–10 episode.

## 2. Prinsip non-negotiable

1. **Trust by design** — sumber, hak cipta, review, koreksi, pelaporan, banding, audit adalah fitur inti.
2. **Curated-first** — hanya kreator yang diundang/diverifikasi dapat submit konten.
3. **Mobile-first** — pengalaman utama adalah feed vertikal.
4. **Modular monolith** — microservices hanya bila ada bukti bottleneck/isolasi/tim independen.
5. **NUR bukan otoritas fatwa** — isu keagamaan kompleks dieskalasi ke reviewer/penasihat kompeten.
6. **Server = sumber kebenaran** untuk role, permission, status editorial, dan status publikasi.
7. **Evidence-driven** — target metrik adalah hipotesis sampai baseline pilot diperoleh.
8. **Prototype = acuan visual** — dilarang redesign tanpa persetujuan; data demo bukan data produksi.

## 3. Scope MVP

- Katalog video pendek terkurasi + feed cursor-based (ranking editorial/freshness, bukan ML).
- Search katalog (PostgreSQL full-text).
- Detail/playback, serial/playlist, progres dan continuation.
- Simpan video, bagikan tautan, laporkan konten.
- Creator Studio (kreator undangan): draft, upload, metadata/sumber/hak, submit review, status.
- Admin Console: review editorial, laporan, takedown, banding, koreksi, kategori, serial, user/role, audit.
- Analytics event berversi + metrik biaya video.
- Closed beta dengan kreator terpilih.

## 4. Non-goals MVP

Live streaming · open upload · chat/messaging · marketplace/pembayaran kompleks · membership kompleks · feed rekomendasi ML · aplikasi desktop native.

## 5. Stack (status 2026-10-20)

| Area | Baseline | Status |
|---|---|---|
| Mobile | React Native + Expo + TypeScript | Proposed |
| Creator Studio / Admin | React + Vite + TypeScript | Proposed |
| UI web | Tailwind CSS + design tokens | Proposed |
| API | FastAPI + Python | Proposed |
| Database | PostgreSQL | Proposed |
| Auth | Managed auth (Supabase Auth kandidat) | **OPEN DECISION (OD-03)** |
| Video | Provider terkelola / object storage + transcoding + CDN | **OPEN DECISION (OD-02)** |
| Background jobs | Worker + retry; queue terkelola bila perlu | Proposed |
| Deployment | Staging & production terpisah, containerized API | Proposed |
| Monorepo | pnpm workspace (frontend) + backend Python | Proposed |
| Platform target | Android-first vs Android+iOS | **OPEN DECISION (OD-01)** |
| Website publik/SEO | Termasuk MVP? | **OPEN DECISION (OD-13)** |

## 6. Modul backend (12 domain)

`identity` · `profiles` · `catalog` · `video_lifecycle` · `feed` · `search` · `series` · `engagement` · `creator_ops` · `trust_safety` · `analytics` · `admin_audit`
Plus: `integrations/` (auth, video, notification), `jobs/`, `db/`, `api/v1/`.

Batas modul: router → HTTP; service/use-case → bisnis + transaksi; repository → query; adapter → vendor. Domain module tidak mengimpor router modul lain.

## 7. Aktor & role

`visitor` · `user` · `creator` · `reviewer` · `moderator` · `admin` · `analyst` · `scholar_advisor`.
Multi-role melalui tabel relasi; role tidak disimpan sebagai satu string di profil.

## 8. Entitas data inti

`users` · `roles`/`user_roles` · `profiles` · `creator_profiles` · `categories` · `videos` · `video_sources` · `video_rights` · `video_assets` · `video_review_events` · `series`/`series_episodes` · `saved_videos` · `watch_progress` · `content_reports` · `moderation_cases` · `appeals` · `corrections` · `audit_logs` · `product_events` · `idempotency_keys` · `outbox_events`.

Aturan data: UUID, `timestamptz` UTC, enum tervalidasi, index untuk status/kategori/creator/publikasi, tanpa binary video di PostgreSQL.

## 9. State machine konten

| Lapisan | Status |
|---|---|
| Media processing | `initiated → uploading → processing → ready_for_review` (`failed` ↔ retry) |
| Editorial | `draft → submitted → in_review → revision_requested/approved/rejected/escalated` |
| Publication | `unpublished · published · restricted · taken_down · archived` |

**Gate publikasi:** hanya `approved` + `published` yang boleh muncul di feed/search/detail/playback.

## 10. API surface

Base `/api/v1`, OpenAPI sebagai kontrak, cursor pagination, error envelope `{error:{code,message,request_id,details}}`, `Idempotency-Key`, rate limit.
Grup: public catalog/feed · me/engagement · creator · admin/moderation · webhook provider.

## 11. Frontend

`apps/mobile` (RN+Expo) · `apps/studio` · `apps/admin` · `packages/design-tokens`.
Setiap layar wajib punya state: idle, loading, success, empty, error, unauthorized.
Responsive check: 320/375/768/1024/1280/1440px.

## 12. Fase & exit gate

| Phase | Isi | Gate |
|---|---|---|
| 0 | Repository bootstrap + knowledge OS | Struktur jelas, tanpa secret, open decisions tercatat |
| 1 | ADR stack, permission matrix, threat model, ERD, OpenAPI awal, UX spec | Owner menyetujui HLD/ADR/LLD |
| 2 | Backend foundation, auth adapter, migrations, CI | CI hijau, permission test lulus |
| 3 | Content & video lifecycle | Upload→publish lulus integration test, draft tidak bocor |
| 4 | User experience MVP | Acceptance test journey inti lulus |
| 5 | Trust & operations | Simulasi report→takedown→appeal lulus |
| 6 | Analytics & closed beta | Baseline metrik + keputusan go/revise/stop |
| 7 | Public pilot | Kapasitas moderasi & biaya memenuhi kriteria |
| 8 | Membership/ecosystem | Hanya setelah retensi terbukti |

## 13. Peta dokumen

| Kebutuhan | Lokasi |
|---|---|
| Scope & keamanan | `docs/architecture/HLD.md` |
| Implementasi & kontrak | `docs/architecture/LLD.md` |
| Visual | `docs/design/NUR_UX_UI_Design_Prototype.html` |
| Keputusan terbuka | `docs/architecture/decisions/OPEN-DECISIONS.md` |
| Keputusan default (ADR) | `docs/architecture/decisions/` (ADR-0001…0010) |
| Permission & route | `docs/architecture/route-permission-matrix.md` |
| Data model | `docs/architecture/data-model.md` |
| API | `docs/architecture/api-overview.md` |
| Keamanan | `docs/architecture/security-privacy.md` |
| Navigasi & journey | `docs/product/navigation-and-sitemap.md`, `user-journeys.md` |
| UX/UI | `docs/design/UX_UI_IMPLEMENTATION_SPEC.md` |
| Aturan agent | `.qoder/project-rules.md`, `AGENTS.md` |
| State & task | `knowledge/.qoder/`, `knowledge/tasks/` |

## 14. Batas `knowledge/` vs `docs/`

- `knowledge/` = lapisan state, memori, konteks, dan task agent (AGENTS.md §2).
- `docs/` = dokumen produk, arsitektur, dan desain.
- HLD/LLD tidak disalin; `knowledge/` hanya merujuk untuk mencegah dokumentasi duplikat.

## 15. Implementasi saat ini (2026-10-20)

| Area | Status | Lokasi |
|---|---|---|
| Design tokens | Selesai | `packages/design-tokens` |
| AppShell + 5 halaman | Selesai (preview shell, data demo berlabel) | `apps/studio` |
| FastAPI foundation | Selesai (14 test) | `backend/app`, `backend/tests` |
| Identity nyata | Belum (mock `dev-*`) | — |
| Database/migration | Belum | — |
| Endpoint katalog/feed/search | Belum | — |
| OpenAPI contract test | Belum | — |

Backlog eksekusi: `docs/product/backlog-fastapi.md`.
