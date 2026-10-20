# ADR-0007 — Analytics First-Party dan Definisi Meaningful Session

- **Status:** Accepted (default, diotorisasi owner 2026-10-20)
- **Tanggal:** 2026-10-20
- **Pemilik keputusan:** Product + analytics
- **Terkait:** HLD §15, LLD §6.2 (`product_events`), OD-09, OD-14

## Konteks

Metrik inti harus dapat dipercaya, minim PII, dan tidak bergantung pada vendor analytics eksternal sebelum kebijakan privasi final. Definisi north star belum operasional.

## Keputusan

1. **Event first-party** disimpan di tabel `product_events` dengan `event_name`, `schema_version`, `event_id` unik, timestamp, actor reference pseudonim, dan `properties` JSONB terbatas.
2. Event allowlist + validasi schema; ingestion idempotent berdasarkan `event_id`; batas ukuran dan rate limit.
3. Dilarang mengirim email, telepon, token, signed URL, isi laporan privat, atau teks bebas sensitif.
4. Agregasi dilakukan job terjadwal (`aggregate_product_events`); dashboard membaca agregat, bukan raw events.
5. **Vendor analytics eksternal tidak dipakai pada MVP** (OD-14 default). Integrasi vendor hanya melalui adapter dan ADR baru.
6. **Meaningful watch session (OD-09 default, provisional):** satu sesi dihitung bermakna bila memuat minimal satu video yang mencapai **≥70% durasi** atau `completed`, DAN sesi tersebut juga memuat setidaknya satu aksi: `save`, `share`, atau `series_continuation`. Dedup per `(actor_ref, video_id, session_id)`.
7. Ambang 70% adalah **konfigurasi**, bukan angka final; dievaluasi setelah baseline pilot.

## Konsekuensi

- **Positif:** kontrol privasi penuh, definisi metrik tunggal, tanpa lock-in vendor.
- **Negatif:** dashboard harus dibangun sendiri; query agregasi menambah beban worker.
- **Risiko:** ambang 70% mungkin tidak mencerminkan perilaku nyata; wajib dievaluasi dengan data pilot.
- **Revisit trigger:** baseline pilot diperoleh (OD-09), volume event membutuhkan warehouse, atau kebijakan privasi menuntut consent berbeda.

## Bukti / referensi

HLD §7.4/§15, LLD §12.2. Angka 70% adalah default operasional, bukan hasil pengukuran.
