# ADR-0008 — Website Publik/SEO Ditunda (Post-MVP)

- **Status:** Accepted (default, diotorisasi owner 2026-10-20)
- **Tanggal:** 2026-10-20
- **Pemilik keputusan:** Product owner
- **Terkait:** HLD §26.4/§27, LLD §20.4, OD-13

## Konteks

HLD memuat struktur website publik dan aturan XML sitemap, tetapi statusnya belum diputuskan. Membangun situs publik menambah permukaan keamanan, konten, dan biaya sebelum retensi produk terbukti.

## Keputusan

1. **MVP tidak memiliki website publik/SEO.** Fokus pada mobile app, Creator Studio, dan Admin Console.
2. Tidak ada `/sitemap.xml`, `robots.txt`, canonical policy, atau landing SEO pada MVP.
3. URL publik video/kreator/serial tidak dijanjikan pada MVP; share menggunakan deep link aplikasi.
4. Dokumen `docs/seo/*` tidak dibuat sampai keputusan berubah.
5. Keputusan ini menutup OD-13 sebagai **default**, dapat dibuka kembali sebelum public pilot.

## Konsekuensi

- **Positif:** scope lebih kecil, tidak ada halaman SEO fiktif, permukaan serangan berkurang.
- **Negatif:** akuisisi awal bergantung pada distribusi kreator dan undangan; tidak ada indexing organik.
- **Revisit trigger:** strategi akuisisi membutuhkan halaman publik; kebutuhan share web; sebelum public pilot.

## Bukti / referensi

HLD §26.4 dan §27 secara eksplisit melarang membuat "sitemap SEO fiktif" bila website publik tidak termasuk scope.
