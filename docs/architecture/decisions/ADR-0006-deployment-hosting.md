# ADR-0006 — Deployment dan Lingkungan

- **Status:** Accepted (default, diotorisasi owner 2026-10-20) — provider/region belum dipilih
- **Tanggal:** 2026-10-20
- **Pemilik keputusan:** Tech lead / operations
- **Terkait:** HLD §16, LLD §16, OD-04

## Konteks

MVP membutuhkan staging yang mendekati production, backup, observability, dan jalur rilis yang dapat di-rollback, tanpa mengunci vendor hosting lebih awal.

## Keputusan

1. API dikemas sebagai **container**; database **managed PostgreSQL**; media melalui video provider/object storage (ADR-0004).
2. Empat lingkungan: `local`, `test`, `staging`, `production` — terpisah, secrets terpisah.
3. CI minimum (LLD §16.2): lint → typecheck → unit → integration → build → migration check → secret/dependency scan → deploy staging → smoke test → approval → production.
4. Migration produksi memakai strategi expand-migrate-contract; migration destruktif memerlukan backup + rollback plan.
5. Observability minimum: request ID, structured JSON logs, error tracking, metrics, alert error rate & provider failure.
6. **Vendor hosting dan region tetap OPEN (OD-04)**; diputuskan sebelum staging pertama.
7. IaC ditambahkan saat provider dipilih; tidak membangun abstraksi cloud sebelum itu.

## Konsekuensi

- **Positif:** portabel, staging realistis, rilis dapat di-rollback.
- **Negatif:** biaya dan latensi region belum diketahui; beberapa keputusan operasional menunggu vendor.
- **Revisit trigger:** OD-04 diputuskan; kebutuhan multi-region; biaya melampaui anggaran pilot.

## Bukti / referensi

HLD §16, LLD §16. Tidak ada deployment yang dijalankan — status: **belum diverifikasi**.
