import React, { memo } from 'react';
import { Circle } from '@untitledui/icons';

const StatusBar = memo(({ selectedNode, lastTimestamp, systemStatus }) => {
  const isDanger = systemStatus === 'BAHAYA';
  const isOffline = systemStatus === 'OFFLINE';

  const statusColorClass = isOffline
    ? 'text-[#667085]'
    : isDanger
    ? 'text-[#FF4628]'
    : 'text-[#16A34A]';

  const dotColorClass = isOffline
    ? 'text-[#98A2B3]'
    : isDanger
    ? 'text-[#FF4628]'
    : 'text-[#16A34A]';

  const statusMsg = isOffline
    ? `Node ${selectedNode} terputus (Offline) · Terakhir terupdate ${lastTimestamp}`
    : `Node ${selectedNode} terhubung · Tersinkronisasi · ${lastTimestamp}`;

  return (
    <div
      id="status-bar"
      className="h-[36px] bg-white border-t border-[#EAECF0] flex items-center justify-between px-3 sm:px-6 shrink-0"
    >
      <div className={`flex items-center gap-[5px] text-[11px] ${statusColorClass} min-w-0`}>
        <Circle size={13} fill="currentColor" strokeWidth={0} className={`${dotColorClass} shrink-0`} />
        <span className="truncate">{statusMsg}</span>
      </div>
      <div className="text-[11px] text-[#9BA3AE] hidden sm:block shrink-0">
        Interval: 1 detik · ISA-101
      </div>
    </div>
  );
});

StatusBar.displayName = 'StatusBar';
export default StatusBar;
