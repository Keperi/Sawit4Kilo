import React, { memo } from 'react';

/**
 * CompactStatusBlock — Left column (col-span-4) of the Bento Grid.
 * Groups pH and TDS live readings with bidirectional range-bar monitor.
 * Uses soft tint tokens for status colors (no solid saturated backgrounds).
 */
const CompactStatusBlock = memo(({
  currentPh,
  currentTds,
  isPhAlert,
  isTdsAlert,
  phThresholdMin,
  phThresholdMax,
  systemStatus,
  isLoading,
}) => {
  const phVal  = parseFloat(currentPh)  || 0;
  const tdsVal = parseFloat(currentTds) || 0;

  const isOffline = systemStatus === 'OFFLINE';

  // ── pH status ──────────────────────────────────────────────
  const phStatus = isOffline
    ? 'offline'
    : phVal < phThresholdMin
    ? 'danger'
    : phVal > phThresholdMax
    ? 'warning'
    : 'stable';

  // Pin position: map 0–14 → 0–100%
  const phPinPct = Math.min(100, Math.round((phVal / 14) * 100));
  // Safe zone bounds
  const phSafeLeft  = `${((phThresholdMin / 14) * 100).toFixed(1)}%`;
  const phSafeWidth = `${(((phThresholdMax - phThresholdMin) / 14) * 100).toFixed(1)}%`;

  // ── TDS status ─────────────────────────────────────────────
  const TDS_WARN  = 500;
  const TDS_LIMIT = 800;
  const TDS_MAX   = 1600;

  const tdsStatus = isOffline
    ? 'offline'
    : tdsVal > TDS_LIMIT
    ? 'danger'
    : tdsVal > TDS_WARN
    ? 'warning'
    : 'stable';

  const tdsPinPct       = Math.min(100, Math.round((tdsVal / TDS_MAX) * 100));
  const tdsSafeWidth    = `${((TDS_WARN / TDS_MAX) * 100).toFixed(1)}%`;

  // ── Status config (soft tints only) ────────────────────────
  const cfg = {
    danger:  { badge: 'bg-red-50/60 text-red-700',    dot: 'bg-red-500',    label: 'BAHAYA',  delta: 'text-red-600' },
    warning: { badge: 'bg-amber-50/60 text-amber-700', dot: 'bg-amber-500',  label: 'WASPADA', delta: 'text-amber-600' },
    stable:  { badge: 'bg-emerald-50/60 text-emerald-700', dot: 'bg-emerald-500', label: 'AMAN', delta: 'text-emerald-600' },
    offline: { badge: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400', label: 'OFFLINE', delta: 'text-slate-500' },
  };

  const sysCfg  = isOffline ? cfg.offline : systemStatus === 'BAHAYA' ? cfg.danger : cfg.stable;
  const phCfg   = cfg[phStatus];
  const tdsCfg  = cfg[tdsStatus];

  const phDelta = isOffline
    ? 'Perangkat tidak terhubung'
    : phStatus === 'danger'
    ? `−${(phThresholdMin - phVal).toFixed(2)} bawah ambang`
    : phStatus === 'warning'
    ? `+${(phVal - phThresholdMax).toFixed(2)} atas ambang`
    : 'Dalam rentang aman';

  const tdsDelta = isOffline
    ? 'Perangkat tidak terhubung'
    : tdsStatus === 'danger'
    ? `+${(tdsVal - TDS_LIMIT)} ppm melebihi batas`
    : tdsStatus === 'warning'
    ? `+${(tdsVal - TDS_WARN)} ppm zona waspada`
    : `${TDS_WARN - tdsVal} ppm headroom`;

  return (
    <div className="flex flex-col gap-3 h-full">

      {/* ── System Status Row ── */}
      <div className={`flex items-center justify-between px-3.5 py-2 rounded-xl border ${
        isOffline
          ? 'bg-slate-100 border-slate-200'
          : systemStatus === 'BAHAYA'
          ? 'bg-red-50/60 border-red-100'
          : 'bg-emerald-50/60 border-emerald-100'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${sysCfg.dot} ${!isOffline ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status Sistem</span>
        </div>
        <span className={`text-[11px] font-black uppercase tracking-widest ${
          isOffline ? 'text-slate-600' : systemStatus === 'BAHAYA' ? 'text-red-700' : 'text-emerald-700'
        }`}>
          {isOffline ? 'OFFLINE' : systemStatus === 'BAHAYA' ? 'BAHAYA' : 'NORMAL'}
        </span>
      </div>

      {/* ── pH Card ── */}
      <div className="bg-white rounded-xl border border-slate-200/50 shadow-sm p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nilai pH</span>
            {isLoading ? (
              <div className="animate-pulse bg-slate-100 h-10 w-20 rounded mt-1" />
            ) : (
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`font-mono font-bold text-[38px] tracking-tight leading-none ${isOffline ? 'text-slate-400' : 'text-slate-900'}`}>
                  {isOffline ? '-' : phVal.toFixed(1)}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">pH</span>
              </div>
            )}
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${phCfg.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${phCfg.dot}`} />
            {phCfg.label}
          </div>
        </div>

        {/* Range Bar */}
        <div>
          <div className="flex justify-between text-[9px] font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            <span>pH 0</span>
            <span>Aman {phThresholdMin}–{phThresholdMax}</span>
            <span>pH 14</span>
          </div>
          <div className="relative h-1.5 w-full bg-slate-100 rounded-full">
            {/* Safe zone */}
            <div
              className={`absolute top-0 h-full rounded-full ${isOffline ? 'bg-slate-200/50' : 'bg-emerald-200/70'}`}
              style={{ left: phSafeLeft, width: phSafeWidth }}
            />
            {/* Bidirectional pin */}
            {!isOffline && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-slate-900 border-2 border-white shadow-md transition-all duration-700 ease-out"
                style={{ left: `${phPinPct}%` }}
              />
            )}
          </div>
          <div className={`text-[10px] font-semibold mt-1.5 ${phCfg.delta}`}>{phDelta}</div>
        </div>
      </div>

      {/* ── TDS Card ── */}
      <div className="bg-white rounded-xl border border-slate-200/50 shadow-sm p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">TDS Terlarut</span>
            {isLoading ? (
              <div className="animate-pulse bg-slate-100 h-10 w-24 rounded mt-1" />
            ) : (
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`font-mono font-bold text-[38px] tracking-tight leading-none ${isOffline ? 'text-slate-400' : 'text-slate-900'}`}>
                  {isOffline ? '-' : tdsVal}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">ppm</span>
              </div>
            )}
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${tdsCfg.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${tdsCfg.dot}`} />
            {tdsCfg.label}
          </div>
        </div>

        {/* Range Bar */}
        <div>
          <div className="flex justify-between text-[9px] font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            <span>0</span>
            <span>Batas &lt;{TDS_LIMIT} ppm</span>
            <span>{TDS_MAX}</span>
          </div>
          <div className="relative h-1.5 w-full bg-slate-100 rounded-full">
            {/* Safe zone */}
            <div
              className={`absolute top-0 left-0 h-full rounded-full ${isOffline ? 'bg-slate-200/50' : 'bg-emerald-200/70'}`}
              style={{ width: tdsSafeWidth }}
            />
            {/* Pin */}
            {!isOffline && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-slate-900 border-2 border-white shadow-md transition-all duration-700 ease-out"
                style={{ left: `${tdsPinPct}%` }}
              />
            )}
          </div>
          <div className={`text-[10px] font-semibold mt-1.5 ${tdsCfg.delta}`}>{tdsDelta}</div>
        </div>
      </div>

    </div>
  );
});

CompactStatusBlock.displayName = 'CompactStatusBlock';
export default CompactStatusBlock;
