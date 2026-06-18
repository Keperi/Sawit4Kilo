import React, { useEffect, useContext, useState } from 'react';
import { SensorContext } from '../../context/SensorContext';
import { X, Wifi, WifiOff, Clock, Server03 } from '@untitledui/icons';
import MiniChart from './MiniChart';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const getRelativeTime = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 5) return 'Baru saja';
  if (seconds < 60) return `${seconds} detik lalu`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  return `${hours} jam lalu`;
};

const NodeDetailSidebar = ({ node, onClose, onNavigateToHistory }) => {
  const { phThresholdMin, tdsThreshold, getNodeStatus } = useContext(SensorContext);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const status = getNodeStatus(node);
  const secondsSinceUpdate = Math.floor((Date.now() - new Date(node.lastUpdate).getTime()) / 1000);
  const isStale = secondsSinceUpdate > 30;

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 200);
  };

  const translateX = isClosing ? 'translate-x-full' : 'translate-x-0';

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[420px] bg-white border-l border-[#EAECF0] z-50 transform transition-transform duration-300 ease-out ${translateX} flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAECF0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-[36px] h-[36px] rounded-[8px] bg-[#F7F8FA] border border-[#EAECF0] flex items-center justify-center shrink-0">
              <Server03 size={18} strokeWidth={1.5} className="text-[#8C9BAF]" />
            </div>
            <div>
              <div className="text-[16px] font-bold text-[#202020]">{node.name}</div>
              <div className="text-[11px] text-[#B9C8D7]">{node.location}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={status === 'AMAN' ? 'safe' : status === 'BAHAYA' ? 'danger' : 'gray'}
              dot
            >
              {status}
            </Badge>
            <button
              onClick={handleClose}
              className="w-[30px] h-[30px] rounded-[6px] bg-[#F7F8FA] border border-[#EAECF0] flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <X size={14} strokeWidth={2} className="text-[#8C9BAF]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {/* Info Teknis */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#B9C8D7] mb-2">
              Info Perangkat
            </div>
            <div className="bg-white rounded-[10px] border border-[#EAECF0] p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  {node.online ? (
                    <Wifi size={14} strokeWidth={2} className="text-[#16A34A]" />
                  ) : (
                    <WifiOff size={14} strokeWidth={2} className="text-[#D1D5DB]" />
                  )}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7]">Koneksi</div>
                    <div className={`text-[12px] font-semibold ${node.online ? 'text-[#16A34A]' : 'text-[#D1D5DB]'}`}>
                      {node.online ? 'Terhubung' : 'Terputus'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} strokeWidth={2} className="text-[#8C9BAF]" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7]">Update Terakhir</div>
                    <div className="text-[12px] font-semibold text-[#202020]">
                      {getRelativeTime(node.lastUpdate)}
                    </div>
                  </div>
                </div>
              </div>

              {isStale && node.online && (
                <div className="mt-3 bg-[#FF4628]/10 border border-[#FF4628]/20 rounded-[6px] px-3 py-2 flex items-center gap-2">
                  <div className="w-[6px] h-[6px] rounded-full bg-[#FF4628] animate-pulse" />
                  <span className="text-[11px] font-bold text-[#FF4628]">
                    Node Offline — Tidak ada data selama {secondsSinceUpdate}s
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Data Sensor Real-Time */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#B9C8D7] mb-2">
              Data Sensor Real-Time
            </div>
            <div className="bg-white rounded-[10px] border border-[#EAECF0] p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#F9FAFB] rounded-[8px] p-3 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7] mb-1">pH</div>
                  <div className="font-mono font-bold text-[28px] text-[#202020] leading-none">
                    {node.ph.toFixed(1)}
                  </div>
                </div>
                <div className="bg-[#F9FAFB] rounded-[8px] p-3 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7] mb-1">TDS</div>
                  <div className="font-mono font-bold text-[28px] text-[#202020] leading-none">
                    {node.tds}
                    <span className="text-[11px] font-normal text-[#B9C8D7] ml-1">ppm</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <MiniChart
                  data={node.chartData}
                  dataKey="ph"
                  color="#FF4628"
                  threshold={phThresholdMin}
                  label="pH History (30 menit)"
                />
                <MiniChart
                  data={node.chartData}
                  dataKey="tds"
                  color="#3B82F6"
                  threshold={tdsThreshold}
                  label="TDS History (30 menit)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#EAECF0] px-5 py-4 shrink-0">
          <Button
            color="secondary"
            className="w-full"
            onClick={() => {
              handleClose();
              setTimeout(() => onNavigateToHistory(node.id), 300);
            }}
          >
            Lihat Riwayat Lengkap
          </Button>
        </div>
      </div>
    </>
  );
};

export default NodeDetailSidebar;
