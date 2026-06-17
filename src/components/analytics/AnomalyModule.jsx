import React from 'react';
import { AlertTriangle, AlertCircle } from '@untitledui/icons';
import AIInsightBlock from './AIInsightBlock';

const AnomalyModule = ({ anomalies, insight, loading, onRefreshInsight }) => {
  const severityColors = {
    'Berat': 'bg-[#FF4628]/10 text-[#FF4628]',
    'Sedang': 'bg-[#F59E0B]/10 text-[#F59E0B]',
    'Ringan': 'bg-[#3B82F6]/10 text-[#3B82F6]',
  };

  return (
    <div className="bg-white border border-[#EAECF0] rounded-[12px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-bold text-[#202020]">Deteksi Anomali</h3>
          <p className="text-[12px] text-[#8C9BAF] mt-0.5">Kejadian penyimpangan dari pola normal</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#8C9BAF]">Ditemukan:</span>
          <span className={`text-[14px] font-bold ${anomalies?.length > 0 ? 'text-[#FF4628]' : 'text-[#16A34A]'}`}>
            {anomalies?.length || 0} anomali
          </span>
        </div>
      </div>

      {anomalies?.length > 0 ? (
        <div className="max-h-[300px] overflow-y-auto mb-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#EAECF0]">
                <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7]">Waktu</th>
                <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7]">pH</th>
                <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7]">TDS</th>
                <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7]">Jenis</th>
                <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7]">Tingkat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7]">
              {anomalies.map((a, i) => (
                <tr key={i} className="hover:bg-[#F7F8FA]">
                  <td className="py-2.5 px-3 text-[12px] text-[#8C9BAF]">{a.time}</td>
                  <td className={`py-2.5 px-3 text-[12px] font-mono font-semibold ${a.ph < 4.5 ? 'text-[#FF4628]' : 'text-[#202020]'}`}>
                    {a.ph.toFixed(1)}
                  </td>
                  <td className={`py-2.5 px-3 text-[12px] font-mono font-semibold ${a.tds > 800 ? 'text-[#FF4628]' : 'text-[#202020]'}`}>
                    {a.tds}
                  </td>
                  <td className="py-2.5 px-3 text-[12px] text-[#8C9BAF]">{a.type}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${severityColors[a.severity]}`}>
                      {a.severity === 'Berat' ? <AlertCircle size={10} /> : <AlertTriangle size={10} />}
                      {a.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-[8px] p-4 text-center mb-4">
          <span className="text-[13px] text-[#166534]">Tidak ada anomali terdeteksi pada periode ini</span>
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
