import React, { useState, useEffect } from 'react';
import { Loading01, RefreshCw01, CheckCircle, AlertTriangle, AlertCircle } from '@untitledui/icons';

const AISummary = ({ summary, loading, onRegenerate, period, onPeriodChange, lastUpdate }) => {
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    if (cooldown) {
      const timer = setTimeout(() => setCooldown(false), 120000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleRegenerate = () => {
    if (cooldown || loading) return;
    setCooldown(true);
    onRegenerate();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'BAHAYA':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D92D20]/10 text-[#D92D20] text-[11px] font-bold border border-[#FEE2E2]">
            <AlertCircle size={12} strokeWidth={2.5} />
            STATUS BAHAYA
          </span>
        );
      case 'WASPADA':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B45309]/10 text-[#B45309] text-[11px] font-bold border border-[#FEF08A]">
            <AlertTriangle size={12} strokeWidth={2.5} />
            STATUS WASPADA
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15803D]/10 text-[#15803D] text-[11px] font-bold border border-[#D1FADF]">
            <CheckCircle size={12} strokeWidth={2.5} />
            STATUS AMAN
          </span>
        );
    }
  };

  const getBorderColorClass = (status) => {
    switch (status) {
      case 'BAHAYA': return 'border-l-[#D92D20]';
      case 'WASPADA': return 'border-l-[#B45309]';
      default: return 'border-l-[#15803D]';
    }
  };

  return (
    <div className={`bg-white border-y border-r border-l-[4px] ${getBorderColorClass(summary?.status)} border-y-[#EAECF0] border-r-[#EAECF0] rounded-r-[16px] rounded-l-[4px] p-6 shadow-xs hover:shadow-md transition-all duration-300`}>
      
      {/* Executive Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center shadow-md">
            <span className="text-[14px] font-bold text-white tracking-wide">AI</span>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#101828]">Ringkasan Eksekutif</h3>
            <p className="text-[12px] text-[#667085]">Analisis otomatis berbasis kecerdasan buatan</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="h-[36px] px-3 bg-white border border-[#EAECF0] rounded-[8px] text-[12px] font-bold text-[#344054] shadow-3xs cursor-pointer outline-none focus:border-[#FF4628] hover:bg-[#F9FAFB] transition-colors"
          >
            <option value="24h">24 Jam Terakhir</option>
            <option value="7d">7 Hari Terakhir</option>
            <option value="30d">30 Hari Terakhir</option>
          </select>
          <button
            onClick={handleRegenerate}
            disabled={cooldown || loading}
            className={`flex items-center gap-1.5 h-[36px] px-4 rounded-[8px] text-[12px] font-bold transition-all shadow-sm ${
              cooldown || loading
                ? 'bg-[#EAECF0] text-[#98A2B3] cursor-not-allowed border border-transparent'
                : 'bg-[#FF4628] text-white hover:bg-[#e03d22] cursor-pointer border border-[#FF4628]'
            }`}
          >
            {loading ? (
              <Loading01 size={14} className="animate-spin" />
            ) : (
              <RefreshCw01 size={14} />
            )}
            {loading ? 'Menganalisis...' : cooldown ? 'Tunggu 2m' : 'Regenerate'}
          </button>
        </div>
      </div>

      {summary?.status && (
        <div className="mb-4">
          {getStatusBadge(summary.status)}
        </div>
      )}

      {loading && !summary?.text ? (
        <div className="flex items-center gap-2.5 text-[14px] font-semibold text-[#667085] py-6 justify-center bg-[#F9FAFB] border border-[#EAECF0] rounded-[10px] border-dashed">
          <Loading01 size={18} className="animate-spin text-[#8B5CF6]" />
          AI sedang menganalisis seluruh data sensor...
        </div>
      ) : summary?.text ? (
        <>
          <p className="text-[14px] text-[#344054] font-medium leading-relaxed mb-5">{summary.text}</p>

          {summary.actionItems?.length > 0 && (
            <div className="bg-gradient-to-r from-[#FFFBEB] to-[#FFFDF5] border border-[#FEF08A] rounded-[12px] p-5 mb-4 shadow-3xs">
              <div className="text-[12px] font-bold text-[#B45309] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-3.5 rounded-full bg-[#B45309]" />
                Rencana Aksi & Tindak Lanjut:
              </div>
              <ul className="space-y-2.5">
                {summary.actionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[12.5px] font-semibold text-[#B45309]">
                    <span className="w-5 h-5 rounded-full bg-[#B45309] text-white flex items-center justify-center shrink-0 text-[10px] font-extrabold shadow-sm mt-0.5">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="text-[14px] text-[#667085] italic py-6 text-center bg-[#F9FAFB] border border-[#EAECF0] rounded-[10px] border-dashed">Belum ada ringkasan hasil analisis.</p>
      )}

      <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#EAECF0] flex-wrap gap-2">
        <p className="text-[10px] text-[#98A2B3] italic leading-tight">
          Dihasilkan otomatis oleh AI KIDECO Copilot. Diperlukan verifikasi manusia sebelum keputusan kritis.
        </p>
        {lastUpdate && (
          <span className="text-[10px] font-medium text-[#667085]">Terakhir diperbarui: {lastUpdate}</span>
        )}
      </div>
    </div>
  );
};

export default AISummary;
