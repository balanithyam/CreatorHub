app_code = r"""import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Layout } from './components/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { IdeasPage } from './pages/IdeasPage';
import { ResearchPage } from './pages/ResearchPage';
import { BlueprintsPage } from './pages/BlueprintsPage';
import { ProductionPage } from './pages/ProductionPage';
import { ReviewStudioPage } from './pages/ReviewStudioPage';
import { AudiencePage } from './pages/AudiencePage';
import { ContentFamilyPage } from './pages/ContentFamilyPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-mono text-xs text-[#6B6864]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#FF5A36] border-t-transparent rounded-full animate-spin" />
          <span>Authenticating studio session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Studio App Routes */}
            <Route path="/app" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/app/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/app/discover" element={<ProtectedRoute><DiscoverPage /></ProtectedRoute>} />
            <Route path="/app/ideas" element={<ProtectedRoute><IdeasPage /></ProtectedRoute>} />
            <Route path="/app/research" element={<ProtectedRoute><ResearchPage /></ProtectedRoute>} />
            <Route path="/app/blueprints" element={<ProtectedRoute><BlueprintsPage /></ProtectedRoute>} />
            <Route path="/app/production" element={<ProtectedRoute><ProductionPage /></ProtectedRoute>} />
            <Route path="/app/review" element={<ProtectedRoute><ReviewStudioPage /></ProtectedRoute>} />
            <Route path="/app/audience" element={<ProtectedRoute><AudiencePage /></ProtectedRoute>} />
            <Route path="/app/family" element={<ProtectedRoute><ContentFamilyPage /></ProtectedRoute>} />
            <Route path="/app/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/app/profile" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
            <Route path="/app/settings" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
"""

with open(r'D:\CreatorHub\frontend\src\App.tsx', 'w', encoding='utf-8') as f:
    f.write(app_code.strip())

print("Updated App.tsx routes successfully!")
