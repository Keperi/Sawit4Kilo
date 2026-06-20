import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { BarChart02 } from '@untitledui/icons';
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

const CustomActiveDot = (props) => {
  const { cx, cy, stroke } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill={stroke}
      stroke="#ffffff"
      strokeWidth={2}
      className="shadow-sm"
    />
  );
};

const TrendModule = ({ data, correlation, insight, loading, onRegenerate, onRefreshInsight }) => {
  const correlationLabel = correlation > 0.5 ? 'kuat, berbanding lurus' :
                           correlation < -0.5 ? 'kuat, berbanding terbalik' :
                           Math.abs(correlation) > 0.3 ? 'sedang' : 'lemah';

  return (
    <div className="bg-white border border-[#EAECF0] rounded-[16px] p-6 shadow-xs hover:shadow-md hover:border-[#D0D5DD] transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#FF4628]/10 flex items-center justify-center text-[#FF4628] shrink-0">
            <BarChart02 size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#101828]">Tren & Korelasi pH vs TDS</h3>
            <p className="text-[12px] text-[#475467] mt-0.5">Visualisasi tren dan hubungan kedua parameter</p>
          </div>
        </div>
        {correlation !== undefined && (
          <div className="flex items-center gap-3 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-1.5 rounded-[10px] shadow-3xs">
            <div className="text-left">
              <div className="text-[9px] font-bold uppercase tracking-wider text-[#667085] leading-none mb-1">Korelasi Pearson</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[15px] font-mono font-extrabold text-[#101828] leading-none">{correlation.toFixed(2)}</span>
                <span className={`text-[10px] font-bold leading-none ${
                  Math.abs(correlation) > 0.5 ? 'text-[#D92D20]' : 'text-[#475467]'
                }`}>({correlationLabel})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ height: 290 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 35, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="phTrendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF4628" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#FF4628" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tdsTrendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(241,245,249,0.8)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="transparent"
              tick={{ fontSize: 10, fill: '#667085' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v, i) => (i % 5 === 0 ? v : '')}
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
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="ph"
              name="pH"
              stroke="#FF4628"
              strokeWidth={2.5}
              fill="url(#phTrendGrad)"
              dot={false}
              activeDot={<CustomActiveDot />}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="tds"
              name="TDS"
              stroke="#3B82F6"
              strokeWidth={2.5}
              fill="url(#tdsTrendGrad)"
              dot={false}
              activeDot={<CustomActiveDot />}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
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

export default TrendModule;
