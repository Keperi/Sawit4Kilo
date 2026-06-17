import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';

export const SensorContext = createContext();

const generateInitialChartData = () => {
  const data = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    data.push({
      time: time.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      ph: parseFloat((Math.random() * 4 + 3).toFixed(1)),
      tds: Math.floor(Math.random() * 800 + 400),
    });
  }
  return data;
};

const formatTime = (date) => {
  return date.toLocaleTimeString('id-ID', { hour12: false });
};

const formatTimestamp = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
};

const getNodeStatus = (node, phThresholdMin, phThresholdMax, tdsThreshold) => {
  if (!node.online) return 'OFFLINE';
  const isPhDanger = node.ph < phThresholdMin || node.ph > phThresholdMax;
  const isTdsDanger = node.tds > tdsThreshold;
  return (isPhDanger || isTdsDanger) ? 'BAHAYA' : 'AMAN';
};

export const SensorProvider = ({ children }) => {
  const [userState] = useState({
    name: 'Admin KIDECO',
    role: 'Environment Engineer',
    sessionActive: true
  });
  
  const [activeSensor, setActiveSensor] = useState('ALL');
  const [audioToggleState, setAudioToggleState] = useState(false);
  const [allAlarmsMuted, setAllAlarmsMuted] = useState(false);
  const [buzzerActive, setBuzzerActive] = useState(false);

  const [phThresholdMin, setPhThresholdMin] = useState(() => {
    const saved = localStorage.getItem('KIDECO_PH_MIN');
    return saved ? parseFloat(saved) : 4.5;
  });
  const [phThresholdMax, setPhThresholdMax] = useState(() => {
    const saved = localStorage.getItem('KIDECO_PH_MAX');
    return saved ? parseFloat(saved) : 9.0;
  });
  const [tdsThreshold, setTdsThreshold] = useState(() => {
    const saved = localStorage.getItem('KIDECO_TDS_MAX');
    return saved ? parseFloat(saved) : 800;
  });

  const [currentPh, setCurrentPh] = useState(3.2);
  const [currentTds, setCurrentTds] = useState(1200);
  const [lastTimestamp, setLastTimestamp] = useState(formatTime(new Date()));

  const isPhAlert = currentPh < phThresholdMin || currentPh > phThresholdMax;
  const isTdsAlert = currentTds > tdsThreshold;
  const systemStatus = (isPhAlert || isTdsAlert) ? 'BAHAYA' : 'AMAN';

  const audioContextRef = useRef(null);

  const [chartData, setChartData] = useState(() => {
    const data = [];
    const now = new Date();
    for (let i = 60; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5000);
      data.push({
        time: formatTime(time),
        ph: parseFloat((Math.random() * 4 + 3).toFixed(1)),
        tds: Math.floor(Math.random() * 800 + 400),
      });
    }
    return data;
  });

  const [historyData] = useState([
    { id: 1, nodeId: 'KDC01', timestamp: '2026-06-09 21:30:05', ph: 6.2, tds: 310, status: 'AMAN' },
    { id: 2, nodeId: 'KDC01', timestamp: '2026-06-09 21:15:02', ph: 3.2, tds: 1200, status: 'ASAM' },
    { id: 3, nodeId: 'KDC02', timestamp: '2026-06-09 21:00:58', ph: 7.0, tds: 240, status: 'AMAN' },
    { id: 4, nodeId: 'KDC02', timestamp: '2026-06-09 20:45:11', ph: 4.1, tds: 870, status: 'ASAM' },
    { id: 5, nodeId: 'KDC01', timestamp: '2026-06-09 20:30:03', ph: 5.8, tds: 420, status: 'AMAN' },
    { id: 6, nodeId: 'KDC01', timestamp: '2026-06-09 20:15:07', ph: 3.8, tds: 950, status: 'ASAM' },
    { id: 7, nodeId: 'KDC02', timestamp: '2026-06-09 20:00:14', ph: 6.5, tds: 380, status: 'AMAN' },
    { id: 8, nodeId: 'KDC01', timestamp: '2026-06-09 19:45:22', ph: 4.3, tds: 810, status: 'ASAM' },
    { id: 9, nodeId: 'KDC02', timestamp: '2026-06-09 19:30:31', ph: 7.2, tds: 290, status: 'AMAN' },
    { id: 10, nodeId: 'KDC01', timestamp: '2026-06-09 19:15:45', ph: 5.5, tds: 520, status: 'AMAN' },
    { id: 11, nodeId: 'KDC02', timestamp: '2026-06-09 19:00:01', ph: 3.5, tds: 1100, status: 'ASAM' },
    { id: 12, nodeId: 'KDC01', timestamp: '2026-06-09 18:45:09', ph: 6.8, tds: 350, status: 'AMAN' },
    { id: 13, nodeId: 'KDC02', timestamp: '2026-06-09 18:30:18', ph: 4.0, tds: 920, status: 'ASAM' },
    { id: 14, nodeId: 'KDC01', timestamp: '2026-06-09 18:15:27', ph: 7.5, tds: 270, status: 'AMAN' },
    { id: 15, nodeId: 'KDC02', timestamp: '2026-06-09 18:00:33', ph: 5.0, tds: 680, status: 'AMAN' },
    { id: 16, nodeId: 'KDC01', timestamp: '2026-06-09 17:45:41', ph: 3.1, tds: 1300, status: 'ASAM' },
    { id: 17, nodeId: 'KDC02', timestamp: '2026-06-09 17:30:50', ph: 6.0, tds: 450, status: 'AMAN' },
    { id: 18, nodeId: 'KDC01', timestamp: '2026-06-09 17:15:59', ph: 4.4, tds: 830, status: 'ASAM' },
    { id: 19, nodeId: 'KDC02', timestamp: '2026-06-09 17:00:08', ph: 7.8, tds: 210, status: 'AMAN' },
    { id: 20, nodeId: 'KDC01', timestamp: '2026-06-09 16:45:16', ph: 5.3, tds: 560, status: 'AMAN' },
  ]);

  const [selectedNode, setSelectedNode] = useState('KDC01');

  const [nodes, setNodes] = useState([
    {
      id: 'KDC01',
      name: 'KDC01',
      location: 'Kolam Pengendap 1',
      online: true,
      ph: 3.2,
      tds: 1200,
      lastUpdate: new Date(),
      chartData: generateInitialChartData(),
    },
    {
      id: 'KDC02',
      name: 'KDC02',
      location: 'Kolam Pengendap 2',
      online: false,
      ph: 7.0,
      tds: 240,
      lastUpdate: new Date(Date.now() - 45000),
      chartData: generateInitialChartData(),
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = formatTime(now);

      setCurrentPh((prev) => {
        const change = Math.random() * 0.4 - 0.2;
        let next = parseFloat((prev + change).toFixed(1));
        if (next < 2.0) next = 2.0;
        if (next > 10.0) next = 10.0;
        return next;
      });

      setCurrentTds((prev) => {
        const change = Math.floor(Math.random() * 30 - 15);
        let next = prev + change;
        if (next < 100) next = 100;
        if (next > 1600) next = 1600;
        return next;
      });

      setLastTimestamp(timeStr);

      setChartData((prev) => {
        const newPoint = {
          time: timeStr,
          ph: parseFloat((currentPh + Math.random() * 0.2 - 0.1).toFixed(1)),
          tds: currentTds + Math.floor(Math.random() * 10 - 5),
        };
        const updated = [...prev, newPoint];
        return updated.length > 60 ? updated.slice(-60) : updated;
      });

      setNodes((prev) =>
        prev.map((node) => {
          const shouldGoOffline = node.id === 'KDC02' && Math.random() < 0.05;
          const shouldComeOnline = node.id === 'KDC02' && !node.online && Math.random() < 0.1;

          let newOnline = node.online;
          if (shouldGoOffline) newOnline = false;
          if (shouldComeOnline) newOnline = true;

          if (!newOnline) {
            return { ...node, online: false };
          }

          const phChange = Math.random() * 0.4 - 0.2;
          let newPh = parseFloat((node.ph + phChange).toFixed(1));
          if (newPh < 2.0) newPh = 2.0;
          if (newPh > 10.0) newPh = 10.0;

          const tdsChange = Math.floor(Math.random() * 30 - 15);
          let newTds = node.tds + tdsChange;
          if (newTds < 100) newTds = 100;
          if (newTds > 1600) newTds = 1600;

          const miniTime = now.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' });
          const newPoint = { time: miniTime, ph: newPh, tds: newTds };
          const updatedChart = [...node.chartData, newPoint];
          const trimmedChart = updatedChart.length > 30 ? updatedChart.slice(-30) : updatedChart;

          return {
            ...node,
            online: true,
            ph: newPh,
            tds: newTds,
            lastUpdate: now,
            chartData: trimmedChart,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPh, currentTds]);

  useEffect(() => {
    if (audioToggleState && systemStatus === 'BAHAYA') {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = 'square';
        gain.gain.value = 0.05;
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } catch {
        // Audio API not supported
      }
    }
  }, [audioToggleState, systemStatus, currentPh, currentTds]);

  const updateThresholds = useCallback(({ phMin, phMax, tdsMax }) => {
    setPhThresholdMin(phMin);
    setPhThresholdMax(phMax);
    localStorage.setItem('KIDECO_PH_MIN', String(phMin));
    localStorage.setItem('KIDECO_PH_MAX', String(phMax));
    if (tdsMax !== undefined) {
      setTdsThreshold(tdsMax);
      localStorage.setItem('KIDECO_TDS_MAX', String(tdsMax));
    }
  }, []);

  const toggleAudioAlarm = useCallback(() => {
    setAudioToggleState((prev) => !prev);
  }, []);

  return (
    <SensorContext.Provider
      value={{
        userState,
        activeSensor,
        setActiveSensor,
        audioToggleState,
        setAudioToggleState,
        allAlarmsMuted,
        setAllAlarmsMuted,
        buzzerActive,
        setBuzzerActive,
        
        currentPh,
        currentTds,
        lastTimestamp,
        systemStatus,
        isPhAlert,
        isTdsAlert,

        phThresholdMin,
        phThresholdMax,
        tdsThreshold,
        setTdsThreshold,
        updateThresholds,

        toggleAudioAlarm,

        chartData,

        historyData,

        selectedNode,
        setSelectedNode,

        nodes,
        setNodes,
        getNodeStatus: (node) => getNodeStatus(node, phThresholdMin, phThresholdMax, tdsThreshold),
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};
