import React, { memo } from 'react';
import { Bell01, AlertTriangle, CheckCircle } from '@untitledui/icons';

const Header = memo(({
  selectedNode,
  onNodeChange,
  systemStatus,
  userName = 'Admin',
  title,
  subtitle,
  showNodeSelector = false,
  showStatusBadge = true,
}) => {
  const isDanger = systemStatus === 'BAHAYA';
  const isGreetingMode = !title;

  return (
    <header
      id="header-bar"
      className="bg-white border-b border-[#B9C8D7]/30 flex items-center justify-between px-6 py-4 shrink-0"
    >
      <div className="flex items-center gap-4">
        {isGreetingMode ? (
          <>
            <h2 className="text-[16px] font-bold text-[#202020] leading-tight">
              Welcome back, {userName?.split(' ')[0] || 'Admin'}!
            </h2>
            <p className="text-[12px] text-[#B9C8D7]">
              Monitoring KIDECO Mining Water Quality
            </p>
          </>
        ) : (
          <h1 className="text-[16px] font-bold text-[#202020]">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {showStatusBadge && systemStatus && (
          <div
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold
              ${isDanger
                ? 'bg-[#FF4628]/10 border-[#FF4628]/20 text-[#FF4628]'
                : 'bg-[#16A34A]/10 border-[#16A34A]/20 text-[#16A34A]'}
            `}
          >
            {isDanger ? (
              <AlertTriangle size={12} strokeWidth={2} />
            ) : (
              <CheckCircle size={12} strokeWidth={2} />
            )}
            {isDanger ? 'Bahaya' : 'Aman'}
          </div>
        )}

        {showNodeSelector && (
          <select
            id="node-selector"
            value={selectedNode}
            onChange={(e) => onNodeChange(e.target.value)}
            className="h-[32px] px-3 bg-white border border-[#EAECF0] rounded-[8px] text-[12px] font-medium text-[#202020] cursor-pointer outline-none transition-colors focus:border-[#FF4628]"
          >
            <option value="KDC01">KDC01</option>
            <option value="KDC02">KDC02</option>
          </select>
        )}

        <button className="relative w-[32px] h-[32px] rounded-[8px] bg-white border border-[#EAECF0] flex items-center justify-center cursor-pointer text-[#B9C8D7] transition-colors hover:bg-[#F7F8FA]">
          <Bell01 size={16} strokeWidth={1.5} />
          {isDanger && (
            <span className="absolute top-1.5 right-1.5 w-[5px] h-[5px] bg-[#FF4628] rounded-full" />
          )}
        </button>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;
