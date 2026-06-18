import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
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

const ForecastModule = ({ historicalData, forecastData, threshold, insight, loading, onRefreshInsight }) => {
  const combinedData = [
    ...historicalData.map((d) => ({ ...d, type: 'actual' })),
    ...forecastData.map((d) => ({ ...d, type: 'forecast' })),
  ];

  return (
    <div className="bg-white border border-[#EAECF0] rounded-[12px] p-5">
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-[#202020]">Prediksi Sederhana</h3>
        <p className="text-[12px] text-[#8C9BAF] mt-0.5">Proyeksi tren berdasarkan regresi linear</p>
      </div>

      <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-[8px] p-3 mb-4">
        <p className="text-[11px] text-[#92400E]">
          <strong className="font-semibold">Catatan:</strong> Ini adalah estimasi statistik, bukan prediksi pasti. Proyeksi berdasarkan tren historis dan dapat berubah.
        </p>
      </div>

      <div style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData} margin={{ top: 5, right: 50, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(241,245,249,0.8)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="transparent"
              tick={{ fontSize: 10, fill: '#98A2B3' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v, i) => (i % 5 === 0 ? v : '')}
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
            {threshold && (
              <ReferenceLine
                yAxisId="left"
                y={threshold}
                stroke="#F43F5E"
                strokeDasharray="4 3"
                strokeWidth={1}
                strokeOpacity={0.5}
                label={{ value: `pH ${threshold}`, position: 'right', fontSize: 10, fill: '#F43F5E' }}
              />
            )}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="ph"
              name="pH"
              stroke="#FF4628"
              strokeWidth={2}
              dot={false}
              strokeDasharray={(entry) => entry?.type === 'forecast' ? '5 5' : undefined}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="tds"
              name="TDS"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              strokeDasharray={(entry) => entry?.type === 'forecast' ? '5 5' : undefined}
            />
          </LineChart>
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
        <div className="flex items-center gap-1.5">
          <div className="w-4 border-t-2 border-dashed border-[#F43F5E]" />
          <span className="text-[11px] text-[#8C9BAF]">Proyeksi</span>
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

export default ForecastModule;
