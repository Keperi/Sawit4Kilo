import React, { useMemo } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Droplets01, ActivityHeart } from '@untitledui/icons';

const WaterQualityTrendCard = ({ currentPh, currentTds, historyData }) => {
  const chartData = useMemo(() => {
    if (!historyData || historyData.length === 0) return { xAxis: [], phSeries: [], tdsSeries: [] };
    const recent = [...historyData].slice(0, 24).reverse();
    return {
      xAxis: recent.map(r => r.timestamp.split(' ')[1] || r.timestamp),
      phSeries: recent.map(r => r.ph),
      tdsSeries: recent.map(r => r.tds),
    };
  }, [historyData]);

  const isPhDanger = currentPh < 4.5 || currentPh > 9.0;
  const isTdsDanger = currentTds > 800;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      {/* Card Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Kualitas Air — 24 Jam Terakhir</h3>
        <p className="text-sm text-gray-500 mt-1">Tren parameter pH dan TDS kolam pengendap secara historis</p>

        {/* Metric Summary Boxes */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* pH Box */}
          <div className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${isPhDanger ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPhDanger ? 'bg-red-100' : 'bg-emerald-100'}`}>
              <Droplets size={18} strokeWidth={2} className={isPhDanger ? 'text-red-500' : 'text-emerald-600'} />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Level pH</div>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold leading-none ${isPhDanger ? 'text-red-500' : 'text-gray-900'}`}>{currentPh}</span>
                <span className="text-xs text-gray-400 font-medium">pH</span>
              </div>
            </div>
          </div>

          {/* TDS Box */}
          <div className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${isTdsDanger ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isTdsDanger ? 'bg-red-100' : 'bg-blue-100'}`}>
              <Activity size={18} strokeWidth={2} className={isTdsDanger ? 'text-red-500' : 'text-blue-600'} />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Zat Terlarut</div>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold leading-none ${isTdsDanger ? 'text-red-500' : 'text-gray-900'}`}>{currentTds}</span>
                <span className="text-xs text-gray-400 font-medium">ppm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MUI Line Chart */}
      <div className="flex-1 px-5 pb-5 pt-2" style={{ minHeight: '220px', width: '100%' }}>
        {chartData.xAxis.length > 0 ? (
          <LineChart
            xAxis={[{
              data: Array.from({ length: chartData.xAxis.length }, (_, i) => i),
              valueFormatter: (value) => chartData.xAxis[value] || '',
              tickLabelStyle: { fontSize: 10, fontFamily: 'Inter, sans-serif', fill: '#9CA3AF' },
              disableLine: true,
              disableTicks: true,
            }]}
            yAxis={[
              {
                id: 'phAxis',
                min: 0,
                max: 14,
                tickLabelStyle: { fontSize: 10, fontFamily: 'Inter, sans-serif', fill: '#9CA3AF' },
              },
              {
                id: 'tdsAxis',
                min: 0,
                max: 1200,
                tickLabelStyle: { fontSize: 10, fontFamily: 'Inter, sans-serif', fill: '#9CA3AF' },
              }
            ]}
            rightAxis="tdsAxis"
            series={[
              {
                id: 'series-ph',
                data: chartData.phSeries,
                label: 'pH Level',
                yAxisKey: 'phAxis',
                color: '#3B82F6',
                showMark: false,
                curve: 'catmullRom',
              },
              {
                id: 'series-tds',
                data: chartData.tdsSeries,
                label: 'TDS (ppm)',
                yAxisKey: 'tdsAxis',
                color: '#FF8C00',
                showMark: false,
                curve: 'catmullRom',
              }
            ]}
            margin={{ top: 16, bottom: 32, left: 40, right: 48 }}
            sx={{
              '& .MuiChartsAxis-tickLabel': { fontFamily: 'Inter, sans-serif !important' },
              '& .MuiChartsAxis-line': { stroke: '#F3F4F6' },
              '& .MuiChartsAxis-tick': { stroke: '#F3F4F6' },
              '& .MuiChartsGrid-line': { stroke: '#F9FAFB', strokeDasharray: '4 4' },
              '& .MuiChartsLegend-label': { fontFamily: 'Inter, sans-serif !important', fontSize: '11px !important' },
              '& .MuiChartsTooltip-root': {
                borderRadius: '12px !important',
                border: '1px solid #F3F4F6 !important',
                boxShadow: '0px 4px 20px rgba(0,0,0,0.04) !important',
              },
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-sm text-gray-400">Memuat data 24 jam...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterQualityTrendCard;
