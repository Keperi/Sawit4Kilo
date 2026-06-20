import React, { useContext, useState } from 'react';
import { SensorContext } from '../context/SensorContext';
import Header from '../components/layout/Header';
import ThresholdGlobalPanel from '../components/device/ThresholdGlobalPanel';
import NodeCard from '../components/device/NodeCard';
import NodeDetailSidebar from '../components/device/NodeDetailSidebar';

const DevicePage = ({ setActivePage, onOpenSidebar }) => {
  const { systemStatus, nodes } = useContext(SensorContext);
  const [selectedNodeDetail, setSelectedNodeDetail] = useState(null);

  const handleNodeClick = (node) => {
    setSelectedNodeDetail(node);
  };

  const handleCloseSidebar = () => {
    setSelectedNodeDetail(null);
  };

  const handleNavigateToHistory = (nodeId) => {
    setActivePage('reports');
  };

  const activeNode = selectedNodeDetail
    ? nodes.find((n) => n.id === selectedNodeDetail.id) || selectedNodeDetail
    : null;

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] overflow-hidden">
      <Header
        title="Device"
        systemStatus={systemStatus}
        onOpenSidebar={onOpenSidebar}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="bg-white rounded-[16px] border border-[#EAECF0] p-4 md:p-6 flex flex-col gap-[18px] min-h-full">
          <ThresholdGlobalPanel />

          <div>
            <div className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#B9C8D7] mb-3">
              Node Terdaftar
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nodes.map((node) => (
                <NodeCard key={node.id} node={node} onClick={handleNodeClick} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {activeNode && (
        <NodeDetailSidebar
          node={activeNode}
          onClose={handleCloseSidebar}
          onNavigateToHistory={handleNavigateToHistory}
        />
      )}
    </div>
  );
};

export default DevicePage;
