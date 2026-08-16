import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { AttendanceModal } from './components/AttendanceModal';

import { Dashboard } from './pages/Dashboard';
import { AttendanceLog } from './pages/AttendanceLog';
import { BillingInvoice } from './pages/BillingInvoice';
import { MasterData } from './pages/MasterData';

const MainAppContent = () => {
  const { activeTab } = useApp();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'attendance':
        return <AttendanceLog />;
      case 'billing':
        return <BillingInvoice />;
      case 'masterdata':
        return <MasterData />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="content-body">
          {renderActivePage()}
        </main>
      </div>

      <AttendanceModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
