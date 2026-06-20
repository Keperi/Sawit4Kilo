import React from 'react';
import { Download01 } from '@untitledui/icons';
import * as XLSX from 'xlsx';
import Button from '../ui/Button';

const ExportButton = ({ color = 'primary', label, data, fileName }) => {
  const isPrimary = color === 'primary';

  const handleExportExcel = () => {
    if (!data || data.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((row, i) => ({
        'No': i + 1,
        'ID Node': row.nodeId,
        'Waktu Pencatatan': row.timestamp,
        'Nilai pH': row.ph,
        'Nilai TDS (ppm)': row.tds,
        'Status': row.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Sensor AMDAL');
    XLSX.writeFile(workbook, `${fileName || 'kideco_report'}.xlsx`);
  };

  const handleExportCSV = () => {
    if (!data || data.length === 0) return;
    const headers = 'No,ID Node,Waktu Pencatatan,Nilai pH,Nilai TDS,Status';
    const rows = data.map((row, i) =>
      `${i + 1},${row.nodeId},${row.timestamp},${row.ph},${row.tds},${row.status}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `${fileName || 'kideco_report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClick = isPrimary ? handleExportExcel : handleExportCSV;

  return (
    <Button
      id={`export-${color}`}
      onClick={handleClick}
      color={isPrimary ? 'primary' : 'secondary'}
      iconLeading={<Download01 />}
    >
      {label}
    </Button>
  );
};

export default ExportButton;
