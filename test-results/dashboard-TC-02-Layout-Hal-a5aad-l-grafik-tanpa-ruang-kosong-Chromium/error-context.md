# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.js >> TC-02: Layout Halaman Analisis >> Halaman analisis menampilkan semua modul grafik tanpa ruang kosong
- Location: tests\dashboard.spec.js:81:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Tren Real-Time').or(locator('text=Trend'))
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for locator('text=Tren Real-Time').or(locator('text=Trend'))

```

```yaml
- complementary:
  - img "Kideco Logo"
  - button "Dashboard"
  - button "Histori & Laporan"
  - button "Device"
  - button "Analisis"
  - text: Notifikasi
  - switch "Alarm Suara Mati"
  - switch "Buzzer Mati"
  - button "Alex Johnson Admin Alex Johnson":
    - img "Alex Johnson"
    - text: Admin Alex Johnson
- main:
  - heading "Analisis" [level=1]
  - button "Bahaya"
  - button
  - heading "Filter Analisis Kualitas Air" [level=4]
  - paragraph: Sesuaikan rentang waktu dan node pemantauan
  - text: Rentang Waktu
  - combobox:
    - option "24 Jam Terakhir"
    - option "7 Hari Terakhir" [selected]
    - option "30 Hari Terakhir"
  - text: Node Pemantauan
  - combobox:
    - option "Semua Node" [selected]
    - option "Node KDC01 (Kolam Pengendap 1)"
    - option "Node KDC02 (Kolam Pengendap 2)"
  - text: 100 sampel data AI
  - heading "Ringkasan Eksekutif" [level=3]
  - paragraph: Analisis otomatis berbasis kecerdasan buatan
  - combobox:
    - option "24 Jam Terakhir"
    - option "7 Hari Terakhir" [selected]
    - option "30 Hari Terakhir"
  - button "Regenerate"
  - text: STATUS AMAN
  - paragraph: Kondisi air di tambang KIDECO saat ini tergolong basa dengan pH yang melebihi ambang batas, yaitu 9,37. Hal ini dapat menyebabkan perubahan ekosistem air dan potensi kerusakan pada ekosistem akuatik di sekitar tambang. Dampaknya, perubahan pH air dapat mempengaruhi keseimbangan ekosistem air, sehingga dapat mematikan beberapa jenis organisme yang tidak toleran terhadap kondisi air basa.
  - text: "Rencana Aksi & Tindak Lanjut:"
  - list:
    - listitem: 1 Lakukan pengecekan lapangan pada KDC01 dengan status BAHAYA
  - paragraph: Dihasilkan otomatis oleh AI KIDECO Copilot. Diperlukan verifikasi manusia sebelum keputusan kritis.
  - heading "Tren & Korelasi pH vs TDS" [level=3]
  - paragraph: Visualisasi tren dan hubungan kedua parameter
  - text: Korelasi Pearson -0.51 (kuat, berbanding terbalik)
  - img: 01:16 01:16 01:11 01:10 01:09 01:06 01:06 01:05 01:04 01:04 01:03 01:02 01:02 01:01 01:00 00:59 0 4 8 14 0 300 600 900 1200
  - text: pH TDS (ppm) AI Analisis Insight AI
  - button "Regenerate"
  - paragraph: Insight analisis belum dihasilkan
  - paragraph: Dihasilkan otomatis oleh AI KIDECO Copilot.
  - heading "Prediksi Sederhana" [level=3]
  - paragraph: Proyeksi tren berdasarkan regresi linear
  - paragraph:
    - strong: "Estimasi Statistik:"
    - text: Grafik di bawah merupakan proyeksi regresi linear sederhana untuk kebutuhan estimasi operasional dan tidak menjamin nilai riil di lapangan.
  - img: 01:01 01:01 01:00 00:59 +1 +6 0 4 8 14 0 200 400 600 800 pH 4.5 (Batas)
  - text: pH TDS (ppm) Proyeksi AI Analisis Insight AI
  - button "Regenerate"
  - paragraph: Insight analisis belum dihasilkan
  - paragraph: Dihasilkan otomatis oleh AI KIDECO Copilot.
  - heading "Statistik Ringkasan" [level=3]
  - paragraph: Ringkasan statistik parameter kualitas air
  - text: pH Parameter Rata-rata 9.37 Min 9.0 Max 10.3 Std Dev 0.15 Bahaya 100 x TDS Parameter Rata-rata 736 ppm Min 87 ppm Max 1159 ppm Std Dev 136 ppm Total data dianalisis 100 sampel AI Analisis Insight AI
  - button "Regenerate"
  - paragraph: Insight analisis belum dihasilkan
  - paragraph: Dihasilkan otomatis oleh AI KIDECO Copilot.
  - heading "Deteksi Anomali" [level=3]
  - paragraph: Penyimpangan data dari pola normal
  - text: 100 Terdeteksi
  - table:
    - rowgroup:
      - row "Waktu pH TDS Parameter Tingkat":
        - columnheader "Waktu"
        - columnheader "pH"
        - columnheader "TDS"
        - columnheader "Parameter"
        - columnheader "Tingkat"
    - rowgroup:
      - row "9.1 1063 ppm pH & TDS Sedang":
        - cell
        - cell "9.1"
        - cell "1063 ppm"
        - cell "pH & TDS"
        - cell "Sedang"
      - row "9.1 1062 ppm pH & TDS Sedang":
        - cell
        - cell "9.1"
        - cell "1062 ppm"
        - cell "pH & TDS"
        - cell "Sedang"
      - row "9.0 1062 ppm pH & TDS Sedang":
        - cell
        - cell "9.0"
        - cell "1062 ppm"
        - cell "pH & TDS"
        - cell "Sedang"
      - row "9.0 1064 ppm pH & TDS Sedang":
        - cell
        - cell "9.0"
        - cell "1064 ppm"
        - cell "pH & TDS"
        - cell "Sedang"
      - row "9.1 1065 ppm pH & TDS Sedang":
        - cell
        - cell "9.1"
        - cell "1065 ppm"
        - cell "pH & TDS"
        - cell "Sedang"
      - row "9.0 1065 ppm pH & TDS Sedang":
        - cell
        - cell "9.0"
        - cell "1065 ppm"
        - cell "pH & TDS"
        - cell "Sedang"
      - row "9.1 1067 ppm pH & TDS Sedang":
        - cell
        - cell "9.1"
        - cell "1067 ppm"
        - cell "pH & TDS"
        - cell "Sedang"
      - row "9.1 1066 ppm pH & TDS Sedang":
        - cell
        - cell "9.1"
        - cell "1066 ppm"
        - cell "pH & TDS"
        - cell "Sedang"
      - row "9.1 1068 ppm pH & TDS Sedang":
        - cell
        - cell "9.1"
        - cell "1068 ppm"
        - cell "pH & TDS"
        - cell "Sedang"
      - row "9.3 1140 ppm pH & TDS Sedang":
        - cell
        - cell "9.3"
        - cell "1140 ppm"
        - cell "pH & TDS"
        - cell "Sedang"
      - row "9.2 1159 ppm pH & TDS Berat":
        - cell
        - cell "9.2"
        - cell "1159 ppm"
        - cell "pH & TDS"
        - cell "Berat"
      - row "9.4 87 ppm pH & TDS Berat":
        - cell
        - cell "9.4"
        - cell "87 ppm"
        - cell "pH & TDS"
        - cell "Berat"
      - row "10.0 756 ppm pH Berat":
        - cell
        - cell "10.0"
        - cell "756 ppm"
        - cell "pH"
        - cell "Berat"
      - row "10.3 735 ppm pH Berat":
        - cell
        - cell "10.3"
        - cell "735 ppm"
        - cell "pH"
        - cell "Berat"
      - row "9.4 701 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "701 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 702 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "702 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 703 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "703 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 700 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "700 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 701 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "701 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 702 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "702 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 702 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "702 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 704 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "704 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 703 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "703 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 698 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "698 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 702 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "702 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 702 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "702 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 701 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "701 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 702 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "702 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 702 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "702 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 702 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "702 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 700 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "700 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 702 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "702 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 701 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "701 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 701 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "701 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 701 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "701 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 701 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "701 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 701 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "701 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 700 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "700 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 701 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "701 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 702 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "702 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 701 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "701 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 702 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "702 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 701 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "701 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 704 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "704 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 697 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 698 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "698 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 697 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 697 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 697 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 696 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "696 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 697 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 697 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 700 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "700 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 697 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 697 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 697 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 700 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "700 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 697 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 696 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "696 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 697 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 698 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "698 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 698 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "698 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 696 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "696 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 698 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "698 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 698 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "698 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 696 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "696 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 698 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "698 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 696 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "696 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 697 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 701 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "701 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 697 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 697 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 698 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "698 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 701 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "701 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 698 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "698 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 698 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "698 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 697 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 699 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "699 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 701 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "701 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 699 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "699 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 696 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "696 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 700 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "700 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 697 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "697 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 703 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "703 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.5 694 ppm pH Ringan":
        - cell
        - cell "9.5"
        - cell "694 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 694 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "694 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 696 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "696 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 693 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "693 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 694 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "694 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 689 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "689 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 694 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "694 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 692 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "692 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.4 693 ppm pH Ringan":
        - cell
        - cell "9.4"
        - cell "693 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.8 694 ppm pH Sedang":
        - cell
        - cell "9.8"
        - cell "694 ppm"
        - cell "pH"
        - cell "Sedang"
      - row "9.3 705 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "705 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 706 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "706 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 705 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "705 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 704 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "704 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 706 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "706 ppm"
        - cell "pH"
        - cell "Ringan"
      - row "9.3 707 ppm pH Ringan":
        - cell
        - cell "9.3"
        - cell "707 ppm"
        - cell "pH"
        - cell "Ringan"
  - text: AI Analisis Insight AI
  - button "Regenerate"
  - paragraph: Insight analisis belum dihasilkan
  - paragraph: Dihasilkan otomatis oleh AI KIDECO Copilot.
  - heading "Perbandingan antar Node" [level=3]
  - paragraph: Analisis komparatif performa setiap node
  - text: Paling Bermasalah KDC01 100 kejadian BAHAYA Paling Stabil KDC02 0 kejadian BAHAYA
  - table:
    - rowgroup:
      - row "Node Rata-rata pH Rata-rata TDS BAHAYA":
        - columnheader "Node"
        - columnheader "Rata-rata pH"
        - columnheader "Rata-rata TDS"
        - columnheader "BAHAYA"
    - rowgroup:
      - row "KDC01 9.4 736 ppm 100":
        - cell "KDC01"
        - cell "9.4"
        - cell "736 ppm"
        - cell "100"
      - row "KDC02 7.0 240 ppm 0":
        - cell "KDC02"
        - cell "7.0"
        - cell "240 ppm"
        - cell "0"
  - img: KDC01 KDC02 0 4 8 14 0 200 400 600 800
  - text: pH TDS (ppm) AI Analisis Insight AI
  - button "Regenerate"
  - paragraph: Insight analisis belum dihasilkan
  - paragraph: Dihasilkan otomatis oleh AI KIDECO Copilot.
- heading "Peringatan Kritis!" [level=4]
- paragraph: pH tinggi (9.08) dan TDS tinggi (1063 ppm) terdeteksi pada KDC01. Segera ambil tindakan pencegahan.
- button "Tutup Peringatan"
```

# Test source

```ts
  1   | /**
  2   |  * KIDECO Dashboard - Automated E2E Test Suite
  3   |  * Mirip seperti `php artisan test` di Laravel, tapi untuk frontend React.
  4   |  * Jalankan: npx playwright test
  5   |  */
  6   | 
  7   | import { test, expect } from '@playwright/test';
  8   | 
  9   | // ─────────────────────────────────────────────────────────────────────────────
  10  | // HELPER FUNCTIONS
  11  | // ─────────────────────────────────────────────────────────────────────────────
  12  | 
  13  | /**
  14  |  * Paksa status BAHAYA dengan inject localStorage secara langsung.
  15  |  * Threshold pH minimum di-set ke 9.5 agar sensor (6.0-8.0) selalu BAHAYA.
  16  |  * Ini jauh lebih cepat dan stabil daripada navigasi melalui UI Settings.
  17  |  */
  18  | async function forceDangerStatus(page) {
  19  |   await page.evaluate(() => {
  20  |     localStorage.setItem('KIDECO_PH_MIN', '9.5');
  21  |   });
  22  |   await page.reload({ waitUntil: 'networkidle' });
  23  |   await page.waitForTimeout(2000); // Tunggu sensor context re-evaluate
  24  | }
  25  | 
  26  | /**
  27  |  * Reset threshold ke nilai normal via localStorage.
  28  |  */
  29  | async function resetToNormal(page) {
  30  |   await page.evaluate(() => {
  31  |     localStorage.setItem('KIDECO_PH_MIN', '4.5');
  32  |   });
  33  | }
  34  | 
  35  | // ─────────────────────────────────────────────────────────────────────────────
  36  | // TEST GROUP 1: Dasar - Halaman Bisa Dibuka
  37  | // ─────────────────────────────────────────────────────────────────────────────
  38  | test.describe('TC-01: Navigasi Dasar Dashboard', () => {
  39  | 
  40  |   test('Halaman dashboard berhasil dimuat', async ({ page }) => {
  41  |     await page.goto('/');
  42  |     await expect(page).toHaveTitle(/KIDECO/i);
  43  |     await expect(page.locator('#sidebar-nav')).toBeVisible();
  44  |     await expect(page.locator('#header-bar')).toBeVisible();
  45  |   });
  46  | 
  47  |   test('Sidebar menampilkan 4 menu navigasi utama', async ({ page }) => {
  48  |     await page.goto('/');
  49  |     await expect(page.locator('#sidebar-nav')).toContainText('Dashboard');
  50  |     await expect(page.locator('#sidebar-nav')).toContainText('Histori & Laporan');
  51  |     await expect(page.locator('#sidebar-nav')).toContainText('Device');
  52  |     await expect(page.locator('#sidebar-nav')).toContainText('Analisis');
  53  |   });
  54  | 
  55  |   test('Navigasi ke halaman Histori & Laporan berfungsi', async ({ page }) => {
  56  |     await page.goto('/');
  57  |     await page.click('text=Histori & Laporan');
  58  |     await expect(page.locator('#header-bar')).toContainText('Histori & Laporan');
  59  |     await expect(page).not.toHaveURL(/blank/);
  60  |   });
  61  | 
  62  |   test('Navigasi ke halaman Device berfungsi', async ({ page }) => {
  63  |     await page.goto('/');
  64  |     await page.click('text=Device');
  65  |     await expect(page.locator('#header-bar')).toContainText('Device');
  66  |   });
  67  | 
  68  |   test('Navigasi ke halaman Analisis berfungsi', async ({ page }) => {
  69  |     await page.goto('/');
  70  |     await page.click('text=Analisis');
  71  |     await expect(page.locator('#header-bar')).toContainText('Analisis');
  72  |   });
  73  | 
  74  | });
  75  | 
  76  | // ─────────────────────────────────────────────────────────────────────────────
  77  | // TEST GROUP 2: Halaman Analisis - Layout
  78  | // ─────────────────────────────────────────────────────────────────────────────
  79  | test.describe('TC-02: Layout Halaman Analisis', () => {
  80  | 
  81  |   test('Halaman analisis menampilkan semua modul grafik tanpa ruang kosong', async ({ page }) => {
  82  |     await page.goto('/');
  83  |     await page.click('text=Analisis');
  84  | 
  85  |     // Pastikan modul-modul utama analytics terlihat
> 86  |     await expect(page.locator('text=Tren Real-Time').or(page.locator('text=Trend'))).toBeVisible({ timeout: 8000 });
      |                                                                                      ^ Error: expect(locator).toBeVisible() failed
  87  |     await expect(page.locator('text=Forecast').or(page.locator('text=Prediksi'))).toBeVisible({ timeout: 8000 });
  88  |   });
  89  | 
  90  |   test('Konten halaman analisis tidak crash (tidak blank putih)', async ({ page }) => {
  91  |     await page.goto('/');
  92  |     await page.click('text=Analisis');
  93  |     await page.waitForTimeout(1000);
  94  | 
  95  |     // Halaman tidak boleh blank — sidebar harus tetap terlihat
  96  |     await expect(page.locator('#sidebar-nav')).toBeVisible();
  97  |     // Main content area harus ada isinya
  98  |     const mainContent = page.locator('main');
  99  |     await expect(mainContent).not.toBeEmpty();
  100 |   });
  101 | 
  102 | });
  103 | 
  104 | // ─────────────────────────────────────────────────────────────────────────────
  105 | // TEST GROUP 3: Threshold Configuration
  106 | // ─────────────────────────────────────────────────────────────────────────────
  107 | test.describe('TC-03: Konfigurasi Batas Ambang (Threshold)', () => {
  108 | 
  109 |   test('Simpan threshold berhasil tanpa menyebabkan halaman blank putih', async ({ page }) => {
  110 |     await page.goto('/');
  111 | 
  112 |     // Navigasi ke Device > ThresholdGlobalPanel
  113 |     await page.click('text=Device');
  114 |     await page.waitForSelector('text=Panel Threshold Global', { timeout: 8000 });
  115 | 
  116 |     // Ubah nilai pH minimum
  117 |     const phMinInput = page.locator('input[type="number"]').first();
  118 |     await phMinInput.fill('5.0');
  119 | 
  120 |     // Klik tombol simpan
  121 |     await page.click('text=Simpan Threshold');
  122 | 
  123 |     // Tunggu respon
  124 |     await page.waitForTimeout(1500);
  125 | 
  126 |     // Pastikan halaman tidak blank — sidebar tetap ada
  127 |     await expect(page.locator('#sidebar-nav')).toBeVisible();
  128 |     await expect(page.locator('#header-bar')).toBeVisible();
  129 |   });
  130 | 
  131 |   test('Banner sukses "Konfigurasi Disimpan" muncul setelah menyimpan', async ({ page }) => {
  132 |     await page.goto('/');
  133 |     await page.click('text=Device');
  134 |     await page.waitForSelector('text=Panel Threshold Global', { timeout: 8000 });
  135 | 
  136 |     const phMinInput = page.locator('input[type="number"]').first();
  137 |     await phMinInput.fill('5.0');
  138 |     await page.click('text=Simpan Threshold');
  139 | 
  140 |     // Banner sukses harus muncul
  141 |     await expect(page.locator('text=Konfigurasi Disimpan')).toBeVisible({ timeout: 5000 });
  142 |   });
  143 | 
  144 |   test('Threshold via modal Pengaturan berhasil disimpan', async ({ page }) => {
  145 |     await page.goto('/');
  146 | 
  147 |     // Buka modal pengaturan via profil
  148 |     await page.click('text=Alex Johnson');
  149 |     await page.waitForTimeout(300);
  150 |     await page.click('text=Pengaturan');
  151 | 
  152 |     // Pindah ke tab Threshold
  153 |     await page.waitForSelector('text=Threshold', { timeout: 5000 });
  154 |     await page.click('text=Threshold');
  155 |     await page.waitForSelector('text=Batas Minimum pH', { timeout: 5000 });
  156 | 
  157 |     // Ubah nilai
  158 |     const phMinInput = page.locator('input[type="number"]').first();
  159 |     await phMinInput.fill('4.5');
  160 | 
  161 |     await page.click('text=Simpan Threshold');
  162 |     await page.waitForTimeout(1500);
  163 | 
  164 |     // Sidebar tetap terlihat (tidak crash)
  165 |     await expect(page.locator('#sidebar-nav')).toBeVisible();
  166 |   });
  167 | 
  168 | });
  169 | 
  170 | // ─────────────────────────────────────────────────────────────────────────────
  171 | // TEST GROUP 4: Badge Bahaya & Toast Warning
  172 | // ─────────────────────────────────────────────────────────────────────────────
  173 | test.describe('TC-04: Badge Bahaya & Toast Peringatan', () => {
  174 | 
  175 |   test.beforeEach(async ({ page }) => {
  176 |     await page.goto('/');
  177 |     // Paksa status BAHAYA dengan mengeset threshold pH minimum sangat tinggi
  178 |     await forceDangerStatus(page);
  179 |   });
  180 | 
  181 |   test.afterEach(async ({ page }) => {
  182 |     // Reset threshold ke normal setelah test
  183 |     await resetToNormal(page);
  184 |   });
  185 | 
  186 |   test('Badge "Bahaya" muncul di header saat status BAHAYA', async ({ page }) => {
```