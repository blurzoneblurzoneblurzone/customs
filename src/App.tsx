import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Header';
import ScheduleView from './components/ScheduleView';
import AdminPanel from './components/AdminPanel';
import LoginForm from './components/LoginForm';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { isAdmin } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleAdminClick = () => {
    if (isAdmin) {
      setShowAdmin(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowAdmin(true);
  };

  const handleLoginClose = () => {
    setShowLogin(false);
  };

  const handleAdminClose = () => {
    setShowAdmin(false);
  };

  if (showAdmin) {
    return <AdminPanel onClose={handleAdminClose} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAdminClick={handleAdminClick} />
      <ScheduleView />
      
      {showLogin && (
        <LoginForm 
          onSuccess={handleLoginSuccess}
          onClose={handleLoginClose}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;