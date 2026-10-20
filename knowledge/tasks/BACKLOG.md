# BACKLOG — NUR

Urutan mengikuti HLD §19 dan LLD §17. Setiap item menunjuk sumber; tidak ada duplikasi isi.

## Gate sebelum Phase 1

- [ ] OD-01 Platform target beta (Android-first vs Android+iOS) — `OPEN-DECISIONS.md`
- [ ] OD-02 Video provider + PoC biaya/playback — `OPEN-DECISIONS.md`
- [ ] OD-03 Auth provider + metode login — `OPEN-DECISIONS.md`
- [ ] OD-13 Website publik/SEO termasuk MVP? — `OPEN-DECISIONS.md`

## Phase 1 — Architecture validation & design foundation

- [x] ADR-0001 modular monolith (`docs/architecture/decisions/`)
- [x] ADR-0002 frontend stack + Android-first (OD-01 default)
- [x] ADR-0003 backend & database
- [x] ADR-0004 video adapter-first (OD-02 partial)
- [x] ADR-0005 auth adapter-first (OD-03 partial)
- [x] ADR-0006 deployment (OD-04 partial)
- [x] ADR-0007 analytics first-party + meaningful session
- [x] ADR-0008 website/SEO post-MVP (OD-13 default)
- [x] ADR-0009 publish authority (OD-15 default)
- [x] ADR-0010 notifications (OD-16 default)
- [x] Permission matrix (`docs/architecture/route-permission-matrix.md`)
- [x] Threat model awal (`docs/architecture/security-privacy.md`)
- [x] ERD + data model (`docs/architecture/data-model.md`)
- [x] API overview (`docs/architecture/api-overview.md`)
- [x] `docs/design/UX_UI_IMPLEMENTATION_SPEC.md`
- [x] `docs/product/navigation-and-sitemap.md`, `docs/product/user-journeys.md`
- [x] OpenAPI spec digenerate dari FastAPI (Phase 2) — `/api/v1/openapi.json`
- [x] Design tokens + AppShell (UX Gate A)
- [x] Visual review AppShell (tablet + mobile 375px harness)
- [x] `docs/product/backlog-fastapi.md`

## Phase 2 — Backend foundation

- [x] FastAPI app, settings, structured logging, request ID, error schema, health/readiness
- [x] Auth adapter interface + permission dependencies (mock sampai OD-03)
- [x] Foundation tests (14 passed)
- [ ] OpenAPI contract test (BE-008)
- [ ] PostgreSQL migrations, repository/service pattern, test database
- [ ] Typed API client generation untuk studio
- [ ] CI: lint, typecheck, unit/integration, migration check, secret/dependency scan

## Phase 3 — Catalog & playback

- [ ] Categories, feed, search, video detail, series, playback adapter interface
- [ ] Seed data development (ditandai jelas, bukan produksi)
- [ ] Integrasi provider hanya setelah PoC disetujui

## Phase 4 — User engagement

- [ ] Saved videos, watch progress, report, analytics event schema
- [ ] E2E: Temukan → Tonton → Simpan/Bagikan → Lanjutkan serial

## Phase 5 — Creator Studio & video lifecycle

- [ ] Draft, metadata, sources, rights, upload intent, processing status, retry
- [ ] Submit review + status tracking; ownership enforcement

## Phase 6 — Review, moderation, admin

- [ ] Review queue, decisions, reason codes, reports, cases, takedown, appeal, correction
- [ ] User/role admin + audit log; outbox + worker + purge/retry
- [ ] Negative permission tests untuk semua aksi sensitif

## Phase 7 — Hardening & closed beta

- [ ] Load/performance, security review, backup/restore drill, provider cost test
- [ ] Runbook moderasi; beta cohort terbatas

## Phase 8 — Membership/ecosystem (post-retention)

- [ ] HLD tambahan untuk subscription/payment/entitlements sebelum implementasi

## Dokumentasi yang masih hilang

- [x] `docs/design/UX_UI_IMPLEMENTATION_SPEC.md`
- [x] `docs/product/navigation-and-sitemap.md`, `docs/product/user-journeys.md`
- [x] `docs/architecture/route-permission-matrix.md`
- [x] `docs/architecture/data-model.md`, `api-overview.md`, `security-privacy.md`
- [ ] `docs/architecture/video-pipeline.md` (setelah OD-02)
- [ ] `docs/operations/*` (local-development, deployment, backup-restore, moderation-runbook)
- [ ] `docs/quality/test-strategy.md`, `acceptance-criteria.md`
- [ ] `docs/seo/*` — tidak dibuat (ADR-0008)
