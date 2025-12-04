import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MainLayout } from './layout/MainLayout';
import { SignalsPage } from './pages/SignalsPage';
import { HistoryPage } from './pages/HistoryPage';
import { BinanceAdminPage } from './pages/BinanceAdminPage';
import { SettingsPage } from './pages/SettingsPage';
import PositionsPage from './pages/PositionsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/signals" replace />} />
                  <Route path="/signals" element={<SignalsPage />} />
                  <Route path="/positions" element={<PositionsPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  
                  {/* Admin-only route */}
                  <Route
                    path="/admin/binance"
                    element={
                      <ProtectedRoute requiredRole="ROLE_ADMIN">
                        <BinanceAdminPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
