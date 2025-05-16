
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/navigation/Navbar';
import { HomePage } from './pages/HomePage';
import { WalletPage } from './pages/WalletPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { Toaster } from './components/ui/toaster';
import { GlobalErrorHandler } from './components/errors/GlobalErrorHandler';
import { ToastProvider } from './providers/ToastProvider';
import { SupabaseAuthProvider } from './providers/SupabaseAuthProvider';

function App() {
  return (
    <ToastProvider>
      <SupabaseAuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
          </div>
          <Toaster />
          <GlobalErrorHandler />
        </Router>
      </SupabaseAuthProvider>
    </ToastProvider>
  );
}

export default App;
