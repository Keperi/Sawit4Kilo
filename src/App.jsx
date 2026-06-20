import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import ConfigPage from './pages/ConfigPage';
import Settings from './pages/Settings';
import DevicePage from './pages/DevicePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import GlobalDangerAlert from './components/layout/GlobalDangerAlert';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} onOpenSidebar={openSidebar} />;
      case 'reports':
        return <HistoryPage onOpenSidebar={openSidebar} />;
      case 'config':
        return <ConfigPage onOpenSidebar={openSidebar} />;
      case 'settings':
        return <Settings onOpenSidebar={openSidebar} />;
      case 'device':
        return <DevicePage setActivePage={setActivePage} onOpenSidebar={openSidebar} />;
      case 'analytics':
        return <AnalyticsPage onOpenSidebar={openSidebar} />;
      default:
        return <DashboardPage setActivePage={setActivePage} onOpenSidebar={openSidebar} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-brand-bg text-neutral-title flex flex-col md:flex-row overflow-hidden relative">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <main className="md:ml-[260px] flex-1 flex flex-col h-screen overflow-hidden">
        {renderPage()}
      </main>

      <GlobalDangerAlert activePage={activePage} />

      <SettingsPage isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default App;
