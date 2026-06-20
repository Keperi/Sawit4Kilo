import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertTriangle } from '@untitledui/icons';
import FormNumericField from './FormNumericField';
import Button from '../ui/Button';
import ConfigurationFeedbackBanner from './ConfigurationFeedbackBanner';

const schema = z.object({
  phMin: z.coerce
    .number({ invalid_type_error: 'Harus berupa angka' })
    .min(0, 'Minimal 0')
    .max(14, 'Maksimal 14'),
  phMax: z.coerce
    .number({ invalid_type_error: 'Harus berupa angka' })
    .min(0, 'Minimal 0')
    .max(14, 'Maksimal 14'),
}).refine(data => data.phMin < data.phMax, {
  message: 'Batas minimum harus lebih kecil dari maksimum',
  path: ['phMin'],
});

const ThresholdConfigurationForm = ({ initialPhMin, initialPhMax, onSave }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { phMin: initialPhMin, phMax: initialPhMax },
  });

  const onSubmit = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 900));
    onSave({ phMin: data.phMin, phMax: data.phMax });
    setIsSuccess(true);
  };

  return (
    <div className="mt-8 max-w-4xl">
      <ConfigurationFeedbackBanner
        isVisible={isSuccess}
        onClose={() => setIsSuccess(false)}
      />

      <div className="text-[11px] font-bold tracking-[0.07em] uppercase text-slate-400 mb-3">
        Panel Kontrol Batas Ambang Alarm
      </div>

      <div className="bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] p-6 transition-all duration-200">
        <p className="text-sm text-slate-500 mb-6">
          Masukkan nilai batas parameter pH yang baru. Nilai akan langsung diperbarui ke EEPROM perangkat keras.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Horizontal Grid Layout for Inputs */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <FormNumericField
              label="Batas Minimum Parameter pH"
              hint="Alarm aktif jika nilai DI BAWAH angka ini (Skala 0–14)"
              error={errors.phMin}
              min="0"
              max="14"
              {...register('phMin')}
            />
            <FormNumericField
              label="Batas Maksimum Parameter pH"
              hint="Alarm aktif jika nilai DI ATAS angka ini (Skala 0–14)"
              error={errors.phMax}
              min="0"
              max="14"
              {...register('phMax')}
            />
          </div>

          {/* Warning box */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 mb-6">
            <AlertTriangle size={18} strokeWidth={2} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 leading-relaxed m-0">
              <strong className="font-semibold">Perhatian:</strong> Perubahan nilai standar pH ini akan langsung mempengaruhi logika alarm sistem real-time dan threshold ESP32. Pastikan nilai sesuai dengan regulasi AMDAL yang berlaku.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
            <Button
              variant="secondary"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Batalkan
            </Button>
            <Button
              id="btn-save-thresholds"
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThresholdConfigurationForm;
