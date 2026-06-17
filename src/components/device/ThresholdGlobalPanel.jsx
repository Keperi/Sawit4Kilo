import React, { useContext, useState } from 'react';
import { SensorContext } from '../../context/SensorContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertTriangle } from '@untitledui/icons';
import Button from '../ui/Button';
import ConfigurationFeedbackBanner from '../config/ConfigurationFeedbackBanner';

const schema = z.object({
  phMin: z.coerce
    .number({ invalid_type_error: 'Harus berupa angka' })
    .min(0, 'Minimal 0')
    .max(14, 'Maksimal 14'),
  tdsMax: z.coerce
    .number({ invalid_type_error: 'Harus berupa angka' })
    .min(10, 'Minimal 10')
    .max(5000, 'Maksimal 5000'),
});

const ThresholdGlobalPanel = () => {
  const { phThresholdMin, tdsThreshold, phThresholdMax, updateThresholds } = useContext(SensorContext);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { phMin: phThresholdMin, tdsMax: tdsThreshold },
  });

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    updateThresholds({ phMin: data.phMin, phMax: phThresholdMax, tdsMax: data.tdsMax });
    setIsSuccess(true);
  };

  return (
    <div>
      <ConfigurationFeedbackBanner isVisible={isSuccess} onClose={() => setIsSuccess(false)} />

      <div className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#B9C8D7] mb-3">
        Panel Threshold Global
      </div>

      <div className="bg-white rounded-[12px] border border-[#EAECF0] p-5 transition-all duration-200">
        <p className="text-[13px] text-[#667085] mb-4">
          Atur batas ambang alarm untuk semua node. Perubahan berlaku secara real-time.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[12px] font-bold text-[#202020] mb-1.5">
                Batas Minimum pH
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="14"
                {...register('phMin')}
                className="w-full h-[38px] px-3 rounded-[8px] border border-[#EAECF0] bg-white text-[13px] font-mono text-[#202020] outline-none transition-colors focus:border-[#FF4628]"
              />
              {errors.phMin && (
                <p className="text-[11px] text-[#FF4628] mt-1">{errors.phMin.message}</p>
              )}
              <p className="text-[10px] text-[#B9C8D7] mt-1">Alarm jika pH di bawah angka ini</p>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#202020] mb-1.5">
                Batas Maksimum TDS (ppm)
              </label>
              <input
                type="number"
                step="1"
                min="10"
                max="5000"
                {...register('tdsMax')}
                className="w-full h-[38px] px-3 rounded-[8px] border border-[#EAECF0] bg-white text-[13px] font-mono text-[#202020] outline-none transition-colors focus:border-[#FF4628]"
              />
              {errors.tdsMax && (
                <p className="text-[11px] text-[#FF4628] mt-1">{errors.tdsMax.message}</p>
              )}
              <p className="text-[10px] text-[#B9C8D7] mt-1">Alarm jika TDS di atas angka ini</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-[8px] p-3 flex items-start gap-2.5 mb-4">
            <AlertTriangle size={16} strokeWidth={2} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-700 leading-relaxed">
              Status BAHAYA terpicu jika pH &lt; <strong>{phThresholdMin}</strong> ATAU TDS &gt; <strong>{tdsThreshold}</strong> ppm
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" color="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Threshold'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThresholdGlobalPanel;
