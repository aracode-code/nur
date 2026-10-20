# ADR-0002 — Frontend Stack dan Platform Target

- **Status:** Accepted (default, diotorisasi owner 2026-10-20) — dapat ditinjau ulang
- **Tanggal:** 2026-10-20
- **Pemilik keputusan:** Tech lead + product
- **Terkait:** HLD §3, HLD §17, LLD §3, OD-01

## Konteks

NUR membutuhkan tiga pengalaman: aplikasi mobile feed vertikal, Creator Studio, dan Admin/Moderation Console. Tim ingin satu bahasa (TypeScript), konsistensi desain, dan kecepatan iterasi tanpa memelihara dua codebase web terpisah.

## Keputusan

| Target | Stack |
|---|---|
| Mobile | React Native + Expo + TypeScript (Expo Router) |
| Creator Studio | React + Vite + TypeScript + React Router |
| Admin Console | React + Vite + TypeScript + React Router |
| Styling | Tailwind CSS + design tokens terpusat (`packages/design-tokens`) |
| Monorepo | pnpm workspace; `packages/contracts`, `api-client`, `design-tokens`, `eslint-config` |
| Platform beta | **Android-first** (OD-01 default); iOS menyusul setelah stabilitas |

Aturan:

- Mobile dan web berbagi kontrak tipe dari `packages/contracts`; tidak ada duplikasi schema manual.
- Design token adalah satu sumber warna/radius/spacing/breakpoint; komponen tidak memakai nilai acak.
- Prototype HTML adalah acuan visual, bukan arsitektur produksi.

## Konsekuensi

- **Positif:** satu ekosistem TypeScript, komponen dan token dapat dibagi, iterasi cepat.
- **Negatif:** validasi video player/DRM di Expo harus dilakukan sebelum fitur playback dikunci; iOS tertunda.
- **Risiko:** kebutuhan native (player, DRM, background upload) dapat memaksa config plugin atau prebuild.
- **Revisit trigger:** PoC playback gagal di Expo Go/managed workflow; kebutuhan iOS mendahului rencana; kebutuhan SEO web (lihat ADR-0008).

## Bukti / referensi

HLD §3 (tabel stack), LLD §3 (struktur repository). OD-01 ditutup sebagai default Android-first pada 2026-10-20.
