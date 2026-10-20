# ADR-0009 — Kewenangan Publikasi

- **Status:** Accepted (default, diotorisasi owner 2026-10-20)
- **Tanggal:** 2026-10-20
- **Pemilik keputusan:** Product + trust & safety
- **Terkait:** HLD §7.1/§10, LLD §7, OD-15

## Konteks

Approval editorial dan publikasi adalah dua peristiwa berbeda. Menyatukannya tanpa audit memungkinkan konten tampil tanpa jejak yang jelas; memisahkan role sepenuhnya menambah beban operasional pada MVP.

## Keputusan

1. **Approval editorial** dan **publikasi** adalah dua aksi terpisah dengan permission berbeda:
   - `review:decide` — approve/revise/reject/escalate.
   - `publish:execute` — mengubah `publication_status` menjadi `published`, `restricted`, atau `taken_down`.
2. Pada MVP, role `reviewer` **boleh** memegang kedua permission (satu alur kerja), tetapi setiap aksi menghasilkan **dua audit event terpisah**: `content.approved` dan `content.published`.
3. `approved` **tidak** otomatis berarti `published`; publikasi tetap aksi eksplisit.
4. Creator tidak pernah memiliki `publish:execute`; reviewer tidak dapat menyetujui konten sendiri.
5. Perubahan material pada metadata/sumber/hak setelah approval mengembalikan status editorial ke `in_review` (re-review terdokumentasi) dan dapat menarik publikasi bila sudah tayang.
6. Admin dapat melakukan publish/takedown dengan audit dan alasan.

## Konsekuensi

- **Positif:** jejak audit jelas, pemisahan domain tetap benar, operasi MVP tetap sederhana.
- **Negatif:** dua langkah pada alur kerja reviewer; risiko reviewer lupa publish (mitigasi: indikator status di queue).
- **Revisit trigger:** kebutuhan four-eyes publish, volume review meningkat, atau insiden publikasi keliru.

## Bukti / referensi

HLD §7.1 menyatakan approval dan publish boleh satu aksi pada MVP tetapi keduanya wajib tercatat. ADR ini memilih permission terpisah dengan audit ganda.
