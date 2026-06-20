const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware supaya Express bisa membaca data JSON dari frontend
app.use(express.json());

// 1. KONEKSI KE MONGODB LOKAL
// 'belajar_mern' adalah nama database yang otomatis dibuat nanti
mongoose
  .connect("mongodb://localhost:27017/belajar_mern")
  .then(() => console.log("Mantap! MongoDB Berhasil Terhubung."))
  .catch((err) => console.error("Aduh! Gagal koneksi MongoDB:", err));

// 2. TEMPAT CODING API BACKEND KAMU
// Contoh API sederhana untuk tes
app.get("/api/halo", (req, res) => {
  res.json({
    status: "Sukses",
    pesan: "Halo Mas! Ini data dari Express Backend.",
  });
});

// 3. SETTINGAN BIAR REACT GABUNG KE EXPRESS
// Express akan membaca folder 'client/dist' (hasil jadi dari React)
app.use(express.static(path.join(__dirname, "client", "dist")));

// Jika user mengakses halaman web biasa, arahkan ke React
// Menggunakan parameter bernama 'any' dengan tanda bintang di belakangnya
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Jalankan Server Express
app.listen(PORT, () => {
  console.log(`Server Express jalan di: http://localhost:${PORT}`);
});
