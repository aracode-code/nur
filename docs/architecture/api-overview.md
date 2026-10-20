# NUR — API Overview

**Status:** baseline Phase 1 (2026-10-20)
**Detail kontrak:** LLD §8 · **Otorisasi:** `route-permission-matrix.md`

## 1. Prinsip

- Base path `/api/v1`; JSON untuk metadata; media diunggah langsung ke provider.
- OpenAPI dihasilkan dari FastAPI dan diuji contract test; bukan dokumen terpisah yang bisa basi.
- Cursor pagination untuk feed/list tumbuh; offset hanya untuk tabel admin kecil.
- UUID untuk ID; ISO 8601 UTC untuk waktu.
- `Idempotency-Key` untuk operasi berisiko duplikasi (save, upload intent, webhook).
- Validasi input di boundary (Pydantic); invariant domain divalidasi di service.
- Tidak mengembalikan stack trace, SQL, token, signed URL, atau detail internal provider.

## 2. Error envelope

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

| Status | Penggunaan |
|---|---|
| 200/201/202/204 | sukses / dibuat / async diterima / tanpa body |
| 400 | request malformed |
| 401 | belum terautentikasi / token invalid |
| 403 | terautentikasi tetapi tidak berhak |
| 404 | tidak ditemukan **atau** disamarkan untuk mencegah enumeration |
| 409 | konflik status/version/idempotency |
| 413 | file/request terlalu besar |
| 422 | validasi field gagal |
| 429 | rate limit |
| 502/503 | dependency eksternal gagal |
| 500 | error tak terduga, tanpa detail internal |

## 3. Peta endpoint

### 3.1 Public catalog & feed

| Endpoint | Modul | Catatan |
|---|---|---|
| `GET /feed?limit&cursor&category_id` | feed | hanya `approved+published`; cursor opaque |
| `GET /videos/{id}` | catalog | metadata publik |
| `GET /videos/{id}/playback` | catalog + video adapter | playback ref berumur pendek |
| `GET /categories` | catalog | kategori aktif |
| `GET /search?q&category_id&cursor` | search | FTS PostgreSQL; exclude non-publik |
| `GET /series`, `GET /series/{id}` | series | episode hanya jika video+serial published |

### 3.2 Identity, profile, engagement

| Endpoint | Modul | Catatan |
|---|---|---|
| `GET /me` | identity/profiles | profil + role aktif |
| `PATCH /me/profile` | profiles | allowlist field |
| `DELETE /me` | profiles | memulai `pending_deletion` |
| `PUT/DELETE /me/saved-videos/{video_id}` | engagement | idempotent |
| `GET /me/saved-videos` | engagement | cursor |
| `PUT/GET /me/watch-progress[/{video_id}]` | engagement | self only |
| `POST /videos/{video_id}/reports` | trust_safety | reason code, rate limit |
| `POST /analytics/events` | analytics | batch kecil, allowlist schema |

### 3.3 Creator Studio

| Endpoint | Modul | Catatan |
|---|---|---|
| `GET/POST /creator/videos` | creator_ops | own only; draft creation |
| `PATCH /creator/videos/{id}` | creator_ops | allowlist; `expected_version` |
| `POST /creator/videos/{id}/upload-intent` | video_lifecycle | signature provider, idempotent |
| `POST /creator/videos/{id}/submit-review` | creator_ops | media ready + sumber/hak lengkap |
| `GET /creator/videos/{id}/status` | creator_ops | status + alasan review |
| `GET /creator/analytics/summary` | analytics | agregat milik sendiri |
| `POST /webhooks/video-provider` | video_lifecycle | signature wajib, bukan endpoint user |

### 3.4 Reviewer, moderator, admin

| Endpoint | Permission |
|---|---|
| `GET /admin/review-queue` | `review:read` |
| `GET /admin/videos/{id}/review-context` | `review:read` |
| `POST /admin/videos/{id}/review-decision` | `review:decide` |
| `POST /admin/videos/{id}/publish` | `publish:execute` |
| `GET /admin/reports`, `GET /admin/moderation-cases/{id}` | `moderation:read` |
| `POST /admin/moderation-cases/{id}/decision` | `moderation:decide` |
| `POST /admin/moderation-cases/{id}/restrict` | `moderation:restrict` |
| `POST /admin/appeals/{id}/decision` | `appeal:decide` |
| `POST /admin/videos/{id}/corrections` | `correction:write` |
| `GET /admin/users` | `user:read` |
| `POST /admin/creators/{id}/status` | `creator:manage` |
| `GET /admin/audit-logs` | `audit:read` |

## 4. Kontrak penting

**Submit review**

```json
{ "expected_version": 3, "declaration_confirmed": true }
```

**Review decision**

```json
{
  "decision": "request_revision",
  "reason_code": "SOURCE_NEEDS_CLARIFICATION",
  "notes": "Mohon lengkapi rujukan yang dapat diperiksa.",
  "expected_version": 4
}
```

**Feed response (ringkas)**

```json
{
  "items": [{
    "id": "uuid",
    "title": "Contoh judul",
    "duration_seconds": 45,
    "thumbnail_url": "provider-derived-url",
    "playback_ref": "opaque-reference",
    "creator": { "id": "uuid", "display_name": "Nama" },
    "category": { "id": "uuid", "name": "Ilmu Praktis" },
    "published_at": "2026-10-20T08:00:00Z",
    "series": { "id": "uuid", "title": "Adab Harian", "episode_number": 2 }
  }],
  "next_cursor": null
}
```

## 5. Rate limit (default awal)

| Area | Default |
|---|---|
| Login/auth | sesuai provider + throttle lokal |
| `POST /reports` | per user per jam |
| Upload intent | per creator per jam |
| `POST /analytics/events` | per sesi/per menit + batch size |
| Search publik | per IP/per menit |

Nilai numerik final ditetapkan setelah load test; jangan mengarang SLO.

## 6. Versioning & kompatibilitas

- `/api/v1` stabil; perubahan breaking → `/api/v2` atau transisi terdokumentasi.
- Field baru additive dianggap kompatibel.
- Enum baru harus ditangani client secara defensif (fallback label), tetapi server tetap memvalidasi.
- Contract test di CI membandingkan OpenAPI dengan response nyata.

## 7. Yang belum diputuskan

- OD-02: bentuk playback reference & signed URL bergantung vendor.
- OD-03: alur login/refresh mengikuti provider.
- OD-11: target latency/SLO belum ditetapkan (HLD §14 hanya target awal).
