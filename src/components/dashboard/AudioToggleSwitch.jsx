import React, { useState, useContext, useRef, useEffect } from 'react';
import { SensorContext } from '../../context/SensorContext';
import { VolumeMax, VolumeX, Loading01 } from '@untitledui/icons';

const AudioToggleSwitch = () => {
  const { audioToggleState, toggleAudioAlarm, systemStatus } = useContext(SensorContext);
  const [isMutating, setIsMutating] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/assets/sounds/alarm_QenbR8T.mp3');
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (audioToggleState && systemStatus === 'BAHAYA') {
      audioRef.current.play().catch(() => { });
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [audioToggleState, systemStatus]);

  const handleToggle = () => {
    if (isMutating) return;
    setIsMutating(true);
    setTimeout(() => {
      toggleAudioAlarm();
      setIsMutating(false);
    }, 600);
  };

  const isOn = audioToggleState;

  return (
    <button
      data-testid="audio-toggle-btn"
      onClick={handleToggle}
      disabled={isMutating}
      role="switch"
      aria-checked={isOn}
      className={`
        w-full flex items-center justify-between px-3 py-2 rounded-[8px] transition-all duration-200 outline-none border
        ${isMutating
          ? 'opacity-70 cursor-wait border-[#EAECF0] bg-white'
          : isOn
            ? 'cursor-pointer border-[#16A34A]/30 bg-[#16A34A]/5'
            : 'cursor-pointer border-[#EAECF0] bg-white'}
      `}
    >
      <div className="flex items-center gap-2">
        <div className={`w-[28px] h-[28px] rounded-[6px] flex items-center justify-center shrink-0 transition-colors duration-200 ${isOn ? 'bg-[#16A34A]/15' : 'bg-[#F7F8FA] border border-[#EAECF0]'
          }`}>
          {isMutating ? (
            <Loading01 size={14} strokeWidth={2} className="animate-spin text-[#B9C8D7]" />
          ) : isOn ? (
            <VolumeMax size={14} strokeWidth={2} className="text-[#16A34A]" />
          ) : (
            <VolumeX size={14} strokeWidth={2} className="text-[#B9C8D7]" />
          )}
        </div>
        <div className="text-left">
          <div className="text-[12px] font-semibold text-[#202020] leading-tight">Alarm Peringatan</div>
          <div className="text-[10px] text-[#B9C8D7] leading-tight mt-0.5">
            {isOn ? 'Aktif' : 'Mati'}
          </div>
        </div>
      </div>

      <div
        className={`
          w-[32px] h-[18px] rounded-[9px] relative shrink-0 transition-colors duration-200
          ${isOn ? 'bg-[#16A34A]' : 'bg-[#D1D5DB]'}
        `}
      >
        <span
          className={`
            absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform duration-200
            ${isOn ? 'translate-x-[14px]' : 'translate-x-0'}
          `}
        />
      </div>
    </button>
  );
};

export default AudioToggleSwitch;
