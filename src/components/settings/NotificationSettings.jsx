import React, { useState, useEffect, useContext } from 'react';
import { SensorContext } from '../../context/SensorContext';
import { CheckCircle, Bell01, BellOff01 } from '@untitledui/icons';

const NotificationSettings = () => {
  const { notificationSettings, updateNotificationSettings } = useContext(SensorContext);
  const [settings, setSettings] = useState(notificationSettings);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setSettings(notificationSettings);
  }, [notificationSettings]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateNotificationSettings(settings);
    setSaving(false);
    setNotification({ type: 'success', message: 'Pengaturan notifikasi disimpan' });
  };

  const ToggleSwitch = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`
        w-[44px] h-[24px] rounded-[12px] relative shrink-0 transition-colors duration-200 outline-none cursor-pointer
        ${value ? 'bg-[#16A34A]' : 'bg-[#E5E7EB]'}
      `}
    >
      <span
        className={`
          absolute top-[2px] left-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200
          ${value ? 'translate-x-[20px]' : 'translate-x-0'}
        `}
      />
    </button>
  );

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-[#202020]">Notifikasi</h2>
        <p className="text-[13px] text-[#8C9BAF] mt-1">Atur jenis dan waktu notifikasi</p>
      </div>

      {notification && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-[10px] border bg-[#F0FDF4] border-[#BBF7D0] text-[#166534] mb-6 transition-all duration-300">
          <CheckCircle size={18} strokeWidth={2} className="text-[#16A34A] shrink-0" />
          <span className="text-[13px] font-semibold">{notification.message}</span>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Jenis Notifikasi */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#B9C8D7] mb-3">Jenis Notifikasi</div>
          <div className="bg-[#F7F8FA] border border-[#EAECF0] rounded-[12px] divide-y divide-[#EAECF0]">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className={`w-[36px] h-[36px] rounded-[8px] flex items-center justify-center ${
                  settings.soundEnabled ? 'bg-[#16A34A]/15' : 'bg-white border border-[#EAECF0]'
                }`}>
                  <Bell01 size={18} strokeWidth={2} className={settings.soundEnabled ? 'text-[#16A34A]' : 'text-[#B9C8D7]'} />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#202020]">Notifikasi Suara</div>
                  <div className="text-[12px] text-[#8C9BAF] mt-0.5">Alarm pH & buzzer saat BAHAYA</div>
                </div>
              </div>
              <ToggleSwitch value={settings.soundEnabled} onChange={(v) => updateSetting('soundEnabled', v)} />
            </div>

            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className={`w-[36px] h-[36px] rounded-[8px] flex items-center justify-center ${
                  settings.visualEnabled ? 'bg-[#16A34A]/15' : 'bg-white border border-[#EAECF0]'
                }`}>
                  <BellOff01 size={18} strokeWidth={2} className={settings.visualEnabled ? 'text-[#16A34A]' : 'text-[#B9C8D7]'} />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#202020]">Notifikasi Visual</div>
                  <div className="text-[12px] text-[#8C9BAF] mt-0.5">Popup & alert banner di dashboard</div>
                </div>
              </div>
              <ToggleSwitch value={settings.visualEnabled} onChange={(v) => updateSetting('visualEnabled', v)} />
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#B9C8D7] mb-3">Jam Senyap</div>
          <div className="bg-[#F7F8FA] border border-[#EAECF0] rounded-[12px] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[14px] font-bold text-[#202020]">Quiet Hours</div>
                <div className="text-[12px] text-[#8C9BAF] mt-0.5">Nonaktifkan notifikasi pada jam tertentu</div>
              </div>
              <ToggleSwitch value={settings.quietHoursEnabled} onChange={(v) => updateSetting('quietHoursEnabled', v)} />
            </div>
            {settings.quietHoursEnabled && (
              <div className="flex items-center gap-3 pt-4 border-t border-[#EAECF0]">
                <div>
                  <label className="block text-[11px] font-bold text-[#B9C8D7] mb-1">Dari</label>
                  <input
                    type="time"
                    value={settings.quietStart}
                    onChange={(e) => updateSetting('quietStart', e.target.value)}
                    className="h-[36px] px-3 rounded-[8px] border border-[#EAECF0] bg-white text-[13px] font-mono text-[#202020] outline-none focus:border-[#FF4628]"
                  />
                </div>
                <span className="text-[#B9C8D7] mt-5">—</span>
                <div>
                  <label className="block text-[11px] font-bold text-[#B9C8D7] mb-1">Sampai</label>
                  <input
                    type="time"
                    value={settings.quietEnd}
                    onChange={(e) => updateSetting('quietEnd', e.target.value)}
                    className="h-[36px] px-3 rounded-[8px] border border-[#EAECF0] bg-white text-[13px] font-mono text-[#202020] outline-none focus:border-[#FF4628]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Frekuensi */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#B9C8D7] mb-3">Frekuensi Notifikasi</div>
          <div className="bg-[#F7F8FA] border border-[#EAECF0] rounded-[12px] p-5">
            <div className="flex flex-col gap-3">
              {[
                { value: 'realtime', label: 'Real-time', desc: 'Setiap kali ada perubahan data' },
                { value: '5min', label: 'Setiap 5 menit', desc: 'Ringkasan setiap 5 menit' },
                { value: '15min', label: 'Setiap 15 menit', desc: 'Ringkasan setiap 15 menit' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[8px] cursor-pointer transition-colors ${
                    settings.frequency === option.value
                      ? 'bg-[#16A34A]/10 border border-[#16A34A]/30'
                      : 'bg-white border border-[#EAECF0] hover:border-[#B9C8D7]'
                  }`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={option.value}
                    checked={settings.frequency === option.value}
                    onChange={(e) => updateSetting('frequency', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 ${
                    settings.frequency === option.value ? 'border-[#16A34A] bg-[#16A34A]' : 'border-[#D1D5DB]'
                  }`}>
                    {settings.frequency === option.value && (
                      <div className="w-[6px] h-[6px] rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#202020]">{option.label}</div>
                    <div className="text-[11px] text-[#8C9BAF]">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
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
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
