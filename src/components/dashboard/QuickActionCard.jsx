import React from 'react';
import { Settings01, ArrowRight, Download01, RefreshCw01, AlertCircle } from '@untitledui/icons';

const SearchIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const QuickActionCard = ({ setActivePage }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col justify-between hover:shadow-card transition-shadow duration-300">
      <div>
        <h3 className="font-bold text-gray-900 text-lg tracking-tight mb-1">Aksi Cepat</h3>
        <p className="text-sm text-gray-500 mb-5">Lakukan tindakan cepat pada sistem pemantauan.</p>

        {/* Search-style Input */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 flex items-center justify-between mb-5 cursor-pointer hover:bg-gray-100 transition-colors">
          <span className="text-sm text-gray-400 flex items-center gap-2">
            <SearchIcon size={14} /> Pilih tindakan...
          </span>
        </div>

        {/* Quick Action Buttons */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tindakan Sering Digunakan</p>
        <div className="flex gap-2">
          <button
            onClick={() => setActivePage && setActivePage('config')}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-kideco-orange hover:bg-orange-50 hover:border-orange-200 transition-all duration-150 shadow-xs"
            title="Pengaturan Alat"
          >
            <Settings01 size={16} strokeWidth={2} />
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 hover:border-blue-200 transition-all duration-150 shadow-xs"
            title="Refresh"
          >
            <RefreshCw01 size={16} strokeWidth={2} />
          </button>
          <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-200 transition-all duration-150 shadow-xs">
            <AlertCircle size={16} strokeWidth={2} />
          </button>
          <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-emerald-500 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-150 shadow-xs">
            <Download01 size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setActivePage && setActivePage('reports')}
          className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold text-sm py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
        >
          Riwayat Laporan
        </button>
        <button
          onClick={() => setActivePage && setActivePage('config')}
          className="flex-1 bg-gray-900 text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-gray-800 transition-all duration-150 flex items-center justify-center gap-2"
        >
          Konfigurasi <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default QuickActionCard;
