import React, { useContext, useMemo, memo } from 'react';
import { SensorContext } from '../../context/SensorContext';

const timeAgo = (timestamp) => {
  const [datePart, timePart] = timestamp.split(' ');
  const now = new Date();
  const past = new Date(`${datePart}T${timePart}`);
  const diffMs = now - past;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'baru saja';
  if (diffMin < 60) return `${diffMin}m lalu`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}j lalu`;
  return `${Math.floor(diffH / 24)}h lalu`;
};

/** Orange gradient: higher pH = deeper orange */
const getCardStyle = (ph) => {
  if (ph >= 9.5)  return { bg: '#FF6D00', text: '#FFFFFF', subtext: 'rgba(255,255,255,0.75)', pill: 'rgba(0,0,0,0.18)' };
  if (ph >= 8.5)  return { bg: '#FF8C00', text: '#FFFFFF', subtext: 'rgba(255,255,255,0.75)', pill: 'rgba(0,0,0,0.15)' };
  if (ph >= 8.0)  return { bg: '#FFA726', text: '#FFFFFF', subtext: 'rgba(255,255,255,0.78)', pill: 'rgba(0,0,0,0.12)' };
  if (ph >= 7.5)  return { bg: '#FFBB45', text: '#5C3000', subtext: 'rgba(92,48,0,0.7)',  pill: 'rgba(255,255,255,0.45)' };
  if (ph >= 7.0)  return { bg: '#FFCC70', text: '#5C3000', subtext: 'rgba(92,48,0,0.65)', pill: 'rgba(255,255,255,0.45)' };
  if (ph >= 6.5)  return { bg: '#FFE0A0', text: '#6B4000', subtext: 'rgba(107,64,0,0.65)', pill: 'rgba(255,255,255,0.55)' };
  return            { bg: '#FFF3D8', text: '#7A5000', subtext: 'rgba(122,80,0,0.6)',  pill: 'rgba(255,255,255,0.6)' };
};

/**
 * CompactTopPeaks — Full-width card row.
 * Top 5 highest pH readings rendered as colored cards.
 * Higher pH = deeper orange. Placed ABOVE the bento grid.
 */
const CompactTopPeaks = memo(() => {
  const { historyData } = useContext(SensorContext);

  const topPeaks = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];
    return [...historyData]
      .sort((a, b) => b.ph - a.ph)
      .slice(0, 5);
  }, [historyData]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/50 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Top 5 Peak pH</span>
        <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">Hari Ini · Alkalinitas Tertinggi</span>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-5 gap-3 min-w-0">
        {topPeaks.length > 0 ? topPeaks.map((item, idx) => {
          const style = getCardStyle(item.ph);
          const barPct = Math.min(100, Math.round((item.ph / 14) * 100));
          return (
            <div
              key={`${item.id}-${idx}`}
              className="flex flex-col justify-between p-3 rounded-[10px] cursor-default transition-[filter] duration-200 hover:brightness-105 min-h-[110px]"
              style={{ backgroundColor: style.bg }}
            >
              {/* Top: Rank + Node */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black leading-none"
                  style={{ backgroundColor: style.pill, color: style.text }}
                >
                  #{idx + 1}
                </div>
                <div
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none"
                  style={{ backgroundColor: style.pill, color: style.text }}
                >
                  {item.nodeId}
                </div>
              </div>

              {/* Center: Big pH */}
              <div className="flex flex-col items-center justify-center py-1">
                <span
                  className="font-mono font-black text-[28px] tracking-tighter leading-none"
                  style={{ color: style.text }}
                >
                  {item.ph.toFixed(1)}
                </span>
                <span
                  className="text-[8px] font-semibold uppercase tracking-widest mt-0.5"
                  style={{ color: style.subtext }}
                >
                  pH
                </span>
              </div>

              {/* Bottom: micro-bar + time */}
              <div className="mt-2">
                <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.12)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${barPct}%`, backgroundColor: style.text === '#FFFFFF' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.2)' }}
                  />
                </div>
                <div
                  className="text-[9px] font-medium mt-1 text-right"
                  style={{ color: style.subtext }}
                >
                  {timeAgo(item.timestamp)}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-5 flex items-center justify-center py-8">
            <span className="text-[11px] text-slate-300">Belum ada data</span>
          </div>
        )}
      </div>
    </div>
  );
});

CompactTopPeaks.displayName = 'CompactTopPeaks';
export default CompactTopPeaks;
