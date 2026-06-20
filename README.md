<div align="center">

<img src="https://img.shields.io/badge/SIMPATI--AAT-v1.2-1D9E75?style=for-the-badge&labelColor=085041" alt="SIMPATI-AAT"/>

# SIMPATI-AAT

### Sistem Monitoring, Prediksi, dan Mitigasi Air Asam Tambang

Sistem dashboard berbasis **IoT + AI** untuk mendeteksi, memprediksi, dan memberikan rencana mitigasi Air Asam Tambang (AAT) secara real-time pada operasional tambang batu bara.

<br/>

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=20232A)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white&labelColor=1a1a2e)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=0f172a)](https://tailwindcss.com)
[![Express.js](https://img.shields.io/badge/Express-4.19-ffffff?style=flat-square&logo=express&logoColor=black&labelColor=eeeeee)](https://expressjs.com)
[![Groq AI](https://img.shields.io/badge/Groq_AI-Llama3-F55036?style=flat-square&logoColor=white&labelColor=1a1a1a)](https://groq.com)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?style=flat-square&logo=playwright&logoColor=white&labelColor=1a1a1a)](https://playwright.dev)

</div>

---

## 📑 Daftar Isi

- [Live Preview Project](#-live-preview-project)
- [Latar Belakang](#-latar-belakang)
- [Fitur Utama](#-fitur-utama)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Tech Stack](#-tech-stack)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [Struktur Direktori](#-struktur-direktori)
- [Diagram Arsitektur](#-diagram-arsitektur)
- [Dokumentasi API](#-dokumentasi-api)
- [Pengujian](#-pengujian)
- [NPM Scripts](#-npm-scripts)
- [Kontribusi](#-kontribusi)
- [Dokumentasi Project](#-dokumentasi-project)

---

## 💻 Live Preview Project

🔗 **Live Demo:** [sawit4-kilo.vercel.app](https://sawit4-kilo.vercel.app/)

<p align="center">
  <img width="250" alt="QR Code" src="https://github.com/user-attachments/assets/5a2a1681-7ada-4ab8-9284-07b9230fd1b8" />
</p>

---

## 🌊 Latar Belakang

**Air Asam Tambang (AAT)** adalah limbah cair dari aktivitas penambangan batu bara. Saat pH air turun di bawah ambang aman atau kadar TDS melampaui batas, dampaknya sangat serius:

| Dampak | Keterangan |
| :--- | :--- |
| 🏭 **Pencemaran lingkungan** | Mencemari sungai dan tanah di sekitar area tambang |
| 🐟 **Kerusakan ekosistem** | Mengancam kehidupan biota air dan rantai ekosistem perairan |
| 🏘️ **Ancaman kesehatan** | Membahayakan masyarakat yang bergantung pada air tanah |

**SIMPATI-AAT** hadir sebagai solusi yang menggabungkan sensor **IoT (ESP32/LoRa)** dengan kecerdasan buatan **Groq AI** untuk:

1. **Deteksi dini** — Monitoring pH dan TDS secara real-time dari multiple titik sensor.
2. **Prediksi** — Analisis tren dan anomali sebelum masalah terjadi.
3. **Mitigasi** — Action plan yang dihasilkan AI untuk penanganan cepat dan tepat.

---

## ✨ Fitur Utama

<details>
<summary><strong>📡 Monitoring Real-Time</strong></summary>

- Dashboard live yang menampilkan data **pH dan TDS** dari setiap node sensor (ESP32/LoRa).
- Grafik telemetry yang terupdate otomatis via **Socket.IO**.
- Status sistem otomatis: **`AMAN`** atau **`BAHAYA`** berdasarkan ambang batas yang dapat dikonfigurasi.

</details>

<details>
<summary><strong>🤖 Analisis & Prediksi Berbasis AI</strong></summary>

- **AI Insight** — Ringkasan kondisi air 1-2 kalimat oleh model Llama 3.1 (cepat).
- **AI Action Plan** — Rencana mitigasi lengkap dalam format JSON oleh model Llama 3.3 (penalaran tinggi).
- Modul analitik: tren, statistik, deteksi anomali, korelasi, dan peramalan (forecast).

</details>

<details>
<summary><strong>🔌 Manajemen Multi-Node</strong></summary>

- Dukungan beberapa node sensor (KDC01, KDC02, dst.) dengan lokasi berbeda.
- Panel device untuk memantau status koneksi setiap node.
- Detail sidebar per node dengan grafik mini dan riwayat data.

</details>

<details>
<summary><strong>🔔 Notifikasi & Alert</strong></summary>

- Banner peringatan visual saat kondisi BAHAYA terdeteksi.
- Alarm audio (buzzer) yang dapat diaktifkan/dinonaktifkan.
- Log notifikasi real-time (danger, offline, success).
- Pengaturan **quiet hours** untuk menonaktifkan notifikasi pada jam tertentu.

</details>

<details>
<summary><strong>⚙️ Konfigurasi & Riwayat Data</strong></summary>

- Pengaturan ambang batas pH (min/max) dan TDS (maks) melalui UI.
- Semua konfigurasi tersimpan di localStorage browser.
- Tabel log data sensor dengan filter (tanggal, status, node) dan pagination.
- Ekspor data ke Excel dan visualisasi: grafik sedimentasi, circadian range, scatter plot.

</details>

---

## 🏗️ Arsitektur Sistem

Arsitektur SIMPATI-AAT menggunakan pola **decoupled** — frontend dan backend terpisah, berkomunikasi via Socket.IO dan REST API.

```mermaid
flowchart LR
  subgraph iot["IoT Network"]
    nodes["ESP32/LoRa Sensor Nodes"]
    extApi["External API Server :3000"]
    nodes -->|Payload| extApi
  end

  subgraph browser["User / Browser"]
    ui["UI Pages<br>(Dashboard, Analytics, History, Config)"]
    context["SensorContext<br>(Socket.IO Client)"]
    ui --- context
  end

  subgraph server["Application Server"]
    proxy["Backend Proxy :3001<br>/api/ai/insight<br>/api/ai/action-plan"]
  end

  subgraph cloud["Cloud Services"]
    groq["Groq Cloud API<br>Llama 3.1 8B (Insight)<br>Llama 3.3 70B (Plan)"]
  end

  extApi -->|Socket.IO + REST| context
  context -->|REST API| proxy
  proxy -->|HTTPS| groq
```

### Komponen Utama

| Komponen | Teknologi | Port | Fungsi |
| :--- | :--- | :---: | :--- |
| **Frontend** | React 18 + Vite | `5173` | UI dashboard, visualisasi data |
| **Backend** | Express.js + Groq SDK | `3001` | Proxy AI, validasi request |
| **External API** | Socket.IO + REST | `3000` | Data sensor dari ESP32/LoRa |
| **AI Engine** | Groq Cloud API | — | Insight & Action Plan |

### Alur Kerja AI Groq

Dua model dipilih berdasarkan kompleksitas tugas:

| Aspek | Insight (Fast) | Action Plan (Reasoning) |
| :--- | :---: | :---: |
| **Model** | `llama-3.1-8b-instant` | `llama-3.3-70b-versatile` |
| **Kecepatan** | ⚡ Sangat cepat | 🧠 Analisis mendalam |
| **Max Token** | 200 | 1500 |
| **Output** | Teks 1-2 kalimat | JSON terstruktur |
| **Use Case** | Ringkasan kondisi real-time | Rencana tindakan mitigasi |
| **Temperature** | 0.2 | 0.2 |

<details>
<summary><strong>Contoh Output AI</strong></summary>

**Insight (Fast):**
> Kondisi air di Node KDC01 menunjukkan pH 3.2 (asam) yang jauh di bawah ambang aman 4.5–9.0. TDS 1200 ppm melampaui batas maksimal 800 ppm, indikasi kontaminasi logam berat yang memerlukan penanganan segera.

**Action Plan (Reasoning):**
```json
{
  "masalah": "pH 3.2 dan TDS 1200 ppm di KDC01 melampaui ambang batas AMDAL",
  "data_detail": [
    { "parameter": "pH",  "nilai": "3.2",  "ambang": "4.5–9.0",  "status": "BAHAYA" },
    { "parameter": "TDS", "nilai": "1200", "ambang": "maks 800", "status": "BAHAYA" }
  ],
  "solusi": [
    { "langkah": 1, "tindakan": "Isolasi area terdampak" },
    { "langkah": 2, "tindakan": "Aplikasi kapur tohor (CaO)" },
    { "langkah": 3, "tindakan": "Pemasangan treatment wetland" },
    { "langkah": 4, "tindakan": "Pelaporan ke DLH" }
  ],
  "dampak": "Tanpa penanganan, kontaminasi dapat menyebar ke sungai sekitar."
}
```

</details>

---

## 🛠️ Tech Stack

<details>
<summary><strong>Frontend</strong></summary>

| Teknologi | Versi | Fungsi |
| :--- | :---: | :--- |
| **React** | 18.2 | UI library utama |
| **Vite** | 5.0 | Build tool & dev server |
| **Tailwind CSS** | 4.3 | Utility-first CSS framework |
| **Recharts** | 2.10 | Visualisasi grafik |
| **MUI (Material UI)** | 9.1 | Komponen UI (charts) |
| **Socket.IO Client** | 4.8 | Koneksi real-time ke server sensor |
| **React Hook Form** | 7.78 | Manajemen form |
| **Zod** | 4.4 | Validasi schema |
| **Lucide React** | 1.17 | Ikon |
| **xlsx** | 0.18 | Ekspor data ke Excel |

</details>

<details>
<summary><strong>Backend</strong></summary>

| Teknologi | Versi | Fungsi |
| :--- | :---: | :--- |
| **Express.js** | 4.19 | HTTP server |
| **Groq SDK** | 0.9 | Client untuk Groq AI API |
| **Socket.IO** | — | Real-time communication |
| **CORS** | 2.8 | Cross-origin resource sharing |
| **dotenv** | 16.4 | Environment variables |

</details>

<details>
<summary><strong>Testing</strong></summary>

| Teknologi | Versi | Fungsi |
| :--- | :---: | :--- |
| **Playwright** | 1.61 | End-to-end testing |

</details>

---

## ✅ Prasyarat

Pastikan sistem Anda memiliki:

- **Node.js** `>= 18.0.0` (direkomendasikan: LTS terbaru)
- **npm** `>= 9.0.0`
- **Groq API Key** — Dapatkan gratis di [console.groq.com](https://console.groq.com)
- **Git** (opsional, untuk cloning)

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone <url-repository>
cd "Project Deteksi Air Asam Tambang (1.2)"
```

### 2. Instal Dependencies

```bash
# Frontend (dari root project)
npm install

# Backend
cd server && npm install && cd ..
```

### 3. Konfigurasi Environment

```bash
# Salin file contoh
copy server\.env.example server\.env
```

Buka `server/.env` dan isi dengan konfigurasi Anda:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3001
```

> 💡 Dapatkan API key Groq secara gratis di [console.groq.com](https://console.groq.com)

### 4. Jalankan Aplikasi

```bash
npm run dev
```

| Service | URL |
| :--- | :--- |
| **Frontend** | `http://localhost:5173` |
| **Backend** | `http://localhost:3001` |

---

## 🔐 Konfigurasi Environment

File environment ditempatkan di `server/.env`:

| Variabel | Wajib | Default | Deskripsi |
| :--- | :---: | :---: | :--- |
| `GROQ_API_KEY` | ✅ | — | API key dari [Groq Cloud](https://console.groq.com) |
| `PORT` | ❌ | `3001` | Port untuk backend proxy server |

> ⚠️ **Penting:** Jangan pernah commit file `.env` ke repository. File ini sudah tercakup dalam `.gitignore`.

---

## 📁 Struktur Direktori

<details>
<summary>Tampilkan struktur lengkap</summary>

```text
Project Deteksi Air Asam Tambang (1.2)/
├── index.html                        # Entry point HTML
├── package.json                      # Dependencies & scripts frontend
├── vite.config.js                    # Konfigurasi Vite
├── tailwind.config.js                # Konfigurasi Tailwind CSS
├── postcss.config.js                 # Konfigurasi PostCSS
├── tsconfig.json                     # Konfigurasi TypeScript
├── playwright.config.js              # Konfigurasi Playwright E2E
│
├── server/                           # Backend Proxy Server
│   ├── index.js                      # Express server + Groq API routes
│   ├── package.json                  # Dependencies backend
│   └── .env                          # Environment variables (tidak di-commit)
│
├── src/                              # Source Code Frontend
│   ├── main.jsx                      # Entry point React
│   ├── App.jsx                       # Root component + routing
│   │
│   ├── components/
│   │   ├── analytics/                # AI Summary, Trend, Stats, Anomaly, Forecast
│   │   ├── config/                   # Device Heartbeat, Threshold Config
│   │   ├── dashboard/                # MetricCard, RealTimeChart, AlertBanner, ActionModal
│   │   ├── device/                   # NodeCard, NodeDetailSidebar
│   │   ├── history/                  # FilterToolbar, LogDataTable, Pagination
│   │   ├── layout/                   # Sidebar, Header, StatusBar, GlobalDangerAlert
│   │   ├── settings/                 # Profile, ESP32, Audio, Threshold, Notification
│   │   └── ui/                       # Badge, Button, Card, FeaturedIcon
│   │
│   ├── context/
│   │   └── SensorContext.jsx         # Global state (sensor, nodes, alerts)
│   │
│   ├── hooks/                        # Custom React Hooks
│   ├── pages/                        # Dashboard, Analytics, History, Device, Config
│   ├── styles/                       # globals.css, theme.css, typography.css
│   └── utils/
│       ├── groq.js                   # Client Groq AI (frontend)
│       └── analytics.js              # Fungsi statistik & analisis
│
├── tests/
│   └── dashboard.spec.js             # E2E Tests (Playwright)
│
└── docs/
    └── design.md                     # Dokumentasi desain
```

</details>

---

## 📊 Diagram Arsitektur

Dokumen ini berisi kumpulan diagram arsitektur untuk project SIMPATI-AAT. Catatan: ERD di bagian akhir adalah model data konseptual yang disarankan jika histori sensor, konfigurasi, notifikasi, dan hasil AI ingin disimpan permanen di database. 

### 1. IoT Network / Sensor Topology Diagram

```mermaid
flowchart LR
  subgraph fieldArea["Area Tambang"]
    pondOne["Kolam Pengendap 1"]
    pondTwo["Kolam Pengendap 2"]

    subgraph nodeOne["Node KDC01"]
      phOne["Sensor pH"]
      tdsOne["Sensor TDS"]
      espOne["ESP32"]
      loraOne["LoRa Transmitter"]
      phOne -->|Data pH| espOne
      tdsOne -->|Data TDS| espOne
      espOne -->|Payload telemetry| loraOne
    end

    subgraph nodeTwo["Node KDC02"]
      phTwo["Sensor pH"]
      tdsTwo["Sensor TDS"]
      espTwo["ESP32"]
      loraTwo["LoRa Transmitter"]
      phTwo -->|Data pH| espTwo
      tdsTwo -->|Data TDS| espTwo
      espTwo -->|Payload telemetry| loraTwo
    end

    pondOne --- phOne
    pondOne --- tdsOne
    pondTwo --- phTwo
    pondTwo --- tdsTwo
  end

  loraOne -->|LoRa packet| gateway["LoRa Gateway"]
  loraTwo -->|LoRa packet| gateway
  gateway -->|HTTP or serial bridge| externalApi["External API Server :3000"]
  externalApi -->|Socket.IO sensor-update| frontend["Dashboard React :5173"]
  externalApi -->|REST sensor-data| frontend
  frontend -->|AI request| aiProxy["Express AI Proxy :3001"]
  aiProxy -->|HTTPS prompt| groq["Groq Cloud API"]
```

### 2. Component Diagram Frontend

```mermaid
flowchart TB
  main["main.jsx"]
  provider["SensorProvider"]
  app["App.jsx"]
  sidebar["Sidebar"]
  header["Header"]
  globalAlert["GlobalDangerAlert"]

  main --> provider
  provider --> app
  app --> sidebar
  app --> globalAlert

  subgraph pages["Halaman Aplikasi"]
    dashboard["DashboardPage"]
    analytics["AnalyticsPage"]
    history["HistoryPage"]
    device["DevicePage"]
    config["ConfigPage"]
    settings["SettingsPage"]
  end

  app --> dashboard
  app --> analytics
  app --> history
  app --> device
  app --> config
  app --> settings
  dashboard --> header

  subgraph sensorContext["SensorContext State"]
    liveState["currentPh, currentTds, systemStatus"]
    nodeState["nodes, selectedNode, getNodeStatus"]
    historyState["chartData, historyData"]
    thresholdState["phThresholdMin, phThresholdMax, tdsThreshold"]
    notificationState["notifications, notificationSettings"]
    audioState["audioToggleState, buzzerActive, showDangerToast"]
  end

  provider --> liveState

  subgraph dashboardComponents["Dashboard Components"]
    metricCard["MetricCard"]
    realtimeChart["RealTimeChart"]
    telemetryChart["TelemetryChartContainer"]
    alertBanner["AlertBanner"]
    actionModal["ActionModal"]
    recentLogs["RecentLogsTable"]
  end

  dashboard --> metricCard

  subgraph analyticsComponents["Analytics Components"]
    stats["StatsModule"]
    trend["TrendModule"]
    anomaly["AnomalyModule"]
    forecast["ForecastModule"]
    compare["CompareModule"]
    aiSummary["AISummary"]
  end

  analytics --> stats

  subgraph integration["Integrasi Browser"]
    socketClient["Socket.IO Client"]
    restClient["REST Fetch Client"]
    localStorageClient["localStorage"]
    audioClient["Web Audio API"]
    groqClient["src/utils/groq.js"]
  end

  liveState --> socketClient
  liveState --> restClient
  liveState --> localStorageClient
  liveState --> audioClient
  metricCard --> groqClient
  stats --> groqClient
```

### 3. Component Diagram Backend

```mermaid
flowchart TB
  browser["Frontend React"]
  expressApp["Express App :3001"]
  cors["CORS Middleware"]
  jsonParser["JSON Body Parser"]
  validator["validateSensorData Middleware"]
  healthRoute["GET /health"]
  insightRoute["POST /api/ai/insight"]
  actionRoute["POST /api/ai/action-plan"]
  callGroq["callGroq Helper"]
  modelSelector["Model Selector"]
  responseHandler["Consistent JSON Response"]
  envConfig["server/.env GROQ_API_KEY"]
  groqSdk["Groq SDK Client"]
  groqApi["Groq Cloud API"]

  browser -->|REST request| expressApp
  expressApp --> cors
  cors --> jsonParser
  jsonParser --> healthRoute
  jsonParser --> validator
  validator --> insightRoute
  validator --> actionRoute

  insightRoute -->|fast insight prompt| callGroq
  actionRoute -->|reasoning JSON prompt| callGroq
  callGroq --> modelSelector
  modelSelector -->|llama-3.1-8b-instant| groqSdk
  modelSelector -->|llama-3.3-70b-versatile| groqSdk
  envConfig --> groqSdk
  groqSdk -->|HTTPS| groqApi
  groqApi --> groqSdk
  groqSdk --> callGroq
  callGroq --> responseHandler
  responseHandler --> browser

  callGroq -->|429, 401, 503, invalid JSON| responseHandler
```

### 4. State Diagram Status Sensor

```mermaid
stateDiagram-v2
  [*] --> Initializing
  Initializing --> Online: Data pertama diterima
  Initializing --> Offline: Tidak ada data atau koneksi gagal

  Online --> Aman: pH dalam ambang dan TDS dalam ambang
  Online --> Bahaya: pH di luar ambang atau TDS melewati ambang

  Aman --> Bahaya: Threshold dilanggar
  Bahaya --> Aman: Nilai kembali normal

  Aman --> Offline: Node tidak mengirim data
  Bahaya --> Offline: Node tidak mengirim data
  Offline --> Online: Data baru diterima

  Offline --> Simulated: API tidak tersedia dan fallback aktif
  Simulated --> Aman: Data simulasi normal
  Simulated --> Bahaya: Data simulasi melanggar threshold

  Aman --> [*]: Dashboard ditutup
  Bahaya --> [*]: Dashboard ditutup
  Offline --> [*]: Dashboard ditutup
```

### 5. Alert Workflow Diagram

```mermaid
flowchart TB
  newData["Data sensor diterima"]
  updateState["Update currentPh, currentTds, nodes, chartData"]
  checkThreshold["Cek threshold pH dan TDS"]
  safeDecision{"Status BAHAYA?"}
  setSafe["Set systemStatus AMAN"]
  setDanger["Set systemStatus BAHAYA"]
  showToast["Tampilkan GlobalDangerAlert"]
  createDangerNotification["Tambah notifikasi DANGER"]
  quietDecision{"Quiet hours aktif?"}
  soundDecision{"Sound enabled dan audio toggle aktif?"}
  playAlarm["Bunyikan alarm"]
  muted["Jangan bunyikan alarm"]
  clearToast["Sembunyikan danger toast"]
  createSuccessNotification["Tambah notifikasi SUCCESS jika pulih"]
  offlineDecision{"Node berubah offline?"}
  offlineNotification["Tambah notifikasi OFFLINE"]

  newData --> updateState
  updateState --> checkThreshold
  checkThreshold --> safeDecision
  safeDecision -->|Ya| setDanger
  safeDecision -->|Tidak| setSafe

  setDanger --> showToast
  setDanger --> createDangerNotification
  setDanger --> quietDecision
  quietDecision -->|Ya| muted
  quietDecision -->|Tidak| soundDecision
  soundDecision -->|Ya| playAlarm
  soundDecision -->|Tidak| muted

  setSafe --> clearToast
  setSafe --> createSuccessNotification

  updateState --> offlineDecision
  offlineDecision -->|Ya| offlineNotification
  offlineDecision -->|Tidak| checkThreshold
```

### 6. Use Case Diagram

```mermaid
flowchart LR
  operator["Operator Tambang"]
  engineer["Environment Engineer"]
  admin["Admin Sistem"]
  sensorNode["ESP32 or LoRa Node"]
  groqService["Groq AI Service"]

  subgraph systemBoundary["SIMPATI-AAT"]
    monitor["Memantau kualitas air real-time"]
    viewDashboard["Melihat dashboard pH dan TDS"]
    viewAnalytics["Melihat analitik dan prediksi"]
    viewHistory["Melihat riwayat data sensor"]
    exportData["Ekspor data ke Excel"]
    manageThreshold["Mengatur ambang pH dan TDS"]
    manageNotifications["Mengatur notifikasi dan quiet hours"]
    receiveAlert["Menerima alert BAHAYA atau OFFLINE"]
    requestInsight["Meminta AI insight"]
    requestActionPlan["Meminta AI action plan"]
    sendTelemetry["Mengirim telemetry sensor"]
    checkDevice["Memantau status node"]
  end

  operator --> viewDashboard
  operator --> receiveAlert
  operator --> requestActionPlan
  engineer --> monitor
  engineer --> viewAnalytics
  engineer --> viewHistory
  engineer --> exportData
  engineer --> requestInsight
  engineer --> requestActionPlan
  admin --> manageThreshold
  admin --> manageNotifications
  admin --> checkDevice
  sensorNode --> sendTelemetry
  groqService --> requestInsight
  groqService --> requestActionPlan

  monitor --> viewDashboard
  viewDashboard --> receiveAlert
  viewAnalytics --> requestInsight
```

### 7. ERD / Data Model Diagram

```mermaid
erDiagram
  USER {
    string id PK
    string name
    string role
    boolean sessionActive
    datetime createdAt
    datetime updatedAt
  }

  SENSOR_NODE {
    string id PK
    string name
    string location
    string hardwareType
    boolean online
    datetime lastUpdate
    datetime createdAt
    datetime updatedAt
  }

  SENSOR_READING {
    string id PK
    string nodeId FK
    float ph
    int tds
    string status
    datetime timestamp
    datetime createdAt
  }

  THRESHOLD_CONFIG {
    string id PK
    string nodeId FK
    float phMin
    float phMax
    int tdsMax
    string scope
    datetime createdAt
    datetime updatedAt
  }

  NOTIFICATION {
    string id PK
    string nodeId FK
    string type
    string message
    boolean unread
    datetime createdAt
  }

  NOTIFICATION_SETTING {
    string id PK
    string userId FK
    boolean soundEnabled
    boolean visualEnabled
    boolean quietHoursEnabled
    string quietStart
    string quietEnd
    string frequency
    datetime updatedAt
  }

  AI_REQUEST {
    string id PK
    string nodeId FK
    string readingId FK
    string requestType
    string model
    string status
    datetime createdAt
  }

  AI_RESULT {
    string id PK
    string aiRequestId FK
    string insightText
    string actionPlanJson
    string errorCode
    datetime createdAt
  }

  USER ||--o{ NOTIFICATION_SETTING : "owns"
  SENSOR_NODE ||--o{ SENSOR_READING : "produces"
  SENSOR_NODE ||--o{ THRESHOLD_CONFIG : "uses"
  SENSOR_NODE ||--o{ NOTIFICATION : "triggers"
  SENSOR_NODE ||--o{ AI_REQUEST : "analyzed_by"
  SENSOR_READING ||--o{ AI_REQUEST : "included_in"
  AI_REQUEST ||--|| AI_RESULT : "returns"
```

### 8. Security / Trust Boundary Diagram

```mermaid
flowchart TB
  subgraph publicZone["Public or User Device Zone"]
    userBrowser["User Browser"]
    reactApp["React App :5173"]
    localStorageArea["Browser localStorage"]
  end

  subgraph sensorZone["Mine Sensor Network Zone"]
    espNodes["ESP32 LoRa Sensor Nodes"]
    gateway["LoRa Gateway"]
    externalApi["External API Server :3000"]
  end

  subgraph appServerZone["Application Server Zone"]
    aiProxy["Express AI Proxy :3001"]
    envFile["server/.env"]
    validation["Request Validation"]
    corsPolicy["Localhost CORS Policy"]
  end

  subgraph thirdPartyZone["Third Party Cloud Zone"]
    groqApi["Groq Cloud API"]
  end

  userBrowser --> reactApp
  reactApp -->|Stores UI preferences and thresholds| localStorageArea
  espNodes -->|Sensor payload| gateway
  gateway -->|Telemetry ingress| externalApi
  externalApi -->|Socket.IO and REST data| reactApp
  reactApp -->|AI request without API key| aiProxy
  aiProxy --> validation
  aiProxy --> corsPolicy
  envFile -->|GROQ_API_KEY only on server| aiProxy
  aiProxy -->|HTTPS request with API key| groqApi
  groqApi -->|AI result| aiProxy
  aiProxy -->|Sanitized JSON response| reactApp
```

### 9. Failure Handling Diagram

```mermaid
flowchart TB
  startFlow["Dashboard aktif"]
  connectSocket["Connect ke Socket.IO :3000"]
  socketDecision{"Socket connected?"}
  receiveSocket["Terima sensor-update"]
  pollLatest["Polling REST /api/sensor-data/latest"]
  latestDecision{"Data latest tersedia?"}
  fetchDummy["Fetch /api/sensor-data/dummy"]
  dummyDecision{"Dummy API tersedia?"}
  localSimulation["Generate simulasi lokal"]
  updateUi["Update UI, chart, node, history"]

  aiRequest["User meminta AI insight atau action plan"]
  proxyDecision{"Backend :3001 aktif?"}
  callGroq["Backend memanggil Groq API"]
  groqDecision{"Groq berhasil?"}
  rateLimit["Tampilkan pesan rate limit dan retryAfter"]
  authFailure["Tampilkan error API key invalid"]
  invalidJson["Tampilkan error AI response invalid"]
  genericAiFallback["Tampilkan fallback AI di frontend"]
  showAiResult["Tampilkan hasil AI"]

  startFlow --> connectSocket
  connectSocket --> socketDecision
  socketDecision -->|Ya| receiveSocket
  socketDecision -->|Tidak| pollLatest
  receiveSocket --> updateUi
  pollLatest --> latestDecision
  latestDecision -->|Ya| updateUi
  latestDecision -->|Tidak| fetchDummy
  fetchDummy --> dummyDecision
  dummyDecision -->|Ya| updateUi
  dummyDecision -->|Tidak| localSimulation
  localSimulation --> updateUi

  aiRequest --> proxyDecision
  proxyDecision -->|Tidak| genericAiFallback
  proxyDecision -->|Ya| callGroq
  callGroq --> groqDecision
  groqDecision -->|Berhasil| showAiResult
  groqDecision -->|429| rateLimit
  groqDecision -->|401| authFailure
  groqDecision -->|Invalid JSON| invalidJson
  groqDecision -->|Error lain| genericAiFallback
```

---

## 📖 Dokumentasi API

Backend berjalan di `http://localhost:3001`.

### `GET /health`

Memeriksa status server.

```json
{
  "status": "OK",
  "service": "KIDECO Groq AI Proxy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "models": {
    "reasoning": "llama-3.3-70b-versatile",
    "fast": "llama-3.1-8b-instant"
  }
}
```

### `POST /api/ai/insight`

Mendapatkan insight singkat kondisi air (model cepat).

<details>
<summary>Request & Response</summary>

**Request Body:**
```json
{
  "sensorData": {
    "ph": 3.2,
    "tds": 1200,
    "nodeId": "KDC01",
    "status": "BAHAYA",
    "phMin": 4.5,
    "tdsMax": 800
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": "Kondisi air di KDC01 menunjukkan pH 3.2 (asam) dengan TDS 1200 ppm..."
}
```

</details>

### `POST /api/ai/action-plan`

Mendapatkan rencana tindakan mitigasi lengkap (model penalaran tinggi).

<details>
<summary>Request & Response</summary>

**Request Body:**
```json
{
  "sensorData": {
    "ph": 3.2,
    "tds": 1200,
    "nodeId": "KDC01",
    "status": "BAHAYA",
    "phMin": 4.5,
    "tdsMax": 800,
    "history": [
      { "timestamp": "2025-01-15 10:00:00", "ph": 3.5, "tds": 1100 }
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "masalah": "...",
    "data_detail": [...],
    "solusi": [...],
    "dampak": "..."
  }
}
```

</details>

### Error Codes

| HTTP Status | Code | Deskripsi |
| :---: | :--- | :--- |
| `400` | `INVALID_PAYLOAD` | Field `sensorData` tidak ditemukan |
| `400` | `MISSING_FIELDS` | `ph`, `tds`, atau `nodeId` tidak lengkap |
| `401` | `AUTH_INVALID` | API key Groq tidak valid |
| `429` | `RATE_LIMIT_EXCEEDED` | Batas kecepatan Groq API tercapai |
| `500` | `INTERNAL_ERROR` | Kesalahan server internal |
| `502` | `INVALID_AI_RESPONSE` | AI mengembalikan format tidak valid |

---

## 🧪 Pengujian

Proyek ini menggunakan **Playwright** untuk end-to-end testing.

```bash
npm test              # Jalankan semua test
npm run test:ui       # Test dengan Playwright UI (visual)
npm run test:headed   # Test dengan browser terlihat
npm run test:report   # Buka laporan test HTML
```

### Cakupan Test

| Test Case | Deskripsi |
| :---: | :--- |
| **TC-01** | Navigasi dasar dashboard — memuat halaman dan elemen utama |
| **TC-02** | Kondisi BAHAYA — banner alert muncul saat threshold terlampaui |
| **TC-03** | Navigasi antar halaman (sidebar) |
| **TC-04** | Interaksi komponen (modal, filter, pagination) |
| **TC-05** | Responsivitas layout |

---

## 📦 NPM Scripts

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Jalankan frontend + backend secara bersamaan |
| `npm run dev:client` | Jalankan hanya frontend (Vite) |
| `npm run dev:server` | Jalankan hanya backend (Express) |
| `npm run build` | Build frontend untuk produksi |
| `npm run preview` | Preview build produksi |
| `npm test` | Jalankan semua E2E test |
| `npm run test:ui` | Jalankan test dengan Playwright UI |
| `npm run test:headed` | Jalankan test dengan browser terlihat |
| `npm run test:report` | Buka laporan test HTML |
| `npm run lint` | Jalankan ESLint |

---

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch baru: `git checkout -b fitur/nama-fitur`
3. Commit perubahan: `git commit -m "feat: tambahkan fitur X"`
4. Push ke branch: `git push origin fitur/nama-fitur`
5. Buat Pull Request

### Commit Convention

Proyek ini mengikuti [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Keterangan |
| :--- | :--- |
| `feat:` | Fitur baru |
| `fix:` | Perbaikan bug |
| `docs:` | Perubahan dokumentasi |
| `style:` | Perubahan formatting (tidak mengubah logika) |
| `refactor:` | Refactoring kode |
| `test:` | Penambahan atau perbaikan test |
| `chore:` | Maintenance tasks |

---

## 📷 Dokumentasi Project


| Halaman Dashboard | Halaman History & Laporan |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/47373fa1-063a-4b6b-b80c-7e04c28cb9e9" alt="Halaman Dashboard" width="500"/> | <img src="https://github.com/user-attachments/assets/35f07f56-61e4-4c69-bc56-f3ab562d8624" alt="Halaman History" width="500"/> |
| **Halaman Device** | **Halaman Analis** |
| <img src="https://github.com/user-attachments/assets/29cdc14f-5169-4f3f-bf2b-c49a1116c934" alt="Halaman Device" width="500"/> | <img src="https://github.com/user-attachments/assets/911f8d1d-c57f-4c36-bd4f-33c7fbe84e0c" alt="Halaman Analis" width="500"/> |
---

## 📄 Lisensi

Proyek ini dikembangkan untuk keperluan lomba/akademik. Silakan hubungi tim pengembang untuk informasi lisensi lebih lanjut.

---

<div align="center">

**SIMPATI-AAT** — Monitoring Air Asam Tambang yang Cerdas dan Terpadu

Dibangun dengan Tim Sawit4Kilo

</div>
