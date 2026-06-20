import React, { useContext, useState, useEffect, useCallback } from 'react';
import { SensorContext } from '../context/SensorContext';
import Header from '../components/layout/Header';
import AISummary from '../components/analytics/AISummary';
import TrendModule from '../components/analytics/TrendModule';
import StatsModule from '../components/analytics/StatsModule';
import AnomalyModule from '../components/analytics/AnomalyModule';
import CompareModule from '../components/analytics/CompareModule';
import ForecastModule from '../components/analytics/ForecastModule';
import {
  calculateMean,
  calculatePearsonCorrelation,
  detectAnomalies,
  linearRegression,
  generateStatsSummary,
} from '../utils/analytics';
import { getAIInsight, getActionPlan } from '../utils/groq';
import { BarChart02 } from '@untitledui/icons';

const AnalyticsPage = ({ onOpenSidebar }) => {
  const { systemStatus, historyData, nodes, phThresholdMin, tdsThreshold } = useContext(SensorContext);
  const [period, setPeriod] = useState('7d');
  const [selectedNode, setSelectedNode] = useState('ALL');

  const [summary, setSummary] = useState(null);
  const [trendInsight, setTrendInsight] = useState('');
  const [statsInsight, setStatsInsight] = useState('');
  const [anomalyInsight, setAnomalyInsight] = useState('');
  const [compareInsight, setCompareInsight] = useState('');
  const [forecastInsight, setForecastInsight] = useState('');

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingTrend, setLoadingTrend] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingAnomaly, setLoadingAnomaly] = useState(false);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [loadingForecast, setLoadingForecast] = useState(false);

  const filterDataByPeriod = useCallback((data, p) => {
    const now = new Date();
    let cutoff;
    switch (p) {
      case '24h': cutoff = new Date(now - 24 * 60 * 60 * 1000); break;
      case '30d': cutoff = new Date(now - 30 * 24 * 60 * 60 * 1000); break;
      default: cutoff = new Date(now - 7 * 24 * 60 * 60 * 1000);
    }
    return data.filter((d) => {
      const ts = new Date(d.timestamp || d.time);
      return ts >= cutoff;
    });
  }, []);

  const filteredData = filterDataByPeriod(historyData, period);
  const phValues = filteredData.map((d) => d.ph);
  const tdsValues = filteredData.map((d) => d.tds);
  const correlation = calculatePearsonCorrelation(phValues, tdsValues);
  const stats = generateStatsSummary(filteredData, phThresholdMin, 9.0, tdsThreshold);
  const anomalies = detectAnomalies(filteredData, phThresholdMin, 9.0, tdsThreshold);

  const chartData = filteredData.map((d) => ({
    time: d.timestamp?.slice(11, 16) || d.time,
    ph: d.ph,
    tds: d.tds,
  }));

  const nodeStats = nodes.map((node) => {
    const nodeData = filteredData.filter((d) => d.nodeId === node.id);
    return {
      nodeId: node.id,
      ...generateStatsSummary(nodeData.length ? nodeData : [{ ph: node.ph, tds: node.tds }], phThresholdMin, 9.0, tdsThreshold),
    };
  });

  const forecastData = (() => {
    if (chartData.length < 2) return [];
    const phReg = linearRegression(chartData.map((d) => d.ph));
    const tdsReg = linearRegression(chartData.map((d) => d.tds));
    const forecasts = [];
    for (let i = 1; i <= 10; i++) {
      const idx = chartData.length + i;
      forecasts.push({
        time: `+${i}`,
        ph: Math.max(0, Math.min(14, phReg.predict(idx))),
        tds: Math.max(0, tdsReg.predict(idx)),
        type: 'forecast',
      });
    }
    return forecasts;
  })();

  const generateFallbackSummaryText = () => {
    const periodLabel = period === '24h' ? '24 jam' : period === '7d' ? '7 hari' : '30 hari';
    const issues = [];
    if (stats.ph.mean < phThresholdMin) issues.push(`pH rata-rata ${stats.ph.mean.toFixed(2)} di bawah ambang aman`);
    if (stats.tds.mean > tdsThreshold) issues.push(`TDS rata-rata ${Math.round(stats.tds.mean)} ppm melebihi batas`);
    if (stats.dangerCount > 0) issues.push(`${stats.dangerCount} kejadian BAHAYA`);

    if (issues.length > 0) {
      return `Selama ${periodLabel} terakhir, terdapat ${issues.join(', ')}. Diperlukan perhatian lebih terhadap kualitas air di area tambang untuk mencegah dampak lingkungan yang lebih luas.`;
    }
    return `Selama ${periodLabel} terakhir, kualitas air dalam kondisi stabil. pH rata-rata ${stats.ph.mean.toFixed(2)} dan TDS rata-rata ${Math.round(stats.tds.mean)} ppm masih dalam batas aman.`;
  };

  const generateFallbackActions = () => {
    const actions = [];
    
    // Cari node yang saat ini berstatus BAHAYA
    const dangerNodes = nodes.filter((n) => {
      const isPhDanger = n.ph < phThresholdMin || n.ph > 9.0;
      const isTdsDanger = n.tds > tdsThreshold;
      return n.online && (isPhDanger || isTdsDanger);
    });

    if (dangerNodes.length > 0) {
      const nodeNames = dangerNodes.map((n) => n.name).join(', ');
      actions.push(`Lakukan pengecekan lapangan pada ${nodeNames} dengan status BAHAYA`);
    } else if (stats.dangerCount > 0) {
      actions.push('Lakukan pengecekan lapangan pada node dengan status BAHAYA');
    }

    if (stats.ph.mean < phThresholdMin) actions.push('Evaluasi sumber pencemaran asam');
    if (stats.tds.mean > tdsThreshold) actions.push('Periksa efektivitas sistem penanganan limbah');
    if (actions.length === 0) actions.push('Pertahankan kondisi monitoring saat ini');
    return actions.slice(0, 3);
  };

  const generateSummary = async () => {
    setLoadingSummary(true);
    const prompt = `Ringkasan kondisi kualitas air tambang KIDECO periode ${period === '24h' ? '24 jam' : period === '7d' ? '7 hari' : '30 hari'} terakhir.

Data: pH rata-rata ${stats.ph.mean.toFixed(2)}, TDS rata-rata ${Math.round(stats.tds.mean)} ppm, ${stats.dangerCount} kejadian BAHAYA dari ${stats.totalPoints} data.

Node: ${nodes.map((n) => `${n.id} (${n.online ? 'online' : 'offline'})`).join(', ')}.

Buat ringkasan 3-5 kalimat dalam Bahasa Indonesia yang menjelaskan kondisi keseluruhan, tren, dan rekomendasi tindak lanjut. Format JSON:
{
  "status": "AMAN/WASPADA/BAHAYA",
  "text": "paragraf ringkasan",
  "actionItems": ["item 1", "item 2"]
}`;

    try {
      const result = await getAIInsight({ ph: stats.ph.mean, tds: stats.tds.mean, nodeId: 'Semua Node', status: systemStatus, phMin: phThresholdMin, tdsMax: tdsThreshold });
      const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      try {
        setSummary(JSON.parse(cleaned));
      } catch {
        setSummary({
          status: systemStatus,
          text: result || generateFallbackSummaryText(),
          actionItems: generateFallbackActions(),
        });
      }
    } catch {
      setSummary({
        status: systemStatus,
        text: generateFallbackSummaryText(),
        actionItems: generateFallbackActions(),
      });
    }
    setLoadingSummary(false);
  };

  const generateModuleInsight = async (moduleName, prompt, setter, loadingSetter) => {
    loadingSetter(true);
    try {
      const result = await getAIInsight({
        ph: stats.ph.mean,
        tds: stats.tds.mean,
        nodeId: selectedNode === 'ALL' ? 'Semua Node' : selectedNode,
        status: systemStatus,
        phMin: phThresholdMin,
        tdsMax: tdsThreshold,
      });
      setter(result || generateModuleFallback(moduleName));
    } catch {
      setter(generateModuleFallback(moduleName));
    }
    loadingSetter(false);
  };

  const generateModuleFallback = (moduleName) => {
    switch (moduleName) {
      case 'trend':
        return `Korelasi pH-TDS: ${correlation.toFixed(2)}. ${correlation < -0.5 ? 'Terdapat korelasi kuat berbanding terbalik antara pH dan TDS.' : 'Hubungan antara pH dan TDS perlu dianalisis lebih lanjut.'}`;
      case 'stats':
        return `Rata-rata pH: ${stats.ph.mean.toFixed(2)}, TDS: ${Math.round(stats.tds.mean)} ppm. Standar deviasi pH: ${stats.ph.stdDev.toFixed(2)}.`;
      case 'anomaly':
        return `Ditemukan ${anomalies.length} anomali pada periode ini. ${anomalies.length > 0 ? 'Perlu perhatian khusus pada titik-titik anomali tersebut.' : 'Tidak ada anomali signifikan.'}`;
      case 'compare':
        return `Node ${nodeStats[0]?.nodeId || 'N/A'} memiliki rata-rata pH ${nodeStats[0]?.ph.mean.toFixed(1) || 0}, sedangkan ${nodeStats[1]?.nodeId || 'N/A'} ${nodeStats[1]?.ph.mean.toFixed(1) || 0}.`;
      case 'forecast':
        return `Berdasarkan tren linear, pH diperkirakan ${forecastData[0]?.ph.toFixed(1) || '-'} pada periode mendatang.`;
      default:
        return 'Insight tidak tersedia';
    }
  };

  useEffect(() => {
    generateSummary();
  }, [period, selectedNode]);

  const periodLabel = period === '24h' ? '24 Jam' : period === '7d' ? '7 Hari' : '30 Hari';
  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] overflow-hidden">
      <Header title="Analisis" systemStatus={systemStatus} onOpenSidebar={onOpenSidebar} />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="flex flex-col gap-6 min-h-full pb-8">

          {/* Filter Toolbar */}
          <div className="bg-white border border-[#EAECF0] rounded-[16px] p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs hover:border-[#D0D5DD] transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FF4628]/10 flex items-center justify-center text-[#FF4628] shrink-0">
                <BarChart02 size={18} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#101828]">Filter Analisis Kualitas Air</h4>
                <p className="text-[12px] text-[#475467] mt-0.5">Sesuaikan rentang waktu dan node pemantauan</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">Rentang Waktu</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="h-[36px] min-w-[130px] px-3 bg-white border border-[#EAECF0] rounded-[8px] text-[12px] font-bold text-[#344054] shadow-3xs cursor-pointer outline-none focus:border-[#FF4628] hover:bg-[#F9FAFB] transition-all"
                >
                  <option value="24h">24 Jam Terakhir</option>
                  <option value="7d">7 Hari Terakhir</option>
                  <option value="30d">30 Hari Terakhir</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">Node Pemantauan</label>
                <select
                  value={selectedNode}
                  onChange={(e) => setSelectedNode(e.target.value)}
                  className="h-[36px] min-w-[150px] px-3 bg-white border border-[#EAECF0] rounded-[8px] text-[12px] font-bold text-[#344054] shadow-3xs cursor-pointer outline-none focus:border-[#FF4628] hover:bg-[#F9FAFB] transition-all"
                >
                  <option value="ALL">Semua Node</option>
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>Node {n.id} ({n.location})</option>
                  ))}
                </select>
              </div>

              <div className="h-[36px] flex items-center bg-[#F2F4F7] border border-[#EAECF0] rounded-[8px] px-3.5 mt-5 shadow-3xs">
                <span className="text-[11px] font-bold text-[#475467]">
                  {filteredData.length} sampel data
                </span>
              </div>
            </div>
          </div>

          {/* AI Summary Banner */}
          <AISummary
            summary={summary}
            loading={loadingSummary}
            onRegenerate={generateSummary}
            period={period}
            onPeriodChange={setPeriod}
          />
          {/* Stacked Layout - 1 Column Full Width */}
          <div className="flex flex-col gap-6 w-full">
            
            {/* Module 1: Trend */}
            <TrendModule
              data={chartData}
              correlation={correlation}
              insight={trendInsight}
              loading={loadingTrend}
              onRegenerate={() => {}}
              onRefreshInsight={() => generateModuleInsight('trend', '', setTrendInsight, setLoadingTrend)}
            />

            {/* Module 5: Forecast */}
            <ForecastModule
              historicalData={chartData.slice(-20)}
              forecastData={forecastData}
              threshold={phThresholdMin}
              insight={forecastInsight}
              loading={loadingForecast}
              onRefreshInsight={() => generateModuleInsight('forecast', '', setForecastInsight, setLoadingForecast)}
            />

            {/* Module 2: Stats */}
            <StatsModule
              stats={stats}
              insight={statsInsight}
              loading={loadingStats}
              onRefreshInsight={() => generateModuleInsight('stats', '', setStatsInsight, setLoadingStats)}
            />

            {/* Module 3: Anomalies */}
            <AnomalyModule
              anomalies={anomalies}
              insight={anomalyInsight}
              loading={loadingAnomaly}
              onRefreshInsight={() => generateModuleInsight('anomaly', '', setAnomalyInsight, setLoadingAnomaly)}
            />

            {/* Module 4: Compare */}
            <CompareModule
              nodeStats={nodeStats}
              insight={compareInsight}
              loading={loadingCompare}
              onRefreshInsight={() => generateModuleInsight('compare', '', setCompareInsight, setLoadingCompare)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
