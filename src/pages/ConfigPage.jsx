import React, { useContext } from 'react';
import { SensorContext } from '../context/SensorContext';
import Header from '../components/layout/Header';
import DeviceHeartbeat from '../components/config/DeviceHeartbeat';
import ThresholdConfigurationForm from '../components/config/ThresholdConfigurationForm';
import { Settings01 } from '@untitledui/icons';

const ConfigPage = ({ onOpenSidebar }) => {
  const { phThresholdMin, phThresholdMax, updateThresholds, systemStatus } = useContext(SensorContext);

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] overflow-hidden">
      {/* ── Header ── */}
      <Header
        title="Konfigurasi Sistem & Perangkat"
        subtitle="Pantau status koneksi hardware LoRa/ESP32 dan atur batas ambang alarm AMDAL"
        icon={Settings01}
        systemStatus={systemStatus}
        onOpenSidebar={onOpenSidebar}
      />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="w-full max-w-3xl flex flex-col gap-6 mx-auto">
          <DeviceHeartbeat />
          <ThresholdConfigurationForm
            initialPhMin={phThresholdMin}
            initialPhMax={phThresholdMax}
            onSave={updateThresholds}
          />
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="bg-white border-t border-gray-100 px-8 py-3 shrink-0 flex items-center">
        <span className="text-xs font-medium text-gray-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          STATUS: Menampilkan hasil pengaturan terbaru · Sistem siap dikonfigurasi
        </span>
      </div>
    </div>
  );
};

export default ConfigPage;
