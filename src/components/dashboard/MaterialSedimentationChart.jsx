import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  ReferenceLine
} from 'recharts';

// Dummy data: last 7 days of TDS changes. Positive means sediment accumulation/pollution, Negative means effective neutralization/sedimentation
const data = [
  { day: 'Sen', delta: -120 },
  { day: 'Sel', delta: -85 },
  { day: 'Rab', delta: -140 },
  { day: 'Kam', delta: 45 },
  { day: 'Jum', delta: -105 },
  { day: 'Sab', delta: -60 },
  { day: 'Min', delta: -110 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const val = payload[0].value;
  const isPositive = val > 0;
  
  return (
    <div className="bg-white rounded-lg p-3 border border-[#EAECF0] shadow-sm flex flex-col gap-1 min-w-[120px]">
      <span className="text-[11px] font-medium text-[#667085] uppercase">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-[14px] font-bold ${isPositive ? 'text-[#FF4628]' : 'text-[#F59E0B]'}`}>
          {isPositive ? '+' : ''}{val} ppm
        </span>
      </div>
      <span className="text-[10px] text-[#98A2B3]">
        {isPositive ? 'Akumulasi material (pekat)' : 'Pengendapan efektif'}
      </span>
    </div>
  );
};

const MaterialSedimentationChart = () => {
  return (
    <div className="bg-white rounded-[12px] border border-[#EAECF0] p-5 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-[14px] font-bold text-[#101828] leading-none">
          Tren Akumulasi Padatan Terlarut
        </h3>
        <p className="text-[12px] text-[#98A2B3] mt-1.5 leading-tight">
          Laju Pengendapan Material (Delta TDS Harian)
        </p>
      </div>

      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#667085' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#667085' }} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
            <ReferenceLine y={0} stroke="#EAECF0" strokeWidth={1.5} />
            <Bar dataKey="delta" barSize={12} radius={[4, 4, 4, 4]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.delta > 0 ? '#FF4628' : '#F59E0B'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MaterialSedimentationChart;
