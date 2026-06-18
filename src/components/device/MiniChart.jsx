import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white rounded-lg px-3 py-2 border border-[#EAECF0] shadow-sm text-[11px]">
      <div className="text-[#98A2B3] mb-1">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="font-semibold text-[#101828]">
          {entry.value?.toFixed?.(1) ?? entry.value} {entry.dataKey === 'ph' ? 'pH' : 'ppm'}
        </div>
      ))}
    </div>
  );
};

const MiniChart = ({ data, dataKey, color, threshold, label }) => {
  return (
    <div className="w-full" style={{ height: 100 }}>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[10px] font-medium text-[#98A2B3]">{label}</span>
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="90%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(241,245,249,0.8)" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="transparent"
            tick={{ fontSize: 9, fill: '#98A2B3' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v, i) => (i % 5 === 0 ? v : '')}
            interval={0}
          />
          <YAxis
            stroke="transparent"
            tick={{ fontSize: 9, fill: '#98A2B3' }}
            tickLine={false}
            axisLine={false}
            domain={dataKey === 'ph' ? [0, 14] : ['dataMin - 50', 'dataMax + 50']}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          {threshold !== undefined && (
            <ReferenceLine
              y={threshold}
              stroke="#F43F5E"
              strokeDasharray="4 3"
              strokeWidth={1}
              strokeOpacity={0.5}
            />
          )}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={1.5}
            fillOpacity={1}
            fill={`url(#grad-${dataKey})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniChart;
