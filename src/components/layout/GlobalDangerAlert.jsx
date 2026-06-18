import React, { useEffect, useContext, useRef } from 'react';
import { SensorContext } from '../../context/SensorContext';
import { AlertCircle, X } from '@untitledui/icons';

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

const GlobalDangerAlert = ({ activePage }) => {
  const {
    systemStatus,
    selectedNode,
    audioToggleState,
    notificationSettings,
    currentPh,
    currentTds,
    phThresholdMin,
    phThresholdMax,
    tdsThreshold,
    showDangerToast,
    setShowDangerToast
  } = useContext(SensorContext);
  const audioRef = useRef(null);

  const isDanger = systemStatus === 'BAHAYA';
  const soundEnabled = notificationSettings ? notificationSettings.soundEnabled : true;
  const visualEnabled = notificationSettings ? notificationSettings.visualEnabled : true;
  const quiet = isInQuietHours(notificationSettings);

  // The toast is visible globally when there is danger and showDangerToast is true (toggled by user or auto-triggered)
  const shouldShow = isDanger && visualEnabled && !quiet && showDangerToast;
  const shouldPlayAudio = shouldShow && audioToggleState && soundEnabled;

  useEffect(() => {
    if (shouldPlayAudio) {
      if (!audioRef.current) {
        audioRef.current = new Audio('/assets/sounds/alarm kiamat.mp3');
      }
      audioRef.current.play().catch((err) => {
        console.log('Audio autoplay blocked or failed', err);
      });
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [shouldPlayAudio]);

  if (!shouldShow) return null;

  // Tentukan pesan peringatan secara dinamis berdasarkan parameter yang melanggar batas
  const isPhLow = currentPh < phThresholdMin;
  const isPhHigh = currentPh > phThresholdMax;
  const isTdsHigh = currentTds > tdsThreshold;

  let dangerMessage = "";
  if (isPhLow && isTdsHigh) {
    dangerMessage = `pH rendah (${currentPh}) dan TDS tinggi (${currentTds} ppm) terdeteksi pada ${selectedNode}.`;
  } else if (isPhHigh && isTdsHigh) {
    dangerMessage = `pH tinggi (${currentPh}) dan TDS tinggi (${currentTds} ppm) terdeteksi pada ${selectedNode}.`;
  } else if (isPhLow) {
    dangerMessage = `Air asam terdeteksi pada ${selectedNode} (pH: ${currentPh}).`;
  } else if (isPhHigh) {
    dangerMessage = `Air basa terdeteksi pada ${selectedNode} (pH: ${currentPh}).`;
  } else if (isTdsHigh) {
    dangerMessage = `Padatan terlarut (TDS) tinggi terdeteksi pada ${selectedNode} (${currentTds} ppm).`;
  } else {
    dangerMessage = `Kondisi air tidak normal terdeteksi pada ${selectedNode}.`;
  }

  return (
    <div data-testid="danger-toast" className="fixed top-[84px] right-6 z-50 animate-bounce-in">
      <div className="bg-[#FEF9F8] border-2 border-[#E8533A] rounded-[12px] p-5 shadow-2xl flex items-start gap-4 max-w-sm relative">
        <div className="w-[40px] h-[40px] rounded-full bg-[#FEE8E2] flex items-center justify-center shrink-0">
          <AlertCircle size={24} strokeWidth={2.5} className="text-[#C84B2F] animate-pulse" />
        </div>
        <div className="flex-1 pr-6">
          <h4 className="text-[15px] font-bold text-[#9B2617] mb-1 leading-tight">
            Peringatan Kritis!
          </h4>
          <p className="text-[13px] text-[#C84B2F] font-medium leading-snug">
            {dangerMessage} Segera ambil tindakan pencegahan.
          </p>
        </div>
        <button
          data-testid="danger-toast-close"
          onClick={() => setShowDangerToast(false)}
          className="absolute top-3 right-3 text-[#C84B2F]/60 hover:text-[#9B2617] hover:bg-[#FEE8E2] rounded-lg p-1 transition-all duration-200 outline-none cursor-pointer active:scale-90"
          title="Tutup Peringatan"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default GlobalDangerAlert;
