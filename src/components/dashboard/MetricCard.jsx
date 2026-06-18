import React, { memo } from 'react';

/**
 * MetricCard — redesigned with:
 *  - Title label (top-left)
 *  - Large bold value
 *  - Colored delta/status sub-text
 *  - Split progress bar  (current vs. reference threshold)
 *  - Legend row below bar
 *
 * Props:
 *  title        – card label
 *  value        – main displayed value (number or string)
 *  unit         – unit shown after value (optional)
 *  deltaText    – e.g. "+2.3 dari ambang batas" or "Melebihi ambang"
 *  barCurrent   – 0-100 percentage for left (active) portion of bar
 *  barColor     – tailwind bg class for active bar  e.g. "bg-[#FF4628]"
 *  legendLeft   – bottom-left legend label
 *  legendRight  – bottom-right legend label
 *  badgeType    – 'safe' | 'warning' | 'danger'  (controls delta text color)
 *  isLoading    – shows skeleton
 */
const MetricCard = memo(({
  title,
  value,
  unit,
  deltaText,
  barCurrent = 50,
  barColor = 'bg-[#22C55E]',
  legendLeft = 'Saat ini',
  legendRight = 'Ambang batas',
  badgeType = 'safe',
  isLoading = false,
  isBidirectional = false,
}) => {
  const deltaColor =
    badgeType === 'danger'
      ? 'text-[#FF4628]'
      : badgeType === 'warning'
      ? 'text-[#D97706]'
      : badgeType === 'offline'
      ? 'text-[#667085]'
      : 'text-[#16A34A]';

  const clampedBar = Math.min(100, Math.max(0, barCurrent));
  const remainingBar = 100 - clampedBar;

  return (
    <div className="bg-white rounded-[12px] border border-[#EAECF0] p-5 flex flex-col gap-4">

      {/* ── Title ── */}
      <p className="text-[11px] font-semibold text-[#98A2B3] uppercase tracking-[0.07em] leading-none">
        {title}
      </p>

      {/* ── Value + Delta ── */}
      <div className="flex items-end justify-between gap-2">
        {isLoading ? (
          <div className="animate-pulse bg-slate-100 h-10 w-24 rounded-lg" />
        ) : (
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="text-[36px] font-bold text-[#101828] tracking-tight leading-none">
              {value}
            </span>
            {unit && (
              <span className="text-[13px] font-medium text-[#98A2B3] mb-0.5">
                {unit}
              </span>
            )}
          </div>
        )}

        {deltaText && !isLoading && (
          <span className={`text-[11px] font-semibold ${deltaColor} text-right leading-tight max-w-[90px]`}>
            {deltaText}
          </span>
        )}
      </div>

      {/* ── Progress Bar ── */}
      <div className="flex flex-col gap-2">
        {isBidirectional ? (
          <div className="relative h-[6px] rounded-full w-full bg-gradient-to-r from-[#FF4628] via-[#22C55E] to-[#FF4628]">
             {/* Safe zone indicator markings could be added here, but gradient conveys it */}
             {/* The Pin */}
             <div 
               className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white border-[2px] border-[#101828] rounded-full shadow-sm transition-all duration-700 ease-out"
               style={{ left: `${clampedBar}%` }}
             />
          </div>
        ) : (
          <div className="flex h-[6px] rounded-full overflow-hidden bg-[#F2F4F7] gap-[2px]">
            {/* Active portion */}
            <div
              className={`${barColor} rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${clampedBar}%` }}
            />
            {/* Remaining portion */}
            {remainingBar > 0 && (
              <div
                className="bg-[#EAECF0] rounded-full"
                style={{ width: `${remainingBar}%` }}
              />
            )}
          </div>
        )}

        {/* ── Legend Row ── */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${isBidirectional ? 'bg-[#101828]' : barColor}`} />
            <span className="text-[10px] font-medium text-[#667085]">{legendLeft}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${isBidirectional ? 'bg-[#22C55E]' : 'bg-[#EAECF0]'}`} />
            <span className="text-[10px] font-medium text-[#667085]">{legendRight}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

MetricCard.displayName = 'MetricCard';
export default MetricCard;
