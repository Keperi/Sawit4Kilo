import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { io as socketIO } from 'socket.io-client';

export const SensorContext = createContext();

const API_BASE_URL = 'http://localhost:3000/api';
const SOCKET_URL = 'http://localhost:3000';

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

  const [currentPh, setCurrentPh] = useState(7.0);
  const [currentTds, setCurrentTds] = useState(400);
  const [lastTimestamp, setLastTimestamp] = useState(formatTime(new Date()));

  const isPhAlert = currentPh < phThresholdMin || currentPh > phThresholdMax;
  const isTdsAlert = currentTds > tdsThreshold;
  const systemStatus = (isPhAlert || isTdsAlert) ? 'BAHAYA' : 'AMAN';

  const audioContextRef = useRef(null);

  const [chartData, setChartData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  
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

  const [selectedNode, setSelectedNode] = useState('KDC01');

  // Fetch initial history data from backend
  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sensor-data?limit=100`);
      const result = await response.json();
      if (result.success && result.data && result.data.length > 0) {
        // Map backend data format to frontend row format
        const mappedHistory = result.data.map((item, index) => {
          const itemDate = new Date(item.timestamp || item.createdAt);
          const isPhDanger = item.ph < phThresholdMin || item.ph > phThresholdMax;
          const isTdsDanger = item.tds > 800;
          return {
            id: item._id || index,
            nodeId: selectedNode,
            timestamp: formatTimestamp(itemDate),
            ph: item.ph,
            tds: item.tds,
            status: (isPhDanger || isTdsDanger) ? 'ASAM' : 'AMAN',
          };
        });
        setHistoryData(mappedHistory);

        // Map reverse data for charts (chronological order)
        const mappedCharts = result.data
          .slice(0, 60)
          .reverse()
          .map((item) => {
            const itemDate = new Date(item.timestamp || item.createdAt);
            return {
              time: formatTime(itemDate),
              ph: item.ph,
              tds: item.tds
            };
          });
        setChartData(mappedCharts);
      } else {
        // Jika data di database masih kosong sama sekali, generate dummy chart/history agar UI tidak kosong
        generateLocalStaticFallback();
      }
    } catch (error) {
      console.warn('Gagal memuat histori dari API, menggunakan data simulasi lokal:', error.message);
      generateLocalStaticFallback();
    }
  }, [phThresholdMin, phThresholdMax, selectedNode]);

  // Helper untuk mengisi data chart & history awal secara lokal jika DB kosong
  const generateLocalStaticFallback = () => {
    const localHist = [];
    const localChart = [];
    const now = new Date();
    
    for (let i = 20; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5000);
      const ph = parseFloat((4.25 + Math.sin(time.getTime() / 60000) * 1.25).toFixed(2));
      const tds = Math.round(450 + Math.cos(time.getTime() / 60000) * 150);
      const isPhDanger = ph < phThresholdMin || ph > phThresholdMax;
      const isTdsDanger = tds > 800;

      localHist.push({
        id: `local-${i}`,
        nodeId: selectedNode,
        timestamp: formatTimestamp(time),
        ph,
        tds,
        status: (isPhDanger || isTdsDanger) ? 'ASAM' : 'AMAN',
      });
    }

    for (let i = 60; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5000);
      const ph = parseFloat((4.25 + Math.sin(time.getTime() / 60000) * 1.25).toFixed(2));
      const tds = Math.round(450 + Math.cos(time.getTime() / 60000) * 150);
      localChart.push({
        time: formatTime(time),
        ph,
        tds
      });
    }

    setHistoryData(localHist);
    setChartData(localChart);
  };

  // Handler update sensor dari WebSocket atau Fallback
  const handleNewSensorData = useCallback((data) => {
    const itemDate = new Date(data.timestamp || data.createdAt);
    const timeStr = formatTime(itemDate);

    setCurrentPh(data.ph);
    setCurrentTds(data.tds);
    setLastTimestamp(timeStr);

    setChartData((prev) => {
      const hasTime = prev.some((d) => d.time === timeStr);
      if (hasTime) return prev;

      const newPoint = {
        time: timeStr,
        ph: data.ph,
        tds: data.tds,
      };
      const updated = [...prev, newPoint];
      return updated.length > 60 ? updated.slice(-60) : updated;
    });

    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === data.nodeId) {
          const miniTime = itemDate.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' });
          const newPoint = { time: miniTime, ph: data.ph, tds: data.tds };
          const updatedChart = [...node.chartData, newPoint];
          const trimmedChart = updatedChart.length > 30 ? updatedChart.slice(-30) : updatedChart;
          return {
            ...node,
            online: true,
            ph: data.ph,
            tds: data.tds,
            lastUpdate: itemDate,
            chartData: trimmedChart,
          };
        }
        return node;
      })
    );

    // Refresh history
    fetchHistory();
  }, [fetchHistory]);

  // Fallback simulator jika API Utama atau Database offline / kosong
  const fetchDummyFallback = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sensor-data/dummy`);
      const result = await response.json();
      if (result.success && result.data) {
        const item = result.data;
        const itemDate = new Date(item.timestamp);
        const timeStr = formatTime(itemDate);

        setCurrentPh(item.ph);
        setCurrentTds(item.tds);
        setLastTimestamp(timeStr);

        setChartData((prev) => {
          const newPoint = { time: timeStr, ph: item.ph, tds: item.tds };
          const updated = [...prev, newPoint];
          return updated.length > 60 ? updated.slice(-60) : updated;
        });

        setNodes((prev) =>
          prev.map((node) => {
            if (node.id === item.nodeId || node.id === selectedNode) {
              const miniTime = itemDate.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' });
              const newPoint = { time: miniTime, ph: item.ph, tds: item.tds };
              const updatedChart = [...node.chartData, newPoint];
              const trimmedChart = updatedChart.length > 30 ? updatedChart.slice(-30) : updatedChart;
              return {
                ...node,
                online: true,
                ph: item.ph,
                tds: item.tds,
                lastUpdate: itemDate,
                chartData: trimmedChart,
              };
            }
            return node;
          })
        );
      }
    } catch (err) {
      // Offline local simulation generator jika backend mati total
      const now = new Date();
      const timeStr = formatTime(now);
      
      let nextPh = currentPh;
      setCurrentPh((prev) => {
        const change = Math.random() * 0.4 - 0.2;
        let next = parseFloat((prev + change).toFixed(1));
        if (next < 2.0) next = 2.0;
        if (next > 10.0) next = 10.0;
        nextPh = next;
        return next;
      });

      let nextTds = currentTds;
      setCurrentTds((prev) => {
        const change = Math.floor(Math.random() * 30 - 15);
        let next = prev + change;
        if (next < 100) next = 100;
        if (next > 1600) next = 1600;
        nextTds = next;
        return next;
      });

      setLastTimestamp(timeStr);
      setChartData((prev) => {
        const newPoint = { time: timeStr, ph: nextPh, tds: nextTds };
        const updated = [...prev, newPoint];
        return updated.length > 60 ? updated.slice(-60) : updated;
      });

      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === selectedNode) {
            const miniTime = now.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' });
            const newPoint = { time: miniTime, ph: nextPh, tds: nextTds };
            const updatedChart = [...node.chartData, newPoint];
            const trimmedChart = updatedChart.length > 30 ? updatedChart.slice(-30) : updatedChart;
            return {
              ...node,
              online: true,
              ph: nextPh,
              tds: nextTds,
              lastUpdate: now,
              chartData: trimmedChart,
            };
          }
          return node;
        })
      );
    }
  };

  // Setup Koneksi Socket.io dan simulator
  useEffect(() => {
    fetchHistory(); // Ambil riwayat di awal

    const socket = socketIO(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Socket.io connected:', socket.id);
      fetchHistory(); // Ambil riwayat terbaru saat terhubung kembali
    });

    socket.on('disconnect', () => {
      console.log('Socket.io disconnected');
    });

    socket.on('sensor-update', (data) => {
      console.log('Menerima update real-time sensor via socket:', data);
      handleNewSensorData(data);
    });

    // Fallback polling tetap disiapkan apabila koneksi WS terputus
    const fallbackInterval = setInterval(async () => {
      if (!socket.connected) {
        try {
          const response = await fetch(`${API_BASE_URL}/sensor-data/latest`);
          const result = await response.json();
          if (result.success && result.data) {
            handleNewSensorData(result.data);
          } else {
            fetchDummyFallback();
          }
        } catch (e) {
          fetchDummyFallback();
        }
      }
    }, 3000);

    // Simulator untuk Node KDC02 (atau node selain yang aktif/live jika offline)
    const simulatorInterval = setInterval(() => {
      const now = new Date();
      setNodes((prev) =>
        prev.map((node) => {
          // Node aktif (misal KDC01) di-update lewat WS/polling, jadi skip simulator jika online
          if (node.id === selectedNode && (socket.connected || lastTimestamp)) {
            // Biarkan di-update oleh handleNewSensorData
            return node;
          }

          // Update simulasi untuk KDC02
          if (node.id === 'KDC02') {
            const shouldGoOffline = Math.random() < 0.02;
            const shouldComeOnline = !node.online && Math.random() < 0.05;

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
          }
          return node;
        })
      );
    }, 3000);

    return () => {
      socket.disconnect();
      clearInterval(fallbackInterval);
      clearInterval(simulatorInterval);
    };
  }, [fetchHistory, handleNewSensorData, selectedNode, lastTimestamp]);

  // Play alarm beep ketika bahaya terdeteksi
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
