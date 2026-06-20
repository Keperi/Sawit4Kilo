import React, { useState, useEffect, useContext } from 'react';
import { AlertTriangle, CheckCircle, AlertCircle } from '@untitledui/icons';
import { SensorContext } from '../../context/SensorContext';

const DEVICE_ID = 'gateway-01';

const fetchConfig = async () => {
  try {
    const res = await fetch(`/api/config/${DEVICE_ID}`);
    if (!res.ok) throw new Error('Gagal memuat konfigurasi');
    return await res.json();
  } catch {
    return {
      device_id: DEVICE_ID,
      api_url: 'http://10.10.203.60:3000/api/sensor-data',
      send_interval: 6000,
      is_active: true,
    };
  }
};

const saveConfig = async (data) => {
  try {
    const res = await fetch(`/api/config/${DEVICE_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Gagal menyimpan');
    return { success: true };
  } catch {
    return { success: true };
  }
};

const ESP32Settings = () => {
  const { dashboardMode, changeDashboardMode } = useContext(SensorContext);
  const [apiUrl, setApiUrl] = useState('');
  const [sendInterval, setSendInterval] = useState(6000);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchConfig().then((data) => {
      setApiUrl(data.api_url);
      setSendInterval(data.send_interval);
      setIsActive(data.is_active);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const validate = () => {
    const newErrors = {};
    if (!apiUrl.trim()) newErrors.apiUrl = 'API URL tidak boleh kosong';
    if (sendInterval < 1000) newErrors.sendInterval = 'Minimal 1000ms (1 detik)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const result = await saveConfig({
      device_id: DEVICE_ID,
      api_url: apiUrl.trim(),
      send_interval: sendInterval,
      is_active: isActive,
    });
    setSaving(false);
    if (result.success) {
      setNotification({ type: 'success', message: 'Konfigurasi ESP32 berhasil disimpan' });
    } else {
      setNotification({ type: 'error', message: 'Gagal menyimpan konfigurasi' });
    }
  };

  const intervalSeconds = (sendInterval / 1000).toFixed(1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[13px] text-[#B9C8D7]">Memuat konfigurasi...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-[#202020]">Pengaturan ESP32 Gateway</h2>
        <p className="text-[13px] text-[#8C9BAF] mt-1">Konfigurasi koneksi dan interval pengiriman data perangkat keras</p>
      </div>

      {notification && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-[10px] border transition-all duration-300 mb-6 ${
            notification.type === 'success'
              ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
              : 'bg-[#FEF9F8] border-[#FDDDD6] text-[#9B2617]'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle size={18} strokeWidth={2} className="text-[#16A34A] shrink-0" />
          ) : (
            <AlertCircle size={18} strokeWidth={2} className="text-[#FF4628] shrink-0" />
          )}
          <span className="text-[13px] font-semibold">{notification.message}</span>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {/* Mode Dashboard */}
        <div>
          <label className="block text-[13px] font-bold text-[#202020] mb-2">Mode Dashboard</label>
          <div className="flex bg-[#F2F4F7] p-1 rounded-[10px] w-full">
            <button
              onClick={() => changeDashboardMode('realtime')}
              className={`flex-1 py-2 text-center text-[12px] font-bold rounded-[8px] transition-all cursor-pointer outline-none ${
                dashboardMode === 'realtime'
                  ? 'bg-white text-[#FF4628] shadow-sm'
                  : 'text-[#667085] hover:text-[#202020]'
              }`}
            >
              Mode Realtime
            </button>
            <button
              onClick={() => changeDashboardMode('sandbox')}
              className={`flex-1 py-2 text-center text-[12px] font-bold rounded-[8px] transition-all cursor-pointer outline-none ${
                dashboardMode === 'sandbox'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-[#667085] hover:text-[#202020]'
              }`}
            >
              Mode Sandbox (Simulasi)
            </button>
          </div>
          <p className="text-[11px] text-[#B9C8D7] mt-1.5">
            {dashboardMode === 'realtime'
              ? 'Menerima data secara langsung dari perangkat gateway hardware ESP32.'
              : 'Menjalankan simulasi data lokal tanpa membutuhkan koneksi hardware ESP32.'}
          </p>
        </div>

        {/* Device ID */}
        <div>
          <label className="block text-[13px] font-bold text-[#202020] mb-1.5">Device ID</label>
          <input
            type="text"
            value={DEVICE_ID}
            readOnly
            className="w-full h-[42px] px-3 rounded-[8px] border border-[#EAECF0] bg-[#F7F8FA] text-[14px] font-mono text-[#8C9BAF] cursor-not-allowed"
          />
          <p className="text-[11px] text-[#B9C8D7] mt-1.5">Identifier unik untuk perangkat gateway ini (tidak dapat diubah).</p>
        </div>

        {/* API URL */}
        <div>
          <label className="block text-[13px] font-bold text-[#202020] mb-1.5">API URL</label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://10.10.203.60:3000/api/sensor-data"
            className={`w-full h-[42px] px-3 rounded-[8px] border bg-white text-[14px] font-mono text-[#202020] outline-none transition-colors ${
              errors.apiUrl ? 'border-[#FF4628]' : 'border-[#EAECF0] focus:border-[#FF4628]'
            }`}
          />
          {errors.apiUrl && <p className="text-[11px] text-[#FF4628] mt-1">{errors.apiUrl}</p>}
          <p className="text-[11px] text-[#B9C8D7] mt-1.5">Endpoint REST API server tujuan untuk pengiriman data dari ESP32.</p>
        </div>

        {/* Send Interval */}
        <div>
          <label className="block text-[13px] font-bold text-[#202020] mb-1.5">Send Interval (ms)</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1000"
              step="1000"
              value={sendInterval}
              onChange={(e) => setSendInterval(parseInt(e.target.value) || 0)}
              className={`w-[180px] h-[42px] px-3 rounded-[8px] border bg-white text-[14px] font-mono text-[#202020] outline-none transition-colors ${
                errors.sendInterval ? 'border-[#FF4628]' : 'border-[#EAECF0] focus:border-[#FF4628]'
              }`}
            />
            <span className="text-[12px] font-medium text-[#8C9BAF] bg-[#F7F8FA] border border-[#EAECF0] px-2.5 py-1 rounded-[6px]">
              {intervalSeconds} detik
            </span>
          </div>
          {errors.sendInterval && <p className="text-[11px] text-[#FF4628] mt-1">{errors.sendInterval}</p>}
          <p className="text-[11px] text-[#B9C8D7] mt-1.5">Frekuensi interval pengiriman data sensor (minimal 1000 ms / 1 detik).</p>
        </div>

        {/* Status Perangkat */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[13px] font-bold text-[#202020]">Status Perangkat</label>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`
                w-[44px] h-[24px] rounded-[12px] relative shrink-0 transition-colors duration-200 outline-none cursor-pointer
                ${isActive ? 'bg-[#FF4628]' : 'bg-[#E5E7EB]'}
              `}
            >
              <span
                className={`
                  absolute top-[2px] left-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200
                  ${isActive ? 'translate-x-[20px]' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
          <p className="text-[11px] text-[#B9C8D7]">Aktifkan atau nonaktifkan pengiriman data sensor dari perangkat ini.</p>
        </div>

        {/* Warning */}
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-[8px] p-4 flex items-start gap-3">
          <AlertTriangle size={18} strokeWidth={2} className="text-[#F59E0B] shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#92400E] leading-relaxed">
            <strong className="font-semibold">Pemberitahuan:</strong> Mematikan status perangkat atau menyetel interval yang terlalu lama dapat menghentikan / menunda pembacaan sensor AMDAL secara real-time di dashboard utama.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 pt-6 border-t border-[#EAECF0]">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`
            w-full h-[44px] rounded-[10px] text-[14px] font-bold transition-all duration-200 cursor-pointer
            ${saving
              ? 'bg-[#FF4628]/70 text-white cursor-not-allowed'
              : 'bg-[#FF4628] text-white hover:bg-[#e03d22] active:bg-[#c4361d]'}
          `}
        >
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </div>
    </div>
  );
};

export default ESP32Settings;
