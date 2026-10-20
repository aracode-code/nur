# NUR — Route & Permission Matrix

**Status:** baseline Phase 1 (2026-10-20)
**Sumber:** HLD §10/§26.5, LLD §5/§8, ADR-0009

## 1. Aturan penegakan

- Semua keputusan otorisasi dieksekusi **di backend**. UI hanya menyembunyikan aksi untuk kenyamanan.
- Default deny: permission tidak dikenal atau role tidak aktif → `403`.
- Resource yang tidak boleh diketahui keberadaannya → `404` (hindari enumeration).
- Role diambil dari database NUR, bukan dari klaim token/client.
- Kepemilikan (ownership) diperiksa untuk setiap operasi creator dan pengguna.
- Setiap aksi sensitif menulis `audit_logs` dengan `reason_code` dan `request_id`.

## 2. Role

| Role | Deskripsi |
|---|---|
| `visitor` | Tanpa sesi; hanya endpoint/route publik. |
| `user` | Akun terdaftar; engagement dan profil sendiri. |
| `creator` | Kreator diundang/aktif; memiliki konten sendiri. |
| `reviewer` | Keputusan editorial; pada MVP boleh memegang `publish:execute`. |
| `moderator` | Laporan, restriksi, takedown, banding, koreksi. |
| `admin` | Role/user, konfigurasi, audit, seluruh operasi dengan audit. |
| `analyst` | Metrik agregat; tanpa data personal dan tanpa aksi konten. |
| `scholar_advisor` | Masukan editorial opsional; tanpa hak admin teknis. |

## 3. Katalog permission

| Permission | visitor | user | creator | reviewer | moderator | admin | analyst |
|---|---:|---:|---:|---:|---:|---:|---:|
| `catalog:read` | Ya | Ya | Ya | Ya | Ya | Ya | Ya |
| `engagement:write` (save/progress) | – | Ya | Ya | Ya | Ya | Ya | – |
| `report:create` | – | Ya | Ya | Ya | Ya | Ya | – |
| `creator:video:read` | – | – | own | – | – | assigned | – |
| `creator:video:write` | – | – | own | – | – | assigned | – |
| `creator:submit` | – | – | own | – | – | assigned | – |
| `creator:analytics:read` | – | – | own | – | – | Ya | Ya |
| `review:read` | – | – | – | Ya | escalated | Ya | – |
| `review:decide` | – | – | – | Ya (bukan konten sendiri) | terbatas | Ya bila ditugaskan | – |
| `publish:execute` | – | – | – | Ya (MVP) | – | Ya | – |
| `moderation:read` | – | own report | terkait | tugas | Ya | Ya | agregat |
| `moderation:decide` | – | – | – | eskalasi | Ya | Ya | – |
| `moderation:restrict` | – | – | – | eskalasi | Ya | Ya | – |
| `appeal:decide` | – | – | – | reviewer berbeda | sesuai policy | Ya + audit | – |
| `correction:write` | – | – | – | tugas | Ya | Ya | – |
| `user:read` | – | – | – | – | – | Ya | – |
| `role:manage` | – | – | – | – | – | Ya | – |
| `audit:read` | – | – | – | scope | scope | Ya (diaudit) | – |
| `analytics:read` | – | – | own | tugas | tugas | Ya | Ya (agregat) |

## 4. Route UI → akses

### 4.1 Mobile app

| Route | Layar | Akses | Status |
|---|---|---|---|
| `/` | Beranda | publik | MVP |
| `/jelajahi` | Jelajahi + filter + search | publik | MVP |
| `/serial` | Daftar serial | publik | MVP |
| `/serial/[id]` | Detail serial + episode | publik | MVP |
| `/video/[id]` | Player/detail vertikal | publik (konten published) | MVP |
| `/tersimpan` | Koleksi tersimpan | `user` | MVP |
| `/profil` | Profil sendiri | `user` | MVP |
| `/profil/preferensi` | Minat, bahasa, privasi | `user` | MVP |
| `/masuk` | Login/onboarding | publik → sesi | MVP |
| `/laporkan/[videoId]` | Form laporan | `user` | MVP |
| `/riwayat` | Riwayat tontonan | `user` | POST-MVP (scope decision) |
| `/notifikasi` | Notifikasi | `user` | POST-MVP (ADR-0010) |

### 4.2 Creator Studio

| Route | Layar | Akses |
|---|---|---|
| `/login` | Login kreator | publik |
| `/dashboard` | KPI + ringkasan | `creator` |
| `/konten` | Daftar konten sendiri | `creator` |
| `/konten/[id]` | Detail + riwayat status | `creator` (own) |
| `/unggah` | Upload + metadata + sumber/hak | `creator` |
| `/analitik` | Ringkasan performa sendiri | `creator` |
| `/pengaturan` | Profil publik kreator | `creator` |

### 4.3 Admin Console

| Route | Layar | Permission |
|---|---|---|
| `/login` | Login + MFA bila tersedia | publik |
| `/dashboard` | Operasional | `review:read` / `moderation:read` |
| `/review` `/review/[id]` | Antrean + detail review | `review:read` |
| `/review/[id]/keputusan` | Approve/revise/reject/escalate | `review:decide` |
| `/reports` `/kasus/[id]` | Laporan + kasus | `moderation:read` |
| `/kasus/[id]/tindakan` | Restrict/takedown/no-violation | `moderation:restrict` |
| `/banding/[id]` | Banding | `appeal:decide` |
| `/koreksi` | Koreksi publik | `correction:write` |
| `/katalog` `/serial` | Katalog & serial | `review:read` (edit: admin) |
| `/kreator` | Status kreator | `creator:manage` |
| `/pengguna` | User & role | `user:read` / `role:manage` |
| `/audit` | Audit log | `audit:read` |
| `/metrik` | Analytics agregat | `analytics:read` |

Tidak ada route admin yang boleh merender data sebelum permission diverifikasi server (route guard saja tidak cukup).

## 5. API route → permission

| Endpoint | Auth | Permission/aturan |
|---|---|---|
| `GET /api/v1/feed` | opsional | hanya `approved+published` |
| `GET /api/v1/videos/{id}` | opsional | hanya `approved+published` |
| `GET /api/v1/videos/{id}/playback` | opsional | cek status sebelum playback ref |
| `GET /api/v1/search` | opsional | exclude draft/restricted/takedown |
| `GET /api/v1/series`, `/series/{id}` | opsional | serial & episode published |
| `GET /api/v1/me` | wajib | user aktif |
| `PATCH /api/v1/me/profile` | wajib | allowlist field, self only |
| `DELETE /api/v1/me` | wajib | memulai `pending_deletion` |
| `PUT/DELETE /api/v1/me/saved-videos/{id}` | wajib | idempotent, video published |
| `GET /api/v1/me/saved-videos` | wajib | cursor |
| `PUT/GET /api/v1/me/watch-progress` | wajib | self only |
| `POST /api/v1/videos/{id}/reports` | wajib | `report:create`, rate limit |
| `POST /api/v1/analytics/events` | opsional | event allowlist, size limit |
| `GET /api/v1/creator/videos` | wajib | `creator:video:read`, own |
| `POST /api/v1/creator/videos` | wajib | `creator:video:write` |
| `PATCH /api/v1/creator/videos/{id}` | wajib | own, allowlist |
| `POST /api/v1/creator/videos/{id}/upload-intent` | wajib | own, status valid, idempotent |
| `POST /api/v1/creator/videos/{id}/submit-review` | wajib | own, media ready, metadata lengkap |
| `GET /api/v1/creator/videos/{id}/status` | wajib | own |
| `GET /api/v1/creator/analytics/summary` | wajib | own, agregat |
| `GET /api/v1/admin/review-queue` | wajib | `review:read` |
| `GET /api/v1/admin/videos/{id}/review-context` | wajib | `review:read` |
| `POST /api/v1/admin/videos/{id}/review-decision` | wajib | `review:decide`, bukan konten sendiri |
| `POST /api/v1/admin/videos/{id}/publish` | wajib | `publish:execute` (ADR-0009) |
| `GET /api/v1/admin/reports` | wajib | `moderation:read` |
| `GET /api/v1/admin/moderation-cases/{id}` | wajib | `moderation:read` |
| `POST /api/v1/admin/moderation-cases/{id}/decision` | wajib | `moderation:decide` |
| `POST /api/v1/admin/moderation-cases/{id}/restrict` | wajib | `moderation:restrict` |
| `POST /api/v1/admin/appeals/{id}/decision` | wajib | `appeal:decide` |
| `POST /api/v1/admin/videos/{id}/corrections` | wajib | `correction:write` |
| `GET /api/v1/admin/users` | wajib | `user:read` |
| `POST /api/v1/admin/creators/{id}/status` | wajib | `creator:manage` |
| `GET /api/v1/admin/audit-logs` | wajib | `audit:read` |
| `POST /api/v1/webhooks/video-provider` | signature | bukan endpoint user |

## 6. Negative test wajib

1. Visitor tidak dapat mengakses draft/rejected/restricted/taken-down via feed, detail, search, playback.
2. Creator A tidak dapat membaca/mengedit draft Creator B (IDOR).
3. Creator tidak dapat memanggil endpoint publish.
4. Reviewer tidak dapat menyetujui konten buatan sendiri.
5. User biasa memanggil endpoint admin → `403`.
6. Analyst membuka data personal → `403`.
7. Token valid tanpa role aktif → `403` (bukan `200`).
8. Role yang dikirim di body/header diabaikan.
9. Webhook tanpa signature valid → `401/403`, tidak ada perubahan status.
10. `expected_version` salah → `409`, bukan overwrite diam-diam.
11. Audit endpoint tidak menyediakan update/delete.
12. Akses resource milik orang lain → `404` bila keberadaan harus disamarkan.
