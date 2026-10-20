# ADR-0004 — Strategi Video Provider (Adapter-First)

- **Status:** Accepted (default, diotorisasi owner 2026-10-20) — vendor belum dipilih
- **Tanggal:** 2026-10-20
- **Pemilik keputusan:** Tech lead + finance
- **Terkait:** HLD §11, LLD §10, OD-02

## Konteks

Video delivery adalah pusat biaya dan risiko produk. Memilih vendor sebelum PoC berisiko mengunci biaya, kualitas playback, dan kemampuan takedown. Domain NUR tidak boleh bergantung pada nama vendor.

## Keputusan

1. Implementasikan **interface adapter internal** `VideoProvider` (LLD §10.1): upload intent, asset status, playback reference, restriction, purge, webhook verification.
2. Gunakan **mock provider** untuk development dan test; tidak ada kredensial vendor nyata di repo.
3. **Vendor selection tetap OPEN (OD-02)** dan wajib melalui PoC sebelum integrasi Phase 3. Kriteria: playback Indonesia, portrait/adaptive bitrate, signed upload/playback, transcoding, caption, webhook, takedown, biaya per jam tonton, exportability, privasi/SLA.
4. Nama vendor, header, dan payload spesifik hanya boleh muncul di `backend/app/integrations/video/`.
5. Webhook: verifikasi signature pada raw body, dedup provider event ID, idempotent, tidak menyetujui editorial.

## Konsekuensi

- **Positif:** Phase 2–3 dapat dibangun dan diuji tanpa menunggu vendor; migrasi vendor lebih murah.
- **Negatif:** integrasi nyata dan biaya aktual belum tervalidasi; playback end-to-end menunggu PoC.
- **Risiko:** perbedaan kemampuan vendor (signed playback, purge) dapat memaksa perubahan adapter; kontrak adapter harus cukup umum.
- **Revisit trigger:** PoC selesai (tutup OD-02); atau vendor mengubah harga/kebijakan secara material.

## Bukti / referensi

HLD §11.2 (provider selection gate), LLD §10. PoC belum dijalankan — status jujur: **belum ada bukti biaya/playback**.
