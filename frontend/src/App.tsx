import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { LanguageProvider } from './context/LanguageContext';
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
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Unique Defensible Creator Features
import { ThumbnailTesterPage } from './pages/ThumbnailTesterPage';
import { TeleprompterPage } from './pages/TeleprompterPage';
import { SponsorshipCalculatorPage } from './pages/SponsorshipCalculatorPage';

import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-xs">Authenticating Studio Session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (user?.role !== 'ADMIN') {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-[#FFEFEA] border-2 border-[#FF5A36] rounded-2xl mx-auto flex items-center justify-center text-[#FF5A36] shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-[#121316] text-[#D2F800]">
            Role Restricted Zone
          </span>
          <h2 className="text-2xl font-black text-[#121316] mt-2 tracking-tight">Studio Administrator Privileges Required</h2>
        </div>
        <p className="text-xs text-[#6b6864] max-w-md mx-auto leading-relaxed">
          Your account is currently signed in as <strong className="text-[#121316] font-black">{user?.role}</strong> ({user?.name}). The Admin Console controls infrastructure health, database quotas, and studio user permissions.
        </p>
        <div className="pt-3">
          <Link
            to={
              user?.role === 'PRODUCER' ? '/app/production' :
              user?.role === 'CURATOR' ? '/app/discover' :
              user?.role === 'EDITOR' ? '/app/review' :
              '/app/ideas'
            }
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#121316] hover:bg-black text-white rounded-xl text-xs font-black shadow-md hover:translate-y-[-1px] transition-all"
          >
            <span>Return to {user?.role || 'Creator'} Workspace</span>
            <ArrowRight className="w-4 h-4 text-[#D2F800]" />
          </Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <SocketProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Studio App */}
              <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/app/home" replace />} />
                <Route path="home" element={<HomePage />} />
                <Route path="discover" element={<DiscoverPage />} />
                <Route path="ideas" element={<IdeasPage />} />
                <Route path="research" element={<ResearchPage />} />
                <Route path="blueprints" element={<BlueprintsPage />} />
                <Route path="production" element={<ProductionPage />} />
                <Route path="review" element={<ReviewStudioPage />} />
                <Route path="audience" element={<AudiencePage />} />
                <Route path="family" element={<ContentFamilyPage />} />
                <Route path="thumbnail-tester" element={<ThumbnailTesterPage />} />
                <Route path="teleprompter" element={<TeleprompterPage />} />
                <Route path="sponsorship-calculator" element={<SponsorshipCalculatorPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<ProfileSettingsPage />} />
                <Route path="admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SocketProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
