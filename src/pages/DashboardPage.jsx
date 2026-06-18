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
    tdsThreshold,
  } = useContext(SensorContext);

  const [showActionModal, setShowActionModal] = useState(false);

  const isDanger = systemStatus === 'BAHAYA';
  const isLoading = !currentPh && !currentTds;

  const phVal = parseFloat(currentPh) || 0;
  let phBadgeType = 'safe';
  if (phVal < 6.5) phBadgeType = 'danger';
  else if (phVal > 8.5) phBadgeType = 'warning';

  const phBarCurrent = Math.round((phVal / 14) * 100);
  const phBarColor =
    phBadgeType === 'danger' ? 'bg-[#FF4628]' :
    phBadgeType === 'warning' ? 'bg-[#F59E0B]' : 'bg-[#22C55E]';
  const phDelta =
    phBadgeType === 'danger'
      ? `${(6.5 - phVal).toFixed(1)} di bawah normal`
      : phBadgeType === 'warning'
      ? `${(phVal - 8.5).toFixed(1)} di atas normal`
      : 'Dalam rentang normal';

  const tdsVal = parseFloat(currentTds) || 0;
  const tdsBarCurrent = Math.min(100, Math.round((tdsVal / 1500) * 100));
  const tdsBarColor = isTdsAlert ? 'bg-[#F59E0B]' : 'bg-[#22C55E]';
  const tdsDelta = isTdsAlert
    ? `+${(tdsVal - 500).toFixed(0)} ppm dari batas`
    : `${(500 - tdsVal).toFixed(0)} ppm di bawah batas`;

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
                value={currentPh}
                unit="pH"
                deltaText={phDelta}
                barCurrent={phBarCurrent}
                barColor={phBarColor}
                legendLeft="Low"
                legendRight="High"
                badgeType={phBadgeType}
                isLoading={isLoading}
                isBidirectional={true}
              />
            </div>

            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <MetricCard
                title="Nilai TDS"
                value={currentTds}
                unit="ppm"
                deltaText={tdsDelta}
                barCurrent={tdsBarCurrent}
                barColor={tdsBarColor}
                legendLeft="Terukur"
                legendRight="Batas aman"
                badgeType={isTdsAlert ? 'warning' : 'safe'}
                isLoading={isLoading}
              />
            </div>

            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <MetricCard
                title="Node Aktif"
                value="02"
                unit="node"
                deltaText="Semua node online"
                barCurrent={100}
                barColor="bg-[#22C55E]"
                legendLeft="Online"
                legendRight="Total node"
                badgeType="safe"
                isLoading={isLoading}
              />
            </div>

            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <MetricCard
                title="Status Sistem"
                value={isDanger ? 'KRITIS' : 'AMAN'}
                unit=""
                deltaText={isDanger ? 'Tindakan diperlukan' : 'Kualitas air baik'}
                barCurrent={isDanger ? 85 : 15}
                barColor={isDanger ? 'bg-[#FF4628]' : 'bg-[#22C55E]'}
                legendLeft="Tingkat risiko"
                legendRight="Threshold"
                badgeType={isDanger ? 'danger' : 'safe'}
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
