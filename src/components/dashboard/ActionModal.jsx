import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Loading01, ChevronRight } from '@untitledui/icons';
import { getActionPlan } from '../../utils/groq';

const ActionModal = ({ isOpen, onClose, sensorData }) => {
  const [loading, setLoading] = useState(true);
  const [actionPlan, setActionPlan] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
      fetchActionPlan();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const fetchActionPlan = async () => {
    setLoading(true);
    const plan = await getActionPlan(sensorData);
    setActionPlan(plan);
    setLoading(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsVisible(false);
      onClose();
    }, 200);
  };

  if (!isOpen && !isClosing) return null;

  const opacity = isClosing ? 'opacity-0' : 'opacity-100';
  const scale = isClosing ? 'scale-95' : 'scale-100';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${opacity}`}
        onClick={handleClose}
      />

      <div className={`relative w-full max-w-[700px] max-h-[85vh] bg-white rounded-[16px] border border-[#EAECF0] shadow-xl flex flex-col overflow-hidden transition-all duration-200 ${opacity} ${scale}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAECF0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] rounded-[10px] bg-[#FF4628]/10 flex items-center justify-center">
              <AlertTriangle size={20} strokeWidth={2} className="text-[#FF4628]" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#202020]">Rencana Tindakan</h2>
              <p className="text-[12px] text-[#8C9BAF]">Analisis AI untuk penanganan air asam</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-[32px] h-[32px] rounded-[8px] bg-[#F7F8FA] border border-[#EAECF0] flex items-center justify-center cursor-pointer hover:bg-[#F5F5F5] transition-colors"
          >
            <X size={16} strokeWidth={2} className="text-[#8C9BAF]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loading01 size={32} className="animate-spin text-[#FF4628] mb-4" />
              <p className="text-[14px] text-[#8C9BAF]">AI sedang menganalisis data...</p>
              <p className="text-[12px] text-[#B9C8D7] mt-1">Memproses rencana tindakan</p>
            </div>
          ) : actionPlan ? (
            <div className="flex flex-col gap-6">
              {/* Masalah */}
              <div className="bg-[#FEF9F8] border border-[#FDDDD6] rounded-[12px] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} strokeWidth={2} className="text-[#FF4628]" />
                  <span className="text-[13px] font-bold text-[#9B2617]">Masalah Teridentifikasi</span>
                </div>
                <p className="text-[14px] text-[#202020] leading-relaxed">{actionPlan.masalah}</p>
              </div>

              {/* Data Detail */}
              {actionPlan.data_detail?.length > 0 && (
                <div>
                  <h3 className="text-[13px] font-bold text-[#202020] mb-3">Data Sensor Detail</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {actionPlan.data_detail.map((item, i) => (
                      <div key={i} className="bg-[#F7F8FA] border border-[#EAECF0] rounded-[10px] p-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#B9C8D7] mb-2">{item.parameter}</div>
                        <div className="flex items-end gap-2">
                          <span className="text-[24px] font-mono font-bold text-[#202020]">{item.nilai}</span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'BAHAYA' ? 'bg-[#FF4628]/10 text-[#FF4628]' : 'bg-[#16A34A]/10 text-[#16A34A]'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#8C9BAF] mt-1">Ambang: {item.ambang}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Solusi */}
              {actionPlan.solusi?.length > 0 && (
                <div>
                  <h3 className="text-[13px] font-bold text-[#202020] mb-3">Langkah Penanganan</h3>
                  <div className="flex flex-col gap-3">
                    {actionPlan.solusi.map((item, i) => (
                      <div key={i} className="bg-white border border-[#EAECF0] rounded-[10px] p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-[28px] h-[28px] rounded-full bg-[#FF4628] text-white flex items-center justify-center shrink-0 text-[12px] font-bold">
                            {item.langkah}
                          </div>
                          <div className="flex-1">
                            <div className="text-[14px] font-bold text-[#202020] mb-1">{item.tindakan}</div>
                            <p className="text-[13px] text-[#8C9BAF] leading-relaxed mb-2">{item.detail}</p>
                            <div className="flex items-center gap-2 text-[12px] text-[#16A34A]">
                              <ChevronRight size={14} strokeWidth={2} />
                              <span className="font-medium">Alasan: {item.alasan}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dampak */}
              {actionPlan.dampak && (
                <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-[12px] p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} strokeWidth={2} className="text-[#F59E0B]" />
                    <span className="text-[13px] font-bold text-[#92400E]">Dampak Jika Tidak Ditindaklanjuti</span>
                  </div>
                  <p className="text-[13px] text-[#92400E] leading-relaxed">{actionPlan.dampak}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-[14px] text-[#B9C8D7]">Tidak ada data</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EAECF0] shrink-0">
          <button
            onClick={handleClose}
            className="w-full h-[42px] rounded-[10px] bg-[#FF4628] text-white text-[13px] font-bold cursor-pointer hover:bg-[#e03d22] transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
