import React from 'react';
import { BarChart02 } from '@untitledui/icons';
import AIInsightBlock from './AIInsightBlock';

const StatCard = ({ label, value, unit, color = '#101828', bg = 'bg-[#F9FAFB]' }) => (
  <div className={`${bg} border border-[#EAECF0] rounded-[10px] p-3.5 flex flex-col justify-between shadow-2xs hover:border-[#D0D5DD] transition-all`}>
    <div className="text-[9px] font-bold uppercase tracking-wider text-[#667085] mb-1.5 leading-tight">{label}</div>
    <div className="flex items-baseline gap-0.5">
      <span className="text-[17px] font-mono font-extrabold leading-none" style={{ color }}>{value}</span>
      {unit && <span className="text-[10px] font-bold text-[#667085] ml-0.5">{unit}</span>}
    </div>
  </div>
);

const StatsModule = ({ stats, insight, loading, onRefreshInsight }) => {
  if (!stats) return null;

  return (
    <div className="bg-white border border-[#EAECF0] rounded-[16px] p-6 shadow-xs hover:shadow-md hover:border-[#D0D5DD] transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[#FF4628]/10 flex items-center justify-center text-[#FF4628] shrink-0">
          <BarChart02 size={18} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-[#101828]">Statistik Ringkasan</h3>
          <p className="text-[12px] text-[#475467] mt-0.5">Ringkasan statistik parameter kualitas air</p>
        </div>
      </div>

      {/* pH Stats */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-1.5 h-3.5 rounded-full bg-[#FF4628]" />
          <span className="text-[11px] font-bold text-[#344054] uppercase tracking-wider">pH Parameter</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          <StatCard label="Rata-rata" value={stats.ph.mean.toFixed(2)} color="#101828" />
          <StatCard label="Min" value={stats.ph.min.toFixed(1)} color="#15803D" bg="bg-[#F0FDF4]" />
          <StatCard label="Max" value={stats.ph.max.toFixed(1)} color="#D92D20" bg="bg-[#FFF5F5]" />
          <StatCard label="Std Dev" value={stats.ph.stdDev.toFixed(2)} color="#475467" />
          <StatCard label="Bahaya" value={stats.dangerCount} unit="x" color={stats.dangerCount > 0 ? '#D92D20' : '#15803D'} bg={stats.dangerCount > 0 ? 'bg-[#FFF5F5]' : 'bg-[#F0FDF4]'} />
        </div>
      </div>

      {/* TDS Stats */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-1.5 h-3.5 rounded-full bg-[#3B82F6]" />
          <span className="text-[11px] font-bold text-[#344054] uppercase tracking-wider">TDS Parameter</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <StatCard label="Rata-rata" value={Math.round(stats.tds.mean)} unit="ppm" color="#101828" />
          <StatCard label="Min" value={Math.round(stats.tds.min)} unit="ppm" color="#15803D" bg="bg-[#F0FDF4]" />
          <StatCard label="Max" value={Math.round(stats.tds.max)} unit="ppm" color="#D92D20" bg="bg-[#FFF5F5]" />
          <StatCard label="Std Dev" value={Math.round(stats.tds.stdDev)} unit="ppm" color="#475467" />
        </div>
      </div>

      {/* Data Count */}
      <div className="bg-[#F9FAFB] border border-[#EAECF0] rounded-[10px] px-4 py-3 flex items-center justify-between shadow-2xs mb-4">
        <span className="text-[12px] font-semibold text-[#475467]">Total data dianalisis</span>
        <span className="text-[13px] font-bold text-[#101828] bg-white border border-[#EAECF0] px-2.5 py-1 rounded-[6px] shadow-3xs">
          {stats.totalPoints} sampel
        </span>
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
