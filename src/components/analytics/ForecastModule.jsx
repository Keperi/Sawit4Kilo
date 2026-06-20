import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { BarChart02, AlertCircle } from '@untitledui/icons';
import AIInsightBlock from './AIInsightBlock';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg px-3 py-2 border border-[#EAECF0] shadow-md text-[11px] flex flex-col gap-1.5">
      <div className="text-[#667085] font-semibold mb-0.5">{label}</div>
      {payload.map((entry, i) => {
        const isForecast = entry.payload.type === 'forecast';
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-medium text-[#475467]">
              {entry.name} {isForecast ? '(Prediksi)' : '(Aktual)'}:
            </span>
            <span className="font-bold text-[#101828]">
              {entry.value?.toFixed?.(1) ?? entry.value}
              {entry.name === 'TDS' ? ' ppm' : ''}
            </span>
          </div>
        );
      })}
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

const ForecastModule = ({ historicalData, forecastData, threshold, insight, loading, onRefreshInsight }) => {
  const combinedData = [
    ...historicalData.map((d) => ({ ...d, type: 'actual' })),
    ...forecastData.map((d) => ({ ...d, type: 'forecast' })),
  ];

  return (
    <div className="bg-white border border-[#EAECF0] rounded-[16px] p-6 shadow-xs hover:shadow-md hover:border-[#D0D5DD] transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-[#FF4628]/10 flex items-center justify-center text-[#FF4628] shrink-0">
          <BarChart02 size={18} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-[#101828]">Prediksi Sederhana</h3>
          <p className="text-[12px] text-[#475467] mt-0.5">Proyeksi tren berdasarkan regresi linear</p>
        </div>
      </div>

      {/* Warning Box */}
      <div className="bg-[#FFFBEB] border border-[#FEF08A] rounded-[10px] p-4 mb-5 flex items-start gap-3 shadow-3xs">
        <AlertCircle size={16} className="text-[#B45309] shrink-0 mt-0.5" />
        <p className="text-[11.5px] font-medium text-[#B45309] leading-relaxed">
          <strong className="font-bold">Estimasi Statistik:</strong> Grafik di bawah merupakan proyeksi regresi linear sederhana untuk kebutuhan estimasi operasional dan tidak menjamin nilai riil di lapangan.
        </p>
      </div>

      {/* Chart */}
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={combinedData} margin={{ top: 10, right: 35, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="phForecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF4628" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#FF4628" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tdsForecastGrad" x1="0" y1="0" x2="0" y2="1">
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
            {threshold && (
              <ReferenceLine
                yAxisId="left"
                y={threshold}
                stroke="#D92D20"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                strokeOpacity={0.7}
                label={{ value: `pH ${threshold} (Batas)`, position: 'insideRight', fontSize: 10, fill: '#D92D20', fontWeight: 600, offset: 10 }}
              />
            )}
            
            {/* Actual Areas */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="ph"
              name="pH"
              stroke="#FF4628"
              strokeWidth={2.5}
              fill="url(#phForecastGrad)"
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
              fill="url(#tdsForecastGrad)"
              dot={false}
              activeDot={<CustomActiveDot />}
            />

            {/* Forecast Lines (Dashed Overlay) */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey={(d) => d.type === 'forecast' ? d.ph : null}
              stroke="#FF4628"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey={(d) => d.type === 'forecast' ? d.tds : null}
              stroke="#3B82F6"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-3 mb-2 justify-center">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF4628]" />
          <span className="text-[11px] font-semibold text-[#475467]">pH</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3B82F6]" />
          <span className="text-[11px] font-semibold text-[#475467]">TDS (ppm)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 border-t-2 border-dashed border-[#667085]" />
          <span className="text-[11px] font-semibold text-[#475467]">Proyeksi</span>
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
