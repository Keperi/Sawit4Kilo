# KIDCEO Design System Specification (`design.md`)

Dokumentasi ini menetapkan aturan implementasi visual, struktur hierarki komponen, dan pemetaan keadaan (state-to-ui mapping) untuk sistem monitoring IoT KIDCEO.

## 1. Tata Letak Global & Grid Layout

Aplikasi menggunakan layout tipe **Fixed Sidebar** di sisi kiri dengan area konten yang bersifat dinamis (scrollable container) di sisi kanan.

* **Sidebar Width:** `260px` (tetap pada resolusi desktop `md:` ke atas).
* **Main Wrapper:** `w-full min-h-screen bg-brand-bg text-neutral-title flex flex-col md:flex-row`.
* **Bento Grid Dashboard:** Menggunakan CSS Grid 12-kolom pada desktop untuk efisiensi penempatan widget:
    * Metric Cards (pH & TDS): `col-span-12 md:col-span-6 lg:col-span-3`
    * Trend Chart: `col-span-12 lg:col-span-8`
    * Quick Control (Buzzer): `col-span-12 lg:col-span-4`

## 2. Spesifikasi Visual Komponen

### A. Kontainer Kartu (Bento Card Container)
Semua komponen informasi wajib dibungkus oleh elemen div standar ini untuk menjaga konsistensi elevasi:
* **Kelas Tailwind:** `bg-brand-card border border-neutral-border/40 rounded-card shadow-soft p-6 transition-all duration-200`

### B. Komponen Grafik Tren (Recharts Customization)
Untuk mereplikasi visualisasi grafik area pada `image_2a0abb.jpg`, terapkan konfigurasi berikut:
* **Stroke Width:** `2px`
* **Dot Marker:** Aktif hanya pada titik hover (`activeDot={{ r: 6, strokeWidth: 0 }}`).
* **Linear Gradient Definition:**
    ```jsx
    <defs>
      <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="var(--color-ph)" stopOpacity={0.2}/>
        <stop offset="95%" stopColor="var(--color-ph)" stopOpacity={0}/>
      </linearGradient>
    </defs>
    ```

### C. Tipografi & Hirarki Teks
* **Page Title:** `text-2xl font-bold tracking-tight text-neutral-title`
* **Section/Card Title:** `text-sm font-semibold tracking-wide text-neutral-body uppercase`
* **Big Data Numbers:** `text-4xl font-extrabold tracking-tight text-neutral-title`

---

## 3. Pemetaan Keadaan State ke Antarmuka (State-to-UI Mapping)

Sistem visual wajib merespons perubahan nilai data sensor dari perangkat keras secara instan melalui perubahan token warna semantik:

| Parameter | Kondisi Logika Data | Token Warna UI (`bg` & `text`) | Efek Visual / Status Badge |
| :--- | :--- | :--- | :--- |
| **Nilai pH** | `< 6.5` (Asam/Acidic) | `bg-red-50/80 text-telemetry-ph-acid` | Badge "Danger: Acidic" |
| **Nilai pH** | `6.5 - 7.5` (Netral) | `bg-emerald-50/80 text-telemetry-ph-neutral` | Badge "Stable: Neutral" |
| **Nilai pH** | `> 7.5` (Basa/Alkaline) | `bg-blue-50/80 text-telemetry-ph-alkaline` | Badge "Danger: Alkaline" |
| **Audio Toggle**| `true` (Alarm Aktif) | `bg-blue-600` (pada komponen Switch) | Tombol bergeser ke kanan |
| **Audio Toggle**| `false` (Mute) | `bg-slate-200` (pada komponen Switch) | Tombol bergeser ke kiri |

---

## 4. Panduan Interaksi (Micro-Interactions)

1.  **Hover State pada Kartu:** Tambahkan efek translasi mikro saat pointer mouse berada di atas kartu navigasi cepat: `hover:-translate-y-1 hover:shadow-md`.
2.  **Loading Placeholder (Skeletone UI):** Saat data sensor pertama kali di-fetch (sesuai diagram alur inisialisasi awal), area teks angka besar wajib merender div animasi denyut: `animate-pulse bg-slate-200 h-10 w-24 rounded`.
3.  **Aksi Klik Asinkron:** Ketika tombol switch Audio dipicu, jalankan animasi rotasi spinner mikro di dalam toggle untuk memberi kepastian visual kepada user bahwa sinyal sedang dikirim ke ESP32.

---

## 5. Arahan Implementasi Pembungkus Halaman

Untuk memastikan pengembang atau Anda sendiri tidak melenceng saat mentransisikan tampilan ke versi perbaikan, ikuti tiga aturan tata letak halaman ini:

1. **Aturan Spasi Kosong (Negative Space Control):** Sesuai struktur data halaman 2 (`Histori dan Laporan`) di `KIDCEO.json`, jangan penuhi layar dengan tabel. Batasi kontainer tabel maksimal setinggi `max-h-[600px]` dan bungkus di dalam elemen overflow scroll. Berikan bantalan kosong (`p-8`) di sekeliling grid utama.
2. **Elevasi Komponen Kontrol Fisik:** Sakelar toggle audio buzzer (`Halaman Utama` pada `KIDCEO.json`) tidak boleh diletakkan sejajar dengan tabel log biasa. Pisahkan kontrol tersebut ke dalam kartu mini mandiri berkategori *Quick Action Card* dengan latar belakang redup (`bg-slate-50`) untuk memandunya sebagai elemen tombol interaktif.
3. **Penyelarasan Input Validasi Form:** Kolom input batas pH pada Halaman Konfigurasi (`image_35ec5f.jpg`) wajib diletakkan bersandingan secara horizontal (`grid grid-cols-2 gap-4`) dalam satu baris, bukan ditumpuk vertikal berukuran raksasa. Hal ini bertujuan agar pengguna dapat membandingkan batas minimum dan maksimum secara linear dan logis.
