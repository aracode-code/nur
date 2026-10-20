# ADR-0010 — Notifikasi MVP: In-App

- **Status:** Accepted (default, diotorisasi owner 2026-10-20)
- **Tanggal:** 2026-10-20
- **Pemilik keputusan:** Product
- **Terkait:** LLD §20.11, OD-16

## Konteks

Kreator perlu mengetahui hasil review dan status konten; pengguna perlu umpan balik laporan. Push notification dan email transaksional menambah izin perangkat, vendor, dan kepatuhan.

## Keputusan

1. MVP hanya menyediakan **status in-app**: Creator Studio (status review, alasan revisi/penolakan) dan halaman laporan pengguna.
2. Email hanya dipakai untuk kebutuhan autentikasi/keamanan yang disediakan managed auth (verifikasi, reset, keamanan akun).
3. Push notification, email marketing, dan digest ditunda ke post-MVP.
4. Semua status yang ditampilkan berasal dari state backend, bukan pesan optimistis frontend.

## Konsekuensi

- **Positif:** tanpa izin push tambahan, tanpa vendor notifikasi, scope kecil.
- **Negatif:** kreator harus membuka studio untuk melihat perubahan status; risiko keputusan terlambat.
- **Revisit trigger:** kreator melewatkan revisi, kebutuhan retensi pengguna, atau sebelum public pilot.

## Bukti / referensi

LLD §20.11 (notification channel) — ditutup sebagai default in-app.
