# ADR-0001 — Modular Monolith untuk Backend MVP

- **Status:** Accepted (default, diotorisasi owner 2026-10-20) — dapat ditinjau ulang
- **Tanggal:** 2026-10-20
- **Pemilik keputusan:** Tech lead
- **Terkait:** HLD §5.2, LLD §3.1, `.qoder/project-rules.md`

## Konteks

MVP harus mengirim katalog, feed, video lifecycle, review editorial, moderasi, audit, dan analytics dengan tim kecil. Microservices menambah biaya operasional, latensi jaringan, dan kompleksitas transaksi/distribusi tanpa bukti kebutuhan skala atau isolasi tim.

## Keputusan

Satu deployment backend **FastAPI** dengan dua belas domain module yang dipisahkan secara tegas:

`identity` · `profiles` · `catalog` · `video_lifecycle` · `feed` · `search` · `series` · `engagement` · `creator_ops` · `trust_safety` · `analytics` · `admin_audit`

Setiap module memiliki empat lapisan:

1. **Router** — HTTP, parsing, response mapping, dependency injection.
2. **Service/use-case** — aturan bisnis, transaksi, otorisasi.
3. **Repository** — query persistence.
4. **Integration adapter** — vendor auth/video/notification.

Aturan:

- Domain module tidak mengimpor router module lain; interaksi melalui service/interface.
- Background worker adalah proses terpisah dengan codebase dan domain module yang sama.
- Satu database PostgreSQL; tidak ada akses tabel lintas module tanpa repository pemilik.
- Tidak ada message broker kompleks sampai ada kebutuhan terukur; outbox + worker cukup.

## Konsekuensi

- **Positif:** deployment sederhana, transaksi lokal, debugging mudah, biaya rendah.
- **Negatif:** risiko coupling dan satu titik kegagalan; disiplin batas module harus ditegakkan di review.
- **Operasional:** worker dan API dapat diskalakan terpisah tanpa memecah domain.
- **Revisit trigger:** kebutuhan isolasi keamanan, bottleneck terukur pada satu module, atau tim yang benar-benar independen.

## Bukti / referensi

HLD §5.2 dan LLD §3.1 sudah menetapkan pola ini; ADR mencatatnya sebagai keputusan baseline agar tidak diubah diam-diam.
