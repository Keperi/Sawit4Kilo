import React, { useContext, useState } from 'react';
import { SensorContext } from '../context/SensorContext';
import Header from '../components/layout/Header';
import MetricCard from '../components/dashboard/MetricCard';
import TelemetryChartContainer from '../components/dashboard/TelemetryChartContainer';
import TopHighestPhCard from '../components/dashboard/TopHighestPhCard';
import RecentLogsTable from '../components/dashboard/RecentLogsTable';
import StatusBar from '../components/layout/StatusBar';
import AlertBanner from '../components/dashboard/AlertBanner';
import ActionModal from '../components/dashboard/ActionModal';

const DashboardPage = ({ setActivePage }) => {
  const {
    userState,
    systemStatus,
    selectedNode,
    setSelectedNode,
    currentPh,
    currentTds,
    isTdsAlert,
    lastTimestamp,
    historyData,
    phThresholdMin,
    phThresholdMax,
    tdsThreshold,
    nodes,
  } = useContext(SensorContext);

  const [showActionModal, setShowActionModal] = useState(false);

  const isDanger = systemStatus === 'BAHAYA';
  const isOffline = systemStatus === 'OFFLINE';
  const isLoading = !currentPh && !currentTds;

  const onlineNodesCount = nodes ? nodes.filter(n => n.online).length : 0;
  const totalNodesCount = nodes ? nodes.length : 2;

  const phVal = parseFloat(currentPh) || 0;
  let phBadgeType = isOffline ? 'offline' : 'safe';
  if (!isOffline) {
    if (phVal < phThresholdMin) phBadgeType = 'danger';
    else if (phVal > phThresholdMax) phBadgeType = 'warning';
  }

  const phBarCurrent = isOffline ? 0 : Math.round((phVal / 14) * 100);
  const phBarColor = isOffline ? 'bg-slate-300' :
    phBadgeType === 'danger' ? 'bg-[#FF4628]' :
    phBadgeType === 'warning' ? 'bg-[#F59E0B]' : 'bg-[#22C55E]';
  const phDelta = isOffline ? 'Offline' :
    phBadgeType === 'danger'
      ? `${(phThresholdMin - phVal).toFixed(2)} di bawah normal`
      : phBadgeType === 'warning'
      ? `${(phVal - phThresholdMax).toFixed(2)} di atas normal`
      : 'Dalam rentang normal';

  const tdsVal = parseFloat(currentTds) || 0;
  const tdsBarCurrent = isOffline ? 0 : Math.min(100, Math.round((tdsVal / 1500) * 100));
  const tdsBarColor = isOffline ? 'bg-slate-300' : isTdsAlert ? 'bg-[#FF4628]' : 'bg-[#22C55E]';
  const tdsDelta = isOffline ? 'Offline' : isTdsAlert
    ? `+${(tdsVal - tdsThreshold).toFixed(0)} ppm dari batas`
    : `${(tdsThreshold - tdsVal).toFixed(0)} ppm di bawah batas`;

  const sensorData = {
    ph: currentPh,
    tds: currentTds,
    nodeId: selectedNode,
    status: systemStatus,
    phMin: phThresholdMin,
    tdsMax: tdsThreshold,
    history: historyData,
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] overflow-hidden">
      <Header
        selectedNode={selectedNode}
        onNodeChange={setSelectedNode}
        systemStatus={systemStatus}
        userName={userState?.name}
        showNodeSelector
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="bg-white rounded-[16px] shadow-sm border border-[#EAECF0] p-4 md:p-6 flex flex-col gap-[18px] min-h-full">

          <AlertBanner
            message="Air asam terdeteksi"
            location={selectedNode}
            isDanger={isDanger}
            systemStatus={systemStatus}
            sensorData={sensorData}
            onAction={() => setShowActionModal(true)}
          />

          <div className="w-full">
            <TopHighestPhCard historyData={historyData} />
          </div>

          <div className="grid grid-cols-12 gap-[14px]">
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <MetricCard
                title="Nilai pH"
                value={isOffline ? '-' : currentPh}
                unit="pH"
                deltaText={phDelta}
                barCurrent={phBarCurrent}
                barColor={phBarColor}
                legendLeft="Low"
                legendRight="High"
                badgeType={phBadgeType}
                isLoading={isLoading}
                isBidirectional={!isOffline}
              />
            </div>

            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <MetricCard
                title="Nilai TDS"
                value={isOffline ? '-' : currentTds}
                unit="ppm"
                deltaText={tdsDelta}
                barCurrent={tdsBarCurrent}
                barColor={tdsBarColor}
                legendLeft="Terukur"
                legendRight="Batas aman"
                badgeType={isOffline ? 'offline' : (isTdsAlert ? 'warning' : 'safe')}
                isLoading={isLoading}
              />
            </div>

            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <MetricCard
                title="Node Aktif"
                value={String(onlineNodesCount).padStart(2, '0')}
                unit="node"
                deltaText={onlineNodesCount === totalNodesCount ? "Semua node online" : `${onlineNodesCount} dari ${totalNodesCount} online`}
                barCurrent={totalNodesCount > 0 ? Math.round((onlineNodesCount / totalNodesCount) * 100) : 0}
                barColor={onlineNodesCount === totalNodesCount ? 'bg-[#22C55E]' : onlineNodesCount > 0 ? 'bg-[#F59E0B]' : 'bg-[#FF4628]'}
                legendLeft="Online"
                legendRight="Total node"
                badgeType={onlineNodesCount === totalNodesCount ? 'safe' : onlineNodesCount > 0 ? 'warning' : 'danger'}
                isLoading={isLoading}
              />
            </div>

            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <MetricCard
                title="Status Sistem"
                value={isOffline ? 'OFFLINE' : isDanger ? 'KRITIS' : 'AMAN'}
                unit=""
                deltaText={isOffline ? 'Koneksi terputus' : isDanger ? 'Tindakan diperlukan' : 'Kualitas air baik'}
                barCurrent={isOffline ? 0 : isDanger ? 85 : 15}
                barColor={isOffline ? 'bg-slate-300' : isDanger ? 'bg-[#FF4628]' : 'bg-[#22C55E]'}
                legendLeft="Tingkat risiko"
                legendRight="Threshold"
                badgeType={isOffline ? 'offline' : isDanger ? 'danger' : 'safe'}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div className="w-full">
            <TelemetryChartContainer />
          </div>

          <div className="pb-2">
            <RecentLogsTable data={historyData} setActivePage={setActivePage} />
          </div>

        </div>
      </div>

      <StatusBar
        selectedNode={selectedNode}
        lastTimestamp={lastTimestamp}
        systemStatus={systemStatus}
      />

      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        sensorData={sensorData}
      />
    </div>
  );
};

export default DashboardPage;
