import React, { memo } from 'react';
import StatusBadge from '../history/StatusBadge';

const RecentLogsTable = memo(({ data, setActivePage }) => {
  const recentData = data.slice(0, 6);

  return (
    <div className="bg-white border border-[#B9C8D7]/30 rounded-[10px]">
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-[14px] border-b border-[#B9C8D7]/30">
        <div>
          <h3 className="text-[13px] font-bold text-[#202020] leading-tight">Log status terakhir</h3>
          <p className="text-[12px] font-normal text-[#B9C8D7] mt-[2px]">{recentData.length} entri terbaru dari sensor aktif</p>
        </div>
        <button
          className="text-[12px] font-bold text-[#B9C8D7] hover:text-[#202020] transition-colors"
          onClick={() => setActivePage && setActivePage('reports')}
        >
          Lihat semua
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F5F5F5] border-b border-[#B9C8D7]/30">
              {['ID Node', 'Waktu', 'Nilai pH', 'Nilai TDS', 'Status'].map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#B9C8D7] whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#B9C8D7]/30">
            {recentData.map((row, idx) => {
              const isPhDanger = row.ph < 4.5 || row.ph > 9.0;
              const isTdsDanger = row.tds > 800;
              const isRowDanger = row.status !== 'AMAN';

              return (
                <tr
                  key={row.id || idx}
                  className={`
                    transition-colors duration-100 hover:bg-[#F5F5F5] cursor-default
                    ${isRowDanger ? 'bg-[#FF4628]/5' : ''}
                  `}
                >
                  {/* Node ID */}
                  <td className="px-4 py-[10px] text-[12px] font-bold text-[#202020] whitespace-nowrap">
                    {row.nodeId}
                  </td>

                  {/* Timestamp */}
                  <td className="px-4 py-[10px] text-[12px] font-normal text-[#B9C8D7]">
                    {row.timestamp}
                  </td>

                  {/* pH */}
                  <td className="px-4 py-[10px]">
                    <span className={`text-[12px] font-bold ${isPhDanger ? 'text-[#FF4628]' : 'text-[#16A34A]'}`}>
                      {row.ph.toFixed(2)}
                    </span>
                  </td>

                  {/* TDS */}
                  <td className="px-4 py-[10px]">
                    <span className={`text-[12px] font-bold ${isTdsDanger ? 'text-[#D97706]' : 'text-[#202020]'}`}>
                      {row.tds} <span className="text-[11px] text-[#B9C8D7] font-normal">ppm</span>
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-[10px]">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

RecentLogsTable.displayName = 'RecentLogsTable';
export default RecentLogsTable;
