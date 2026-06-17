const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_INSTRUCTION = `Anda adalah ahli AMDAL (Analisis Dampak Lingkungan) untuk tambang batu bara KIDECO.

Aturan respons:
- Jawab langsung ke inti, tanpa basa-basi
- Gunakan bahasa Indonesia yang efektif
- Berikan solusi praktis dan actionable
- Format JSON harus valid dan sesuai struktur yang diminta
- Tidak perlu kalimat pembuka seperti "Tentu" atau "Baik"
- Langsung ke data dan analisis`;

const callGemini = async (contents) => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: contents }] }],
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API HTTP error:', response.status, errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      console.error('Gemini API error:', data.error);
      throw new Error(data.error.message || 'API error');
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('Gemini API call failed:', error.message);
    throw error;
  }
};

export const getAIInsight = async (sensorData) => {
  const { ph, tds, nodeId, status, phMin, tdsMax } = sensorData;

  const prompt = `Data sensor: Node ${nodeId}, pH ${ph} (ambang ${phMin}-9.0), TDS ${tds} ppm (maks ${tdsMax}), Status ${status}.

Buat insight 1-2 kalimat tentang kondisi air dan dampaknya ke lingkungan tambang.`;

  try {
    const result = await callGemini(prompt);
    return result || 'Insight tidak tersedia';
  } catch (error) {
    console.error('getAIInsight failed:', error);
    return generateFallbackInsight(sensorData);
  }
};

const generateFallbackInsight = (data) => {
  const { ph, tds, nodeId, status, phMin, tdsMax } = data;
  const issues = [];
  if (ph < phMin) issues.push(`pH ${ph} di bawah ambang aman (${phMin})`);
  if (tds > tdsMax) issues.push(`TDS ${tds} ppm melebihi batas (${tdsMax} ppm)`);
  if (status === 'BAHAYA') {
    return `Kondisi air pada Node ${nodeId} terdeteksi BAHAYA. ${issues.length > 0 ? issues.join(' dan ') + '. ' : ''}Diperlukan tindakan penanganan segera untuk mencegah dampak lebih lanjut terhadap ekosistem tambang.`;
  }
  return `Kondisi air pada Node ${nodeId} dalam status AMAN. pH ${ph} dan TDS ${tds} ppm masih dalam batas toleransi.`;
};

export const getActionPlan = async (sensorData) => {
  const { ph, tds, nodeId, status, phMin, tdsMax, history } = sensorData;

  const historyText = history?.slice(0, 5).map(h =>
    `${h.timestamp}: pH ${h.ph}, TDS ${h.tds}ppm`
  ).join('; ') || 'Tidak ada data';

  const prompt = `Data: Node ${nodeId}, pH ${ph} (ambang ${phMin}-9.0), TDS ${tds}ppm (maks ${tdsMax}), Status ${status}. Histori: ${historyText}.

Balik JSON valid:
{
  "masalah": "Deskripsi masalah",
  "data_detail": [
    {"parameter": "pH", "nilai": "${ph}", "ambang": "${phMin}-9.0", "status": "BAHAYA/AMAN"},
    {"parameter": "TDS", "nilai": "${tds}", "ambang": "maks ${tdsMax}", "status": "BAHAYA/AMAN"}
  ],
  "solusi": [
    {"langkah": 1, "tindakan": "Judul", "detail": "Detail tindakan", "alasan": "Alasan"}
  ],
  "dampak": "Dampak jika tidak ditindaklanjuti"
}

Solusi harus realistis untuk tambang batu bara: tindakan darurat, penanganan teknis, pencegahan jangka panjang, pelaporan. Minimal 3-4 solusi.`;

  try {
    const result = await callGemini(prompt);
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('getActionPlan failed:', error);
    return generateFallbackActionPlan(sensorData);
  }
};

const generateFallbackActionPlan = (data) => {
  const { ph, tds, nodeId, status, phMin, tdsMax } = data;
  return {
    masalah: `Kondisi air pada Node ${nodeId} terdeteksi ${status === 'BAHAYA' ? 'di luar ambang aman' : 'normal'}.`,
    data_detail: [
      { parameter: 'pH', nilai: ph, ambang: `${phMin}-9.0`, status: ph < phMin ? 'BAHAYA' : 'AMAN' },
      { parameter: 'TDS', nilai: tds, ambang: `maks ${tdsMax}`, status: tds > tdsMax ? 'BAHAYA' : 'AMAN' },
    ],
    solusi: [
      { langkah: 1, tindakan: 'Pengecekan Lapangan', detail: 'Lakukan pengecekan langsung ke lokasi Node untuk memverifikasi kondisi air', alasan: 'Memastikan data sensor akurat dan bukan error pembacaan' },
      { langkah: 2, tindakan: 'Kalibrasi Sensor', detail: 'Periksa dan kalibrasi ulang sensor pH dan TDS', alasan: 'Sensor yang tidak akurat dapat memberikan data yang menyesatkan' },
      { langkah: 3, tindakan: 'Pelaporan', detail: 'Laporkan kondisi ke divisi HSE dan instansi terkait', alasan: 'Kepatuhan regulasi AMDAL dan mitigasi risiko lingkungan' },
    ],
    dampak: 'Jika tidak ditindaklanjuti, dapat terjadi pencemaran air yang meluas dan pelanggaran regulasi lingkungan.',
  };
};
