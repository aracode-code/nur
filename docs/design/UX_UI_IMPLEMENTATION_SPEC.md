# NUR — UX/UI Implementation Spec

**Status:** baseline Phase 1 (2026-10-20)
**Sumber otoritatif:** HLD §28–29 · `docs/design/NUR_UX_UI_Design_Prototype.html` (acuan visual)
**Stack:** React + Vite + TS (studio/admin), React Native + Expo (mobile), Tailwind + design tokens (ADR-0002)

> Prototype adalah **referensi visual dan interaksi**, bukan kode produksi. Data demo bukan data produksi.

## 1. Prinsip implementasi

1. Content-first: judul, poster, kategori, kreator, dan aksi utama mudah dipindai.
2. Calm premium: dark surface, ruang kosong cukup, border halus, aksen terbatas.
3. Trust visible: status verifikasi, status review, sumber, dan hak tampil pada konteksnya.
4. Satu aksi utama per konteks; aksi sekunder lebih tenang.
5. Responsive by design, bukan sekadar diperkecil.
6. Accessible: fokus keyboard terlihat, kontras memadai, status tidak hanya warna.
7. Consistency: semua nilai visual dari token terpusat.

## 2. Design tokens

### 2.1 Warna

| Token | Nilai | Penggunaan |
|---|---|---|
| `color.bg` | `#07151D` | Background utama |
| `color.surface` | `#0D222D` | Panel/card |
| `color.surfaceRaised` | `#122D39` | Panel menonjol |
| `color.surfaceHover` | `#183844` | Hover/selected |
| `color.text` | `#F4F7F4` | Teks utama |
| `color.textMuted` | `#9EB2B8` | Teks sekunder |
| `color.textSubtle` | `#6E8992` | Label nonutama |
| `color.primary` | `#32D4BD` | CTA utama, indikator aktif |
| `color.primaryText` | `#062522` | Teks di atas CTA |
| `color.gold` | `#E9C879` | Aksen premium (bukan CTA) |
| `color.border` | `rgba(190,220,221,.13)` | Border halus |
| `color.danger` | `#F18E82` | Error/eskalasi, selalu dengan label |

Aturan: dark theme only sampai ada persetujuan; dilarang menambah warna acak per halaman.

### 2.2 Radius & border

| Token | Nilai |
|---|---|
| `radius.control` | `12px` |
| `radius.card` | `16–20px` |
| `radius.hero` | `24px` |
| `radius.pill` | `999px` |
| `border.hairline` | `1px solid color.border` |

### 2.3 Spacing

Skala 4/8: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.
Gunakan `space.1…space.16`; dilarang nilai acak.

### 2.4 Tipografi

Font stack sistem modern (tanpa dependensi font eksternal kecuali disetujui).

| Token | Size / line-height | Weight |
|---|---|---|
| `text.display` | 32 / 38 | 700 |
| `text.h1` | 28 / 34 | 700 |
| `text.h2` | 22 / 28 | 600 |
| `text.h3` | 18 / 24 | 600 |
| `text.body` | 16 / 24 | 400 |
| `text.bodyS` | 14 / 20 | 400 |
| `text.caption` | 12 / 16 | 400 |
| `text.overline` | 11 / 16, tracking .08em | 600 |

### 2.5 Layout & breakpoint

| Token | Nilai |
|---|---|
| `layout.sidebar` | `248px` (desktop besar) |
| `layout.contentMax` | `1500px` |
| `breakpoint.mobile` | `< 760px` |
| `breakpoint.tablet` | `760–1120px` |
| `breakpoint.desktop` | `> 1120px` |

### 2.6 Elevation & motion

- Elevation: `0` flat, `1` `0 8px 24px rgba(0,0,0,.24)` (card terangkat), `2` modal.
- Motion: 120ms (hover), 180ms (transisi), 240ms (panel); `ease-out`; hormati `prefers-reduced-motion`.

## 3. AppShell

**Desktop/tablet:**
- Sidebar kiri tetap, BrandMark di atas, grup `Ruang Belajar`, `Ruang Kreator`, `Akun`.
- Topbar: breadcrumb, search, akses koleksi, avatar.
- Konten max-width 1500px; heading + deskripsi + aksi konsisten.
- Sidebar/topbar boleh sticky tanpa menutupi konten atau fokus keyboard.

**Mobile:**
- Sidebar disembunyikan; bottom navigation: `Beranda`, `Jelajahi`, `Serial`, `Tersimpan`, `Profil`.
- Hormati safe area.
- Creator Studio/Moderasi tetap dapat diakses sesuai role (bukan di bottom nav).
- Tanpa horizontal overflow pada 320px.
- Tabel boleh scroll horizontal terlokalisasi, bukan seluruh halaman.

**Navigasi mengikuti permission (lihat `route-permission-matrix.md`); elemen visual tidak memberi akses.**

## 4. Component inventory

| Komponen | Varian | State wajib |
|---|---|---|
| `AppShell` | desktop, mobile | default |
| `BrandMark` | full, compact | default |
| `DesktopSidebar` | expanded, collapsed | active, hover, focus-visible |
| `MobileBottomNavigation` | — | active, inactive, focus |
| `Topbar` | — | default, scrolled |
| `Breadcrumbs` | — | default |
| `SearchInput` | header, page | idle, focus, loading, error |
| `PageHeader` | with actions | default |
| `Button` | primary, secondary, quiet, danger | default, hover, focus-visible, active, disabled, loading |
| `StatusBadge` | neutral, success, warning, danger, gold | dengan label teks |
| `StatCard` | — | default, loading |
| `HeroBanner` | — | default |
| `VideoPosterCard` | grid, list, compact | default, hover, focus, loading skeleton |
| `CreatorRow` / `CreatorBadge` | — | verified, unverified |
| `SeriesCard` / `ProgressBar` | — | 0–100%, indeterminate |
| `FilterChipGroup` | — | selected, hover, focus |
| `DataTable` | admin | empty, loading, error, sorted |
| `FormField` | text, select, textarea | default, focus, invalid, disabled, helper |
| `FileUploadField` | — | idle, uploading (%), processing, error, retry |
| `EmptyState` | — | icon, title, description, action |
| `LoadingSkeleton` | card, list, detail | — |
| `ErrorState` | — | message, retry |
| `ConfirmDialog` | — | open, destructive, loading |
| `Toast` / `InlineFeedback` | info, success, error | auto-dismiss, dismissible |

Aturan:

- Tidak menduplikasi tombol/badge/poster/spacing per halaman.
- Semua warna/radius/spacing/breakpoint dari token.
- Ikon dari satu library konsisten; emoji bukan satu-satunya ikon.
- Semantic HTML, label input, alt text, urutan heading logis.

## 5. Route → screen

Detail route ada di `docs/product/navigation-and-sitemap.md`. Ringkas:

| Aplikasi | Layar MVP |
|---|---|
| Mobile | Beranda, Jelajahi+search, Serial, Detail serial, Player/detail video, Tersimpan, Profil, Preferensi, Laporan, Login |
| Studio | Login, Dashboard, Konten saya, Detail konten, Unggah (file→metadata→sumber/hak→pratinjau→submit), Analitik, Pengaturan |
| Admin | Login+MFA, Dashboard, Review queue, Detail review, Keputusan, Publikasi, Reports, Kasus, Tindakan, Banding, Koreksi, Katalog, Serial, Kreator, Pengguna/Role, Kategori, Audit, Metrik |

## 6. State matrix (wajib per layar pengambil data)

| State | Perilaku |
|---|---|
| `idle` | belum ada request |
| `loading` | skeleton/spinner; layout tidak melompat |
| `success` | data nyata dari API |
| `empty` | pesan + aksi relevan |
| `error` | pesan aman + retry; tanpa stack trace |
| `unauthorized` | arahkan login / pesan akses ditolak |
| `submitting` | tombol disabled + progres |
| `disabled` | alasan terlihat (tooltip/helper) |

Aturan: jangan menampilkan toast sukses sebelum API berhasil; optimistic UI hanya untuk aksi yang dapat di-rollback.

## 7. Prototype vs layar yang belum dirancang

| Area | Status |
|---|---|
| Beranda, Jelajahi, Serial, Tersimpan, Profil, Studio, Moderasi | Ada di prototype; implementasi mengikuti reference |
| Player video vertikal + metadata/sumber/serial berikutnya | **Belum dirancang** — layar produksi terpisah (HLD §28.5) |
| Login/onboarding | **Belum dirancang** — ikuti token & HLD; jangan mengarang provider |
| Hasil pencarian | Mengikuti pola grid Jelajahi; perlu review visual |
| Form laporan | Mengikuti FormField + reason code dari backend |
| Riwayat tontonan, notifikasi | POST-MVP |

## 8. Penyimpangan yang disetujui

| # | Penyimpangan | Alasan | Status |
|---|---|---|---|
| D1 | Bottom nav memakai `Beranda/Jelajahi/Serial/Tersimpan/Profil` (HLD §28.4) alih-alih `Beranda/Shorts/Kelas & Kajian/Tersimpan/Profil` (HLD §26.1) | §28.4 adalah referensi visual yang disetujui dan bagian lebih baru | Disetujui default 2026-10-20 |
| D2 | Player vertikal & login dirancang baru (tidak ada di prototype) | HLD §28.5 menyatakan belum ditampilkan | Perlu review visual saat desain tersedia |

Penyimpangan visual lain wajib dicatat di tabel ini sebelum implementasi.

## 9. Aksesibilitas

- Fokus keyboard terlihat; tidak menghapus outline.
- Kontras teks sekunder diperiksa; status tidak hanya warna.
- Label input eksplisit; error terhubung ke field.
- Urutan heading logis; landmark semantik.
- Target sentuh memadai di mobile; safe area dihormati.
- `prefers-reduced-motion` dihormati.

## 10. Acceptance (Definition of Done UX)

- Route & permission ditentukan.
- Komponen memakai token dan komponen bersama.
- Visual dibandingkan dengan prototype pada viewport relevan.
- Loading/empty/error/success/disabled/unauthorized tersedia.
- Interaksi tersambung ke state/API atau ditandai belum terintegrasi.
- Aksesibilitas dasar & responsive diuji.
- Screenshot/visual review disimpan.
- Tidak ada data contoh menyamar sebagai produksi.
- Tidak ada overflow pada 320/375/768/1024/1280/1440px.
