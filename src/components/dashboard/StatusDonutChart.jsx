import React, { useMemo, memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../ui/Card';

const StatusDonutChart = memo(({ data }) => {
  const chartData = useMemo(() => {
    let amanCount = 0;
    let asamCount = 0;

    data.forEach(item => {
      if (item.status === 'AMAN') amanCount++;
      else asamCount++;
    });

    return [
      { name: 'Aman', value: amanCount, color: '#16A34A' },
      { name: 'Bahaya', value: asamCount, color: '#FF4628' }, // Red Orange
    ].filter(item => item.value > 0);
  }, [data]);

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const amanPct = total > 0
    ? Math.round((chartData.find(d => d.name === 'Aman')?.value || 0) / total * 100)
    : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#B9C8D7]/30 rounded-[8px] px-3 py-2 text-[12px] shadow-sm">
          <p className="font-bold text-[#202020] mb-1">{payload[0].name}</p>
          <p className="font-bold" style={{ color: payload[0].payload.color }}>
            {payload[0].value} log ({Math.round(payload[0].value / total * 100)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full flex flex-col border border-[#B9C8D7]/30 shadow-none">
      <div className="px-4 pt-4">
        <h3 className="text-[13px] font-bold text-[#202020]">Distribusi status</h3>
        <p className="text-[11px] font-normal text-[#B9C8D7] mt-[2px]">{total} log total dianalisis</p>
      </div>

      {/* Donut Chart */}
      <div className="relative flex items-center justify-center flex-1 min-h-[160px] py-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              stroke="none"
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[22px] font-bold text-[#202020] leading-none">{amanPct}%</span>
          <span className="text-[11px] font-normal text-[#B9C8D7] mt-[2px]">Aman</span>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-4 flex justify-center gap-[14px]">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1 text-[11px] font-normal text-[#B9C8D7]">
            <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            {entry.name} {Math.round(entry.value / total * 100)}%
          </div>
        ))}
      </div>
    </Card>
  );
});

StatusDonutChart.displayName = 'StatusDonutChart';
export default StatusDonutChart;
