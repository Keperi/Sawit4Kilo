import React, { useRef, useCallback } from 'react';

const AudioToggle = ({ isOn, onToggle }) => {
  const audioContextRef = useRef(null);

  const playAlertBeep = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.value = 880;
      oscillator.type = 'square';
      gainNode.gain.value = 0.1;
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.15);
    } catch {
      // Web Audio API not available
    }
  }, []);

  const handleToggle = () => {
    if (!isOn) playAlertBeep();
    onToggle();
  };

  return (
    <button
      id="audio-toggle"
      onClick={handleToggle}
      className={`
        relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200
        ${isOn ? 'bg-kideco-dark' : 'bg-gray-200'}
      `}
      role="switch"
      aria-checked={isOn}
      aria-label="Toggle audio alarm"
    >
      <span
        className={`
          inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform duration-200
          ${isOn ? 'translate-x-[22px]' : 'translate-x-[3px]'}
        `}
      />
    </button>
  );
};

export default AudioToggle;
