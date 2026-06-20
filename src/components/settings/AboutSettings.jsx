import React, { useContext } from 'react';
import { SensorContext } from '../../context/SensorContext';
import { Server03, Wifi, WifiOff, AlertCircle } from '@untitledui/icons';

const AboutSettings = () => {
  const { nodes, systemStatus } = useContext(SensorContext);

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-[#202020]">Tentang Sistem</h2>
        <p className="text-[13px] text-[#8C9BAF] mt-1">Informasi aplikasi dan status hardware</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Versi Aplikasi */}
        <div className="bg-[#F7F8FA] border border-[#EAECF0] rounded-[12px] p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[36px] h-[36px] rounded-[8px] bg-[#FF4628]/10 flex items-center justify-center">
              <AlertCircle size={18} strokeWidth={2} className="text-[#FF4628]" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-[#202020]">KIDECO Dashboard</div>
              <div className="text-[12px] text-[#8C9BAF]">Water Quality Monitoring System</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7] mb-1">Versi</div>
              <div className="text-[13px] font-mono font-semibold text-[#202020]">v1.0.0</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7] mb-1">Status Sistem</div>
              <div className={`flex items-center gap-1.5 text-[13px] font-semibold ${
                systemStatus === 'OFFLINE' ? 'text-[#667085]' : systemStatus === 'BAHAYA' ? 'text-[#FF4628]' : 'text-[#16A34A]'
              }`}>
                <div className={`w-[6px] h-[6px] rounded-full ${
                  systemStatus === 'OFFLINE' ? 'bg-[#667085]' : systemStatus === 'BAHAYA' ? 'bg-[#FF4628]' : 'bg-[#16A34A]'
                }`} />
                {systemStatus}
              </div>
            </div>
          </div>
        </div>

        {/* Node Status */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#B9C8D7] mb-3">Status Node</div>
          <div className="bg-[#F7F8FA] border border-[#EAECF0] rounded-[12px] divide-y divide-[#EAECF0]">
            {nodes.map((node) => (
              <div key={node.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-[8px] bg-white border border-[#EAECF0] flex items-center justify-center">
                    <Server03 size={18} strokeWidth={1.5} className="text-[#8C9BAF]" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#202020]">{node.name}</div>
                    <div className="text-[12px] text-[#8C9BAF] mt-0.5">{node.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {node.online ? (
                    <Wifi size={14} strokeWidth={2} className="text-[#16A34A]" />
                  ) : (
                    <WifiOff size={14} strokeWidth={2} className="text-[#D1D5DB]" />
                  )}
                  <span className={`text-[12px] font-semibold ${
                    node.online ? 'text-[#16A34A]' : 'text-[#D1D5DB]'
                  }`}>
                    {node.online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Hardware */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#B9C8D7] mb-3">Info Hardware</div>
          <div className="bg-[#F7F8FA] border border-[#EAECF0] rounded-[12px] p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7] mb-1">Node Terdaftar</div>
                <div className="text-[13px] font-semibold text-[#202020]">{nodes.length} unit</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7] mb-1">Protocol</div>
                <div className="text-[13px] font-semibold text-[#202020]">LoRa 868 MHz</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7] mb-1">Sensor</div>
                <div className="text-[13px] font-semibold text-[#202020]">pH + TDS</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7] mb-1">Interval Update</div>
                <div className="text-[13px] font-semibold text-[#202020]">1 detik</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tentang KIDECO */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[8px] p-4">
          <p className="text-[12px] text-[#1E40AF] leading-relaxed">
            <strong className="font-semibold">KIDECO Dashboard</strong> adalah sistem monitoring kualitas air tambang berbasis ESP32 + LoRa. Sistem ini memantau parameter pH dan TDS secara real-time untuk memastikan kepatuhan terhadap regulasi AMDAL.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutSettings;
