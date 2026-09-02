import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { IoTProvider } from './context/IoTContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AcademicsView } from './components/AcademicsView';
import { MaterialsView } from './components/MaterialsView';
import { FacultyView } from './components/FacultyView';
import { GrievancesView } from './components/GrievancesView';
import { LostFoundView } from './components/LostFoundView';
import { BusTrackingView } from './components/BusTrackingView';
import { EventsView } from './components/EventsView';
import { AlumniView } from './components/AlumniView';
import { IoTDashboardView } from './components/IoTDashboardView';
import { AdminView } from './components/AdminView';
import { ProfileView } from './components/ProfileView';
import { AIChatDrawer } from './components/AIChatDrawer';
import { ToastAlert } from './components/ToastAlert';

const AppContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Adjust activeTab if current tab is restricted for a switched role
  useEffect(() => {
    if (activeTab === 'admin' && user?.role !== 'admin') {
      setActiveTab('dashboard');
    }
  }, [user, activeTab]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView setActiveTab={setActiveTab} />;
      case 'academics':
        return <AcademicsView />;
      case 'materials':
        return <MaterialsView />;
      case 'faculty':
        return <FacultyView />;
      case 'grievances':
        return <GrievancesView />;
      case 'lostfound':
        return <LostFoundView />;
      case 'buses':
        return <BusTrackingView />;
      case 'events':
        return <EventsView />;
      case 'alumni':
        return <AlumniView />;
      case 'iot':
        return <IoTDashboardView />;
      case 'admin':
        return user?.role === 'admin' ? <AdminView /> : <DashboardView setActiveTab={setActiveTab} />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      {/* Toast Alert for IoT Emergencies */}
      <ToastAlert />

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar
          onToggleAI={() => setIsAIOpen(!isAIOpen)}
          isAIOpen={isAIOpen}
          activeTheme={theme}
          onToggleTheme={toggleTheme}
          onProfileClick={() => setActiveTab('profile')}
        />

        <main className="page-body">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating AI Assistant Drawer */}
      <AIChatDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <IoTProvider>
        <AppContent />
      </IoTProvider>
    </AuthProvider>
  );
}
