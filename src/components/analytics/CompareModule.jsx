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
import AIInsightBlock from './AIInsightBlock';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg px-3 py-2 border border-[#EAECF0] shadow-sm text-[11px]">
      <div className="text-[#98A2B3] mb-1">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="font-semibold text-[#101828]">
            {entry.name}: {entry.value?.toFixed?.(1) ?? entry.value}
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
    <div className="bg-white border border-[#EAECF0] rounded-[12px] p-5">
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-[#202020]">Perbandingan antar Node</h3>
        <p className="text-[12px] text-[#8C9BAF] mt-0.5">Analisis komparatif performa setiap node</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#FF4628]/5 border border-[#FF4628]/20 rounded-[8px] p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF4628] mb-1">Paling Bermasalah</div>
          <div className="text-[16px] font-bold text-[#202020]">{worstNode.nodeId}</div>
          <div className="text-[11px] text-[#8C9BAF]">{worstNode.dangerCount} kejadian BAHAYA</div>
        </div>
        <div className="bg-[#16A34A]/5 border border-[#16A34A]/20 rounded-[8px] p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#16A34A] mb-1">Paling Stabil</div>
          <div className="text-[16px] font-bold text-[#202020]">{bestNode.nodeId}</div>
          <div className="text-[11px] text-[#8C9BAF]">{bestNode.dangerCount} kejadian BAHAYA</div>
        </div>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#EAECF0]">
              <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7]">Node</th>
              <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7]">Rata-rata pH</th>
              <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7]">Rata-rata TDS</th>
              <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7]">Kejadian BAHAYA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2F4F7]">
            {nodeStats.map((n, i) => (
              <tr key={i} className="hover:bg-[#F7F8FA]">
                <td className="py-2.5 px-3 text-[13px] font-bold text-[#202020]">{n.nodeId}</td>
                <td className="py-2.5 px-3 text-[13px] font-mono text-[#202020]">{n.ph.mean.toFixed(1)}</td>
                <td className="py-2.5 px-3 text-[13px] font-mono text-[#202020]">{Math.round(n.tds.mean)} ppm</td>
                <td className="py-2.5 px-3">
                  <span className={`text-[13px] font-bold ${n.dangerCount > 0 ? 'text-[#FF4628]' : 'text-[#16A34A]'}`}>
                    {n.dangerCount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 50, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(241,245,249,0.8)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="transparent"
              tick={{ fontSize: 11, fill: '#98A2B3' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="transparent"
              tick={{ fontSize: 10, fill: '#98A2B3' }}
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
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="left" dataKey="pH" name="pH" fill="#FF4628" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="TDS" name="TDS (ppm)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-3 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF4628]" />
          <span className="text-[11px] text-[#8C9BAF]">pH</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
          <span className="text-[11px] text-[#8C9BAF]">TDS (ppm)</span>
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
