import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import ConfigPage from './pages/ConfigPage';
import Settings from './pages/Settings';
import GlobalDangerAlert from './components/layout/GlobalDangerAlert';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} />;
      case 'reports':
        return <HistoryPage />;
      case 'config':
        return <ConfigPage />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-brand-bg text-neutral-title flex flex-col md:flex-row overflow-hidden relative">
      {/* Fixed Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content — offset by sidebar width on desktop */}
      <main className="md:ml-[260px] flex-1 flex flex-col h-screen overflow-hidden">
        {renderPage()}
      </main>

      {/* Global Alert for non-dashboard pages */}
      <GlobalDangerAlert activePage={activePage} />
    </div>
  );
}

export default App;
