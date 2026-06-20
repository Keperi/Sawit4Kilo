import React, { useContext, useState, useCallback } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { SensorContext } from '../../context/SensorContext';

/* ─────────────────────────────────────────────
   Pill filter button — matches reference photo
───────────────────────────────────────────── */
const PillButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      px-3 py-[5px] rounded-[6px] text-[11px] font-semibold transition-all duration-200 cursor-pointer select-none
      ${active
        ? 'bg-[#101828] text-white shadow-sm'
        : 'bg-transparent text-[#667085] hover:text-[#101828] hover:bg-black/5'}
    `}
  >
    {label}
  </button>
);

/* ─────────────────────────────────────────────
   Custom Tooltip — matches the white design in photo
───────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label, filter, phThresholdMin }) => {
  if (!active || !payload || !payload.length) return null;

  const phEntry = payload.find((p) => p.dataKey === 'ph');
  const tdsEntry = payload.find((p) => p.dataKey === 'tds');
  const ph = phEntry?.value;
  const tds = tdsEntry?.value;

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '8px',
        padding: '10px 14px',
        border: '1px solid #EAECF0',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        minWidth: '160px',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      {/* Label/Time */}
      <div style={{ fontSize: '11px', color: '#98A2B3', fontWeight: 500, marginBottom: '2px' }}>
        {label}
      </div>

      {ph !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '4px', height: '24px', background: '#FF4628', borderRadius: '4px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', color: '#667085', lineHeight: 1 }}>pH Value</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#101828', lineHeight: 1.2 }}>{ph.toFixed(1)}</span>
          </div>
        </div>
      )}

      {tds !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '4px', height: '24px', background: '#3B82F6', borderRadius: '4px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', color: '#667085', lineHeight: 1 }}>TDS Value</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#101828', lineHeight: 1.2 }}>{tds} ppm</span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Custom vertical cursor — black line with triangles
───────────────────────────────────────────── */
const CustomCursor = (props) => {
  const { points, height, top = 0 } = props;
  if (!points || !points[0]) return null;
  const { x } = points[0];
  const bottom = top + height;
  return (
    <g>
      <line
        x1={x} y1={top}
        x2={x} y2={bottom}
        stroke="#101828"
        strokeWidth={1.5}
      />
      <polygon
        points={`${x-4},${top} ${x+4},${top} ${x},${top+6}`}
        fill="#101828"
      />
      <polygon
        points={`${x-4},${bottom} ${x+4},${bottom} ${x},${bottom-6}`}
        fill="#101828"
      />
    </g>
  );
};

/* ─────────────────────────────────────────────
   Custom Active Dot — black rounded square
───────────────────────────────────────────── */
const CustomActiveDot = (props) => {
  const { cx, cy } = props;
  return (
    <rect
      x={cx - 5}
      y={cy - 5}
      width={10}
      height={10}
      rx={3}
      fill="#101828"
      stroke="#ffffff"
      strokeWidth={1.5}
    />
  );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const TelemetryChartContainer = () => {
  const { chartData, phThresholdMin } = useContext(SensorContext);
  const [filter, setFilter] = useState('both'); // 'ph' | 'tds' | 'both'

  const showPh  = filter === 'ph'  || filter === 'both';
  const showTds = filter === 'tds' || filter === 'both';

  // Only show every 5th time label to avoid crowding
  const tickFormatter = useCallback((val, idx) => (idx % 10 === 0 ? val : ''), []);

  // Y-axis domains per mode
  const leftDomain  = filter === 'tds' ? ['dataMin - 50', 'dataMax + 50'] : [0, 14];
  const rightDomain = ['dataMin - 50', 'dataMax + 50'];

  return (
    <div className="w-full bg-white rounded-[12px] border border-[#EAECF0] p-4 sm:p-5 flex flex-col min-h-[260px] sm:min-h-[340px]">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-5 shrink-0 gap-3">
        <div>
          <p className="text-[14px] font-bold text-[#101828] leading-none">
            Grafik Tren Real-time
          </p>
          <p className="text-[12px] text-[#98A2B3] mt-1 leading-none">
            Data gateway ESP32 · interval 1 detik
          </p>
        </div>

        {/* Pill buttons — top right like reference photo */}
        <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#EAECF0] p-1 rounded-[8px]">
          <PillButton label="pH"       active={filter === 'ph'}   onClick={() => setFilter('ph')}   />
          <PillButton label="TDS"      active={filter === 'tds'}  onClick={() => setFilter('tds')}  />
          <PillButton label="Keduanya" active={filter === 'both'} onClick={() => setFilter('both')} />
        </div>
      </div>

      {/* ── Legend dots ── */}
      <div className="flex items-center gap-3 sm:gap-4 mb-3 shrink-0 flex-wrap">
        {showPh && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4628] inline-block" />
            <span className="text-[11px] font-medium text-[#667085]">pH (saat ini)</span>
          </div>
        )}
        {showTds && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] inline-block" />
            <span className="text-[11px] font-medium text-[#667085]">TDS (ppm)</span>
          </div>
        )}
        {showPh && (
          <div className="flex items-center gap-1.5">
            <span className="block w-5 border-t-2 border-dashed border-[#F43F5E] opacity-70" />
            <span className="text-[11px] font-medium text-[#667085]">Ambang pH</span>
          </div>
        )}
      </div>

      {/* ── Chart ── */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 6, right: filter === 'both' ? 50 : 4, left: -22, bottom: 0 }}
          >
            <defs>
              <linearGradient id="phGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="#FF4628" stopOpacity={0.18} />
                <stop offset="90%" stopColor="#FF4628" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="tdsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="90%" stopColor="#3B82F6" stopOpacity={0}    />
              </linearGradient>
            </defs>

            {/* Grid — horizontal only, muted translucent */}
            <CartesianGrid
              stroke="rgba(241, 245, 249, 0.8)"
              strokeDasharray="0"
              vertical={false}
            />

            {/* X Axis */}
            <XAxis
              dataKey="time"
              stroke="transparent"
              tick={{ fontSize: 10, fill: '#98A2B3' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={tickFormatter}
              interval={0}
            />

            {/* Left Y Axis (pH or TDS-only) */}
            <YAxis
              yAxisId="left"
              stroke="transparent"
              tick={{ fontSize: 10, fill: '#98A2B3' }}
              tickLine={false}
              axisLine={false}
              domain={leftDomain}
              tickFormatter={(v) => filter === 'tds' ? v : v.toFixed(1)}
              width={38}
            />

            {/* Right Y Axis for TDS when both shown */}
            {filter === 'both' && (
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="transparent"
                tick={{ fontSize: 10, fill: '#3B82F6' }}
                tickLine={false}
                axisLine={false}
                domain={rightDomain}
                width={46}
              />
            )}

            {/* pH threshold reference line */}
            {showPh && phThresholdMin && (
              <ReferenceLine
                yAxisId="left"
                y={phThresholdMin}
                stroke="#F43F5E"
                strokeDasharray="6 4"
                strokeWidth={1.5}
                strokeOpacity={0.6}
              />
            )}

            {/* Custom tooltip */}
            <Tooltip
              content={<CustomTooltip filter={filter} phThresholdMin={phThresholdMin} />}
              cursor={<CustomCursor />}
            />

            {/* ── pH Area ── */}
            {showPh && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="ph"
                name="pH"
                stroke="#FF4628"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#phGrad)"
                isAnimationActive={false}
                dot={false}
                activeDot={<CustomActiveDot />}
              />
            )}

            {/* ── TDS Area (single mode) ── */}
            {showTds && filter !== 'both' && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="tds"
                name="TDS"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#tdsGrad)"
                isAnimationActive={false}
                dot={false}
                activeDot={<CustomActiveDot />}
              />
            )}

            {/* ── TDS Line on right axis (both mode) ── */}
            {showTds && filter === 'both' && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="tds"
                name="TDS"
                stroke="#3B82F6"
                strokeWidth={2}
                isAnimationActive={false}
                dot={false}
                activeDot={<CustomActiveDot />}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TelemetryChartContainer;
