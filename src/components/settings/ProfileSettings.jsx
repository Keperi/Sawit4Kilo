import React, { useState } from 'react';
import { User01, Camera01, CheckCircle } from '@untitledui/icons';

const ProfileSettings = () => {
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('admin@kideco.com');
  const [role, setRole] = useState('Environment Engineer');
  const [bio, setBio] = useState('Admin sistem monitoring kualitas air tambang KIDECO dengan pengalaman dalam pengelolaan AMDAL.');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setNotification({ type: 'success', message: 'Profil berhasil disimpan' });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-[#202020]">Profil Akun</h2>
        <p className="text-[13px] text-[#8C9BAF] mt-1">Kelola informasi profil Anda</p>
      </div>

      {notification && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-[10px] border bg-[#F0FDF4] border-[#BBF7D0] text-[#166534] mb-6 transition-all duration-300">
          <CheckCircle size={18} strokeWidth={2} className="text-[#16A34A] shrink-0" />
          <span className="text-[13px] font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Avatar Section */}
      <div className="bg-[#F7F8FA] border border-[#EAECF0] rounded-[12px] p-5 flex items-center gap-5 mb-8">
        <div className="relative">
          <div className="w-[72px] h-[72px] rounded-full bg-[#B9C8D7]/30 flex items-center justify-center">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
              alt="Avatar"
              className="w-[72px] h-[72px] rounded-full"
            />
          </div>
          <button className="absolute bottom-0 right-0 w-[28px] h-[28px] rounded-full bg-white border border-[#EAECF0] flex items-center justify-center shadow-sm hover:bg-[#F5F5F5] transition-colors cursor-pointer">
            <Camera01 size={14} strokeWidth={2} className="text-[#8C9BAF]" />
          </button>
        </div>
        <div>
          <div className="text-[15px] font-bold text-[#202020]">{name}</div>
          <div className="text-[12px] text-[#8C9BAF] mt-0.5">Klik ikon kamera untuk mengubah foto</div>
          <div className="text-[11px] text-[#B9C8D7] mt-1">JPG, PNG maks 2MB</div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold text-[#202020] mb-1.5">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[42px] px-3 rounded-[8px] border border-[#EAECF0] bg-white text-[14px] text-[#202020] outline-none transition-colors focus:border-[#FF4628]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#202020] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[42px] px-3 rounded-[8px] border border-[#EAECF0] bg-white text-[14px] text-[#202020] outline-none transition-colors focus:border-[#FF4628]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-[#202020] mb-1.5">Role / Jabatan</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-[42px] px-3 rounded-[8px] border border-[#EAECF0] bg-white text-[14px] text-[#202020] outline-none transition-colors focus:border-[#FF4628]"
          />
        </div>

        <div>
          <label className="block text-[13px] font-bold text-[#202020] mb-1.5">Bio Singkat</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-3 py-2.5 rounded-[8px] border border-[#EAECF0] bg-white text-[14px] text-[#202020] outline-none transition-colors focus:border-[#FF4628] resize-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 pt-6 border-t border-[#EAECF0]">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`
            w-full h-[44px] rounded-[10px] text-[14px] font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2
            ${saving
              ? 'bg-[#16A34A]/70 text-white cursor-not-allowed'
              : 'bg-[#16A34A] text-white hover:bg-[#15803D] active:bg-[#14673A]'}
          `}
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan Perubahan'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
