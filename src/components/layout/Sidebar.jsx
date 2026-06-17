import React, { memo, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  BarChart01,
  Dataflow03,
  Server03,
  LogOut01,
  Settings01,
  ChevronDown,
  BarChart02,
} from '@untitledui/icons';
import AudioToggleSwitch from '../dashboard/AudioToggleSwitch';
import MuteAllButton from '../dashboard/MuteAllButton';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart01 },
  { id: 'reports', label: 'Histori & Laporan', icon: Dataflow03 },
  { id: 'device', label: 'Device', icon: Server03 },
  { id: 'analytics', label: 'Analisis', icon: BarChart02 },
];

const Sidebar = memo(({ activePage, setActivePage, onOpenSettings }) => {
  return (
    <aside
      id="sidebar-nav"
      className="fixed left-0 top-0 w-[260px] h-screen flex flex-col z-30 bg-[#F5F5F5] border-r border-[#B9C8D7]/30"
    >
      <div className="flex flex-col h-full px-4 py-6">

        {/* ── 1. Top: Logo ── */}
        <div className="px-2 mb-6">
          <div className="flex items-center gap-3">
            <img src="/assets/logo/Logo Kideco.svg" alt="Kideco Logo" className="h-7 object-contain" />
          </div>
        </div>

        {/* ── 2. Navigation ── */}
        <div className="flex flex-col flex-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`
                  w-full flex items-center gap-3.5 px-3 py-2.5 rounded-[10px] text-[13px] transition-all duration-200 mt-1
                  ${isActive
                    ? 'bg-white text-[#FF4628] font-bold border border-[#B9C8D7]/30 shadow-sm'
                    : 'text-[#8C9BAF] font-normal hover:bg-[#B9C8D7]/10 border border-transparent'}
                `}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={isActive ? 'text-[#FF4628]' : 'text-[#8C9BAF]'}
                />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* ── 3. Audio Controls ── */}
        <div className="border-t border-[#B9C8D7]/30 pt-4 px-2 mb-4">
          <div className="px-3 mb-2">
            <div className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#B9C8D7]">Notifikasi</div>
          </div>
          <div className="px-3 flex flex-col gap-1.5">
            <AudioToggleSwitch />
            <MuteAllButton />
          </div>
        </div>

        {/* ── 4. Bottom: Profile Dropdown ── */}
        <div className="border-t border-[#B9C8D7]/30 pt-4 px-2">
          <Menu as="div" className="relative">
            <Menu.Button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] bg-white border border-[#B9C8D7]/30 shadow-sm transition-colors hover:bg-slate-50 cursor-pointer outline-none">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                alt="Alex Johnson"
                className="w-[34px] h-[34px] rounded-full bg-[#B9C8D7]/20 shrink-0"
              />
              <div className="flex-1 min-w-0 text-left">
                <div className="text-[11px] font-normal text-[#B9C8D7] truncate leading-tight">Admin</div>
                <div className="text-[13px] font-bold text-[#202020] truncate leading-tight">
                  Alex Johnson
                </div>
              </div>
              <ChevronDown size={14} className="text-[#B9C8D7] shrink-0" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-full ml-2 bottom-0 w-[160px] rounded-[10px] bg-white border border-[#B9C8D7]/30 shadow-sm outline-none overflow-hidden z-50">
                <div className="p-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onOpenSettings()}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-bold transition-colors duration-150 ${
                          active ? 'bg-[#F5F5F5] text-[#202020]' : 'text-[#202020]'
                        }`}
                      >
                        <Settings01 size={16} strokeWidth={2} />
                        Pengaturan
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-bold transition-colors duration-150 ${
                          active ? 'bg-[#FF4628]/10 text-[#FF4628]' : 'text-[#FF4628]'
                        }`}
                      >
                        <LogOut01 size={16} strokeWidth={2} />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;
