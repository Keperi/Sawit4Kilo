import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
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

const TrendModule = ({ data, correlation, insight, loading, onRegenerate, onRefreshInsight }) => {
  const correlationLabel = correlation > 0.5 ? 'kuat, berbanding lurus' :
                           correlation < -0.5 ? 'kuat, berbanding terbalik' :
                           Math.abs(correlation) > 0.3 ? 'sedang' : 'lemah';

  return (
    <div className="bg-white border border-[#EAECF0] rounded-[12px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-bold text-[#202020]">Tren & Korelasi pH vs TDS</h3>
          <p className="text-[12px] text-[#8C9BAF] mt-0.5">Visualisasi tren dan hubungan kedua parameter</p>
        </div>
        {correlation !== undefined && (
          <div className="text-right">
            <div className="text-[11px] text-[#B9C8D7]">Korelasi Pearson</div>
            <div className="text-[14px] font-mono font-bold text-[#202020]">{correlation.toFixed(2)}</div>
            <div className="text-[10px] text-[#8C9BAF]">{correlationLabel}</div>
          </div>
        )}
      </div>

      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 50, left: -10, bottom: 0 }}>
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
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="ph"
              name="pH"
              stroke="#FF4628"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="tds"
              name="TDS"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
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

export default TrendModule;
