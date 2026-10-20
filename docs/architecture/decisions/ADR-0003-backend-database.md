# ADR-0003 — Backend dan Database

- **Status:** Accepted (default, diotorisasi owner 2026-10-20) — dapat ditinjau ulang
- **Tanggal:** 2026-10-20
- **Pemilik keputusan:** Tech lead
- **Terkait:** HLD §3, LLD §4, LLD §6, LLD §11

## Konteks

Backend harus menyediakan API metadata, otorisasi, workflow editorial, audit, dan event analytics dengan transaksi yang konsisten. Dataset awal kecil–menengah dan bentuk relasinya jelas.

## Keputusan

| Area | Keputusan |
|---|---|
| Bahasa/framework | Python 3.12 + FastAPI |
| Validasi | Pydantic v2 (request/response terpisah dari ORM) |
| ORM/migrasi | SQLAlchemy 2.x (async) + Alembic |
| Database | PostgreSQL 16 |
| Search MVP | PostgreSQL full-text search (`tsvector` + GIN) |
| Testing | pytest + httpx/TestClient; database uji terpisah |
| ID | UUID (v7 bila tersedia, jika tidak v4) |
| Waktu | `timestamptz` UTC di database; ISO 8601 di API |

Aturan:

- Repository pattern; service tidak menulis SQL ad-hoc lintas module.
- Migration wajib review; perubahan destruktif memakai expand-migrate-contract.
- Constraint/enum divalidasi di database dan service (bukan string bebas).
- Tidak menyimpan binary video di PostgreSQL.
- Full-text search tidak menggantikan sistem pencarian khusus sampai volume membuktikan kebutuhan.

## Konsekuensi

- **Positif:** transaksi kuat, query relasional jelas, tooling matang, biaya operasional rendah.
- **Negatif:** async SQLAlchemy menambah kompleksitas; full-text PostgreSQL terbatas untuk ranking lanjutan.
- **Revisit trigger:** volume/pencarian melampaui kapasitas FTS, kebutuhan analitik berat, atau kebutuhan multi-region.

## Bukti / referensi

HLD §3 dan LLD §4/§6/§11. Nama library (SQLAlchemy/Alembic) adalah default implementasi, bukan keputusan vendor eksternal.
