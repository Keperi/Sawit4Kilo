// ============================================================
// KIDECO - Frontend Groq AI Client
// Memanggil backend proxy server (TIDAK langsung ke Groq API)
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const GROQ_PROXY_BASE_URL = `${API_BASE_URL}/ai`;

// ──────────────────────────────────────────────────────────
// Helper: Request ke backend proxy dengan error handling
// ──────────────────────────────────────────────────────────
/**
 * @param {string} endpoint - Endpoint proxy (/insight atau /action-plan)
 * @param {object} sensorData - Data sensor yang dikirim
 * @returns {Promise<any>} Data dari AI
 */
const callGroqProxy = async (endpoint, sensorData) => {
  const response = await fetch(`${GROQ_PROXY_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sensorData }),
  });

  const json = await response.json();

  // ── Tangani Rate Limit 429 secara khusus ──
  if (response.status === 429) {
    const retryAfter = json.error?.retryAfter || 60;
    throw new RateLimitError(
      `Rate limit Groq API tercapai. Coba lagi dalam ${retryAfter} detik.`,
      retryAfter
    );
  }

  if (!response.ok || !json.success) {
    const code = json.error?.code || 'UNKNOWN_ERROR';
    const message = json.error?.message || 'Terjadi kesalahan pada server AI.';
    throw new AIError(code, message);
  }

  return json.data;
};

// ──────────────────────────────────────────────────────────
// Custom Error Classes
// ──────────────────────────────────────────────────────────
class RateLimitError extends Error {
  constructor(message, retryAfter) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

class AIError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'AIError';
    this.code = code;
  }
}

// ──────────────────────────────────────────────────────────
// Export 1: getAIInsight — Insight singkat 1-2 kalimat
// Cocok untuk ditampilkan real-time di kartu sensor
// ──────────────────────────────────────────────────────────
export const getAIInsight = async (sensorData) => {
  try {
    const result = await callGroqProxy('/insight', sensorData);
    return result || 'Insight tidak tersedia.';
  } catch (error) {
    if (error instanceof RateLimitError) {
      console.warn(`[Groq Rate Limit] ${error.message}`);
      return `⏳ AI sedang sibuk, coba lagi dalam ${error.retryAfter} detik.`;
    }
    console.error('[Groq Insight Error]', error.message);
    return 'Gagal mendapatkan insight dari AI. Pastikan server backend aktif.';
  }
};

// ──────────────────────────────────────────────────────────
// Export 2: getActionPlan — Rencana tindakan lengkap (JSON)
// Menggunakan model reasoning untuk analisis mendalam
// ──────────────────────────────────────────────────────────
export const getActionPlan = async (sensorData) => {
  try {
    const result = await callGroqProxy('/action-plan', sensorData);
    return result;
  } catch (error) {
    const { ph, tds, nodeId, phMin = 4.5, tdsMax = 800 } = sensorData;

    if (error instanceof RateLimitError) {
      console.warn(`[Groq Rate Limit] ${error.message}`);
      return {
        masalah: `⏳ AI sedang sibuk. Coba lagi dalam ${error.retryAfter} detik.`,
        data_detail: [
          { parameter: 'pH', nilai: ph, ambang: `${phMin}-9.0`, status: ph < phMin || ph > 9.0 ? 'BAHAYA' : 'AMAN' },
          { parameter: 'TDS', nilai: tds, ambang: `maks ${tdsMax}`, status: tds > tdsMax ? 'BAHAYA' : 'AMAN' },
        ],
        solusi: [],
        dampak: `Rate limit Groq API tercapai. Tunggu ${error.retryAfter} detik.`,
      };
    }

    console.error('[Groq Action Plan Error]', error.message);
    return {
      masalah: 'Gagal memproses rencana tindakan dari AI.',
      data_detail: [
        { parameter: 'pH', nilai: ph, ambang: `${phMin}-9.0`, status: ph < phMin || ph > 9.0 ? 'BAHAYA' : 'AMAN' },
        { parameter: 'TDS', nilai: tds, ambang: `maks ${tdsMax}`, status: tds > tdsMax ? 'BAHAYA' : 'AMAN' },
      ],
      solusi: [],
      dampak: 'Terjadi kesalahan sistem. Pastikan server backend berjalan di port 3001.',
    };
  }
};
