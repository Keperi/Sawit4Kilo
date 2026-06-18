import React, { useContext, useState, useMemo, useCallback } from 'react';
import { SensorContext } from '../context/SensorContext';
import Header from '../components/layout/Header';
import FilterToolbar from '../components/history/FilterToolbar';
import LogDataTable from '../components/history/LogDataTable';
import TablePaginationControl from '../components/history/TablePaginationControl';
import { File02 } from '@untitledui/icons';
import Badge from '../components/ui/Badge';
import MaterialSedimentationChart from '../components/dashboard/MaterialSedimentationChart';
import CircadianRangeChart from '../components/dashboard/CircadianRangeChart';
import SweetSpotScatterChart from '../components/dashboard/SweetSpotScatterChart';

const ITEMS_PER_PAGE = 15;

const HistoryPage = () => {
  const { historyData, systemStatus } = useContext(SensorContext);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [acidityFilter, setAcidityFilter] = useState('ALL');
  const [nodeFilter, setNodeFilter] = useState('ALL');

  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: '',
    dateTo: '',
    acidity: 'ALL',
    nodeId: 'ALL',
  });

  const [currentPage, setCurrentPage] = useState(0);

  const handleApplyFilter = useCallback(() => {
    setAppliedFilters({ dateFrom, dateTo, acidity: acidityFilter, nodeId: nodeFilter });
    setCurrentPage(0);
  }, [dateFrom, dateTo, acidityFilter, nodeFilter]);

  const filteredData = useMemo(() => {
    return historyData.filter((row) => {
      if (appliedFilters.nodeId !== 'ALL' && row.nodeId !== appliedFilters.nodeId) return false;

      if (appliedFilters.acidity === 'ACIDIC' && row.status !== 'ASAM') return false;
      if (appliedFilters.acidity === 'NEUTRAL' && row.status !== 'AMAN') return false;
      if (appliedFilters.acidity === 'ALKALINE' && row.ph >= 4.5 && row.ph <= 9.0 && row.tds <= 800) return false;

      const rowDt = row.timestamp.replace(' ', 'T').slice(0, 16);

      if (appliedFilters.dateFrom) {
        if (rowDt < appliedFilters.dateFrom) return false;
      }
      if (appliedFilters.dateTo) {
        if (rowDt > appliedFilters.dateTo) return false;
      }

      return true;
    });
  }, [historyData, appliedFilters]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] overflow-hidden">
      <Header
        title="Histori & Laporan"
        systemStatus={systemStatus}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="bg-white rounded-[16px] border border-[#EAECF0] p-4 md:p-6 flex flex-col gap-[18px] min-h-full">

          {/* Filter Bar */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#B9C8D7] mb-3">
              Filter & Ekspor Data
            </div>
            <div className="bg-white rounded-[12px] border border-[#EAECF0] p-4">
              <FilterToolbar
                dateFrom={dateFrom}
                dateTo={dateTo}
                acidityFilter={acidityFilter}
                nodeFilter={nodeFilter}
                onDateFromChange={setDateFrom}
                onDateToChange={setDateTo}
                onAcidityChange={setAcidityFilter}
                onNodeChange={setNodeFilter}
                onApplyFilter={handleApplyFilter}
                dataToExport={filteredData}
              />
            </div>
          </div>

          {/* Info Row */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#8C9BAF] font-medium">
              Menampilkan <span className="font-bold text-[#202020]">{filteredData.length}</span> entri
              {appliedFilters.acidity !== 'ALL' && (
                <Badge variant="primary" className="ml-2">
                  Status: {appliedFilters.acidity}
                </Badge>
              )}
              {appliedFilters.nodeId !== 'ALL' && (
                <Badge variant="primary" className="ml-2">
                  Node: {appliedFilters.nodeId}
                </Badge>
              )}
            </span>
          </div>

          {/* Charts Row */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#B9C8D7] mb-3">
              Visualisasi Data
            </div>
            <div className="grid grid-cols-12 gap-[14px]">
              <div className="col-span-12 lg:col-span-4">
                <MaterialSedimentationChart />
              </div>
              <div className="col-span-12 lg:col-span-4">
                <CircadianRangeChart />
              </div>
              <div className="col-span-12 lg:col-span-4">
                <SweetSpotScatterChart />
              </div>
            </div>
          </div>

          {/* Table */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#B9C8D7] mb-3">
              Data Log Sensor
            </div>
            <div className="bg-white rounded-[12px] border border-[#EAECF0] overflow-hidden">
              <div className="overflow-auto max-h-[500px]">
                <LogDataTable data={paginatedData} />
              </div>
              {filteredData.length > 0 && (
                <div className="shrink-0 border-t border-[#EAECF0]">
                  <TablePaginationControl
                    totalLogs={filteredData.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
