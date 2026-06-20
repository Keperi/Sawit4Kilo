import React, { useContext } from 'react';
import { SensorContext } from '../../context/SensorContext';
import { Droplets01, ActivityHeart } from '@untitledui/icons';
import MetricCard from './MetricCard';

const MetricCardSelector = () => {
  const {
    currentPh,
    currentTds,
    isPhAlert,
    isTdsAlert,
    activeSensor,
    setActiveSensor
  } = useContext(SensorContext);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        onClick={() => setActiveSensor(activeSensor === 'PH' ? 'ALL' : 'PH')}
        className={`cursor-pointer transition-all duration-300 rounded-2xl ${
          activeSensor === 'PH' ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]' : 'hover:scale-[1.01]'
        }`}
      >
        <MetricCard
          title="Rata-rata pH"
          value={currentPh}
          unit=""
          trend="+0.2"
          trendUp={true}
          icon={Droplets01}
          iconColor="text-blue-500"
          isAlert={isPhAlert}
        />
      </div>

      <div 
        onClick={() => setActiveSensor(activeSensor === 'TDS' ? 'ALL' : 'TDS')}
        className={`cursor-pointer transition-all duration-300 rounded-2xl ${
          activeSensor === 'TDS' ? 'ring-2 ring-kideco-orange shadow-lg scale-[1.02]' : 'hover:scale-[1.01]'
        }`}
      >
        <MetricCard
          title="Rata-rata TDS"
          value={currentTds}
          unit="ppm"
          trend="-15"
          trendUp={false}
          icon={ActivityHeart}
          iconColor="text-kideco-orange"
          isAlert={isTdsAlert}
        />
      </div>
    </div>
  );
};

export default MetricCardSelector;
