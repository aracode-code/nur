# ADR-0005 — Strategi Autentikasi (Adapter-First)

- **Status:** Accepted (default, diotorisasi owner 2026-10-20) — vendor belum dikunci
- **Tanggal:** 2026-10-20
- **Pemilik keputusan:** Tech lead + product
- **Terkait:** HLD §3, LLD §5, OD-03

## Konteks

Aplikasi tidak boleh membangun penyimpanan password sendiri. Role dan permission tetap milik NUR, dan admin membutuhkan perlindungan lebih kuat. Vendor auth belum diputuskan.

## Keputusan

1. Gunakan **managed auth** melalui adapter internal (`AuthProvider`): verifikasi token, refresh/session, user provisioning, deletion hook.
2. Kandidat utama: **Supabase Auth** (email/OTP), tetapi **belum dikunci**; keputusan final setelah PoC (OD-03).
3. Identitas internal dipetakan ke `users.auth_subject`; **role selalu diambil dari database NUR**, tidak pernah dari klaim client.
4. Development/test memakai **provider mock** berbasis token lokal; tidak ada kredensial nyata di repo.
5. Admin wajib MFA bila vendor mendukung; bila tidak, kompensasi: sesi pendek, IP/device review, audit ketat, dan risiko dicatat.
6. Logout, revoke, dan account deletion mengikuti lifecycle vendor; NUR menyimpan status `pending_deletion`/`deleted`.

## Konsekuensi

- **Positif:** tidak menyimpan password, integrasi cepat, MFA tersedia bila vendor mendukung.
- **Negatif:** ketergantungan vendor pada session/identity; migrasi user memerlukan perencanaan.
- **Risiko:** MFA tidak tersedia pada paket terpilih → wajib mitigasi terdokumentasi.
- **Revisit trigger:** PoC auth selesai, kebutuhan MFA/SAML/enterprise, atau perubahan harga/kebijakan vendor.

## Bukti / referensi

HLD §3/§13.1, LLD §5. Belum ada PoC — status: **belum terverifikasi**.
