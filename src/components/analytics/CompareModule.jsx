import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { AlertTriangle, CheckCircle, BarChart02 } from '@untitledui/icons';
import AIInsightBlock from './AIInsightBlock';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg px-3 py-2 border border-[#EAECF0] shadow-md text-[11px] flex flex-col gap-1.5">
      <div className="text-[#667085] font-semibold mb-0.5">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="font-medium text-[#475467]">{entry.name}:</span>
          <span className="font-bold text-[#101828]">
            {entry.value?.toFixed?.(1) ?? entry.value}
            {entry.name === 'TDS' ? ' ppm' : ''}
          </span>
        </div>
      ))}
    </div>
  );
};

const CompareModule = ({ nodeStats, insight, loading, onRefreshInsight }) => {
  if (!nodeStats?.length) return null;

  const chartData = nodeStats.map((n) => ({
    name: n.nodeId,
    pH: parseFloat(n.ph.mean.toFixed(1)),
    TDS: Math.round(n.tds.mean),
  }));

  const worstNode = nodeStats.reduce((worst, n) =>
    (n.dangerCount > worst.dangerCount) ? n : worst
  );
  const bestNode = nodeStats.reduce((best, n) =>
    (n.dangerCount < best.dangerCount) ? n : best
  );

  return (
    <div className="bg-white border border-[#EAECF0] rounded-[16px] p-6 shadow-xs hover:shadow-md hover:border-[#D0D5DD] transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[#FF4628]/10 flex items-center justify-center text-[#FF4628] shrink-0">
          <BarChart02 size={18} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-[#101828]">Perbandingan antar Node</h3>
          <p className="text-[12px] text-[#475467] mt-0.5">Analisis komparatif performa setiap node</p>
        </div>
      </div>

      {/* Worst / Best Nodes Widgets */}
      <div className="grid grid-cols-2 gap-3.5 mb-5">
        <div className="bg-gradient-to-br from-[#FFF5F5] to-[#FFEBEB] border border-[#FEE2E2] rounded-[10px] p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#D92D20] mb-1">
            <AlertTriangle size={12} className="text-[#D92D20]" />
            Paling Bermasalah
          </div>
          <div className="text-[18px] font-extrabold text-[#101828]">{worstNode.nodeId}</div>
          <div className="text-[11px] font-medium text-[#667085] mt-0.5">{worstNode.dangerCount} kejadian BAHAYA</div>
        </div>

        <div className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#D1FADF] rounded-[10px] p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#15803D] mb-1">
            <CheckCircle size={12} className="text-[#15803D]" />
            Paling Stabil
          </div>
          <div className="text-[18px] font-extrabold text-[#101828]">{bestNode.nodeId}</div>
          <div className="text-[11px] font-medium text-[#667085] mt-0.5">{bestNode.dangerCount} kejadian BAHAYA</div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="overflow-x-auto mb-5 border border-[#F2F4F7] rounded-[8px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-[#EAECF0]">
              <th className="py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider text-[#475467]">Node</th>
              <th className="py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider text-[#475467]">Rata-rata pH</th>
              <th className="py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider text-[#475467]">Rata-rata TDS</th>
              <th className="py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider text-[#475467]">BAHAYA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2F4F7]">
            {nodeStats.map((n, i) => (
              <tr key={i} className="hover:bg-[#F9FAFB] transition-colors duration-150">
                <td className="py-2.5 px-3">
                  <span className="inline-block bg-[#F2F4F7] text-[#344054] text-[11px] font-bold px-2 py-0.5 rounded-[4px]">
                    {n.nodeId}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-[13px] font-mono font-semibold text-[#101828]">{n.ph.mean.toFixed(1)}</td>
                <td className="py-2.5 px-3 text-[13px] font-mono font-semibold text-[#101828]">{Math.round(n.tds.mean)} ppm</td>
                <td className="py-2.5 px-3">
                  <span className={`text-[13px] font-bold ${n.dangerCount > 0 ? 'text-[#D92D20]' : 'text-[#15803D]'}`}>
                    {n.dangerCount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div style={{ height: 210 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 35, left: -22, bottom: 0 }} barGap={4}>
            <defs>
              <linearGradient id="phBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF4628" stopOpacity={1} />
                <stop offset="100%" stopColor="#FF8A75" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="tdsBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(241,245,249,0.8)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="transparent"
              tick={{ fontSize: 11, fill: '#475467', fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="transparent"
              tick={{ fontSize: 10, fill: '#667085' }}
              tickLine={false}
              axisLine={false}
              domain={[0, 14]}
              width={35}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="transparent"
              tick={{ fontSize: 10, fill: '#3B82F6' }}
              tickLine={false}
              axisLine={false}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(242, 244, 247, 0.4)' }} />
            <Bar yAxisId="left" dataKey="pH" name="pH" fill="url(#phBarGrad)" radius={[4, 4, 0, 0]} barSize={10} />
            <Bar yAxisId="right" dataKey="TDS" name="TDS" fill="url(#tdsBarGrad)" radius={[4, 4, 0, 0]} barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center gap-4 mt-3 mb-2 justify-center">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF4628]" />
          <span className="text-[11px] font-semibold text-[#475467]">pH</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3B82F6]" />
          <span className="text-[11px] font-semibold text-[#475467]">TDS (ppm)</span>
        </div>
      </div>

      <AIInsightBlock
        insight={insight}
        loading={loading}
        onRegenerate={onRefreshInsight}
      />
    </div>
  );
};

export default CompareModule;
