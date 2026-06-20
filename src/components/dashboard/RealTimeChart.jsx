import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
} from 'recharts';

const RealTimeChart = ({ chartData, phThresholdMin, tdsThresholdMax }) => {
  const [activeMetric, setActiveMetric] = useState('ph');

  const isPh = activeMetric === 'ph';

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 border border-kideco-border h-full flex flex-col">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-sans text-[16px] font-bold text-kideco-primary-text">
            Progress Overview
          </h3>
          <p className="font-sans text-[12px] text-kideco-secondary-text mt-1">
            Your sensor monitoring activity and trends.
          </p>
        </div>

        {/* Filters/Toggles */}
        <div className="flex gap-2">
          <select 
            value={activeMetric}
            onChange={(e) => setActiveMetric(e.target.value)}
            className="bg-white border border-kideco-border rounded-lg px-3 py-1.5 text-[12px] font-sans font-medium text-kideco-primary-text shadow-sm focus:outline-none cursor-pointer"
          >
            <option value="ph">Nilai pH</option>
            <option value="tds">Nilai TDS</option>
          </select>
          <select className="bg-white border border-kideco-border rounded-lg px-3 py-1.5 text-[12px] font-sans font-medium text-kideco-primary-text shadow-sm focus:outline-none cursor-pointer">
            <option>Real-time</option>
            <option>1 Jam Terakhir</option>
          </select>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF8A00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF8A00" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              horizontal={true}
              stroke="#F1F5F9"
            />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: '"DM Sans", sans-serif' }}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />

            <YAxis
              domain={isPh ? [0, 14] : [0, 2000]}
              tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: '"DM Sans", sans-serif' }}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />

            {/* Threshold Reference Line */}
            <ReferenceLine
              y={isPh ? phThresholdMin : tdsThresholdMax}
              stroke="#F43F5E"
              strokeDasharray="6 4"
              strokeOpacity={0.5}
            />

            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
              }}
              labelStyle={{
                fontWeight: 600,
                color: '#0F172A',
                marginBottom: '4px'
              }}
            />

            <Area
              type="monotone"
              dataKey={isPh ? 'ph' : 'tds'}
              stroke="#FF8A00"
              strokeWidth={3}
              fill="url(#areaColor)"
              isAnimationActive={false}
              name={isPh ? 'pH' : 'TDS (ppm)'}
              dot={{ r: 0 }}
              activeDot={{ r: 6, fill: '#FF8A00', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealTimeChart;
