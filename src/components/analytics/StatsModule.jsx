import React from 'react';
import AIInsightBlock from './AIInsightBlock';

const StatCard = ({ label, value, unit, color = '#202020' }) => (
  <div className="bg-[#F7F8FA] border border-[#EAECF0] rounded-[8px] p-3 text-center">
    <div className="text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7] mb-1">{label}</div>
    <div className="text-[18px] font-mono font-bold" style={{ color }}>{value}</div>
    {unit && <div className="text-[10px] text-[#B9C8D7]">{unit}</div>}
  </div>
);

const StatsModule = ({ stats, insight, loading, onRefreshInsight }) => {
  if (!stats) return null;

  return (
    <div className="bg-white border border-[#EAECF0] rounded-[12px] p-5">
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-[#202020]">Statistik Ringkasan</h3>
        <p className="text-[12px] text-[#8C9BAF] mt-0.5">Ringkasan statistik parameter kualitas air</p>
      </div>

      <div className="mb-4">
        <div className="text-[11px] font-bold text-[#B9C8D7] mb-2 uppercase tracking-wider">pH</div>
        <div className="grid grid-cols-5 gap-2">
          <StatCard label="Rata-rata" value={stats.ph.mean.toFixed(2)} color="#202020" />
          <StatCard label="Min" value={stats.ph.min.toFixed(1)} color="#16A34A" />
          <StatCard label="Max" value={stats.ph.max.toFixed(1)} color="#FF4628" />
          <StatCard label="Std Dev" value={stats.ph.stdDev.toFixed(2)} color="#8C9BAF" />
          <StatCard label="Status" value={stats.dangerCount} unit="BAHAYA" color="#FF4628" />
        </div>
      </div>

      <div className="mb-4">
        <div className="text-[11px] font-bold text-[#B9C8D7] mb-2 uppercase tracking-wider">TDS</div>
        <div className="grid grid-cols-4 gap-2">
          <StatCard label="Rata-rata" value={Math.round(stats.tds.mean)} unit="ppm" color="#202020" />
          <StatCard label="Min" value={Math.round(stats.tds.min)} unit="ppm" color="#16A34A" />
          <StatCard label="Max" value={Math.round(stats.tds.max)} unit="ppm" color="#FF4628" />
          <StatCard label="Std Dev" value={Math.round(stats.tds.stdDev)} unit="ppm" color="#8C9BAF" />
        </div>
      </div>

      <div className="bg-[#F7F8FA] border border-[#EAECF0] rounded-[8px] p-3 flex items-center justify-between">
        <span className="text-[12px] text-[#8C9BAF]">Total data dianalisis</span>
        <span className="text-[14px] font-bold text-[#202020]">{stats.totalPoints} titik</span>
      </div>

      <AIInsightBlock
        insight={insight}
        loading={loading}
        onRegenerate={onRefreshInsight}
      />
    </div>
  );
};

export default StatsModule;
