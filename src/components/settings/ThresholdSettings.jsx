import React, { useContext, useState, useEffect } from 'react';
import { SensorContext } from '../../context/SensorContext';
import { CheckCircle, AlertTriangle } from '@untitledui/icons';

const ThresholdSettings = () => {
  const {
    phThresholdMin,
    phThresholdMax,
    tdsThreshold,
    updateThresholds,
  } = useContext(SensorContext);

  const [phMin, setPhMin] = useState(phThresholdMin);
  const [phMax, setPhMax] = useState(phThresholdMax);
  const [tdsMax, setTdsMax] = useState(tdsThreshold);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setPhMin(phThresholdMin);
    setPhMax(phThresholdMax);
    setTdsMax(tdsThreshold);
  }, [phThresholdMin, phThresholdMax, tdsThreshold]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const validate = () => {
    const newErrors = {};
    if (phMin < 0 || phMin > 14) newErrors.phMin = 'pH harus 0-14';
    if (phMax < 0 || phMax > 14) newErrors.phMax = 'pH harus 0-14';
    if (phMin >= phMax) newErrors.phMin = 'Harus lebih kecil dari maksimum';
    if (tdsMax < 10) newErrors.tdsMax = 'Minimal 10 ppm';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateThresholds({ phMin, phMax, tdsMax });
    setSaving(false);
    setNotification({ type: 'success', message: 'Threshold berhasil disimpan' });
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-[#202020]">Threshold Alert</h2>
        <p className="text-[13px] text-[#8C9BAF] mt-1">Atur batas ambang parameter untuk seluruh sistem</p>
      </div>

      {notification && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-[10px] border bg-[#F0FDF4] border-[#BBF7D0] text-[#166534] mb-6 transition-all duration-300">
          <CheckCircle size={18} strokeWidth={2} className="text-[#16A34A] shrink-0" />
          <span className="text-[13px] font-semibold">{notification.message}</span>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold text-[#202020] mb-1.5">Batas Minimum pH</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="14"
              value={phMin}
              onChange={(e) => setPhMin(parseFloat(e.target.value) || 0)}
              className={`w-full h-[42px] px-3 rounded-[8px] border bg-white text-[14px] font-mono text-[#202020] outline-none transition-colors ${
                errors.phMin ? 'border-[#FF4628]' : 'border-[#EAECF0] focus:border-[#FF4628]'
              }`}
            />
            {errors.phMin && <p className="text-[11px] text-[#FF4628] mt-1">{errors.phMin}</p>}
            <p className="text-[11px] text-[#B9C8D7] mt-1">Alarm jika pH di bawah angka ini</p>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#202020] mb-1.5">Batas Maksimum pH</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="14"
              value={phMax}
              onChange={(e) => setPhMax(parseFloat(e.target.value) || 0)}
              className={`w-full h-[42px] px-3 rounded-[8px] border bg-white text-[14px] font-mono text-[#202020] outline-none transition-colors ${
                errors.phMax ? 'border-[#FF4628]' : 'border-[#EAECF0] focus:border-[#FF4628]'
              }`}
            />
            {errors.phMax && <p className="text-[11px] text-[#FF4628] mt-1">{errors.phMax}</p>}
            <p className="text-[11px] text-[#B9C8D7] mt-1">Alarm jika pH di atas angka ini</p>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-[#202020] mb-1.5">Batas Maksimum TDS (ppm)</label>
          <input
            type="number"
            step="1"
            min="10"
            max="5000"
            value={tdsMax}
            onChange={(e) => setTdsMax(parseInt(e.target.value) || 0)}
            className={`w-full h-[42px] px-3 rounded-[8px] border bg-white text-[14px] font-mono text-[#202020] outline-none transition-colors ${
              errors.tdsMax ? 'border-[#FF4628]' : 'border-[#EAECF0] focus:border-[#FF4628]'
            }`}
          />
          {errors.tdsMax && <p className="text-[11px] text-[#FF4628] mt-1">{errors.tdsMax}</p>}
          <p className="text-[11px] text-[#B9C8D7] mt-1">Alarm jika TDS di atas angka ini</p>
        </div>

        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-[8px] p-4 flex items-start gap-3">
          <AlertTriangle size={18} strokeWidth={2} className="text-[#F59E0B] shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#92400E] leading-relaxed">
            <strong className="font-semibold">Catatan:</strong> Status BAHAYA terpicu jika pH &lt; {phMin} ATAU pH &gt; {phMax} ATAU TDS &gt; {tdsMax} ppm
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#EAECF0]">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`
            w-full h-[44px] rounded-[10px] text-[14px] font-bold transition-all duration-200 cursor-pointer
            ${saving
              ? 'bg-[#16A34A]/70 text-white cursor-not-allowed'
              : 'bg-[#16A34A] text-white hover:bg-[#15803D] active:bg-[#14673A]'}
          `}
        >
          {saving ? 'Menyimpan...' : 'Simpan Threshold'}
        </button>
      </div>
    </div>
  );
};

export default ThresholdSettings;
