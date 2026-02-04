import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview'; // Import the new page
import Chatbot from './components/Chatbot';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [interviewConfig, setInterviewConfig] = useState({ role: '', mode: 'text' });

  const handleLogin = () => setCurrentPage('dashboard');
  const handleLogout = () => setCurrentPage('login');

  // Logic to switch to Interview Mode
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
          role={interviewConfig.role} 
          mode={interviewConfig.mode} 
          onEndSession={handleEndInterview} 
        />
      )}
    </div>
  );
}

export default App;