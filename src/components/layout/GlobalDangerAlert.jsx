import React, { useEffect, useContext, useRef } from 'react';
import { SensorContext } from '../../context/SensorContext';
import { AlertCircle } from '@untitledui/icons';

const GlobalDangerAlert = ({ activePage }) => {
  const { systemStatus, selectedNode, audioToggleState } = useContext(SensorContext);
  const audioRef = useRef(null);

  const isDanger = systemStatus === 'BAHAYA';
  const shouldShow = isDanger && activePage !== 'dashboard';

  useEffect(() => {
    if (shouldShow && audioToggleState) {
      if (!audioRef.current) {
        audioRef.current = new Audio('/assets/sounds/alarm.mp3');
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
  }, [shouldShow, audioToggleState]);

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
      <div className="bg-[#FEF9F8] border-2 border-[#E8533A] rounded-[12px] p-5 shadow-2xl flex items-start gap-4 max-w-sm">
        <div className="w-[40px] h-[40px] rounded-full bg-[#FEE8E2] flex items-center justify-center shrink-0">
          <AlertCircle size={24} strokeWidth={2.5} className="text-[#C84B2F] animate-pulse" />
        </div>
        <div className="flex-1">
          <h4 className="text-[15px] font-bold text-[#9B2617] mb-1 leading-tight">
            Peringatan Kritis!
          </h4>
          <p className="text-[13px] text-[#C84B2F] font-medium leading-snug">
            Air asam terdeteksi pada <span className="font-bold underline">{selectedNode}</span>. Segera ambil tindakan pencegahan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalDangerAlert;
