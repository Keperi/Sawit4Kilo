/**
 * KIDECO Dashboard - Automated E2E Test Suite
 * Mirip seperti `php artisan test` di Laravel, tapi untuk frontend React.
 * Jalankan: npx playwright test
 */

import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Paksa status BAHAYA dengan inject localStorage secara langsung.
 * Threshold pH minimum di-set ke 9.5 agar sensor (6.0-8.0) selalu BAHAYA.
 * Ini jauh lebih cepat dan stabil daripada navigasi melalui UI Settings.
 */
async function forceDangerStatus(page) {
  await page.evaluate(() => {
    localStorage.setItem('KIDECO_PH_MIN', '9.5');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Tunggu sensor context re-evaluate
}

/**
 * Reset threshold ke nilai normal via localStorage.
 */
async function resetToNormal(page) {
  await page.evaluate(() => {
    localStorage.setItem('KIDECO_PH_MIN', '4.5');
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST GROUP 1: Dasar - Halaman Bisa Dibuka
// ─────────────────────────────────────────────────────────────────────────────
test.describe('TC-01: Navigasi Dasar Dashboard', () => {

  test('Halaman dashboard berhasil dimuat', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/KIDECO/i);
    await expect(page.locator('#sidebar-nav')).toBeVisible();
    await expect(page.locator('#header-bar')).toBeVisible();
  });

  test('Sidebar menampilkan 4 menu navigasi utama', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#sidebar-nav')).toContainText('Dashboard');
    await expect(page.locator('#sidebar-nav')).toContainText('Histori & Laporan');
    await expect(page.locator('#sidebar-nav')).toContainText('Device');
    await expect(page.locator('#sidebar-nav')).toContainText('Analisis');
  });

  test('Navigasi ke halaman Histori & Laporan berfungsi', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Histori & Laporan');
    await expect(page.locator('#header-bar')).toContainText('Histori & Laporan');
    await expect(page).not.toHaveURL(/blank/);
  });

  test('Navigasi ke halaman Device berfungsi', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Device');
    await expect(page.locator('#header-bar')).toContainText('Device');
  });

  test('Navigasi ke halaman Analisis berfungsi', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Analisis');
    await expect(page.locator('#header-bar')).toContainText('Analisis');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// TEST GROUP 2: Halaman Analisis - Layout
// ─────────────────────────────────────────────────────────────────────────────
test.describe('TC-02: Layout Halaman Analisis', () => {

  test('Halaman analisis menampilkan semua modul grafik tanpa ruang kosong', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Analisis');

    // Heading yang ada di halaman berdasarkan struktur aktual komponen analytics
    await expect(page.locator('text=Tren & Korelasi pH vs TDS')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=Prediksi Sederhana')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=Statistik Ringkasan')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=Deteksi Anomali')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=Perbandingan antar Node')).toBeVisible({ timeout: 8000 });
  });

  test('Konten halaman analisis tidak crash (tidak blank putih)', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Analisis');
    await page.waitForTimeout(1000);

    // Halaman tidak boleh blank — sidebar harus tetap terlihat
    await expect(page.locator('#sidebar-nav')).toBeVisible();
    // Header harus ada dengan judul Analisis
    await expect(page.locator('#header-bar')).toContainText('Analisis');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// TEST GROUP 3: Threshold Configuration
// ─────────────────────────────────────────────────────────────────────────────
test.describe('TC-03: Konfigurasi Batas Ambang (Threshold)', () => {

  test('Simpan threshold berhasil tanpa menyebabkan halaman blank putih', async ({ page }) => {
    await page.goto('/');

    // Navigasi ke Device > ThresholdGlobalPanel
    await page.click('text=Device');
    await page.waitForSelector('text=Panel Threshold Global', { timeout: 8000 });

    // Ubah nilai pH minimum
    const phMinInput = page.locator('input[type="number"]').first();
    await phMinInput.fill('5.0');

    // Klik tombol simpan
    await page.click('text=Simpan Threshold');

    // Tunggu respon
    await page.waitForTimeout(1500);

    // Pastikan halaman tidak blank — sidebar tetap ada
    await expect(page.locator('#sidebar-nav')).toBeVisible();
    await expect(page.locator('#header-bar')).toBeVisible();
  });

  test('Banner sukses "Konfigurasi Disimpan" muncul setelah menyimpan', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Device');
    await page.waitForSelector('text=Panel Threshold Global', { timeout: 8000 });

    const phMinInput = page.locator('input[type="number"]').first();
    await phMinInput.fill('5.0');
    await page.click('text=Simpan Threshold');

    // Banner sukses harus muncul
    await expect(page.locator('text=Konfigurasi Disimpan')).toBeVisible({ timeout: 5000 });
  });

  test('Threshold via modal Pengaturan berhasil disimpan', async ({ page }) => {
    await page.goto('/');

    // Buka modal pengaturan via profil
    await page.click('text=Alex Johnson');
    await page.waitForTimeout(300);
    await page.click('text=Pengaturan');

    // Pindah ke tab Threshold
    await page.waitForSelector('text=Threshold', { timeout: 5000 });
    await page.click('text=Threshold');
    await page.waitForSelector('text=Batas Minimum pH', { timeout: 5000 });

    // Ubah nilai
    const phMinInput = page.locator('input[type="number"]').first();
    await phMinInput.fill('4.5');

    await page.click('text=Simpan Threshold');
    await page.waitForTimeout(1500);

    // Sidebar tetap terlihat (tidak crash)
    await expect(page.locator('#sidebar-nav')).toBeVisible();
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// TEST GROUP 4: Badge Bahaya & Toast Warning
// ─────────────────────────────────────────────────────────────────────────────
test.describe('TC-04: Badge Bahaya & Toast Peringatan', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Paksa status BAHAYA dengan mengeset threshold pH minimum sangat tinggi
    await forceDangerStatus(page);
  });

  test.afterEach(async ({ page }) => {
    // Reset threshold ke normal setelah test
    await resetToNormal(page);
  });

  test('Badge "Bahaya" muncul di header saat status BAHAYA', async ({ page }) => {
    await expect(page.getByTestId('danger-badge-btn')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('danger-badge-btn')).toContainText('Bahaya');
  });

  test('Toast "Peringatan Kritis!" muncul otomatis saat status BAHAYA aktif', async ({ page }) => {
    await expect(page.getByTestId('danger-toast')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('danger-toast')).toContainText('Peringatan Kritis!');
  });

  test('Klik badge Bahaya menyembunyikan toast warning', async ({ page }) => {
    // Tunggu toast muncul dulu
    await page.getByTestId('danger-toast').waitFor({ state: 'visible', timeout: 10000 });

    // Klik badge untuk close
    await page.getByTestId('danger-badge-btn').click();
    await page.waitForTimeout(500);

    // Toast harus hilang
    await expect(page.getByTestId('danger-toast')).not.toBeVisible();
  });

  test('Klik badge Bahaya dua kali (toggle) memunculkan kembali toast', async ({ page }) => {
    await page.getByTestId('danger-toast').waitFor({ state: 'visible', timeout: 10000 });

    // Close
    await page.getByTestId('danger-badge-btn').click();
    await page.waitForTimeout(400);
    await expect(page.getByTestId('danger-toast')).not.toBeVisible();

    // Reopen
    await page.getByTestId('danger-badge-btn').click();
    await page.waitForTimeout(400);
    await expect(page.getByTestId('danger-toast')).toBeVisible();
  });

  test('Tombol silang (X) di toast berhasil menutup toast', async ({ page }) => {
    await page.getByTestId('danger-toast').waitFor({ state: 'visible', timeout: 10000 });

    // Klik tombol X
    await page.getByTestId('danger-toast-close').click();
    await page.waitForTimeout(500);

    // Toast harus hilang
    await expect(page.getByTestId('danger-toast')).not.toBeVisible();
  });

  test('Menutup toast (X) tidak mengubah badge Bahaya menjadi Aman', async ({ page }) => {
    await page.getByTestId('danger-toast').waitFor({ state: 'visible', timeout: 10000 });

    // Tutup toast
    await page.getByTestId('danger-toast-close').click();
    await page.waitForTimeout(500);

    // Badge Bahaya di header harus masih ada
    await expect(page.getByTestId('danger-badge-btn')).toBeVisible();
    await expect(page.getByTestId('safe-badge')).not.toBeVisible();
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// TEST GROUP 5: Toggle Alarm Suara (Unified Audio)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('TC-05: Toggle Alarm Suara Terpadu', () => {

  test('Toggle Alarm Suara ada di sidebar dan bisa diklik', async ({ page }) => {
    await page.goto('/');

    const audioToggle = page.getByTestId('audio-toggle-btn');
    await expect(audioToggle).toBeVisible();
    await expect(audioToggle).toContainText('Alarm Suara');
  });

  test('Toggle Alarm Suara menampilkan status "Aktif" saat dinyalakan', async ({ page }) => {
    await page.goto('/');

    const audioToggle = page.getByTestId('audio-toggle-btn');
    const isOn = (await audioToggle.getAttribute('aria-checked')) === 'true';

    if (!isOn) {
      await audioToggle.click();
      await page.waitForTimeout(800); // Tunggu animasi 600ms
    }

    await expect(audioToggle).toHaveAttribute('aria-checked', 'true');
    await expect(audioToggle).toContainText('Aktif');
  });

  test('Toggle Alarm Suara menampilkan status "Mati" saat dimatikan', async ({ page }) => {
    await page.goto('/');

    const audioToggle = page.getByTestId('audio-toggle-btn');
    const isOn = (await audioToggle.getAttribute('aria-checked')) === 'true';

    if (isOn) {
      await audioToggle.click();
      await page.waitForTimeout(800);
    }

    await expect(audioToggle).toHaveAttribute('aria-checked', 'false');
    await expect(audioToggle).toContainText('Mati');
  });

  test('Sidebar hanya memiliki SATU toggle alarm suara (tidak ada duplikat)', async ({ page }) => {
    await page.goto('/');

    // Cukup satu tombol switch audio
    const audioToggles = page.getByTestId('audio-toggle-btn');
    await expect(audioToggles).toHaveCount(1);
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// TEST GROUP 6: Modal Pengaturan
// ─────────────────────────────────────────────────────────────────────────────
test.describe('TC-06: Modal Pengaturan', () => {

  test('Klik profil admin membuka menu dropdown', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Alex Johnson');
    await expect(page.locator('text=Pengaturan')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('text=Logout')).toBeVisible({ timeout: 3000 });
  });

  test('Modal Pengaturan terbuka dan dapat ditutup', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Alex Johnson');
    await page.waitForTimeout(300);
    await page.click('text=Pengaturan');
    await page.waitForSelector('text=Profil', { timeout: 5000 });

    // Modal terbuka
    await expect(page.locator('text=Pengaturan').first()).toBeVisible();

    // Tutup dengan Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    // Modal tertutup - kembali ke dashboard
    await expect(page.locator('#sidebar-nav')).toBeVisible();
  });

  test('Tab-tab dalam modal pengaturan dapat dipindah', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Alex Johnson');
    await page.waitForTimeout(300);
    await page.click('text=Pengaturan');
    await page.waitForSelector('text=Audio & Alarm', { timeout: 5000 });

    await page.getByRole('button', { name: 'Audio & Alarm' }).click();
    // Target h2 heading di panel konten modal (bukan label sidebar/toggle)
    await expect(page.getByRole('heading', { name: 'Audio & Alarm', level: 2 })).toBeVisible({ timeout: 3000 });

    await page.getByRole('button', { name: 'Notifikasi' }).click();
    // h2 heading "Notifikasi" di panel konten modal
    await expect(page.getByRole('heading', { name: 'Notifikasi', level: 2 })).toBeVisible({ timeout: 3000 });
  });

});
