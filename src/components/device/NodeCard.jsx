import React, { useContext } from 'react';
import { SensorContext } from '../../context/SensorContext';
import { Server03 } from '@untitledui/icons';
import Badge from '../ui/Badge';

const NodeCard = ({ node, onClick }) => {
  const { getNodeStatus } = useContext(SensorContext);
  const status = getNodeStatus(node);

  const isStale = node.online && (Date.now() - new Date(node.lastUpdate).getTime()) > 30000;
  const dotColor = !node.online
    ? 'bg-[#D1D5DB]'
    : isStale
    ? 'bg-[#F59E0B]'
    : 'bg-[#16A34A]';
  const showPing = node.online && !isStale;

  return (
    <button
      onClick={() => onClick(node)}
      className="w-full bg-white rounded-[10px] border border-[#EAECF0] p-4 cursor-pointer hover:border-[#B9C8D7]/60 transition-all duration-200 text-left"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-[36px] h-[36px] rounded-[8px] bg-[#F7F8FA] border border-[#EAECF0] flex items-center justify-center shrink-0">
            <Server03 size={18} strokeWidth={1.5} className="text-[#8C9BAF]" />
          </div>
          <div>
            <div className="text-[14px] font-bold text-[#202020] leading-tight">{node.name}</div>
            <div className="text-[11px] text-[#B9C8D7] mt-[2px]">{node.location}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {showPing && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-60" />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
          </span>
          <Badge variant={status === 'AMAN' ? 'safe' : status === 'BAHAYA' ? 'danger' : 'gray'} dot>
            {status}
          </Badge>
        </div>
      </div>

      <div className="border-t border-[#EAECF0] pt-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7] mb-1">pH</div>
            <div className="font-mono font-bold text-[20px] text-[#202020] leading-none">
              {node.ph.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#B9C8D7] mb-1">TDS</div>
            <div className="font-mono font-bold text-[20px] text-[#202020] leading-none">
              {node.tds}
              <span className="text-[11px] font-normal text-[#B9C8D7] ml-1">ppm</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default NodeCard;
