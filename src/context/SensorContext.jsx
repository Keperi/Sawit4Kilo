import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { io as socketIO } from 'socket.io-client';

export const SensorContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

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

const parseESP32Timestamp = (timestamp, createdAt) => {
  if (timestamp) {
    if (typeof timestamp === 'string' && timestamp.endsWith('Z')) {
      return new Date(timestamp.replace(/Z$/, '+08:00'));
    }
    return new Date(timestamp);
  }
  return createdAt ? new Date(createdAt) : new Date();
};

const getNodeStatus = (node, phThresholdMin, phThresholdMax, tdsThreshold) => {
  if (!node.online) return 'OFFLINE';
  const isPhDanger = node.ph < phThresholdMin || node.ph > phThresholdMax;
  const isTdsDanger = node.tds > tdsThreshold;
  return (isPhDanger || isTdsDanger) ? 'BAHAYA' : 'AMAN';
};

const isInQuietHours = (settings) => {
  if (!settings || !settings.quietHoursEnabled) return false;
  const now = new Date();
  const nowH = now.getHours();
  const nowM = now.getMinutes();

  const [startH, startM] = (settings.quietStart || '22:00').split(':').map(Number);
  const [endH, endM] = (settings.quietEnd || '06:00').split(':').map(Number);

  const nowMinutes = nowH * 60 + nowM;
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
  } else {
    return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
  }
};

export const SensorProvider = ({ children }) => {
  const [userState] = useState({
    name: 'Admin KIDECO',
    role: 'Environment Engineer',
    sessionActive: true
  });
  
  const [activeSensor, setActiveSensor] = useState('ALL');
  const [audioToggleState, setAudioToggleState] = useState(() => {
    const saved = localStorage.getItem('KIDECO_AUDIO_ALARM');
    return saved === 'true';
  });
  const [showDangerToast, setShowDangerToast] = useState(false);
  const [allAlarmsMuted, setAllAlarmsMuted] = useState(false);
  const [buzzerActive, setBuzzerActive] = useState(false);

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

  // State Notifikasi Real-time
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'DANGER',
      message: 'pH kritis terdeteksi di KDC01: pH 3.2 (Asam)',
      time: '10m lalu',
      unread: true,
    },
    {
      id: 2,
      type: 'OFFLINE',
      message: 'Node KDC02 terputus (Offline)',
      time: '30m lalu',
      unread: true,
    },
    {
      id: 3,
      type: 'SUCCESS',
      message: 'Node KDC01 kembali dalam kondisi Aman',
      time: '1j lalu',
      unread: false,
    }
  ]);

  const addNotification = useCallback((type, message) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setNotifications((prev) => [
      {
        id: Date.now(),
        type,
        message,
        time: timeStr,
        unread: true,
      },
      ...prev.slice(0, 19),
    ]);
  }, []);

  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = localStorage.getItem('KIDECO_NOTIFICATION_SETTINGS');
    const defaultSettings = {
      soundEnabled: true,
      visualEnabled: true,
      quietHoursEnabled: false,
      quietStart: '22:00',
      quietEnd: '06:00',
      frequency: 'realtime',
    };
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateNotificationSettings = useCallback((newSettings) => {
    setNotificationSettings(newSettings);
    localStorage.setItem('KIDECO_NOTIFICATION_SETTINGS', JSON.stringify(newSettings));
  }, []);

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

  const activeNodeObj = nodes.find(n => n.id === selectedNode);
  const isNodeOffline = activeNodeObj ? !activeNodeObj.online : false;

  const isPhAlert = currentPh < phThresholdMin || currentPh > phThresholdMax;
  const isTdsAlert = currentTds > tdsThreshold;
  const systemStatus = isNodeOffline ? 'OFFLINE' : (isPhAlert || isTdsAlert) ? 'BAHAYA' : 'AMAN';

  useEffect(() => {
    if (systemStatus === 'BAHAYA') {
      setShowDangerToast(true);
    } else {
      setShowDangerToast(false);
    }
  }, [systemStatus]);

  // Track systemStatus transitions for real-time notifications
  const prevStatusRef = useRef(systemStatus);
  useEffect(() => {
    if (systemStatus !== prevStatusRef.current) {
      if (systemStatus === 'BAHAYA') {
        const isPhDanger = currentPh < phThresholdMin || currentPh > phThresholdMax;
        const isTdsDanger = currentTds > tdsThreshold;
        let msg = '';
        if (isPhDanger && isTdsDanger) msg = `Kondisi Kritis: pH (${currentPh}) & TDS (${currentTds} ppm) melanggar batas.`;
        else if (isPhDanger) msg = `pH Kritis terdeteksi: ${currentPh}.`;
        else msg = `TDS Kritis terdeteksi: ${currentTds} ppm.`;
        addNotification('DANGER', msg);
      } else if (systemStatus === 'OFFLINE') {
        addNotification('OFFLINE', `Node ${selectedNode} terputus (Offline)`);
      } else if (systemStatus === 'AMAN') {
        if (prevStatusRef.current === 'BAHAYA') {
          addNotification('SUCCESS', 'Kondisi air kembali normal dan Aman.');
        } else if (prevStatusRef.current === 'OFFLINE') {
          addNotification('SUCCESS', `Node ${selectedNode} kembali terhubung (Online)`);
        }
      }
      prevStatusRef.current = systemStatus;
    }
  }, [systemStatus, currentPh, currentTds, phThresholdMin, phThresholdMax, tdsThreshold, addNotification, selectedNode]);

  // Track nodes online/offline status changes for real-time notifications
  const prevNodesOnlineRef = useRef({
    KDC01: true,
    KDC02: false,
  });
  useEffect(() => {
    nodes.forEach((node) => {
      const prevOnline = prevNodesOnlineRef.current[node.id];
      if (prevOnline !== undefined && prevOnline !== node.online) {
        if (!node.online) {
          addNotification('OFFLINE', `Node ${node.id} terputus (Offline)`);
        } else {
          addNotification('SUCCESS', `Node ${node.id} kembali terhubung (Online)`);
        }
      }
      prevNodesOnlineRef.current[node.id] = node.online;
    });
  }, [nodes, addNotification]);

  // Real-time offline detection: check every 3 seconds if any node has not sent data in the last 15 seconds
  useEffect(() => {
    const offlineChecker = setInterval(() => {
      const now = Date.now();
      setNodes((prevNodes) => {
        let changed = false;
        const nextNodes = prevNodes.map((node) => {
          const lastUpdateTime = new Date(node.lastUpdate).getTime();
          if (node.online && (now - lastUpdateTime > 15000)) {
            changed = true;
            return {
              ...node,
              online: false,
            };
          }
          return node;
        });
        return changed ? nextNodes : prevNodes;
      });
    }, 3000);

    return () => clearInterval(offlineChecker);
  }, []);

  const audioContextRef = useRef(null);

  // Fetch initial history data from backend
  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sensor-data?limit=100`);
      const result = await response.json();
      if (result.success && result.data && result.data.length > 0) {
        const latestItem = result.data[0];
        if (latestItem) {
          const itemDate = parseESP32Timestamp(latestItem.timestamp, latestItem.createdAt);
          const isOfflineOnLoad = (Date.now() - itemDate.getTime()) > 15000;
          setNodes(prev => prev.map(node => {
            if (node.id === selectedNode) {
              return {
                ...node,
                online: !isOfflineOnLoad,
                ph: latestItem.ph,
                tds: latestItem.tds,
                lastUpdate: itemDate,
              };
            }
            return node;
          }));
        }

        // Map backend data format to frontend row format
        const mappedHistory = result.data.map((item, index) => {
          const itemDate = parseESP32Timestamp(item.timestamp, item.createdAt);
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
    const itemDate = parseESP32Timestamp(data.timestamp, data.createdAt);
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
        const itemDate = parseESP32Timestamp(item.timestamp);
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

  // Play alarm beep ketika bahaya terdeteksi (Dinonaktifkan sesuai permintaan: suara tit tit tit tidak diperlukan)
  useEffect(() => {
    // beep dinonaktifkan
  }, [audioToggleState, systemStatus, notificationSettings]);

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
    setAudioToggleState((prev) => {
      const next = !prev;
      localStorage.setItem('KIDECO_AUDIO_ALARM', String(next));
      return next;
    });
  }, []);

  return (
    <SensorContext.Provider
      value={{
        userState,
        activeSensor,
        setActiveSensor,
        audioToggleState,
        setAudioToggleState,
        showDangerToast,
        setShowDangerToast,
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
        
        notificationSettings,
        updateNotificationSettings,

        notifications,
        setNotifications,
        addNotification,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};
