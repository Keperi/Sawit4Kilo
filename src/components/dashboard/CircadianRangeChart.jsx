import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Dummy data: 14 days of min/max pH values to simulate circadian fluctuation
const data = [
  { day: '01/06', range: [6.1, 7.2] },
  { day: '02/06', range: [6.0, 7.5] },
  { day: '03/06', range: [6.2, 7.3] },
  { day: '04/06', range: [6.1, 7.6] },
  { day: '05/06', range: [6.3, 7.8] },
  { day: '06/06', range: [6.0, 7.1] },
  { day: '07/06', range: [5.9, 7.0] },
  { day: '08/06', range: [6.1, 7.2] },
  { day: '09/06', range: [6.4, 7.9] },
  { day: '10/06', range: [6.2, 7.6] },
  { day: '11/06', range: [6.3, 7.8] },
  { day: '12/06', range: [6.1, 7.5] },
  { day: '13/06', range: [6.0, 7.4] },
  { day: '14/06', range: [6.2, 7.6] },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const range = payload[0].value; // [low, high]
  
  return (
    <div className="bg-white rounded-[8px] p-3 shadow-md border border-[#EAECF0] min-w-[140px]">
      <p className="text-[11px] text-[#667085] mb-2">{label}</p>
      <div className="flex items-center justify-between gap-4 mb-1">
        <span className="text-[11px] font-medium text-[#98A2B3]">pH Tertinggi</span>
        <span className="text-[13px] font-bold text-[#101828]">{range[1]}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-[11px] font-medium text-[#98A2B3]">pH Terendah</span>
        <span className="text-[13px] font-bold text-[#101828]">{range[0]}</span>
      </div>
      <div className="mt-2 pt-2 border-t border-[#F2F4F7] flex items-center justify-between">
         <span className="text-[10px] font-medium text-[#667085]">Fluktuasi</span>
         <span className="text-[11px] font-bold text-[#3B82F6]">{(range[1] - range[0]).toFixed(1)}</span>
      </div>
    </div>
  );
};

const CircadianRangeChart = () => {
  return (
    <div className="bg-white rounded-[12px] border border-[#EAECF0] p-5 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-[14px] font-bold text-[#101828] leading-none">
          Fluktuasi Diurnal
        </h3>
        <p className="text-[12px] text-[#98A2B3] mt-1.5 leading-tight">
          Rentang pH (14 Hari Terakhir)
        </p>
      </div>

      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#667085' }} 
              dy={10}
              interval={2}
            />
            <YAxis 
              domain={[4, 10]}
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#667085' }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="range" 
              stroke="#3B82F6" 
              fill="#3B82F6" 
              strokeWidth={2}
              fillOpacity={0.1} 
              activeDot={{ r: 4, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CircadianRangeChart;
