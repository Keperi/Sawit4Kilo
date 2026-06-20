import React from 'react';
import StatusBadge from './StatusBadge';

const LogDataTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse" style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr className="bg-[#F7F8FA] border-b border-[#EAECF0]">
            <th className="w-12 px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#B9C8D7]">No</th>
            <th className="w-24 px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#B9C8D7]">ID Node</th>
            <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#B9C8D7]">Waktu</th>
            <th className="w-24 px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#B9C8D7]">pH</th>
            <th className="w-28 px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#B9C8D7]">TDS</th>
            <th className="w-32 px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#B9C8D7]">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F2F4F7]">
          {data.map((row, index) => {
            const isPhDanger = row.ph < 4.5 || row.ph > 9.0;
            const isTdsDanger = row.tds > 800;
            const isRowDanger = row.status !== 'AMAN';

            return (
              <tr
                key={row.id || index}
                className={`transition-colors duration-100 hover:bg-[#F7F8FA] cursor-default ${isRowDanger ? 'bg-[#FF4628]/5' : ''}`}
              >
                <td className="px-6 py-3.5 text-[13px] text-[#B9C8D7] font-medium">{index + 1}</td>
                <td className="px-6 py-3.5 text-[13px] font-bold text-[#202020]">{row.nodeId}</td>
                <td className="px-6 py-3.5 text-[13px] text-[#8C9BAF] font-medium">{row.timestamp}</td>
                <td className={`px-6 py-3.5 text-[13px] font-bold ${isPhDanger ? 'text-[#FF4628]' : 'text-[#16A34A]'}`}>
                  {row.ph}
                </td>
                <td className={`px-6 py-3.5 text-[13px] font-bold ${isTdsDanger ? 'text-[#FF4628]' : 'text-[#16A34A]'}`}>
                  {row.tds}
                  <span className="ml-1 text-[11px] font-normal text-[#B9C8D7]">ppm</span>
                </td>
                <td className="px-6 py-3.5">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            );
          })}
          {data.length === 0 && (
            <tr>
              <td colSpan="6" className="px-6 py-16 text-center text-[13px] text-[#B9C8D7]">
                Tidak ada data log yang sesuai filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogDataTable;
