import React, { useEffect } from 'react';
import { CheckCircle } from '@untitledui/icons';
import { Transition } from '@headlessui/react';

const ConfigurationFeedbackBanner = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <Transition
      show={isVisible}
      as="div"
      enter="transition-all duration-300 ease-out"
      enterFrom="opacity-0 translate-y-2 sm:translate-y-0 sm:translate-x-4"
      enterTo="opacity-100 translate-y-0 sm:translate-x-0"
      leave="transition-all duration-200 ease-in"
      leaveFrom="opacity-100 translate-y-0 sm:translate-x-0"
      leaveTo="opacity-0 translate-y-2 sm:translate-y-0 sm:translate-x-4"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-kideco-surface rounded shadow-elevated border border-semantic-safe-border p-4 min-w-[300px]"
    >
      <div className="flex-shrink-0">
        <CheckCircle className="h-6 w-6 text-semantic-safe" />
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-[13px] font-bold text-kideco-gray font-sans">
          Konfigurasi Disimpan
        </p>
        <p className="mt-0.5 text-[11px] text-kideco-secondary-text font-sans leading-relaxed">
          Parameter baru berhasil disinkronisasi ke perangkat ESP32.
        </p>
      </div>
    </Transition>
  );
};

export default ConfigurationFeedbackBanner;
