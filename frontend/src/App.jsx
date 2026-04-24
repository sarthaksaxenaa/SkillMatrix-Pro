import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Chatbot from './components/Chatbot';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [interviewConfig, setInterviewConfig] = useState({ role: '', mode: 'text' });

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    setCurrentPage('login');
  };

  const handleStartInterview = (role, mode) => {
    setInterviewConfig({ role, mode });
    setCurrentPage('interview');
  };

  const handleEndInterview = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen">
      {currentPage === 'login' && <Login onLogin={handleLogin} />}

      {currentPage === 'dashboard' && (
        <>
          <Dashboard onStartInterview={handleStartInterview} onLogout={handleLogout} />
          <Chatbot />
        </>
      )}

      {currentPage === 'interview' && (
        <Interview
          jobRole={interviewConfig.role}
          mode={interviewConfig.mode}
          onEnd={handleEndInterview}
        />
      )}
    </div>
  );
}

export default App;