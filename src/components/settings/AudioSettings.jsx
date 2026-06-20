import React, { useContext, useState } from 'react';
import { SensorContext } from '../../context/SensorContext';
import { VolumeMax, VolumeX, CheckCircle } from '@untitledui/icons';

const AudioSettings = () => {
  const {
    audioToggleState,
    setAudioToggleState,
  } = useContext(SensorContext);

  const [notification, setNotification] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setNotification({ type: 'success', message: 'Pengaturan audio berhasil disimpan' });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-[#202020]">Audio & Alarm</h2>
        <p className="text-[13px] text-[#8C9BAF] mt-1">Konfigurasi pengaturan suara alarm dan notifikasi</p>
      </div>

      {notification && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-[10px] border bg-[#F0FDF4] border-[#BBF7D0] text-[#166534] mb-6 transition-all duration-300">
          <CheckCircle size={18} strokeWidth={2} className="text-[#16A34A] shrink-0" />
          <span className="text-[13px] font-semibold">{notification.message}</span>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Alarm Suara */}
        <div className="bg-[#F7F8FA] border border-[#EAECF0] rounded-[12px] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-[40px] h-[40px] rounded-[10px] flex items-center justify-center ${
                audioToggleState ? 'bg-[#16A34A]/20' : 'bg-white border border-[#EAECF0]'
              }`}>
                {audioToggleState ? (
                  <VolumeMax size={20} strokeWidth={2} className="text-[#16A34A]" />
                ) : (
                  <VolumeX size={20} strokeWidth={2} className="text-[#B9C8D7]" />
                )}
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#202020]">Alarm Suara</div>
                <div className="text-[12px] text-[#8C9BAF] mt-0.5">
                  {audioToggleState ? 'Aktif — suara alarm akan berbunyi saat status sistem Bahaya' : 'Nonaktif — alarm dalam mode senyap'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setAudioToggleState(!audioToggleState)}
              className={`
                w-[48px] h-[26px] rounded-[13px] relative shrink-0 transition-colors duration-200 outline-none cursor-pointer
                ${audioToggleState ? 'bg-[#16A34A]' : 'bg-[#E5E7EB]'}
              `}
            >
              <span
                className={`
                  absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200
                  ${audioToggleState ? 'translate-x-[22px]' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[8px] p-4">
          <p className="text-[12px] text-[#1E40AF] leading-relaxed">
            <strong className="font-semibold">Catatan:</strong> Alarm akan berbunyi saat status sistem == BAHAYA.
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
              ? 'bg-[#16A34A]/70 text-white cursor-not-allowed'
              : 'bg-[#16A34A] text-white hover:bg-[#15803D] active:bg-[#14673A]'}
          `}
        >
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </div>
    </div>
  );
};

export default AudioSettings;
