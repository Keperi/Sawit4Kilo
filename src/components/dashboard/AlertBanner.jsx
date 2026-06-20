import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle, Loading01 } from '@untitledui/icons';
import { getAIInsight } from '../../utils/groq';

const AI_COOLDOWN_MS = 60_000;

const AlertBanner = ({ message, location, isDanger = true, systemStatus = 'AMAN', sensorData, onAction }) => {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const prevIsDangerRef = useRef(false);
  const lastFetchTimeRef = useRef(0);

  const isOffline = systemStatus === 'OFFLINE';

  useEffect(() => {
    const justBecameDanger = isDanger && !prevIsDangerRef.current;
    const cooldownElapsed = Date.now() - lastFetchTimeRef.current > AI_COOLDOWN_MS;

    if (isDanger && sensorData && !isOffline && (justBecameDanger || cooldownElapsed)) {
      lastFetchTimeRef.current = Date.now();
      fetchInsight();
    }

    prevIsDangerRef.current = isDanger;
  }, [isDanger, isOffline]);

  const fetchInsight = async () => {
    setLoading(true);
    const result = await getAIInsight(sensorData);
    setInsight(result);
    setLoading(false);
  };

  const containerBg = isOffline
    ? 'bg-slate-50 border-slate-200'
    : isDanger
    ? 'bg-[#FEF9F8] border-[#FDDDD6]'
    : 'bg-[#F0FDF4] border-[#BBF7D0]';

  const iconBg = isOffline
    ? 'bg-slate-100'
    : isDanger
    ? 'bg-[#FEE8E2]'
    : 'bg-[#DCFCE7]';

  const textHeaderColor = isOffline
    ? 'text-slate-700'
    : isDanger
    ? 'text-[#9B2617]'
    : 'text-[#166534]';

  const textBodyColor = isOffline
    ? 'text-slate-500'
    : isDanger
    ? 'text-[#C84B2F]'
    : 'text-[#15803D]';

  const locationColor = isOffline
    ? 'decoration-slate-400 text-slate-500'
    : isDanger
    ? 'decoration-[#E8533A] text-[#E8533A]'
    : 'decoration-[#22C55E] text-[#22C55E]';

  return (
    <div className={`border rounded-[10px] p-4 sm:p-5 mb-[18px] flex flex-col sm:flex-row gap-3 sm:gap-4 items-start ${containerBg}`}>
      <div className={`w-[36px] h-[36px] rounded-[7px] flex items-center justify-center shrink-0 ${iconBg}`}>
        {isOffline ? (
          <AlertCircle size={18} strokeWidth={2.5} className="text-slate-500" />
        ) : isDanger ? (
          <AlertCircle size={18} strokeWidth={2.5} className="text-[#C84B2F]" />
        ) : (
          <CheckCircle size={18} strokeWidth={2.5} className="text-[#166534]" />
        )}
      </div>
      <div className="flex-1">
        <div className={`text-[15px] font-semibold ${textHeaderColor}`}>
          {isOffline ? (
            <>Koneksi terputus: Perangkat </>
          ) : isDanger ? (
            <>Peringatan kritis: {message} pada </>
          ) : (
            <>Status normal: Kualitas air baik pada </>
          )}
          <span className={`underline cursor-pointer ${locationColor}`}>
            {location}
          </span>
          {isOffline && <> offline</>}
        </div>
        <div className={`text-[13px] mt-2 ${textBodyColor}`}>
          <span className="font-medium">Status:</span>{' '}
          {isOffline
            ? 'Tidak dapat menerima data sensor. Silakan periksa koneksi internet atau catu daya pada perangkat ESP32 gateway Anda.'
            : loading ? (
              <span className="inline-flex items-center gap-1.5">
                <Loading01 size={12} className="animate-spin" />
                <span className="text-[#B9C8D7]">Menganalisis...</span>
              </span>
            ) : (
              insight || (isDanger
                ? 'Tingkat keasaman di luar ambang batas aman.'
                : 'Semua parameter terpantau dalam rentang toleransi yang aman.')
            )}
        </div>
        {isDanger && !isOffline && (
          <button
            onClick={onAction}
            className="mt-4 px-[16px] py-[8px] rounded-[7px] bg-[#E8533A] text-white text-[13px] font-medium cursor-pointer border-none hover:bg-[#C84B2F] transition-colors"
          >
            Ambil tindakan
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertBanner;
