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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF4628]/10 text-[#FF4628] text-[11px] font-bold">
            <AlertCircle size={12} strokeWidth={2} />
            BAHAYA
          </span>
        );
      case 'WASPADA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-[11px] font-bold">
            <AlertTriangle size={12} strokeWidth={2} />
            WASPADA
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[11px] font-bold">
            <CheckCircle size={12} strokeWidth={2} />
            AMAN
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#EAECF0] rounded-[12px] p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-[36px] h-[36px] rounded-[8px] bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center">
            <span className="text-[12px] font-bold text-white">AI</span>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#202020]">Ringkasan Eksekutif</h3>
            <p className="text-[11px] text-[#B9C8D7]">Analisis otomatis berbasis AI</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="h-[32px] px-3 bg-white border border-[#EAECF0] rounded-[8px] text-[12px] font-medium text-[#202020] cursor-pointer outline-none focus:border-[#FF4628]"
          >
            <option value="24h">24 Jam</option>
            <option value="7d">7 Hari</option>
            <option value="30d">30 Hari</option>
          </select>
          <button
            onClick={handleRegenerate}
            disabled={cooldown || loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-colors ${
              cooldown || loading
                ? 'bg-[#EAECF0] text-[#B9C8D7] cursor-not-allowed'
                : 'bg-[#FF4628] text-white hover:bg-[#e03d22] cursor-pointer'
            }`}
          >
            {loading ? (
              <Loading01 size={14} className="animate-spin" />
            ) : (
              <RefreshCw01 size={14} />
            )}
            {loading ? 'Menganalisis...' : cooldown ? 'Tunggu' : 'Regenerate'}
          </button>
        </div>
      </div>

      {summary?.status && (
        <div className="mb-3">
          {getStatusBadge(summary.status)}
        </div>
      )}

      {loading && !summary?.text ? (
        <div className="flex items-center gap-2 text-[14px] text-[#B9C8D7] py-4">
          <Loading01 size={16} className="animate-spin" />
          AI sedang menganalisis seluruh data...
        </div>
      ) : summary?.text ? (
        <>
          <p className="text-[14px] text-[#202020] leading-relaxed mb-4">{summary.text}</p>

          {summary.actionItems?.length > 0 && (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-[8px] p-4 mb-4">
              <div className="text-[12px] font-bold text-[#92400E] mb-2">Poin Tindak Lanjut:</div>
              <ul className="space-y-1.5">
                {summary.actionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-[#92400E]">
                    <span className="w-4 h-4 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="text-[14px] text-[#B9C8D7] py-4">Belum ada ringkasan</p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-[#EAECF0]">
        <p className="text-[10px] text-[#D1D5DB] italic">
          Dihasilkan otomatis oleh AI berdasarkan data sensor, perlu verifikasi manusia untuk keputusan kritis.
        </p>
        {lastUpdate && (
          <span className="text-[10px] text-[#B9C8D7]">Terakhir diperbarui: {lastUpdate}</span>
        )}
      </div>
    </div>
  );
};

export default AISummary;
