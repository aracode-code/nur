# Project Memory (L1) — NUR

> Pengetahuan reusable yang terverifikasi. Detail panjang tetap di `docs/` (dirujuk, bukan disalin).

## Identitas

- NUR = platform video pendek Islami untuk Indonesia; MVP **curated-first**, closed beta.
- Loop produk: **Temukan → Tonton → Simpan/Bagikan → Lanjutkan serial**.
- North star: meaningful watch sessions per weekly active user (definisi operasional masih OD-09).

## Invariant domain (tidak boleh dilanggar)

- Konten publik hanya jika `editorial_status=approved` **dan** `publication_status=published`.
- Upload/transcode sukses **≠** publikasi; publish adalah aksi eksplisit, permission-gated, diaudit.
- Tiga status terpisah: media processing, editorial, publication — jangan digabung menjadi satu enum.
- Reviewer tidak boleh menyetujui konten sendiri; creator tidak boleh mempublikasikan melewati review.
- Semua aksi sensitif menulis `audit_logs` (append-only, tanpa endpoint update/delete).
- Webhook provider: verifikasi signature, dedup event ID, hanya memperbarui status media.
- Takedown/restrict harus hilang dari feed/search dari sumber kebenaran database, lalu purge ke provider/CDN.

## Keputusan default (owner-authorized 2026-10-20, reversible)

- **Backend:** modular monolith FastAPI + SQLAlchemy async + Alembic + PostgreSQL 16 + FTS (ADR-0001/0003).
- **Frontend:** React Native + Expo + TS (mobile, Android-first), React + Vite + TS (studio/admin), Tailwind + tokens, pnpm workspace (ADR-0002).
- **Video:** adapter-first + mock; vendor tetap OPEN sampai PoC (ADR-0004, OD-02).
- **Auth:** adapter-first; Supabase Auth kandidat; role selalu dari DB (ADR-0005, OD-03).
- **Deploy:** container + managed PostgreSQL; vendor/region OPEN (ADR-0006, OD-04).
- **Analytics:** first-party `product_events`; meaningful session = ≥1 video ≥70%/completed + save/share/continuation, provisional (ADR-0007, OD-09/OD-14).
- **Publish:** `review:decide` dan `publish:execute` terpisah, audit ganda (ADR-0009, OD-15).
- **Website/SEO:** post-MVP, tanpa sitemap/robots (ADR-0008, OD-13).
- **Notifikasi:** in-app only (ADR-0010, OD-16).
- **Masih OPEN (tidak boleh diisi):** OD-05, OD-06, OD-07, OD-08, OD-10, OD-11, OD-12, OD-17.

## Otoritas dokumen

1. ACTUAL CODE / CONFIG / TEST RESULT.
2. `docs/architecture/HLD.md` (scope, keamanan, permission) dan `docs/architecture/LLD.md` (kontrak implementasi).
3. `docs/design/NUR_UX_UI_Design_Prototype.html` — visual saja; konflik dengan keamanan → HLD menang.
4. `docs/architecture/decisions/OPEN-DECISIONS.md` — register keputusan terbuka.

## Struktur proyek

- `knowledge/` = OS agent (state, memory, context, tasks, index).
- `docs/` = produk, arsitektur, desain.
- Tidak ada duplikasi isi HLD/LLD di `knowledge/`.

## Kesalahan agent yang harus dihindari

- Mengisi `OPEN DECISION` tanpa ADR dan persetujuan owner.
- Menampilkan data mock/prototype sebagai data produksi.
- Melakukan redesign atau mengganti palet prototipe.
- Mengklaim test/build lulus tanpa eksekusi aktual.
- Menyembunyikan tombol sebagai pengganti authorization backend.
