import React, { useState, useEffect, useContext } from 'react';
import { SensorContext } from '../context/SensorContext';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import { Settings01, AlertTriangle, CheckCircle, AlertOctagon } from '@untitledui/icons';

const Settings = ({ onOpenSidebar }) => {
  const { systemStatus } = useContext(SensorContext);

  const [formData, setFormData] = useState({
    device_id: 'gateway-01',
    api_url: '',
    send_interval: 5000,
    is_active: true
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [notification, setNotification] = useState(null);

  // Fetch data on page load
  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/config/gateway-01');
      const result = await response.json();
      if (result.success && result.data) {
        setFormData({
          device_id: result.data.device_id || 'gateway-01',
          api_url: result.data.api_url || '',
          send_interval: result.data.send_interval ?? 5000,
          is_active: result.data.is_active ?? true
        });
      } else {
        setNotification({
          type: 'error',
          title: 'Gagal Memuat Konfigurasi',
          message: result.message || 'Gagal memuat data dari server.'
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Kesalahan Koneksi',
        message: 'Tidak dapat menghubungi server API backend.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'send_interval' ? (parseInt(value, 10) || '') : value
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleToggleChange = () => {
    setFormData((prev) => ({
      ...prev,
      is_active: !prev.is_active
    }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.api_url.trim()) {
      errors.api_url = 'API URL wajib diisi';
    }
    if (formData.send_interval === '') {
      errors.send_interval = 'Send Interval wajib diisi';
    } else if (Number(formData.send_interval) < 1000) {
      errors.send_interval = 'Send Interval minimal adalah 1000 ms (1 detik)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSaving(true);
      const response = await fetch('http://localhost:3000/api/config/gateway-01', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_url: formData.api_url,
          send_interval: Number(formData.send_interval),
          is_active: formData.is_active
        })
      });

      const result = await response.json();
      if (result.success) {
        setNotification({
          type: 'success',
          title: 'Konfigurasi Disimpan',
          message: 'Pengaturan gateway ESP32 berhasil diperbarui secara real-time.'
        });
        // Auto-close toast
        setTimeout(() => setNotification(null), 4000);
      } else {
        setNotification({
          type: 'error',
          title: 'Gagal Menyimpan',
          message: result.message || 'Terjadi kesalahan saat menyimpan ke database.'
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Kesalahan Koneksi',
        message: 'Gagal menghubungi server untuk menyimpan perubahan.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-[#F9FAFB] overflow-hidden">
        <Header
          title="Pengaturan ESP32 Gateway"
          subtitle="Konfigurasi URL endpoint API dan interval pengiriman data perangkat keras"
          icon={Settings01}
          systemStatus={systemStatus}
          onOpenSidebar={onOpenSidebar}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-[#FF4628] animate-spin" />
            <span className="text-sm font-semibold text-slate-500">Memuat konfigurasi...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border p-4 min-w-[320px] transition-all duration-300 bg-white ${
          notification.type === 'success' ? 'border-emerald-100' : 'border-red-100'
        }`}>
          <div className="flex-shrink-0">
            {notification.type === 'success' ? (
              <CheckCircle className="h-6 w-6 text-emerald-500" />
            ) : (
              <AlertOctagon className="h-6 w-6 text-red-500" />
            )}
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-[13px] font-bold text-slate-800">
              {notification.title}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed">
              {notification.message}
            </p>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold px-1.5 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        title="Pengaturan ESP32 Gateway"
        subtitle="Konfigurasi URL endpoint API dan interval pengiriman data perangkat keras"
        icon={Settings01}
        systemStatus={systemStatus}
        onOpenSidebar={onOpenSidebar}
      />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="w-full max-w-3xl flex flex-col gap-6 mx-auto">
          
          <div className="text-[11px] font-bold tracking-[0.07em] uppercase text-slate-400 mb-1">
            Panel Konfigurasi Hardware ESP32
          </div>

          <div className="bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] p-6 transition-all duration-200">
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Sesuaikan endpoint penerima data dan durasi jeda transmisi untuk perangkat gateway ESP32. Perubahan akan diterapkan secara otomatis saat perangkat boot ulang.
            </p>

            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Device ID (Readonly) */}
              <div className="flex flex-col w-full">
                <label className="text-sm font-semibold text-slate-700 mb-1.5">
                  Device ID
                </label>
                <input
                  type="text"
                  value={formData.device_id}
                  readOnly
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-slate-500 outline-none cursor-not-allowed shadow-inner"
                />
                <p className="text-xs text-slate-400 mt-1.5">
                  Identifier unik untuk perangkat gateway ini (tidak dapat diubah).
                </p>
              </div>

              {/* API URL (Editable) */}
              <div className="flex flex-col w-full">
                <label className="text-sm font-semibold text-slate-700 mb-1.5">
                  API URL
                </label>
                <input
                  type="text"
                  name="api_url"
                  value={formData.api_url}
                  onChange={handleInputChange}
                  placeholder="http://10.10.203.60:3000/api/sensor-data"
                  className={`w-full h-11 px-4 bg-white border rounded-xl font-mono text-sm text-slate-900 outline-none transition-all shadow-sm ${
                    validationErrors.api_url
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10'
                  }`}
                />
                {validationErrors.api_url ? (
                  <span className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {validationErrors.api_url}
                  </span>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Endpoint REST API server tujuan untuk pengiriman data dari ESP32.
                  </p>
                )}
              </div>

              {/* Send Interval (ms) */}
              <div className="flex flex-col w-full">
                <label className="text-sm font-semibold text-slate-700 mb-1.5">
                  Send Interval (ms)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="send_interval"
                    value={formData.send_interval}
                    onChange={handleInputChange}
                    placeholder="5000"
                    min="1000"
                    className={`w-full h-11 px-4 bg-white border rounded-xl font-mono text-sm text-slate-900 outline-none transition-all shadow-sm pr-28 ${
                      validationErrors.send_interval
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    {formData.send_interval ? `${(Number(formData.send_interval) / 1000).toFixed(1)} detik` : '0.0 detik'}
                  </div>
                </div>
                {validationErrors.send_interval ? (
                  <span className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {validationErrors.send_interval}
                  </span>
                ) : (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Frekuensi interval pengiriman data sensor (minimum 1000 ms / 1 detik).
                  </p>
                )}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Status Perangkat</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Aktifkan atau nonaktifkan pengiriman data sensor dari perangkat ini.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleChange}
                  className={`relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.is_active ? 'bg-[#FF4628]' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.is_active ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Warning Alert Box */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={18} strokeWidth={2} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed m-0 font-medium">
                  <strong>Pemberitahuan:</strong> Mematikan status perangkat atau menyetel interval yang terlalu lama dapat menghentikan / menunda pembacaan sensor AMDAL secara real-time di dashboard utama.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
                <Button
                  variant="secondary"
                  onClick={fetchConfig}
                  disabled={isSaving}
                >
                  Reset Form
                </Button>
                <Button
                  id="btn-save-settings"
                  type="submit"
                  variant="primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </Button>
              </div>

            </form>
          </div>

        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="bg-white border-t border-gray-100 px-8 py-3 shrink-0 flex items-center">
        <span className="text-xs font-medium text-gray-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          STATUS: Terhubung ke gateway-01 · Konfigurasi siap disinkronkan
        </span>
      </div>
    </div>
  );
};

export default Settings;
