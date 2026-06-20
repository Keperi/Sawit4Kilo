import React from 'react';
import { AlertTriangle, AlertCircle } from '@untitledui/icons';
import AIInsightBlock from './AIInsightBlock';

const AnomalyModule = ({ anomalies, insight, loading, onRefreshInsight }) => {
  const severityStyles = {
    'Berat': 'bg-[#FEE2E2] text-[#D92D20] border-[#FECDCA]',
    'Sedang': 'bg-[#FEF0C7] text-[#B54708] border-[#FEDF89]',
    'Ringan': 'bg-[#EFF8FF] text-[#175CD3] border-[#B9E6FE]',
  };

  return (
    <div className="bg-white border border-[#EAECF0] rounded-[16px] p-6 shadow-xs hover:shadow-md hover:border-[#D0D5DD] transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] shrink-0">
            <AlertTriangle size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#101828]">Deteksi Anomali</h3>
            <p className="text-[12px] text-[#475467] mt-0.5">Penyimpangan data dari pola normal</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
          anomalies?.length > 0 ? 'bg-[#FEE2E2] text-[#D92D20]' : 'bg-[#D1FADF] text-[#15803D]'
        }`}>
          {anomalies?.length || 0} Terdeteksi
        </span>
      </div>

      {anomalies?.length > 0 ? (
        <div className="max-h-[300px] overflow-y-auto mb-5 border border-[#F2F4F7] rounded-[8px] scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#EAECF0] sticky top-0 z-10">
                <th className="py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider text-[#475467]">Waktu</th>
                <th className="py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider text-[#475467]">pH</th>
                <th className="py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider text-[#475467]">TDS</th>
                <th className="py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider text-[#475467]">Parameter</th>
                <th className="py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider text-[#475467]">Tingkat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7]">
              {anomalies.map((a, i) => (
                <tr key={i} className="hover:bg-[#F9FAFB] transition-colors duration-150">
                  <td className="py-2.5 px-3 text-[11px] font-medium text-[#667085] whitespace-nowrap">{a.time}</td>
                  <td className={`py-2.5 px-3 text-[12px] font-mono font-bold ${a.ph < 4.5 || a.ph > 9.0 ? 'text-[#D92D20]' : 'text-[#101828]'}`}>
                    {a.ph.toFixed(1)}
                  </td>
                  <td className={`py-2.5 px-3 text-[12px] font-mono font-bold ${a.tds > 800 ? 'text-[#D92D20]' : 'text-[#101828]'}`}>
                    {a.tds} <span className="text-[10px] font-normal text-[#98A2B3]">ppm</span>
                  </td>
                  <td className="py-2.5 px-3 text-[11px] font-medium text-[#475467]">{a.type}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${severityStyles[a.severity]}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                      {a.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#D1FADF] rounded-[10px] p-5 text-center mb-5 shadow-2xs">
          <CheckCircle size={24} className="text-[#16A34A] mx-auto mb-2" />
          <span className="text-[13px] font-bold text-[#15803D]">Tidak ada anomali terdeteksi</span>
          <p className="text-[11px] text-[#166534] mt-1">Seluruh sensor membaca dalam rentang wajar dan stabil.</p>
        </div>
      )}

      <AIInsightBlock
        insight={insight}
        loading={loading}
        onRegenerate={onRefreshInsight}
      />
    </div>
  );
};

export default AnomalyModule;
