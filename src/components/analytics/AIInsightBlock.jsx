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
    <div className="bg-[#F7F8FA] border border-[#EAECF0] rounded-[10px] p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-[24px] h-[24px] rounded-[6px] bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">AI</span>
          </div>
          <span className="text-[12px] font-bold text-[#202020]">AI Insight</span>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="text-[10px] text-[#B9C8D7]">
              Diperbarui {lastUpdate}
            </span>
          )}
          <button
            onClick={handleRegenerate}
            disabled={cooldown || loading}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-colors ${
              cooldown || loading
                ? 'bg-[#EAECF0] text-[#B9C8D7] cursor-not-allowed'
                : 'bg-white border border-[#EAECF0] text-[#8C9BAF] hover:bg-[#F7F8FA] hover:text-[#202020] cursor-pointer'
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
        <div className="flex items-center gap-2 text-[13px] text-[#B9C8D7]">
          <Loading01 size={14} className="animate-spin" />
          AI sedang menganalisis data...
        </div>
      ) : insight ? (
        <p className="text-[13px] text-[#8C9BAF] leading-relaxed whitespace-pre-line">{insight}</p>
      ) : (
        <p className="text-[13px] text-[#B9C8D7]">Belum ada insight</p>
      )}

      <div className="mt-3 pt-3 border-t border-[#EAECF0]">
        <p className="text-[10px] text-[#D1D5DB] italic">
          Dihasilkan otomatis oleh AI berdasarkan data sensor, perlu verifikasi manusia untuk keputusan kritis.
        </p>
      </div>
    </div>
  );
};

export default AIInsightBlock;
