import React from 'react';
import AcidityFilterDropdown from './AcidityFilterDropdown';
import ExportButton from './ExportButton';
import { FilterLines, SearchMd } from '@untitledui/icons';
import Button from '../ui/Button';

const FilterToolbar = ({
  dateFrom,
  dateTo,
  acidityFilter,
  onDateFromChange,
  onDateToChange,
  onAcidityChange,
  onApplyFilter,
  dataToExport
}) => {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 mr-2">
          <FilterLines size={16} className="text-[#B9C8D7]" />
          <span className="text-[11px] font-bold text-[#B9C8D7] uppercase tracking-widest hidden sm:block">
            Filter Log
          </span>
        </div>

        <input
          id="filter-date-from"
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="h-[38px] px-3 bg-white border border-[#EAECF0] rounded-[8px] text-[13px] font-medium text-[#202020] outline-none transition-all focus:border-[#FF4628] max-w-[140px]"
          title="Dari Tanggal"
        />

        <span className="text-[#B9C8D7] text-[13px]">—</span>

        <input
          id="filter-date-to"
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="h-[38px] px-3 bg-white border border-[#EAECF0] rounded-[8px] text-[13px] font-medium text-[#202020] outline-none transition-all focus:border-[#FF4628] max-w-[140px]"
          title="Hingga Tanggal"
        />

        <div className="w-[160px]">
          <AcidityFilterDropdown value={acidityFilter} onChange={onAcidityChange} />
        </div>

        <Button
          id="filter-apply"
          color="primary"
          iconLeading={<SearchMd />}
          onClick={onApplyFilter}
          className="h-[38px]"
        >
          Cari
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <ExportButton
          color="secondary"
          label="Unduh CSV"
          data={dataToExport}
          fileName={`kideco_amdal_${new Date().toISOString().slice(0, 10)}`}
        />
        <ExportButton
          color="primary"
          label="Unduh Excel"
          data={dataToExport}
          fileName={`kideco_amdal_${new Date().toISOString().slice(0, 10)}`}
        />
      </div>
    </div>
  );
};

export default FilterToolbar;
