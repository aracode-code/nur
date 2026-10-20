# NUR — Open Decisions Register

**Status:** aktif (diperbarui 2026-10-20)
**Sumber:** HLD §22, HLD §26.4/§27, LLD §20

Register ini **menggabungkan** daftar dari HLD dan LLD menjadi satu daftar kanonik. Bila ada perbedaan redaksi, HLD/LLD tetap menjadi penjelas; register ini yang menjadi status operasional.

## Legenda status

| Status | Arti |
|---|---|
| `OPEN` | Belum diputuskan; tidak boleh diisi diam-diam. |
| `DEFAULT` | Keputusan default diotorisasi owner 2026-10-20; dicatat di ADR; dapat ditinjau ulang. |
| `PARTIAL` | Arah sudah ditetapkan (adapter-first), tetapi bagian (vendor/region) masih terbuka. |
| `CLOSED` | Diputuskan final melalui ADR. |

## Aturan

- Setiap penutupan wajib memiliki ADR dan memperbarui kolom Status.
- `DEFAULT` tetap harus ditinjau sebelum fase yang bergantung padanya; bukan izin untuk mengabaikan bukti.
- Keputusan yang menyentuh vendor, biaya, privasi, skema, atau kontrak eksternal wajib melalui ADR.
- Selama `OPEN`/`PARTIAL`, implementasi memakai interface adapter + mock.

## Register

| ID | Keputusan | Owner disarankan | Harus ditutup sebelum | Status | Sumber / ADR |
|---|---|---|---|---|---|
| OD-01 | Platform target beta | Product owner | Phase 1 | **DEFAULT** — Android-first | HLD §22, LLD §20.3, ADR-0002 |
| OD-02 | Video provider + PoC biaya | Tech lead + finance | Integrasi Phase 3 | **PARTIAL** — adapter + mock; vendor OPEN | HLD §22, LLD §20.1, ADR-0004 |
| OD-03 | Auth provider + metode login | Tech lead + product | Phase 2 | **PARTIAL** — adapter + mock; Supabase kandidat, belum dikunci | HLD §22, LLD §20.2, ADR-0005 |
| OD-04 | Hosting API/database + region | Tech lead | Staging pertama | **PARTIAL** — container + managed PG; vendor/region OPEN | HLD §22, ADR-0006 |
| OD-05 | Umur minimum + child-safety policy | Product/legal | Closed beta | OPEN | HLD §22 |
| OD-06 | Editorial review rubric + escalation | Editorial owner/advisory panel | Upload pilot | OPEN | HLD §22 |
| OD-07 | SLA laporan/takedown/banding | Trust & safety owner | Closed beta | OPEN | HLD §22 |
| OD-08 | Privacy, retention, deletion, consent | Product/legal | Beta | OPEN | HLD §22 |
| OD-09 | Definisi meaningful watch session | Product/analytics | Analytics release | **DEFAULT** — ≥70% atau completed + save/share/continuation (provisional) | HLD §22, ADR-0007 |
| OD-10 | Bahasa subtitle + accessibility baseline | Product/design | Beta | OPEN | HLD §22 |
| OD-11 | Target NFR/SLO + RPO/RTO | Tech lead/operations | Production | OPEN | HLD §22 |
| OD-12 | Sponsor disclosure + approval policy | Business/editorial | Sponsor pilot | OPEN | HLD §22 |
| OD-13 | Website publik/SEO termasuk MVP? | Product owner | Phase 1 | **DEFAULT** — post-MVP, tanpa SEO | HLD §26.4/§27, LLD §20.4, ADR-0008 |
| OD-14 | Analytics vendor | Product/analytics | Phase 6 | **DEFAULT** — first-party events, vendor ditunda | LLD §20.6, ADR-0007 |
| OD-15 | Kewenangan publish | Product + trust & safety | Phase 6 | **DEFAULT** — permission terpisah, audit ganda | LLD §20.7, ADR-0009 |
| OD-16 | Notification channel | Product | Phase 4 | **DEFAULT** — in-app only | LLD §20.11, ADR-0010 |
| OD-17 | Format deklarasi/bukti hak kreator | Legal/editorial | Upload pilot | OPEN | LLD §20.12 |

## Ringkasan blokir

- **Tidak ada** item yang memblokir pekerjaan dokumentasi Phase 1.
- OD-02/OD-03/OD-04 memblokir integrasi nyata (Phase 3/staging), bukan scaffold adapter/mock.
- OD-05/OD-07/OD-08/OD-10/OD-17 memblokir beta publik; wajib ditutup sebelum closed beta.
- OD-11 memblokir production (SLO/RPO/RTO).
