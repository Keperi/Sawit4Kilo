import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { io as socketIO } from 'socket.io-client';

export const SensorContext = createContext();

const API_BASE_URL = 'http://localhost:3000/api';
const SOCKET_URL = 'http://localhost:3000';

// Format time as HH:MM:SS
const formatTime = (date) => {
  return date.toLocaleTimeString('id-ID', { hour12: false });
};

// Format timestamp for history table
const formatTimestamp = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
};

export const SensorProvider = ({ children }) => {
  // New States based on specs
  const [userState, setUserState] = useState({
    name: 'Admin KIDECO',
    role: 'Environment Engineer',
    sessionActive: true
  });
  
  const [activeSensor, setActiveSensor] = useState('ALL'); // 'ALL' | 'PH' | 'TDS'
  const [audioToggleState, setAudioToggleState] = useState(false);

  // Thresholds
  const [phThresholdMin, setPhThresholdMin] = useState(() => {
    const saved = localStorage.getItem('KIDECO_PH_MIN');
    return saved ? parseFloat(saved) : 4.5;
  });
  const [phThresholdMax, setPhThresholdMax] = useState(() => {
    const saved = localStorage.getItem('KIDECO_PH_MAX');
    return saved ? parseFloat(saved) : 9.0;
  });

  // Current sensor values
  const [currentPh, setCurrentPh] = useState(7.0);
  const [currentTds, setCurrentTds] = useState(400);
  const [lastTimestamp, setLastTimestamp] = useState(formatTime(new Date()));

  // System status derived
  const isPhAlert = currentPh < phThresholdMin || currentPh > phThresholdMax;
  const isTdsAlert = currentTds > 800; // Static value as per new PRD
  const systemStatus = (isPhAlert || isTdsAlert) ? 'BAHAYA' : 'AMAN';

  // Audio alarm
  const audioContextRef = useRef(null);

  // Chart data and History data
  const [chartData, setChartData] = useState([]);
  const [historyData, setHistoryData] = useState([]);

  // Selected node
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

    // Refresh history
    fetchHistory();
  }, [fetchHistory]);

  // Setup Koneksi Socket.io
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

    return () => {
      socket.disconnect();
      clearInterval(fallbackInterval);
    };
  }, [fetchHistory, handleNewSensorData]);

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
      }
    } catch (err) {
      // Offline local simulation generator jika backend mati total
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
        const newPoint = { time: timeStr, ph: currentPh, tds: currentTds };
        const updated = [...prev, newPoint];
        return updated.length > 60 ? updated.slice(-60) : updated;
      });
    }
  };

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

  const updateThresholds = useCallback(({ phMin, phMax }) => {
    setPhThresholdMin(phMin);
    setPhThresholdMax(phMax);
    localStorage.setItem('KIDECO_PH_MIN', String(phMin));
    localStorage.setItem('KIDECO_PH_MAX', String(phMax));
  }, []);

  const toggleAudioAlarm = useCallback(() => {
    setAudioToggleState((prev) => !prev);
  }, []);

  return (
    <SensorContext.Provider
      value={{
        // New Spec States
        userState,
        activeSensor,
        setActiveSensor,
        audioToggleState,
        setAudioToggleState,
        
        // Current readings
        currentPh,
        currentTds,
        lastTimestamp,
        systemStatus,
        isPhAlert,
        isTdsAlert,

        // Thresholds
        phThresholdMin,
        phThresholdMax,
        updateThresholds,

        // Audio
        toggleAudioAlarm,

        // Chart
        chartData,

        // History
        historyData,

        // Node
        selectedNode,
        setSelectedNode,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};


