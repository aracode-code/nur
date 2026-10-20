# NUR API — Foundation (Phase 2)

FastAPI foundation untuk NUR: settings, structured JSON logging, request ID, error envelope, health/readiness, mock auth, dan permission dependency.

## Menjalankan

```bash
cd backend
python -m venv .venv
.venv/Scripts/python -m pip install -e ".[dev]"   # Windows
# source .venv/bin/activate && pip install -e ".[dev]"  # Unix
.venv/Scripts/python -m uvicorn app.main:app --reload --port 8000
```

- Health: `GET http://127.0.0.1:8000/health`
- Readiness: `GET http://127.0.0.1:8000/ready` → `degraded` selama database/video provider belum dikonfigurasi
- OpenAPI: `http://127.0.0.1:8000/docs`

## Test

```bash
cd backend
.venv/Scripts/python -m pytest
```

## Mock auth (development only)

`auth_mode=mock`. Kirim `Authorization: Bearer <token>`:

| Token | Role |
|---|---|
| `dev-user` | user |
| `dev-creator` | user, creator |
| `dev-reviewer` | user, reviewer (termasuk `publish:execute` pada MVP) |
| `dev-moderator` | user, moderator |
| `dev-admin` | user, admin |
| `dev-analyst` | analyst |
| `dev-scholar` | user, scholar_advisor |

Token ini **bukan secret** dan DILARANG dipakai di staging/production. Untuk `auth_mode` selain `mock`, endpoint mengembalikan `503 AUTH_NOT_CONFIGURED` sampai adapter managed auth diimplementasikan (ADR-0005).

## Yang belum ada

- Database, migration, repository (Phase 2 lanjutan).
- Endpoint katalog/creator/admin; hanya `/api/v1/me` sebagai fondasi.
- Rate limiting, audit persistence, OpenAPI contract test.

## Catatan keamanan

- Role/permission dihitung di server dari role internal, bukan dari klaim client.
- Default deny: permission tidak dikenal ditolak, termasuk untuk admin.
- Error 500 tidak mengembalikan detail internal; request ID selalu disertakan.
