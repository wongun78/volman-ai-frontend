import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MainLayout } from './layout/MainLayout';
import { SignalsPage } from './pages/SignalsPage';
import { HistoryPage } from './pages/HistoryPage';
import { BinanceAdminPage } from './pages/BinanceAdminPage';
import { SettingsPage } from './pages/SettingsPage';
import PositionsPage from './pages/PositionsPage';

function App() {
  return (
    <>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/signals" replace />} />
          <Route path="/signals" element={<SignalsPage />} />
          <Route path="/positions" element={<PositionsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/admin/binance" element={<BinanceAdminPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </MainLayout>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
