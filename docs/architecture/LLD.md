# NUR Platform — Low-Level Design (LLD)

**Dokumen:** NUR-LLD-001  
**Versi:** 1.0  
**Tanggal:** 20 Oktober 2026  
**Status:** Draft teknis untuk diturunkan ke implementasi Qoder  
**Parent:** `docs/architecture/HLD.md` (NUR-HLD-001 v1.1)  
**Produk:** NUR — Short Islamic Video Platform

> **Aturan penggunaan:** LLD ini menurunkan HLD menjadi rancangan implementasi. Ia tidak membatalkan HLD, tidak mengunci vendor yang masih `OPEN DECISION`, dan bukan pengganti keputusan produk/keamanan. Jika ada konflik, HLD dan keputusan tertulis terbaru dari product owner menjadi acuan.

---

## 1. Tujuan dan ruang lingkup

LLD menjelaskan struktur kode, domain model, tabel, kontrak API, alur bisnis, permission, validasi, error handling, background jobs, dan pengujian agar implementasi dapat dikerjakan bertahap di Qoder.

### 1.1 Scope MVP

- Katalog video pendek Islami yang dikurasi.
- Feed dan discovery berbasis urutan editorial/popularitas sederhana, bukan ML.
- Search katalog.
- Detail/playback video, serial/playlist, progres serial.
- Simpan video, bagikan tautan, laporkan konten.
- Creator Studio untuk kreator undangan: draft, upload, metadata/sumber/hak, submit review, lihat status.
- Admin Console untuk review editorial, laporan, takedown, banding, koreksi, kategori, serial, pengguna, dan audit.
- Event analytics dasar dan metrik operasional biaya video.
- Closed beta dengan akses kreator terpilih.

### 1.2 Di luar scope MVP

- Live streaming.
- Upload terbuka bagi seluruh pengguna.
- Chat/messaging.
- Marketplace atau pembayaran kompleks.
- Membership kompleks.
- Feed rekomendasi machine-learning.
- Aplikasi desktop native.

### 1.3 Prinsip non-negotiable

1. Curated-first: video tidak menjadi publik hanya karena upload berhasil.
2. Server adalah sumber kebenaran untuk role, permission, status editorial, dan status publikasi.
3. Semua tindakan administratif sensitif harus diaudit.
4. Metadata sumber, konteks, dan hak konten wajib tersedia sebelum review final.
5. NUR bukan otoritas fatwa; klaim keagamaan kompleks harus ditangani melalui reviewer/penasihat yang sesuai dan sumber yang dapat diperiksa.
6. Prototipe `docs/design/NUR_UX_UI_Design_Prototype.html` adalah acuan visual. Jangan redesign tanpa persetujuan.
7. Data contoh di prototype tidak boleh menjadi data produksi.

---

## 2. Status keputusan teknis

Pilihan di bawah adalah baseline implementasi yang diusulkan untuk LLD. Hal yang belum disetujui tetap harus dicatat di `docs/architecture/decisions/`.

| Area | Baseline LLD | Status |
|---|---|---|
| Mobile app | React Native + Expo + TypeScript | Proposed; validasi player dan target platform |
| Creator Studio/Admin | React + Vite + TypeScript | Proposed |
| UI web | Tailwind CSS + design tokens | Proposed |
| API | FastAPI + Python | Proposed |
| Database | PostgreSQL | Proposed |
| Auth | Managed auth; Supabase Auth kandidat | OPEN DECISION |
| Video storage/transcoding/CDN | Provider terkelola atau object storage + transcoding + CDN | OPEN DECISION; wajib PoC |
| Background jobs | Worker sederhana dengan retry; queue terkelola jika diperlukan | Proposed |
| Search | PostgreSQL full-text search | Proposed |
| Analytics | Event table berversi + agregasi | Proposed |
| Deployment | Staging dan production terpisah, containerized API | Proposed |
| Monorepo | pnpm workspace untuk frontend; backend Python dalam repo yang sama | Proposed |
| Android saja atau Android+iOS | Belum diputuskan | OPEN DECISION |
| Website publik/SEO | Belum diputuskan | OPEN DECISION |
| Kebijakan usia minimum, residency, legal entity | Belum diputuskan | OPEN DECISION |
| Vendor analytics | Belum diputuskan | OPEN DECISION |

**Qoder tidak boleh mengubah `OPEN DECISION` menjadi keputusan diam-diam.** Buat ADR untuk setiap keputusan yang berdampak pada vendor, biaya, privasi, skema, atau kontrak eksternal.

---

## 3. Struktur repository

Struktur target berikut merupakan rancangan. Sesuaikan hanya setelah memeriksa repository yang sudah ada; jangan menghapus file/proyek existing tanpa persetujuan.

```text
nur/
├── apps/
│   ├── mobile/                     # React Native + Expo
│   │   └── src/
│   │       ├── app/                # routing/screens
│   │       ├── features/
│   │       │   ├── home/
│   │       │   ├── discover/
│   │       │   ├── video/
│   │       │   ├── series/
│   │       │   ├── saved/
│   │       │   ├── profile/
│   │       │   └── reports/
│   │       ├── components/
│   │       ├── lib/
│   │       └── theme/
│   ├── studio/                     # Creator Studio (React/Vite)
│   │   └── src/
│   │       ├── app/
│   │       ├── features/
│   │       │   ├── dashboard/
│   │       │   ├── uploads/
│   │       │   ├── content/
│   │       │   └── analytics/
│   │       └── shared/
│   └── admin/                      # Admin & moderation console
│       └── src/
│           ├── app/
│           ├── features/
│           │   ├── review-queue/
│           │   ├── reports/
│           │   ├── moderation/
│           │   ├── appeals/
│           │   ├── corrections/
│           │   ├── users/
│           │   └── audit/
│           └── shared/
├── packages/
│   ├── api-client/                 # generated/typed API client
│   ├── contracts/                  # shared TypeScript schemas/types
│   ├── design-tokens/              # visual tokens from approved prototype
│   └── eslint-config/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/v1/
│   │   ├── core/                   # settings, auth, errors, logging
│   │   ├── modules/
│   │   │   ├── identity/
│   │   │   ├── profiles/
│   │   │   ├── catalog/
│   │   │   ├── video_lifecycle/
│   │   │   ├── feed/
│   │   │   ├── search/
│   │   │   ├── series/
│   │   │   ├── engagement/
│   │   │   ├── trust_safety/
│   │   │   ├── creator_ops/
│   │   │   ├── analytics/
│   │   │   └── admin_audit/
│   │   ├── integrations/           # auth/video/email adapters
│   │   ├── jobs/
│   │   └── db/
│   ├── migrations/
│   └── tests/
├── docs/
│   ├── architecture/HLD.md
│   ├── architecture/LLD.md
│   ├── architecture/decisions/
│   ├── design/NUR_UX_UI_Design_Prototype.html
│   ├── design/UX_UI_IMPLEMENTATION_SPEC.md
│   ├── product/navigation-and-sitemap.md
│   ├── product/user-journeys.md
│   ├── architecture/route-permission-matrix.md
│   └── runbooks/
├── infra/                          # deployment config/IaC when chosen
├── .env.example
├── pnpm-workspace.yaml
└── README.md
```

### 3.1 Batas modul backend

- Router hanya menangani HTTP, parsing, response mapping, dan dependency injection.
- Service/use-case menjalankan aturan bisnis dan transaksi.
- Repository bertanggung jawab atas query persistence.
- Integration adapter mengisolasi vendor auth/video/notification.
- Domain module tidak mengimpor router modul lain untuk menjalankan business logic.
- Hindari satu service besar dan query SQL lintas modul yang tidak terkontrol.
- Jangan membuat microservices untuk MVP; worker dapat berjalan sebagai proses terpisah dari codebase yang sama.

---

## 4. Konvensi implementasi

### 4.1 Naming

- Python: `snake_case`, class `PascalCase`.
- TypeScript: `camelCase`, React component `PascalCase`.
- Database: tabel dan kolom `snake_case`, primary key UUID.
- Endpoint: plural nouns, `/api/v1/...`.
- Enum database/API menggunakan nilai lowercase `snake_case`.
- Timestamp disimpan sebagai `timestamptz` dalam UTC; UI menampilkan waktu lokal Indonesia.

### 4.2 Kontrak umum API

- Base path: `/api/v1`.
- JSON untuk request/response kecuali upload media langsung ke provider.
- UUID untuk ID entitas.
- Pagination: cursor-based untuk feed/list yang terus bertambah; offset boleh untuk tabel admin kecil jika terukur.
- Setiap response error menggunakan format seragam.
- `Idempotency-Key` untuk operasi yang dapat diulang dan berpotensi menggandakan efek.
- API version baru hanya jika ada perubahan kontrak yang tidak kompatibel.

Contoh error:

```json
{
  "error": {
    "code": "VIDEO_NOT_READY",
    "message": "Video belum siap diproses untuk review.",
    "request_id": "req_opaque_id",
    "details": []
  }
}
```

Jangan mengembalikan stack trace, SQL, token, signed URL, atau detail internal provider kepada client.

---

## 5. Role dan authorization

### 5.1 Role

- `visitor`: tidak memiliki session; hanya endpoint publik.
- `user`: akun terdaftar.
- `creator`: kreator yang diundang/diaktifkan.
- `reviewer`: pemeriksa editorial.
- `moderator`: menangani laporan, pembatasan, takedown, koreksi, dan banding sesuai kebijakan.
- `admin`: pengaturan operasional/role dengan audit.
- `analyst`: akses metrik agregat terbatas.
- `scholar_advisor`: peran keahlian editorial opsional; tidak otomatis memiliki hak admin teknis.

Satu akun dapat memiliki beberapa role melalui tabel relasi. Jangan menyimpan role sebagai satu string tunggal di profil jika multi-role diperlukan.

### 5.2 Permission minimum

| Permission | User | Creator | Reviewer | Moderator | Admin | Analyst |
|---|---:|---:|---:|---:|---:|---:|
| Baca konten published | Ya | Ya | Ya | Ya | Ya | Sesuai kebutuhan |
| Simpan/laporkan | Ya | Ya | Ya | Ya | Ya | Tidak |
| Buat/edit draft milik sendiri | Tidak | Ya | Tidak | Tidak | Hanya bila ditugaskan | Tidak |
| Submit review | Tidak | Ya | Tidak | Tidak | Sesuai tugas | Tidak |
| Keputusan editorial | Tidak | Tidak | Ya | Terbatas | Bila ditugaskan | Tidak |
| Restrict/takedown | Tidak | Tidak | Eskalasi | Ya | Ya | Tidak |
| Putuskan banding | Tidak | Tidak | Idealnya reviewer berbeda | Sesuai policy | Ya dengan audit | Tidak |
| Kelola role | Tidak | Tidak | Tidak | Tidak | Ya | Tidak |
| Lihat audit log | Tidak | Terbatas | Scope tugas | Scope tugas | Ya | Tidak |
| Baca metrik agregat | Tidak | Milik sendiri | Sesuai tugas | Sesuai tugas | Ya | Ya |

### 5.3 Aturan authorization

- Validasi token managed auth di middleware.
- Resolve internal user dan role aktif dari database; jangan percaya role yang dikirim client.
- Periksa ownership untuk seluruh operasi creator.
- Reviewer tidak boleh menyetujui konten yang dibuat sendiri atau jika ada conflict-of-interest.
- Periksa permission pada service/use-case, bukan hanya menyembunyikan tombol.
- Default deny: permission tidak dikenal berarti ditolak.
- Semua aksi admin/moderasi mencatat actor, target, reason, timestamp, dan request ID.
- Admin wajib MFA jika provider mendukung; jika tidak, catat mitigasi dan keputusan keamanan.

---

## 6. Model data relasional

Schema berikut adalah baseline LLD. Kolom/constraint dapat disesuaikan melalui migration dan ADR, bukan perubahan langsung di production.

### 6.1 Entitas utama

| Tabel | Fungsi |
|---|---|
| `users` | Identitas internal yang dipetakan ke managed auth |
| `roles`, `user_roles` | Role dan pemetaan multi-role |
| `profiles` | Nama tampilan, avatar, bio, preferensi |
| `creator_profiles` | Status undangan/aktivasi kreator |
| `categories` | Kategori katalog |
| `videos` | Metadata video dan status editorial/publikasi |
| `video_sources` | Sumber rujukan/kredit/atribusi |
| `video_rights` | Deklarasi hak cipta/lisensi/izin |
| `video_assets` | Referensi asset dari provider, thumbnail, playback metadata |
| `video_review_events` | Keputusan review/revisi/eskalasi |
| `series` | Serial atau playlist terstruktur |
| `series_episodes` | Relasi urutan video di serial |
| `saved_videos` | Video yang disimpan user |
| `watch_progress` | Progres episode/serial per user |
| `content_reports` | Laporan dari pengguna |
| `moderation_cases` | Case penanganan laporan/takedown |
| `appeals` | Banding atas keputusan moderasi |
| `corrections` | Koreksi yang terkait dengan video |
| `audit_logs` | Jejak aksi sensitif yang append-only |
| `product_events` | Event analitik berversi |
| `idempotency_keys` | Pencegah duplikasi operasi penting |
| `outbox_events` | Event untuk pekerjaan async yang harus dikirim ulang |

### 6.2 Definisi kolom minimum

#### `users`

- `id UUID PRIMARY KEY`
- `auth_subject TEXT UNIQUE NOT NULL` — subject dari managed auth.
- `status TEXT NOT NULL` — `active`, `suspended`, `pending_deletion`, `deleted`.
- `created_at`, `updated_at TIMESTAMPTZ NOT NULL`
- `deleted_at TIMESTAMPTZ NULL`

#### `roles` dan `user_roles`

- `roles(id UUID PK, code TEXT UNIQUE, name TEXT)`
- `user_roles(user_id UUID FK, role_id UUID FK, granted_by UUID NULL, granted_at TIMESTAMPTZ, revoked_at TIMESTAMPTZ NULL)`
- Unique partial index pada pasangan aktif `user_id, role_id` bila didukung migrasi yang digunakan.

#### `profiles`

- `user_id UUID PK/FK users`
- `display_name TEXT NOT NULL`
- `avatar_asset_ref TEXT NULL`
- `bio TEXT NULL`
- `preferred_language TEXT NOT NULL DEFAULT 'id'`
- `onboarding_completed_at TIMESTAMPTZ NULL`
- `created_at`, `updated_at`

#### `creator_profiles`

- `user_id UUID PK/FK users`
- `status TEXT NOT NULL` — `invited`, `active`, `paused`, `revoked`
- `public_name TEXT NOT NULL`
- `bio TEXT NULL`
- `created_by UUID FK users`
- `activated_at TIMESTAMPTZ NULL`
- `created_at`, `updated_at`

#### `videos`

- `id UUID PK`
- `creator_id UUID FK users NOT NULL`
- `title VARCHAR(120) NOT NULL`
- `description VARCHAR(2000) NULL`
- `language_code TEXT NOT NULL DEFAULT 'id'`
- `category_id UUID FK categories NOT NULL`
- `duration_seconds INTEGER NULL`
- `editorial_status TEXT NOT NULL`
- `publication_status TEXT NOT NULL`
- `visibility TEXT NOT NULL DEFAULT 'public'`
- `primary_asset_id UUID NULL`
- `published_at TIMESTAMPTZ NULL`
- `created_at`, `updated_at`
- `version INTEGER NOT NULL DEFAULT 1` untuk optimistic concurrency.
- Check: `duration_seconds IS NULL OR duration_seconds > 0`.
- Index: `(publication_status, published_at DESC)`, `(creator_id, created_at DESC)`, `(category_id, publication_status)`.

#### `video_sources`

- `id UUID PK`
- `video_id UUID FK videos ON DELETE CASCADE`
- `source_type TEXT NOT NULL` — `book`, `article`, `official_site`, `scholar`, `other`
- `title TEXT NOT NULL`
- `author_or_publisher TEXT NULL`
- `url TEXT NULL`
- `reference_text TEXT NULL`
- `accessed_at TIMESTAMPTZ NULL`
- `created_at`

#### `video_rights`

- `id UUID PK`
- `video_id UUID FK videos ON DELETE CASCADE`
- `rights_type TEXT NOT NULL` — `original`, `licensed`, `permission_granted`, `public_domain`, `other`
- `rights_holder TEXT NULL`
- `permission_evidence_ref TEXT NULL`
- `territory TEXT NULL`
- `valid_until TIMESTAMPTZ NULL`
- `declaration_by UUID FK users NOT NULL`
- `declared_at TIMESTAMPTZ NOT NULL`
- `review_status TEXT NOT NULL DEFAULT 'pending'`

#### `video_assets`

- `id UUID PK`
- `video_id UUID FK videos ON DELETE CASCADE`
- `provider_code TEXT NOT NULL`
- `provider_asset_id TEXT NOT NULL`
- `asset_kind TEXT NOT NULL` — `source`, `playback`, `thumbnail`, `caption`
- `processing_status TEXT NOT NULL`
- `duration_seconds INTEGER NULL`
- `width INTEGER NULL`, `height INTEGER NULL`
- `metadata JSONB NOT NULL DEFAULT '{}'`
- `created_at`, `updated_at`
- Unique `(provider_code, provider_asset_id, asset_kind)`.
- Jangan menyimpan binary video di PostgreSQL.

#### `video_review_events`

- `id UUID PK`
- `video_id UUID FK videos NOT NULL`
- `reviewer_id UUID FK users NOT NULL`
- `decision TEXT NOT NULL` — `request_revision`, `approve`, `reject`, `escalate`
- `reason_code TEXT NOT NULL`
- `notes TEXT NULL`
- `created_at TIMESTAMPTZ NOT NULL`
- Simpan riwayat sebagai event; jangan menimpa keputusan lama.

#### `series`

- `id UUID PK`
- `title VARCHAR(160) NOT NULL`
- `slug TEXT UNIQUE NOT NULL`
- `description TEXT NULL`
- `category_id UUID FK categories NULL`
- `status TEXT NOT NULL` — `draft`, `published`, `archived`
- `created_by UUID FK users NOT NULL`
- `published_at TIMESTAMPTZ NULL`
- `created_at`, `updated_at`

#### `series_episodes`

- `series_id UUID FK series`
- `video_id UUID FK videos`
- `episode_number INTEGER NOT NULL`
- `is_required BOOLEAN NOT NULL DEFAULT TRUE`
- `created_at`
- PK `(series_id, video_id)`.
- Unique `(series_id, episode_number)`.
- Episode hanya ditampilkan bila video dan serial memenuhi status publikasi.

#### `saved_videos`

- `user_id UUID FK users`
- `video_id UUID FK videos`
- `created_at TIMESTAMPTZ NOT NULL`
- PK `(user_id, video_id)`.

#### `watch_progress`

- `user_id UUID FK users`
- `video_id UUID FK videos`
- `position_seconds INTEGER NOT NULL DEFAULT 0`
- `duration_seconds INTEGER NULL`
- `completed_at TIMESTAMPTZ NULL`
- `last_watched_at TIMESTAMPTZ NOT NULL`
- PK `(user_id, video_id)`.
- Clamp posisi agar tidak negatif dan jangan menganggap completion dari posisi client tanpa validasi.

#### `content_reports`

- `id UUID PK`
- `reporter_id UUID FK users NOT NULL`
- `video_id UUID FK videos NOT NULL`
- `reason_code TEXT NOT NULL`
- `description TEXT NULL`
- `status TEXT NOT NULL` — `open`, `triaged`, `resolved`, `dismissed`
- `created_at`, `updated_at`

#### `moderation_cases`

- `id UUID PK`
- `video_id UUID FK videos NOT NULL`
- `report_id UUID FK content_reports NULL`
- `assigned_to UUID FK users NULL`
- `status TEXT NOT NULL` — `open`, `investigating`, `restricted`, `resolved`, `appealed`
- `decision TEXT NULL`
- `reason_code TEXT NULL`
- `notes TEXT NULL`
- `created_at`, `updated_at`, `resolved_at TIMESTAMPTZ NULL`

#### `appeals`

- `id UUID PK`
- `case_id UUID FK moderation_cases NOT NULL`
- `submitted_by UUID FK users NOT NULL`
- `reason TEXT NOT NULL`
- `status TEXT NOT NULL` — `submitted`, `under_review`, `upheld`, `overturned`, `closed`
- `decided_by UUID FK users NULL`
- `decision_notes TEXT NULL`
- `created_at`, `decided_at TIMESTAMPTZ NULL`

#### `corrections`

- `id UUID PK`
- `video_id UUID FK videos NOT NULL`
- `created_by UUID FK users NOT NULL`
- `correction_type TEXT NOT NULL`
- `public_note TEXT NOT NULL`
- `internal_note TEXT NULL`
- `status TEXT NOT NULL` — `draft`, `published`, `withdrawn`
- `published_at TIMESTAMPTZ NULL`
- `created_at`

#### `audit_logs`

- `id UUID PK`
- `actor_user_id UUID FK users NULL`
- `action TEXT NOT NULL`
- `entity_type TEXT NOT NULL`
- `entity_id UUID NULL`
- `reason_code TEXT NULL`
- `request_id TEXT NULL`
- `ip_hash TEXT NULL` — hindari menyimpan IP mentah tanpa kebutuhan/kebijakan.
- `metadata JSONB NOT NULL DEFAULT '{}'`
- `created_at TIMESTAMPTZ NOT NULL`
- Append-only; aplikasi tidak menyediakan endpoint update/delete audit.

#### `product_events`

- `id UUID PK`
- `event_name TEXT NOT NULL`
- `schema_version INTEGER NOT NULL`
- `user_id UUID NULL`
- `anonymous_id TEXT NULL`
- `session_id TEXT NULL`
- `entity_type TEXT NULL`
- `entity_id UUID NULL`
- `occurred_at TIMESTAMPTZ NOT NULL`
- `received_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `properties JSONB NOT NULL DEFAULT '{}'`
- Jangan memasukkan token, isi sensitif, atau data personal yang tidak dibutuhkan.

### 6.3 Constraint dan indexing umum

- Semua FK wajib memiliki kebijakan delete yang eksplisit.
- Gunakan soft-delete untuk user/content bila dibutuhkan untuk audit/legal hold; jangan cascade menghapus audit.
- Tambahkan index untuk FK yang sering difilter, status queue, waktu publikasi, dan pencarian.
- Gunakan PostgreSQL full-text index untuk `title` dan `description`; jangan membuat search service khusus sebelum terukur.
- Terapkan unique constraint untuk slug, saved item, episode number, provider asset ID, dan idempotency key.
- JSONB hanya untuk metadata yang benar-benar fleksibel, bukan mengganti kolom relasional penting.
- Migration harus dapat direview dan dijalankan di staging sebelum production.

---

## 7. State machine konten dan media

Pisahkan status media teknis dari status editorial dan status publikasi. Jangan membuat satu enum besar yang mencampur ketiganya.

### 7.1 Media processing status

`initiated → uploading → processing → ready_for_review`

Kondisi alternatif:
- `processing → failed`
- `failed → processing` melalui retry yang sah.
- `ready_for_review` hanya jika asset playback/thumbnail minimum siap dan metadata durasi valid.

### 7.2 Editorial status

`draft → submitted → in_review`

Transisi yang diizinkan:
- `in_review → revision_requested`
- `revision_requested → submitted`
- `in_review → approved`
- `in_review → rejected`
- `in_review → escalated`
- `escalated → in_review`
- `approved → in_review` hanya melalui re-review yang diaudit jika ada perubahan material.

### 7.3 Publication status

- `unpublished`
- `published`
- `restricted`
- `taken_down`
- `archived`

Aturan:
- Hanya `editorial_status=approved` dan `publication_status=published` yang boleh tampil di endpoint publik.
- `restricted` dan `taken_down` harus hilang dari feed/search secepat mungkin.
- Approval tidak otomatis berarti publikasi; proses publish harus eksplisit dan permission-gated.
- Update metadata setelah approval yang memengaruhi substansi/sumber/hak dapat memaksa status kembali ke `submitted`/`in_review`.
- Semua transisi memvalidasi status sebelumnya dan menyimpan event/audit.

### 7.4 Review decision matrix

| Keputusan | Syarat | Efek |
|---|---|---|
| `request_revision` | Reviewer berwenang; reason code dan feedback wajib | Status `revision_requested`; kreator dapat mengedit draft |
| `approve` | Sumber dan deklarasi hak tersedia; checklist review lulus; no conflict | Editorial `approved`; publikasi tetap terpisah |
| `reject` | Reason code wajib dan catatan yang sesuai | Editorial `rejected`; kreator melihat alasan yang dapat dibagikan |
| `escalate` | Ada isu agama/keamanan/hak/ambigu yang perlu ahli | Status `escalated`; assign ke role/ahli yang tepat |

---

## 8. Kontrak API rinci

Semua endpoint di bawah berada di bawah `/api/v1`. Daftar ini merupakan kontrak baseline; finalisasi OpenAPI harus menjadi bagian implementasi dan diuji contract-test.

### 8.1 Public catalog dan feed

| Method + path | Auth | Tujuan |
|---|---|---|
| `GET /feed` | Optional | Feed video published dengan cursor |
| `GET /videos/{video_id}` | Optional | Metadata video publik |
| `GET /videos/{video_id}/playback` | Optional | Playback reference/token yang sah |
| `GET /categories` | Optional | Kategori aktif |
| `GET /search?q=...` | Optional | Pencarian katalog |
| `GET /series` | Optional | Daftar serial published |
| `GET /series/{series_id}` | Optional | Detail serial dan episode published |

Feed hanya boleh mengembalikan video yang memenuhi seluruh kondisi publikasi. Jangan mengambil daftar semua video lalu mengandalkan filter frontend.

Contoh query feed:
`GET /api/v1/feed?limit=10&cursor=<opaque>&category_id=<uuid>`

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Contoh judul",
      "description": "Deskripsi",
      "duration_seconds": 45,
      "thumbnail_url": "provider-derived-url",
      "playback_ref": "opaque-provider-reference",
      "creator": {"id": "uuid", "display_name": "Nama"},
      "category": {"id": "uuid", "name": "Ilmu Praktis"},
      "published_at": "2026-10-20T08:00:00Z",
      "series": {"id": "uuid", "title": "Adab Harian", "episode_number": 2}
    }
  ],
  "next_cursor": null
}
```

URL di atas ilustrasi. Bentuk aktual mengikuti provider; hindari playback URL permanen yang melewati kontrol akses.

### 8.2 Identity/profile/engagement

| Method + path | Auth | Permission/aturan |
|---|---|---|
| `GET /me` | Required | Profil dan role aktif |
| `PATCH /me/profile` | Required | Hanya profil sendiri; field allowlist |
| `DELETE /me` | Required | Memulai proses penghapusan akun, bukan hard-delete langsung |
| `PUT /me/saved-videos/{video_id}` | Required | Idempotent save |
| `DELETE /me/saved-videos/{video_id}` | Required | Idempotent unsave |
| `GET /me/saved-videos` | Required | Cursor pagination |
| `PUT /me/watch-progress/{video_id}` | Required | Upsert progress yang tervalidasi |
| `GET /me/watch-progress` | Required | Progress sendiri |
| `POST /videos/{video_id}/reports` | Required | Reason code valid; rate-limited |
| `POST /analytics/events` | Optional/required by event policy | Schema allowlist, size limit, no sensitive data |

### 8.3 Creator Studio

| Method + path | Auth | Permission/aturan |
|---|---|---|
| `GET /creator/videos` | Creator | Hanya konten milik sendiri |
| `POST /creator/videos` | Creator | Membuat draft dan metadata awal |
| `PATCH /creator/videos/{id}` | Creator | Owner only; hanya field yang boleh diedit |
| `POST /creator/videos/{id}/upload-intent` | Creator | Status draft valid; idempotent |
| `POST /creator/videos/{id}/submit-review` | Creator | Media siap; metadata/sumber/hak lengkap |
| `GET /creator/videos/{id}/status` | Creator | Owner only |
| `GET /creator/analytics/summary` | Creator | Data sendiri, agregat |
| `POST /webhooks/video-provider` | Provider signature | Bukan endpoint user; verifikasi signature |

### 8.4 Reviewer/admin/moderasi

| Method + path | Permission |
|---|---|
| `GET /admin/review-queue` | `review:read` |
| `GET /admin/videos/{id}/review-context` | `review:read` |
| `POST /admin/videos/{id}/review-decision` | `review:decide` |
| `GET /admin/reports` | `moderation:read` |
| `GET /admin/moderation-cases/{id}` | `moderation:read` |
| `POST /admin/moderation-cases/{id}/decision` | `moderation:decide` |
| `POST /admin/moderation-cases/{id}/restrict` | `moderation:restrict` |
| `POST /admin/appeals/{id}/decision` | `appeal:decide` |
| `POST /admin/videos/{id}/corrections` | `correction:write` |
| `GET /admin/users` | `user:read` |
| `POST /admin/creators/{id}/status` | `creator:manage` |
| `GET /admin/audit-logs` | `audit:read` |

Endpoint admin tidak boleh dipanggil dari client publik tanpa permission. Filter, pagination, export, dan pencarian admin harus dibatasi sesuai peran.

### 8.5 Bentuk request penting

Submit review:

```json
{
  "expected_version": 3,
  "declaration_confirmed": true
}
```

Review decision:

```json
{
  "decision": "request_revision",
  "reason_code": "SOURCE_NEEDS_CLARIFICATION",
  "notes": "Mohon lengkapi rujukan yang dapat diperiksa.",
  "expected_version": 4
}
```

Moderation decision:

```json
{
  "decision": "restrict",
  "reason_code": "POTENTIAL_COPYRIGHT_ISSUE",
  "notes": "Konten dibatasi sambil memeriksa izin.",
  "expected_version": 2
}
```

Validasi enum dilakukan di server. `expected_version` mencegah perubahan diam-diam akibat dua reviewer mengedit entitas yang sama.

### 8.6 HTTP status

- `200`: berhasil membaca/mengubah dengan response.
- `201`: resource dibuat.
- `202`: pekerjaan async diterima, belum selesai.
- `204`: berhasil tanpa body.
- `400`: request malformed.
- `401`: belum terautentikasi/token tidak valid.
- `403`: identitas valid tetapi tidak berhak.
- `404`: resource tidak ditemukan atau sengaja disamarkan untuk mencegah enumeration.
- `409`: konflik status/version/idempotency.
- `413`: file/request terlalu besar.
- `422`: validasi field gagal.
- `429`: rate limit.
- `502/503`: dependency eksternal gagal/tidak tersedia.
- `500`: error tak terduga; response tidak memuat detail internal.

---

## 9. Use case dan alur proses

### 9.1 Menemukan dan menonton

1. Client meminta `GET /feed` dengan cursor/filter.
2. API memvalidasi parameter.
3. Feed service mengambil hanya video `approved + published` dan serial yang aktif.
4. API mengembalikan metadata dan cursor, bukan binary video.
5. Saat pengguna memilih video, client meminta playback reference/token.
6. API memeriksa status publikasi dan meminta playback data ke adapter provider.
7. Client memutar media melalui provider/CDN.
8. Client mengirim event `video_started`, `video_progress` pada interval yang dibatasi, dan `video_completed` jika aturan completion terpenuhi.
9. Progress pengguna tersimpan hanya bila login; event analytics boleh anonim sesuai policy.

### 9.2 Simpan dan lanjutkan serial

1. User menekan Simpan.
2. Client `PUT /me/saved-videos/{id}`.
3. API memeriksa akun aktif dan video published.
4. Database melakukan upsert idempotent.
5. Client memperbarui state dari response, bukan toast sukses palsu.
6. Saat video serial selesai, client mengambil episode berikutnya yang published dan memperbarui progress.

### 9.3 Upload sampai review

1. Creator membuat draft `POST /creator/videos`.
2. Creator mengisi metadata, kategori, sumber, dan deklarasi hak.
3. Creator meminta upload intent.
4. API memastikan creator aktif dan draft dimiliki creator.
5. API meminta signed upload intent ke provider adapter.
6. Client mengunggah langsung ke provider/storage; file tidak diproxy melalui FastAPI kecuali PoC memaksa keputusan lain.
7. Provider mengirim webhook; API memverifikasi signature dan idempotency.
8. Worker memperbarui processing state dan menyimpan asset metadata.
9. Creator melengkapi sumber/hak lalu submit review.
10. API memvalidasi metadata dan readiness media dalam satu transaksi.
11. Review queue menampilkan item kepada reviewer.
12. Reviewer approve/revision/reject/escalate; decision event dan audit dicatat.
13. Publishing dilakukan secara eksplisit oleh role yang berwenang; hanya setelah itu konten muncul di feed.

### 9.4 Laporan dan takedown

1. User melaporkan video dengan reason code.
2. API melakukan rate limit dan menyimpan report.
3. Case dibuat atau ditautkan sesuai aturan deduplikasi.
4. Moderator melakukan triage.
5. Jika perlu, moderator membatasi/takedown video; perubahan publication status dilakukan di database dan outbox event dibuat dalam transaksi.
6. Worker mengirim instruksi purge/invalidate ke provider/CDN bila didukung.
7. Feed/search mengecualikan video segera dari sumber kebenaran database.
8. Keputusan, alasan, actor, dan waktu dicatat ke audit log.
9. Kreator dapat mengajukan banding sesuai policy; keputusan banding sebaiknya dilakukan pihak berbeda.
10. Koreksi publik dipublikasikan dengan riwayat, tidak menghapus jejak keputusan terdahulu.

---

## 10. Upload, provider adapter, dan background jobs

### 10.1 Provider interface

Implementasikan interface internal agar vendor dapat diganti tanpa mengubah domain modules:

```python
class VideoProvider(Protocol):
    async def create_upload_intent(self, *, video_id: UUID, content_type: str) -> UploadIntent: ...
    async def get_asset_status(self, *, provider_asset_id: str) -> ProviderAssetStatus: ...
    async def get_playback_reference(self, *, provider_asset_id: str, policy: PlaybackPolicy) -> PlaybackReference: ...
    async def request_asset_restriction(self, *, provider_asset_id: str) -> None: ...
    async def request_asset_purge(self, *, provider_asset_id: str) -> None: ...
    async def verify_webhook(self, *, headers: Mapping[str, str], raw_body: bytes) -> VerifiedWebhook: ...
```

Ini adalah interface konseptual; tipe final dibuat di `backend/app/integrations/video/`. Jangan menaruh nama vendor dalam domain model atau business logic.

### 10.2 Webhook

- Verifikasi signature terhadap raw request body sebelum parsing.
- Tolak timestamp lama/replay bila provider menyediakan timestamp/nonce.
- Simpan provider event ID dan pastikan unik/idempotent.
- Webhook hanya memperbarui status media; tidak boleh menyetujui editorial atau memublikasikan konten.
- Response cepat setelah event valid disimpan; pekerjaan berat masuk worker.
- Log hanya metadata aman, bukan secret atau URL bertanda tangan.

### 10.3 Jobs minimum

| Job | Trigger | Retry/Idempotency |
|---|---|---|
| `process_video_webhook` | Provider callback | Dedup provider event ID |
| `reconcile_video_status` | Scheduled/ops manual | Upsert status provider |
| `publish_video` | Explicit publish action/outbox | Unique event key |
| `purge_restricted_video` | Restrict/takedown outbox | Retry with backoff |
| `aggregate_product_events` | Scheduled | Window-based upsert |
| `cleanup_expired_upload_intents` | Scheduled | Safe repeat |
| `account_deletion_workflow` | User request | State-driven and auditable |

Jangan menambah message broker kompleks sebelum beban/operasi membutuhkannya. Worker harus punya dead-letter/error reporting minimal dan retry dengan exponential backoff + jitter.

---

## 11. Validasi, konsistensi, dan idempotency

- Validasi input di boundary API dan validasi invariant domain di service.
- Gunakan Pydantic request/response schema; jangan expose ORM model langsung.
- Field yang boleh diedit oleh creator harus allowlist.
- Transaksi database untuk perubahan status + event review/audit/outbox terkait.
- Gunakan optimistic concurrency melalui `version`/`expected_version`.
- Operasi save/unsave bersifat idempotent.
- Upload intent dan webhook menggunakan idempotency/deduplication key.
- Jangan mengandalkan distributed transaction antara PostgreSQL dan provider; gunakan outbox + retry.
- Gunakan UTC di storage, ISO 8601 pada API.
- Normalisasi pencarian teks dengan strategi PostgreSQL yang konsisten; jangan mengubah teks Arab atau transliterasi secara destruktif.
- Slug harus unik dan stabil; perubahan slug perlu redirect/policy jika URL publik diterapkan.

---

## 12. Keamanan dan privasi

### 12.1 Kontrol minimum

- TLS untuk semua koneksi eksternal.
- Secrets hanya dari secret manager/environment; `.env` lokal tidak di-commit.
- Managed auth; tidak membangun password storage sendiri.
- Role/permission diperiksa server-side untuk setiap operasi sensitif.
- Rate limit untuk login-related endpoints, reports, upload intent, analytics events, dan pencarian publik.
- CORS allowlist untuk web apps; jangan wildcard credentials.
- Validasi file type, ukuran, durasi, dan status media berdasarkan provider; jangan percaya filename/MIME dari client saja.
- Signed URL/token berumur pendek bila provider mendukung.
- Sanitasi teks untuk rendering; jangan menyisipkan HTML mentah dari deskripsi.
- Audit untuk role changes, review decisions, takedown, appeals, corrections, dan publish.
- Data minimization untuk analytics; hindari data personal sensitif.
- Workflow penghapusan akun mempertimbangkan retensi audit, laporan hukum, dan kebijakan privasi yang akan disahkan.
- Backup terenkripsi dan uji restore berkala.
- Admin/MFA dan akses produksi dibatasi berdasarkan prinsip least privilege.

### 12.2 Privasi analytics

- Tentukan event allowlist dan schema version.
- Jangan kirim email, nomor telepon, auth token, signed URL, teks laporan privat, atau informasi sensitif ke analytics.
- Batasi retention dan akses ke raw events.
- Analyst menerima data agregat kecuali ada kebutuhan yang disetujui.
- Tetapkan kebijakan consent/notice sesuai hukum dan platform target sebelum production.

### 12.3 Trust & safety

- Reason code dikonfigurasi dan terdokumentasi.
- Report tidak otomatis berarti konten salah; moderator menilai konteks.
- Untuk isu keagamaan kompleks, gunakan eskalasi ke advisor yang kompeten.
- Simpan rujukan, konteks, keputusan, dan koreksi agar keputusan dapat ditelusuri.
- Jangan klaim bahwa verifikasi kreator sama dengan jaminan kebenaran semua isi.

---

## 13. Frontend implementation detail dan prototype fidelity

### 13.1 Design reference

Wajib tersedia:
`docs/design/NUR_UX_UI_Design_Prototype.html`

Buat:
`docs/design/UX_UI_IMPLEMENTATION_SPEC.md`

Spec tersebut harus memetakan:
- Token warna, spacing, radius, typography, shadow.
- Sidebar desktop, topbar, mobile bottom navigation.
- Hero, video card/poster, badge, empty state, form field, modal/dialog, table, status badge.
- Route-to-screen mapping dan permission.
- Loading, empty, error, success, disabled, unauthorized states.
- Elemen prototype versus layar yang belum didesain (khususnya vertical video player produksi dan autentikasi).
- Penyimpangan visual yang disetujui.

### 13.2 State UI

Setiap screen/data feature harus membedakan:
- `idle`
- `loading`
- `success`
- `empty`
- `error`
- `unauthorized`
- `submitting`/`disabled` bila relevan

Jangan menampilkan toast “berhasil” sebelum API berhasil. Optimistic UI hanya untuk aksi yang dapat dipulihkan dan harus rollback saat gagal.

### 13.3 Batas data frontend

- Gunakan typed API client dari OpenAPI/kontrak.
- Token auth dikelola sesuai SDK managed auth; jangan simpan secret di source code.
- Jangan mengakses database langsung dari browser.
- UI menyembunyikan aksi yang tidak relevan untuk UX, tetapi backend tetap menjadi kontrol keamanan.
- Mock data hanya untuk storybook/dev/prototype dan harus jelas terpisah dari production config.

### 13.4 Visual QA

Bandingkan dengan prototype pada viewport 320, 375, 768, 1024, 1280, dan 1440 px. Review minimal Beranda, Jelajahi, Creator Studio, Moderasi, dan mobile navigation. Jangan mengubah palette dark navy/teal, CTA turquoise, aksen emas, hierarchy, sidebar desktop, atau bottom navigation mobile tanpa persetujuan.

---

## 14. Observability dan operasi

### 14.1 Logging

Log terstruktur dalam JSON dengan:
- `timestamp`, `level`, `service`, `environment`
- `request_id`, `trace_id` bila tersedia
- `actor_id` pseudonymous bila diperlukan
- `route`, `status_code`, `duration_ms`
- `error_code`, `dependency`

Jangan log bearer token, password, raw signed URL, isi sensitif report, atau payload pribadi penuh.

### 14.2 Metrics minimum

- API request count, latency p50/p95/p99, error rate.
- Database connection pool dan slow queries.
- Upload intent success/failure.
- Processing time dan failure rate video.
- Playback startup/error rate jika provider menyediakan.
- Video delivery cost per watch hour dan biaya storage/transcoding.
- Review queue age, review turnaround, revision/rejection rate.
- Reports open/resolve time dan takedown propagation time.
- Feed-to-watch conversion, completion, save/share, series continuation, retention.
- Job retry/failure/dead-letter counts.

### 14.3 Alert minimum

- API 5xx melewati threshold yang ditetapkan setelah baseline.
- Provider video/auth unavailable.
- Webhook signature failures atau lonjakan callback gagal.
- Worker backlog atau job failure berulang.
- Database storage/connection pool mendekati limit.
- Lonjakan biaya delivery atau playback error.
- Takedown purge gagal melewati target operasional.

Threshold numerik harus ditentukan dari hasil load test dan provider SLA, bukan dikarang di awal.

---

## 15. Strategi pengujian

### 15.1 Test layers

1. **Unit tests:** domain rules, state transitions, permission decisions, validators.
2. **Repository/integration tests:** PostgreSQL, constraints, transactions, migrations.
3. **API tests:** request/response, status codes, auth, pagination, error format.
4. **Contract tests:** OpenAPI/client schemas dan provider adapter.
5. **Security tests:** negative permission tests, IDOR, webhook signature, rate limits.
6. **End-to-end tests:** journey user dan creator/reviewer.
7. **Visual/responsive tests:** prototype fidelity, keyboard/focus, mobile navigation.
8. **Operational tests:** retry, idempotency, provider outage, backup/restore, takedown propagation.

### 15.2 Acceptance scenarios minimum

- Visitor tidak dapat melihat draft, rejected, restricted, atau taken-down video melalui feed, detail, search, maupun playback.
- Creator A tidak dapat membaca/mengedit draft Creator B.
- Creator tidak dapat mempublikasikan konten sendiri melewati review.
- Reviewer tidak dapat menyetujui konten sendiri.
- Video tanpa source/rights declaration tidak dapat submit review.
- Provider webhook dengan signature invalid ditolak.
- Webhook duplikat tidak membuat asset/event duplikat.
- Dua reviewer yang mengubah versi sama menghasilkan conflict yang eksplisit.
- Takedown menghilangkan video dari feed/search segera dari sumber kebenaran dan memicu purge job.
- Save/unsave berulang tidak membuat duplikasi.
- Report memiliki rate limit dan reason code valid.
- Keputusan review, perubahan role, appeal, correction, takedown, dan publish memiliki audit trail.
- Kegagalan provider tidak menampilkan success palsu.
- Mobile dan web responsive tidak overflow pada viewport yang ditetapkan.
- Prototype visual tidak diganti desain generik.

---

## 16. CI/CD dan lingkungan

### 16.1 Lingkungan

- `local`: data dummy dan provider sandbox/mock.
- `test`: integrasi otomatis.
- `staging`: konfigurasi mendekati production, akun uji, video uji.
- `production`: akses terbatas, secrets terpisah, observability aktif.

Jangan memakai data personal production untuk testing tanpa dasar dan prosedur yang disetujui.

### 16.2 Pipeline minimum

1. Format/lint.
2. Type checking frontend.
3. Python lint/type checks.
4. Unit tests.
5. API/integration tests.
6. Build web/mobile/API.
7. Migration check pada database sementara.
8. Dependency/security scan sesuai tooling yang dipilih.
9. Deploy staging.
10. Smoke test dan approval.
11. Deploy production dengan migration strategy dan rollback plan.

Migration yang destruktif tidak boleh dijalankan otomatis tanpa backup/plan yang disetujui. Gunakan expand-migrate-contract bila perubahan schema membutuhkan transisi.

---

## 17. Rencana implementasi di Qoder

Implementasi wajib incremental; jangan meminta Qoder menghasilkan seluruh aplikasi dalam satu langkah.

### Phase 0 — Repository audit dan keputusan

- Baca seluruh `docs/architecture/HLD.md`.
- Periksa repository, package manager, framework, lint/test, dan file existing.
- Salin prototype asli ke `docs/design/NUR_UX_UI_Design_Prototype.html`.
- Buat `docs/architecture/LLD.md` dan `docs/architecture/decisions/`.
- Buat daftar open decisions, jangan memilih vendor tanpa persetujuan.
- Output: audit repo, daftar gap, rencana file, keputusan yang dibutuhkan.

**Gate:** owner menyetujui scope dan daftar keputusan yang harus diputuskan sebelum integrasi vendor.

### Phase 1 — Fondasi dan design system

- Setup workspace sesuai stack yang disetujui.
- Buat design tokens, shared components, AppShell, routing, API client scaffolding.
- Buat `UX_UI_IMPLEMENTATION_SPEC.md`.
- Implementasikan hanya shell dan komponen inti, kemudian tampilkan preview.

**Gate:** visual shell disetujui; responsive dan lint/build lulus.

### Phase 2 — Backend foundation

- FastAPI app, settings, logging, request ID, error schema, health check.
- PostgreSQL migrations, repository/service pattern, test database.
- Auth adapter interface dan permission dependencies.
- OpenAPI schema dan API client generation.

**Gate:** migration, health check, auth test, permission negative tests lulus.

### Phase 3 — Catalog dan playback

- Categories, feed, search, video detail, series, playback adapter interface.
- Data seed khusus development.
- Integrasi provider hanya setelah vendor diputuskan dan PoC disetujui.

**Gate:** hanya video published yang bisa dilihat dan dimainkan.

### Phase 4 — User engagement

- Saved videos, watch progress, report, analytics event schema.
- Loading/error/empty/auth states.
- E2E journey: Temukan → Tonton → Simpan/Bagikan → Lanjutkan serial.

**Gate:** E2E core user journey lulus.

### Phase 5 — Creator Studio dan video lifecycle

- Draft, metadata, sources, rights, upload intent, processing status, retry.
- Creator ownership enforcement.
- Submit review dan status tracking.

**Gate:** creator dapat submit tetapi tidak dapat publish melewati review.

### Phase 6 — Review, moderation, admin

- Review queue, decisions, reason codes, reports, moderation case, takedown, appeal, correction, user/role admin, audit.
- Outbox + worker dan purge/retry.
- Negative permission tests untuk semua aksi sensitif.

**Gate:** semua aksi sensitif server-authorized dan audited.

### Phase 7 — Hardening dan closed beta

- Load/performance test, security review, backup/restore, provider cost test.
- Uji operasional moderator/reviewer dan runbook.
- Beta cohort terbatas; metrik dan feedback dikumpulkan.
- Tunda fitur di luar MVP sampai ada bukti kebutuhan.

**Gate:** sign-off produk, engineering, trust/safety, privacy, dan operasional.

---

## 18. Prompt utama untuk Qoder

Gunakan prompt ini sebagai instruksi implementasi awal:

> Baca `docs/architecture/HLD.md` dan `docs/architecture/LLD.md` secara lengkap sebelum coding. HLD adalah sumber kebenaran untuk scope dan batas arsitektur; LLD menurunkan detail implementasi. Jangan mengubah keputusan yang berstatus OPEN DECISION dan jangan menambah vendor/fitur tanpa ADR dan persetujuan.
>
> Scope MVP NUR adalah curated short Islamic video platform untuk closed beta. Tidak termasuk live streaming, open upload, chat, marketplace/pembayaran kompleks, atau ML recommendations.
>
> Pertama audit repository dan laporkan struktur, stack yang sudah ada, konflik terhadap dokumen, open decisions, file yang akan dibuat, serta test yang akan dijalankan. Jangan overwrite atau menghapus file existing tanpa izin.
>
> Gunakan modular monolith FastAPI + PostgreSQL untuk backend dan stack frontend yang sudah disepakati di HLD. Pisahkan domain module, service/use-case, repository, router, dan integration adapter. Gunakan migrations, typed contracts, OpenAPI, request ID, structured logging, error schema seragam, dan automated tests.
>
> Server harus menjadi sumber kebenaran role, permission, publication status, dan editorial status. Hanya video yang approved dan published boleh dikembalikan oleh feed, search, detail, dan playback. Upload berhasil tidak berarti konten boleh dipublikasikan. Semua tindakan sensitif harus diperiksa di backend dan menulis audit log.
>
> Jangan memilih video provider/auth vendor/analytics vendor jika masih OPEN DECISION. Implementasikan interface adapter dan mock untuk development sampai keputusan disetujui. Jangan membuat data prototype sebagai data produksi.
>
> Untuk frontend, buka `docs/design/NUR_UX_UI_Design_Prototype.html` dan pertahankan visualnya. Jangan redesign menjadi dashboard generik. Implementasikan per phase dan minta review pada setiap gate. Mulai dari Phase 0, bukan seluruh aplikasi sekaligus.
>
> Pada akhir setiap phase, laporkan: file dibuat/diubah, keputusan yang dipakai, test yang dijalankan beserta hasilnya, risiko/open decisions, dan acceptance criteria yang belum terpenuhi. Jangan menyatakan selesai jika test belum dijalankan atau ada kegagalan.

---

## 19. Definition of Done

Sebuah fitur dianggap selesai hanya bila:

- Requirement dan route tercatat.
- Permission/ownership ditegakkan di backend.
- Request/response schema terdokumentasi dalam OpenAPI.
- Validation dan error handling tersedia.
- Database migration dan constraint ditambahkan bila diperlukan.
- Unit/integration/API tests lulus.
- Loading, empty, error, success, disabled, dan unauthorized state tersedia sesuai konteks.
- Tidak ada data mock yang menyamar sebagai produksi.
- Operasi sensitif tercatat di audit log.
- Retry/idempotency diterapkan untuk operasi async yang relevan.
- Responsif dan visual diperiksa terhadap prototype.
- Log tidak membocorkan secret/data sensitif.
- README/runbook diperbarui bila perilaku operasional berubah.

---

## 20. Open decisions yang perlu ditutup sebelum production

1. **Video provider:** PoC playback di jaringan Indonesia, signed upload/playback, captions, webhook, takedown, analytics, harga, dan data processing.
2. **Auth provider:** email/OTP, MFA admin, session lifecycle, account deletion, role mapping.
3. **Platform target:** Android-first atau Android+iOS pada closed beta.
4. **Public website/SEO:** apakah termasuk MVP; jika ya, domain kanonis, route publik, robots/canonical, dan XML sitemap.
5. **Privacy/legal:** usia minimum, consent, data retention, data residency, legal entity, privacy policy, takedown/copyright process.
6. **Analytics vendor:** event retention, consent, export, dan akses data.
7. **Publishing authority:** apakah reviewer dapat publish atau diperlukan role/persetujuan terpisah.
8. **Moderation SLA:** target waktu review, takedown, appeal, dan escalation.
9. **Content policy:** reason codes final, editorial checklist, religious-advisor escalation policy.
10. **Operational thresholds:** load target, SLO, alert thresholds, backup RPO/RTO.
11. **Notification channel:** email/push atau hanya status in-app untuk MVP.
12. **Creator terms and rights evidence:** format deklarasi dan bukti yang diterima.

Jangan mengarang jawaban untuk item-item ini. Catat pilihan dan alasannya dalam ADR setelah keputusan dibuat.

---

## 21. Referensi dokumen

- `docs/architecture/HLD.md` — NUR-HLD-001 v1.1.
- `docs/design/NUR_UX_UI_Design_Prototype.html` — approved visual reference.
- `docs/design/UX_UI_IMPLEMENTATION_SPEC.md` — mapping prototype to production components/screens.
- `docs/product/navigation-and-sitemap.md` — sitemap navigasi.
- `docs/product/user-journeys.md` — user journeys.
- `docs/architecture/route-permission-matrix.md` — route/action authorization.
- `docs/architecture/decisions/` — Architecture Decision Records (ADR).
