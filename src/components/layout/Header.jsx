import React, { memo, useContext, useState, useEffect, useRef } from 'react';
import { Bell01, AlertTriangle, CheckCircle, AlertCircle } from '@untitledui/icons';
import { SensorContext } from '../../context/SensorContext';

const Header = memo(({
  selectedNode,
  onNodeChange,
  systemStatus,
  userName = 'Admin',
  title,
  subtitle,
  showNodeSelector = false,
  showStatusBadge = true,
}) => {
  const { showDangerToast, setShowDangerToast, notifications, setNotifications } = useContext(SensorContext);
  const isDanger = systemStatus === 'BAHAYA';
  const isGreetingMode = !title;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications ? notifications.filter((n) => n.unread).length : 0;

  const handleMarkAllRead = () => {
    if (setNotifications) {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, unread: false }))
      );
    }
  };

  return (
    <header
      id="header-bar"
      className="bg-white border-b border-[#B9C8D7]/30 flex items-center justify-between px-6 py-4 shrink-0 relative"
    >
      <div className="flex items-center gap-4">
        {isGreetingMode ? (
          <>
            <h2 className="text-[16px] font-bold text-[#202020] leading-tight">
              Welcome back, {userName?.split(' ')[0] || 'Admin'}!
            </h2>
            <p className="text-[12px] text-[#B9C8D7]">
              Monitoring KIDECO Mining Water Quality
            </p>
          </>
        ) : (
          <h1 className="text-[16px] font-bold text-[#202020]">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {showStatusBadge && systemStatus && (
          systemStatus === 'OFFLINE' ? (
            <div data-testid="offline-badge" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-100 text-slate-500 text-[11px] font-bold select-none">
              <AlertCircle size={12} strokeWidth={2} />
              Offline
            </div>
          ) : isDanger ? (
            <button
              data-testid="danger-badge-btn"
              onClick={() => setShowDangerToast((prev) => !prev)}
              title="Klik untuk tampilkan/sembunyikan detail peringatan"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#FF4628]/20 bg-[#FF4628]/10 text-[#FF4628] text-[11px] font-bold cursor-pointer hover:bg-[#FF4628]/20 transition-all select-none active:scale-95 outline-none shadow-3xs"
            >
              <AlertTriangle size={12} strokeWidth={2} />
              Bahaya
            </button>
          ) : (
            <div data-testid="safe-badge" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#16A34A]/20 bg-[#16A34A]/10 text-[#16A34A] text-[11px] font-bold">
              <CheckCircle size={12} strokeWidth={2} />
              Aman
            </div>
          )
        )}

        {showNodeSelector && (
          <select
            id="node-selector"
            value={selectedNode}
            onChange={(e) => onNodeChange(e.target.value)}
            className="h-[32px] px-3 bg-white border border-[#EAECF0] rounded-[8px] text-[12px] font-medium text-[#202020] cursor-pointer outline-none transition-colors focus:border-[#FF4628]"
          >
            <option value="KDC01">KDC01</option>
            <option value="KDC02">KDC02</option>
          </select>
        )}

        {/* Notification Bell with Dropdown Wrapper */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="relative w-[32px] h-[32px] rounded-[8px] bg-white border border-[#EAECF0] flex items-center justify-center cursor-pointer text-[#B9C8D7] transition-colors hover:bg-[#F7F8FA] outline-none"
            title="Notifikasi"
          >
            <Bell01 size={16} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 rounded-full bg-[#FF4628] text-white text-[8px] font-bold flex items-center justify-center border border-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 top-[40px] w-[300px] bg-white border border-[#EAECF0] rounded-[12px] shadow-lg z-50 overflow-hidden">
              {/* Dropdown Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#EAECF0]">
                <span className="text-[12px] font-bold text-[#202020]">Notifikasi Terbaru</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-bold text-[#FF4628] hover:text-[#FF4628]/80 cursor-pointer transition-colors"
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>

              {/* Dropdown Body / Notification List */}
              <div className="max-h-[260px] overflow-y-auto divide-y divide-[#F2F4F7]">
                {notifications && notifications.map((notif) => {
                  const isUnread = notif.unread;
                  let IconComponent = CheckCircle;
                  let iconBgClass = 'text-[#16A34A] bg-[#16A34A]/10';
                  
                  if (notif.type === 'DANGER') {
                    IconComponent = AlertTriangle;
                    iconBgClass = 'text-[#FF4628] bg-[#FF4628]/10';
                  } else if (notif.type === 'OFFLINE') {
                    IconComponent = AlertCircle;
                    iconBgClass = 'text-[#D97706] bg-[#D97706]/10';
                  }

                  return (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 p-3 transition-colors ${
                        isUnread ? 'bg-[#FF4628]/5' : 'hover:bg-[#F9FAFB]'
                      }`}
                    >
                      <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 ${iconBgClass}`}>
                        <IconComponent size={13} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[12px] leading-snug ${isUnread ? 'font-bold text-[#202020]' : 'font-medium text-[#475467]'}`}>
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-[#B9C8D7] mt-1 block">
                          {notif.time}
                        </span>
                      </div>
                      {isUnread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4628] mt-1.5 shrink-0" />
                      )}
                    </div>
                  );
                })}

                {(!notifications || notifications.length === 0) && (
                  <div className="py-8 text-center text-[12px] text-[#B9C8D7]">
                    Tidak ada notifikasi baru
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;
