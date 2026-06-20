import React, { useState, useEffect, useContext } from 'react';
import { SensorContext } from '../context/SensorContext';
import { Settings01, User01, Server03, VolumeMax, Sliders01, Bell01, AlertCircle, X } from '@untitledui/icons';
import ProfileSettings from '../components/settings/ProfileSettings';
import ESP32Settings from '../components/settings/ESP32Settings';
import AudioSettings from '../components/settings/AudioSettings';
import ThresholdSettings from '../components/settings/ThresholdSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import AboutSettings from '../components/settings/AboutSettings';
import DeveloperSettings from '../components/settings/DeveloperSettings';

const tabs = [
  { id: 'profile', label: 'Profil', icon: User01, group: 'PROFIL' },
  { id: 'esp32', label: 'Pengaturan ESP32', icon: Server03, group: 'PERANGKAT' },
  { id: 'audio', label: 'Audio & Alarm', icon: VolumeMax, group: 'PERANGKAT' },
  { id: 'threshold', label: 'Threshold', icon: Sliders01, group: 'PERANGKAT' },
  { id: 'notification', label: 'Notifikasi', icon: Bell01, group: 'SISTEM' },
  { id: 'about', label: 'Tentang', icon: AlertCircle, group: 'SISTEM' },
  { id: 'developer', label: 'Developer', icon: User01, group: 'LAINNYA' },
];

const SettingsPage = ({ isOpen, onClose }) => {
  const { systemStatus } = useContext(SensorContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileView, setMobileView] = useState('menu'); // 'menu' or 'content'
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMobileView('menu');
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsVisible(false);
      onClose();
    }, 200);
  };

  if (!isOpen && !isClosing) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'esp32':
        return <ESP32Settings />;
      case 'audio':
        return <AudioSettings />;
      case 'threshold':
        return <ThresholdSettings />;
      case 'notification':
        return <NotificationSettings />;
      case 'about':
        return <AboutSettings />;
      case 'developer':
        return <DeveloperSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  const groupedTabs = tabs.reduce((acc, tab) => {
    if (!acc[tab.group]) acc[tab.group] = [];
    acc[tab.group].push(tab);
    return acc;
  }, {});

  const opacity = isClosing ? 'opacity-0' : 'opacity-100';
  const scale = isClosing ? 'scale-95' : 'scale-100';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${opacity}`}
        onClick={handleClose}
      />

      <div className={`relative w-full max-w-[900px] h-[85vh] bg-white rounded-[16px] border border-[#EAECF0] shadow-xl flex flex-col md:flex-row overflow-hidden transition-all duration-200 ${opacity} ${scale}`}>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-[32px] h-[32px] rounded-[8px] bg-[#F7F8FA] border border-[#EAECF0] flex items-center justify-center cursor-pointer hover:bg-[#F5F5F5] transition-colors"
        >
          <X size={16} strokeWidth={2} className="text-[#8C9BAF]" />
        </button>

        {/* Sidebar menu */}
        <div className={`shrink-0 p-4 overflow-y-auto ${
          mobileView === 'content'
            ? 'hidden md:block'
            : 'w-full md:w-[240px] flex-1 md:flex-none border-b md:border-b-0 md:border-r border-[#EAECF0]'
        }`}>
          <div className="flex items-center gap-2 mb-6 px-3">
            <Settings01 size={18} strokeWidth={2} className="text-[#202020]" />
            <span className="text-[15px] font-bold text-[#202020]">Pengaturan</span>
          </div>

          {Object.entries(groupedTabs).map(([group, items]) => (
            <div key={group} className="mb-4">
              <div className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#B9C8D7] px-3 mb-2">
                {group}
              </div>
              <div className="flex flex-col gap-1">
                {items.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileView('content');
                      }}
                      className={`
                        w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] transition-all duration-150 text-left
                        ${isActive
                          ? 'bg-[#F5F5F5] text-[#202020] font-bold'
                          : 'text-[#8C9BAF] font-medium hover:bg-[#F7F8FA] hover:text-[#202020]'}
                      `}
                    >
                      <Icon size={16} strokeWidth={2} className={isActive ? 'text-[#202020]' : 'text-[#B9C8D7]'} />
                      {tab.label}
                      {isActive && (
                        <svg className="w-4 h-4 ml-auto text-[#202020]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className={`flex-1 p-5 sm:p-6 overflow-y-auto ${
          mobileView === 'menu' ? 'hidden md:block' : 'block'
        }`}>
          {/* Back button on mobile */}
          <div className="md:hidden flex items-center mb-6 border-b border-[#EAECF0] pb-4">
            <button
              onClick={() => setMobileView('menu')}
              className="flex items-center gap-2 text-[14px] font-bold text-[#8C9BAF] hover:text-[#202020] transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Kembali ke Menu
            </button>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
