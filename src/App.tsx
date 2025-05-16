
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navigation/Navbar';
import { HomePage } from './pages/HomePage';
import { WalletPage } from './pages/WalletPage';
import { DashboardPage } from './pages/DashboardPage';
import { AppContent } from './components/AppContent';
import { WalletConnectProvider } from './providers/WalletConnectProvider';
import { ToastProvider } from './providers/ToastProvider';

function App() {
  return (
    <ToastProvider>
      <WalletConnectProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="*" element={<AppContent />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </WalletConnectProvider>
    </ToastProvider>
  );
}

export default App;
