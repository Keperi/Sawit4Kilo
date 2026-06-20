import React, { useContext } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';
import { SensorContext } from '../../context/SensorContext';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const ph = payload[0].payload.ph;
  const tds = payload[0].payload.tds;
  
  return (
    <div className="bg-[#101828] rounded-[8px] p-3 shadow-lg min-w-[130px] border border-[#344054]">
      <p className="text-[10px] text-[#98A2B3] uppercase tracking-wider mb-2">Koordinat Log</p>
      <div className="flex justify-between items-center gap-4 mb-1">
        <span className="text-[11px] font-semibold text-[#10B981]">pH</span>
        <span className="text-[13px] font-bold text-white">{ph}</span>
      </div>
      <div className="flex justify-between items-center gap-4">
        <span className="text-[11px] font-semibold text-[#10B981]">TDS</span>
        <span className="text-[13px] font-bold text-white">{tds} <span className="text-[10px] text-[#98A2B3] font-normal">ppm</span></span>
      </div>
    </div>
  );
};

const SweetSpotScatterChart = () => {
  const { historyData } = useContext(SensorContext);
  
  // Transform historyData for scatter plot
  const scatterData = historyData.map(log => ({
    ph: log.ph,
    tds: log.tds,
    id: log.id
  }));

  // Define the "Sweet Spot" safe zone based on requirements:
  // pH ideal: 6.5 - 8.5
  // TDS ideal: 200 - 500
  const SAFE_PH_MIN = 6.5;
  const SAFE_PH_MAX = 8.5;
  const SAFE_TDS_MIN = 200;
  const SAFE_TDS_MAX = 500;

  return (
    <div className="bg-white rounded-[12px] border border-[#EAECF0] p-5 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-[14px] font-bold text-[#101828] leading-none">
          pH vs TDS Sweet Spot
        </h3>
        <p className="text-[12px] text-[#98A2B3] mt-1.5 leading-tight">
          Sebaran Kualitas Ekosistem
        </p>
      </div>

      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F7" />
            <XAxis 
              type="number" 
              dataKey="ph" 
              name="pH" 
              domain={[2, 12]} 
              tickCount={6}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#667085' }}
              dy={10}
            />
            <YAxis 
              type="number" 
              dataKey="tds" 
              name="TDS" 
              domain={[0, 1500]}
              tickCount={6}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#667085' }}
            />
            
            {/* Safe Zone Reference Area */}
            <ReferenceArea 
              x1={SAFE_PH_MIN} 
              x2={SAFE_PH_MAX} 
              y1={SAFE_TDS_MIN} 
              y2={SAFE_TDS_MAX} 
              fill="#10B981" 
              fillOpacity={0.15} 
              strokeOpacity={0}
            />

            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            
            <Scatter 
              name="Log Data" 
              data={scatterData} 
              fill="#10B981" 
              fillOpacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-3 flex items-center justify-center gap-2">
        <div className="w-3 h-3 bg-[#10B981] opacity-15 rounded-sm border border-[#10B981]"></div>
        <span className="text-[10px] font-medium text-[#667085]">Zona Ideal (Sweet Spot)</span>
      </div>
    </div>
  );
};

export default SweetSpotScatterChart;
