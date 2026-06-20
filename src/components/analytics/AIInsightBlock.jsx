import React, { useState, useEffect } from 'react';
import { Loading01, RefreshCw01 } from '@untitledui/icons';

const AIInsightBlock = ({ insight, loading, onRegenerate, lastUpdate }) => {
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

  return (
    <div className="bg-[#F9FAFB] border-y border-r border-l-[4px] border-l-[#8B5CF6] border-y-[#EAECF0] border-r-[#EAECF0] rounded-r-[12px] rounded-l-[4px] p-4.5 mt-5 shadow-3xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-[24px] h-[24px] rounded-[6px] bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-bold text-white">AI</span>
          </div>
          <span className="text-[12px] font-bold text-[#101828]">Analisis Insight AI</span>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="text-[10px] font-medium text-[#667085]">
              Diperbarui {lastUpdate}
            </span>
          )}
          <button
            onClick={handleRegenerate}
            disabled={cooldown || loading}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-bold transition-all shadow-3xs border ${
              cooldown || loading
                ? 'bg-[#EAECF0] text-[#98A2B3] border-transparent cursor-not-allowed'
                : 'bg-white border-[#EAECF0] text-[#475467] hover:bg-slate-50 hover:text-[#101828] cursor-pointer'
            }`}
          >
            {loading ? (
              <Loading01 size={12} className="animate-spin" />
            ) : (
              <RefreshCw01 size={12} />
            )}
            {loading ? 'Menganalisis...' : cooldown ? 'Tunggu 2m' : 'Regenerate'}
          </button>
        </div>
      </div>

      {loading && !insight ? (
        <div className="flex items-center gap-2 text-[13px] font-medium text-[#667085] py-2">
          <Loading01 size={14} className="animate-spin text-[#8B5CF6]" />
          AI sedang menganalisis data...
        </div>
      ) : insight ? (
        <p className="text-[13px] text-[#344054] font-medium leading-relaxed whitespace-pre-line">{insight}</p>
      ) : (
        <p className="text-[13px] text-[#98A2B3] italic py-1">Insight analisis belum dihasilkan</p>
      )}

      <div className="mt-3 pt-3 border-t border-[#EAECF0] flex items-center justify-between">
        <p className="text-[9.5px] text-[#98A2B3] italic leading-tight">
          Dihasilkan otomatis oleh AI KIDECO Copilot.
        </p>
      </div>
    </div>
  );
};

export default AIInsightBlock;
