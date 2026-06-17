import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import DevicePage from './pages/DevicePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import GlobalDangerAlert from './components/layout/GlobalDangerAlert';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} />;
      case 'reports':
        return <HistoryPage />;
      case 'device':
        return <DevicePage setActivePage={setActivePage} />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <DashboardPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-brand-bg text-neutral-title flex flex-col md:flex-row overflow-hidden relative">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenSettings={() => setIsSettingsOpen(true)}
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
