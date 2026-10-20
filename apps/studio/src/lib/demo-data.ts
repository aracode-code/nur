/**
 * Data demo untuk UX Gate A. BUKAN data produksi dan tidak boleh dipakai
 * sebagai seed production (HLD §28.9, UX spec §7).
 */
export type DemoAccent = "primary" | "gold" | "danger";

export type DemoVideo = {
  id: string;
  title: string;
  category: string;
  creator: string;
  duration: string;
  accent: DemoAccent;
};

export const demoVideos: DemoVideo[] = [
  {
    id: "demo-01",
    title: "Adab Sebelum Tidur",
    category: "Ilmu Praktis",
    creator: "Kreator Contoh A",
    duration: "0:48",
    accent: "primary",
  },
  {
    id: "demo-02",
    title: "Doa Perjalanan",
    category: "Ilmu Praktis",
    creator: "Kreator Contoh B",
    duration: "0:36",
    accent: "gold",
  },
  {
    id: "demo-03",
    title: "Kisah Nabi Yusuf — Bagian 1",
    category: "Kisah",
    creator: "Kreator Contoh C",
    duration: "1:12",
    accent: "primary",
  },
  {
    id: "demo-04",
    title: "Menjaga Lisan di Ruang Digital",
    category: "Ilmu Praktis",
    creator: "Kreator Contoh D",
    duration: "0:52",
    accent: "danger",
  },
  {
    id: "demo-05",
    title: "Refleksi Pagi: Syukur",
    category: "Kisah",
    creator: "Kreator Contoh A",
    duration: "0:28",
    accent: "gold",
  },
  {
    id: "demo-06",
    title: "Adab Harian — Episode 2",
    category: "Serial",
    creator: "Kreator Contoh B",
    duration: "0:44",
    accent: "primary",
  },
];

export type DemoSeries = {
  id: string;
  title: string;
  description: string;
  episodes: number;
  completed: number;
  category: string;
};

export const demoSeries: DemoSeries[] = [
  {
    id: "series-01",
    title: "Adab Harian",
    description: "Kebiasaan kecil yang dibangun bertahap dalam enam episode.",
    episodes: 6,
    completed: 2,
    category: "Ilmu Praktis",
  },
  {
    id: "series-02",
    title: "Kisah Teladan",
    description: "Rangkaian kisah dengan konteks dan rujukan yang dapat diperiksa.",
    episodes: 8,
    completed: 0,
    category: "Kisah",
  },
  {
    id: "series-03",
    title: "Doa & Dzikir Harian",
    description: "Panduan singkat untuk momen harian, disusun bertahap.",
    episodes: 5,
    completed: 5,
    category: "Ilmu Praktis",
  },
];

export const demoStats = [
  { label: "Video tersedia", value: "6 demo", hint: "Data contoh, bukan katalog nyata" },
  { label: "Serial aktif", value: "3 demo", hint: "Progres disimpan setelah auth aktif" },
  { label: "Status akun", value: "Tamu", hint: "Login aktif pada Phase 2/4" },
];
