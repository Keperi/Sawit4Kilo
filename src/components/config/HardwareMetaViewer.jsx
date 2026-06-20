import React from 'react';
import { CpuChip01, Wifi, ActivityHeart } from '@untitledui/icons';

const mockFirmwareData = {
  macAddress: '24:6F:28:DA:11:3C',
  ipAddress: '192.168.1.145',
  uptime: '4 Hari, 12 Jam, 33 Menit',
  firmwareVersion: 'v2.4.1-stable',
  signalStrength: '-65 dBm (Good)',
  activeNode: 'KDC01 - Kolam Pengendap 1'
};

const HardwareMetaViewer = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <CpuChip01 className="text-[#B9C8D7]" size={24} />
        <h2 className="text-lg font-bold text-gray-800 font-sans">Informasi Firmware & Perangkat</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Node Active */}
        <div className="flex flex-col gap-1 pb-4 border-b border-gray-100 md:border-b-0">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Node Aktif</span>
          <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            {mockFirmwareData.activeNode}
          </span>
        </div>

        {/* Uptime */}
        <div className="flex flex-col gap-1 pb-4 border-b border-gray-100 md:border-b-0">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Uptime Sistem</span>
          <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <ActivityHeart size={16} className="text-[#FF4628]" />
            {mockFirmwareData.uptime}
          </span>
        </div>

        {/* Signal */}
        <div className="flex flex-col gap-1 pb-4 border-b border-gray-100 md:border-b-0 lg:border-none">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Kekuatan Sinyal</span>
          <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <Wifi size={16} className="text-green-500" />
            {mockFirmwareData.signalStrength}
          </span>
        </div>

        {/* MAC Address */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">MAC Address</span>
          <span className="text-sm font-dm-mono text-gray-600">{mockFirmwareData.macAddress}</span>
        </div>

        {/* IP Address */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">IP Address</span>
          <span className="text-sm font-dm-mono text-gray-600">{mockFirmwareData.ipAddress}</span>
        </div>

        {/* Firmware Version */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Versi Firmware</span>
          <span className="text-sm font-dm-mono text-gray-600">{mockFirmwareData.firmwareVersion}</span>
        </div>
      </div>
    </div>
  );
};

export default HardwareMetaViewer;
