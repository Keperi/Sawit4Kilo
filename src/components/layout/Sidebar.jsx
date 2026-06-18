import React, { memo, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  BarChart01,
  Dataflow03,
  Settings01,
  Settings02,
  LogOut01,
  ChevronDown,
  Server03,
} from '@untitledui/icons';
import AudioToggleSwitch from '../dashboard/AudioToggleSwitch';

const navItemsWithDividers = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart01 },
  { id: 'reports', label: 'Histori & Laporan', icon: Dataflow03 },
  { id: 'config', label: 'Konfigurasi', icon: Settings01 },
  { id: 'settings', label: 'Pengaturan ESP32', icon: Settings02 },
  { divider: true },
  { id: 'KDC01', label: 'KDC01', subtitle: 'Kolam Pengendap 1', icon: Server03, isNode: true, online: true },
  { id: 'KDC02', label: 'KDC02', subtitle: 'Kolam Pengendap 2', icon: Server03, isNode: true, online: false },
];

const Sidebar = memo(({ activePage, setActivePage }) => {
  return (
    <aside
      id="sidebar-nav"
      className="fixed left-0 top-0 w-[260px] h-screen flex flex-col z-30 bg-[#F5F5F5] border-r border-[#B9C8D7]/30"
    >
      <div className="flex flex-col h-full overflow-y-auto px-4 py-6">

        {/* ── 1. Top: Logo & Profile ── */}
        <div className="border-b border-[#B9C8D7]/30 pb-6 mb-4">
          <div className="flex items-center gap-3 mb-6 px-2">
            <img src="/assets/logo/Logo Kideco.svg" alt="Kideco Logo" className="h-7 object-contain" />
          </div>

          <div className="px-2">
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
                <Menu.Items className="absolute left-0 right-0 mt-2 rounded-[10px] bg-white border border-[#B9C8D7]/30 shadow-sm outline-none overflow-hidden z-50">
                  <div className="p-1">
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

        {/* ── 2. Dynamic Nav ── */}
        <div className="flex flex-col flex-1 px-2">
          {navItemsWithDividers.map((item, index) => {
            if (item.divider) {
              return <div key={`div-${index}`} className="border-b border-[#B9C8D7]/30 my-3 mx-1" />;
            }

            const Icon = item.icon;

            if (item.isNode) {
              return (
                <div
                  key={item.id}
                  className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-[10px] text-[13px] text-[#8C9BAF] transition-colors duration-150 hover:bg-[#B9C8D7]/10 cursor-pointer border border-transparent mt-1"
                >
                  <Icon size={18} strokeWidth={1.5} className="text-[#8C9BAF] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-bold text-[#202020]">
                      {item.label} <span className="font-normal text-[#B9C8D7]">— {item.subtitle}</span>
                    </div>
                  </div>
                  <div className={`w-[6px] h-[6px] rounded-full shrink-0 ${item.online ? 'bg-[#16A34A]' : 'bg-[#D1D5DB]'}`} />
                </div>
              );
            }

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

        {/* ── 3. Bottom ── */}
        <div className="border-t border-[#B9C8D7]/30 pt-4 px-2 mt-4">
          <div className="px-3">
            <AudioToggleSwitch />
          </div>
        </div>

      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;
