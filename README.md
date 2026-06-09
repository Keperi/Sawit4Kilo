# !!! JANGAN LUPA

Install node js sama mongo db




# Langkah 1: Setup Awal Proyek (Inisialisasi)

Buka terminal pada folder utama proyek Anda, lalu jalankan perintah berikut secara berurutan:

## 1. Membuat file konfigurasi package.json otomatis
npm init -y

## 2. Menginstal framework Express dan library Mongoose untuk database MongoDB
npm install express mongoose

## 3. Membuat folder frontend berbasis React menggunakan Vite dengan nama folder 'client'
npm create vite@latest client -- --template react

# Langkah 2: Menginstal Dependensi Frontend

Masuk ke dalam folder frontend yang baru saja dibuat untuk menginstal modul bawaan React:

## 1. Berpindah masuk ke dalam folder 'client'
cd client

## 2. Menginstal semua library/package bawaan React + Vite
npm install

# Langkah 3: Uji Coba Server Lokal (Development)

Untuk memastikan backend Express Mas sudah berjalan sebelum digabungkan, kembali ke folder utama:

## 1. Keluar dari folder client balik ke folder utama
cd ..

## 2. Menjalankan server backend Express
node server.js

# Langkah 4: Kompilasi Frontend & Penggabungan (Production)

Agar React dan Express bisa menyatu dalam satu server, kita harus melakukan proses build pada React terlebih dahulu:

## 1. Masuk kembali ke folder client
cd client

## 2. Melakukan kompilasi/build React menjadi file statis (akan menghasilkan folder 'dist')
npm run build

## 3. Tunggu sampai proses build selesai, lalu kembali ke folder utama
cd ..

## 4. Jalankan kembali server Express Anda
node server.js
