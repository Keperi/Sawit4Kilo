// ============================================================
// KIDECO - Backend Proxy Server untuk Groq AI API
// Express.js | Groq SDK | Deteksi Air Asam Tambang
// ============================================================

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';

// Muat .env dari direktori server/ — berjalan dari mana saja
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

// ──────────────────────────────────────────────────────────
// Validasi API Key saat startup
// ──────────────────────────────────────────────────────────
if (!process.env.GROQ_API_KEY) {
  console.error('[FATAL] GROQ_API_KEY tidak ditemukan di environment!');
  console.error('[FATAL] Salin server/.env.example ke server/.env lalu isi API key Groq kamu.');
  process.exit(1);
}

// ──────────────────────────────────────────────────────────
// Inisialisasi Groq Client
// ──────────────────────────────────────────────────────────
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ──────────────────────────────────────────────────────────
// Pemilihan Model Berdasarkan Kebutuhan
// - llama-3.3-70b-versatile → penalaran tinggi (insight, action plan)
// - llama-3.1-8b-instant    → kecepatan respons murni
// ──────────────────────────────────────────────────────────
const MODELS = {
  reasoning: 'llama-3.3-70b-versatile',
  fast: 'llama-3.1-8b-instant',
};

// ──────────────────────────────────────────────────────────
// System Message — Mengunci perilaku AI
// ──────────────────────────────────────────────────────────
const SYSTEM_MESSAGE = `Anda adalah ahli AMDAL (Analisis Dampak Lingkungan) untuk tambang batu bara KIDECO.

Aturan mutlak:
- Jawab langsung ke inti teknis, TANPA kalimat pembuka seperti "Tentu", "Baik", "Halo", dsb.
- Gunakan bahasa Indonesia yang efektif dan padat.
- Berikan solusi praktis dan actionable untuk operasional tambang.
- Jika diminta format JSON, kembalikan HANYA JSON valid tanpa markdown code block, tanpa penjelasan tambahan.
- Langsung ke data dan analisis.`;

// ──────────────────────────────────────────────────────────
// Helper: Panggil Groq API dengan Error Handling lengkap
// ──────────────────────────────────────────────────────────
/**
 * @param {string} userPrompt - Prompt dari user/sistem
 * @param {'reasoning'|'fast'} modelType - Jenis model yang digunakan
 * @param {number} maxTokens - Batas token output
 * @returns {Promise<string>} Teks respons dari Groq
 */
const callGroq = async (userPrompt, modelType = 'reasoning', maxTokens = 1024) => {
  const model = MODELS[modelType] || MODELS.reasoning;

  try {
    const chatCompletion = await groq.chat.completions.create({
      model,
      temperature: 0.2,
      max_tokens: maxTokens,
      messages: [
        {
          role: 'system',
          content: SYSTEM_MESSAGE,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    return chatCompletion.choices[0]?.message?.content || '';

  } catch (error) {
    // ── Error 429: Rate Limit Exceeded (Groq free tier sangat ketat) ──
    if (error?.status === 429 || error?.error?.type === 'tokens' || error?.message?.includes('rate_limit')) {
      const retryAfter = error?.headers?.['retry-after'] || 60;
      console.warn(`[WARN] Groq Rate Limit tercapai. Coba lagi dalam ${retryAfter} detik.`);
      const rateLimitError = new Error('RATE_LIMIT');
      rateLimitError.retryAfter = retryAfter;
      throw rateLimitError;
    }

    // ── Error autentikasi ──
    if (error?.status === 401) {
      console.error('[ERROR] GROQ_API_KEY tidak valid atau sudah kedaluwarsa.');
      throw new Error('AUTH_INVALID');
    }

    // ── Error model tidak tersedia ──
    if (error?.status === 503 || error?.status === 400) {
      console.error('[ERROR] Model Groq tidak tersedia:', error.message);
      throw new Error('MODEL_UNAVAILABLE');
    }

    // ── Error umum lainnya ──
    console.error('[ERROR] Groq API error:', error.message);
    throw error;
  }
};

// ──────────────────────────────────────────────────────────
// Setup Express App
// ──────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3001;

// Terima semua origin localhost (port berapapun) — Vite bisa pakai 5173, 5174, dst.
const corsOptions = {
  origin: (origin, callback) => {
    // Izinkan request tanpa origin (Postman, curl) dan semua localhost
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} tidak diizinkan oleh CORS`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Eksplisit handle preflight OPTIONS

app.use(express.json());

// ──────────────────────────────────────────────────────────
// Helper: Kirim respons error yang konsisten
// ──────────────────────────────────────────────────────────
const sendError = (res, statusCode, code, message, extra = {}) => {
  res.status(statusCode).json({ success: false, error: { code, message, ...extra } });
};

// ──────────────────────────────────────────────────────────
// Middleware: Validasi body request
// ──────────────────────────────────────────────────────────
const validateSensorData = (req, res, next) => {
  const { sensorData } = req.body;
  if (!sensorData) {
    return sendError(res, 400, 'INVALID_PAYLOAD', 'Field sensorData diperlukan dalam request body.');
  }
  const { ph, tds, nodeId } = sensorData;
  if (ph === undefined || tds === undefined || !nodeId) {
    return sendError(res, 400, 'MISSING_FIELDS', 'sensorData harus mengandung ph, tds, dan nodeId.');
  }
  next();
};

// ──────────────────────────────────────────────────────────
// Route 1: GET /health — Status server
// ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'KIDECO Groq AI Proxy',
    timestamp: new Date().toISOString(),
    models: MODELS,
  });
});

// ──────────────────────────────────────────────────────────
// Route 2: POST /api/ai/insight — AI Insight Sensor (Fast)
// Gunakan model CEPAT karena hanya butuh 1-2 kalimat singkat
// ──────────────────────────────────────────────────────────
app.post('/api/ai/insight', validateSensorData, async (req, res) => {
  const { ph, tds, nodeId, status, phMin = 4.5, tdsMax = 800 } = req.body.sensorData;

  const prompt = `Data sensor: Node ${nodeId}, pH ${ph} (ambang ${phMin}-9.0), TDS ${tds} ppm (maks ${tdsMax}), Status ${status}.

Buat insight 1-2 kalimat tentang kondisi air dan dampaknya ke lingkungan tambang.`;

  try {
    // Insight pendek → pakai model cepat, token terbatas
    const result = await callGroq(prompt, 'fast', 200);
    res.json({ success: true, data: result });
  } catch (error) {
    if (error.message === 'RATE_LIMIT') {
      return sendError(res, 429, 'RATE_LIMIT_EXCEEDED',
        'Batas kecepatan Groq API tercapai. Tunggu sebentar lalu coba lagi.',
        { retryAfter: error.retryAfter }
      );
    }
    if (error.message === 'AUTH_INVALID') {
      return sendError(res, 401, 'AUTH_INVALID', 'API Key Groq tidak valid.');
    }
    sendError(res, 500, 'INTERNAL_ERROR', 'Gagal menghasilkan insight dari AI.');
  }
});

// ──────────────────────────────────────────────────────────
// Route 3: POST /api/ai/action-plan — Rencana Tindakan (Reasoning)
// Gunakan model CERDAS karena butuh analisis mendalam + output JSON
// ──────────────────────────────────────────────────────────
app.post('/api/ai/action-plan', validateSensorData, async (req, res) => {
  const { ph, tds, nodeId, status, phMin = 4.5, tdsMax = 800, history } = req.body.sensorData;

  const historyText = Array.isArray(history) && history.length > 0
    ? history.slice(0, 5).map(h => `${h.timestamp}: pH ${h.ph}, TDS ${h.tds}ppm`).join('; ')
    : 'Tidak ada data historis';

  const prompt = `Data: Node ${nodeId}, pH ${ph} (ambang ${phMin}-9.0), TDS ${tds}ppm (maks ${tdsMax}), Status ${status}. Histori: ${historyText}.

Kembalikan HANYA JSON valid berikut (tanpa markdown, tanpa penjelasan):
{
  "masalah": "Deskripsi masalah utama",
  "data_detail": [
    {"parameter": "pH", "nilai": "${ph}", "ambang": "${phMin}-9.0", "status": "BAHAYA atau AMAN"},
    {"parameter": "TDS", "nilai": "${tds}", "ambang": "maks ${tdsMax}", "status": "BAHAYA atau AMAN"}
  ],
  "solusi": [
    {"langkah": 1, "tindakan": "Judul tindakan", "detail": "Detail teknis", "alasan": "Alasan teknis"}
  ],
  "dampak": "Dampak lingkungan jika tidak ditindaklanjuti"
}

Berikan minimal 3-4 solusi realistis mencakup: tindakan darurat, penanganan teknis, pencegahan jangka panjang, dan pelaporan.`;

  try {
    // Action plan kompleks → pakai model penalaran tinggi
    const result = await callGroq(prompt, 'reasoning', 1500);

    // Parse & validasi JSON dari Groq
    const cleaned = result
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);
    res.json({ success: true, data: parsed });

  } catch (error) {
    if (error.message === 'RATE_LIMIT') {
      return sendError(res, 429, 'RATE_LIMIT_EXCEEDED',
        'Batas kecepatan Groq API tercapai. Tunggu sebentar lalu coba lagi.',
        { retryAfter: error.retryAfter }
      );
    }
    if (error.message === 'AUTH_INVALID') {
      return sendError(res, 401, 'AUTH_INVALID', 'API Key Groq tidak valid.');
    }
    if (error instanceof SyntaxError) {
      return sendError(res, 502, 'INVALID_AI_RESPONSE', 'AI mengembalikan format yang tidak valid.');
    }
    sendError(res, 500, 'INTERNAL_ERROR', 'Gagal menghasilkan rencana tindakan dari AI.');
  }
});

// ──────────────────────────────────────────────────────────
// Start Server
// ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║  KIDECO Groq AI Proxy Server — AKTIF   ║');
  console.log(`║  Berjalan di: http://localhost:${PORT}     ║`);
  console.log(`║  Model Reasoning : ${MODELS.reasoning}  ║`);
  console.log(`║  Model Fast      : ${MODELS.fast}        ║`);
  console.log('╚════════════════════════════════════════╝');
  console.log('');
});
