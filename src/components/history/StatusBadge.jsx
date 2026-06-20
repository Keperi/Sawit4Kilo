import React, { memo } from 'react';

const StatusBadge = memo(({ status, className = '' }) => {
  let badgeClasses = 'bg-[#F7F8FA] text-[#B9C8D7] border border-[#EAECF0]';
  let label = status;

  if (status === 'AMAN') {
    badgeClasses = 'bg-[#DCFCE7] text-[#166534]';
    label = 'Aman';
  } else if (status === 'ASAM' || status === 'BAHAYA' || status === 'KRITIS') {
    badgeClasses = 'bg-[#FF4628]/10 text-[#FF4628]';
    label = 'Bahaya';
  } else if (status === 'BASA' || status === 'WARNING') {
    badgeClasses = 'bg-[#FEF3C7] text-[#92400E]';
    label = 'Warning';
  } else if (status === 'ONLINE') {
    badgeClasses = 'bg-[#DCFCE7] text-[#166534]';
    label = 'Online';
  } else if (status === 'OFFLINE') {
    badgeClasses = 'bg-[#F7F8FA] text-[#B9C8D7] border border-[#EAECF0]';
    label = 'Offline';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wide ${badgeClasses} ${className}`}
    >
      {label}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';
export default StatusBadge;
