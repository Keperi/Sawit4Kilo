import React from 'react';
import { ChevronLeft, ChevronRight } from '@untitledui/icons';
import Button from '../ui/Button';

const TablePaginationControl = ({ totalLogs, itemsPerPage = 15, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalLogs / itemsPerPage);

  if (totalPages <= 1) return (
    <div className="px-6 py-4 text-[12px] text-[#B9C8D7] font-normal">
      Menampilkan {totalLogs} dari {totalLogs} entri
    </div>
  );

  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalLogs);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const left = Math.max(0, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);
    for (let i = left; i <= right; i++) range.push(i);

    const pages = [];
    let prev = null;
    for (const p of range) {
      if (prev !== null && p - prev > 1) pages.push('…');
      pages.push(p);
      prev = p;
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#B9C8D7]/30 bg-white rounded-b-[10px]">
      <span className="text-[12px] font-normal text-[#B9C8D7]">
        Baris {startItem}–{endItem} dari {totalLogs.toLocaleString('id-ID')} entri
      </span>

      <div className="flex items-center gap-1.5">
        <Button
          color="secondary"
          size="sm"
          iconLeading={<ChevronLeft />}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Sebelum
        </Button>

        <div className="flex items-center gap-1 mx-2">
          {getVisiblePages().map((page, i) =>
            page === '…' ? (
              <span key={`ell-${i}`} className="px-2 text-sm text-[#B9C8D7]">…</span>
            ) : (
              <button
                key={page}
                id={`pagination-page-${page + 1}`}
                onClick={() => onPageChange(page)}
                className={`
                  min-w-[30px] h-7 rounded-[8px] text-[12px] font-bold flex items-center justify-center cursor-pointer transition-all duration-150 border
                  ${page === currentPage
                    ? 'bg-[#FF4628] text-white border-[#FF4628]'
                    : 'bg-white text-[#B9C8D7] border-[#B9C8D7]/30 hover:bg-[#F5F5F5] hover:text-[#202020]'}
                `}
              >
                {page + 1}
              </button>
            )
          )}
        </div>

        <Button
          color="secondary"
          size="sm"
          iconTrailing={<ChevronRight />}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          Sesudah
        </Button>
      </div>
    </div>
  );
};

export default TablePaginationControl;
