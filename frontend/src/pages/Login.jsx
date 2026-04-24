import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/register`;
    
    // Map fullName to name for Express backend
    const payload = {
        email: formData.email,
        password: formData.password,
        ...(isLogin ? {} : { name: formData.fullName })
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      
      if (response.ok && data.token) {
        // Login success
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name || 'User');
        onLogin();
      } else if (response.ok && data.msg === 'User registered successfully') {
        // Signup success, switch to login
        setIsLogin(true);
        setError('Account created! Please log in.');
      } else {
        setError(data.msg || data.error || data.detail || 'Authentication failed');
      }
    } catch {
      setError('Server connection failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#09090b' }}>

      {/* Subtle top glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, transparent 70%)' }} />

      <div className="w-full max-w-sm relative z-10">

        {/* Brand */}
        <div className="text-center mb-12 animate-enter">
          <h1 className="text-[42px] leading-none tracking-[-0.04em] font-bold mb-3">
            Skill<span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400, color: '#a1a1aa' }}>Matrix</span>
          </h1>
          <p className="text-sm text-zinc-500">AI-powered career acceleration</p>
        </div>

        {/* Card */}
        <div className="surface p-8 animate-enter delay-1">

          {/* Tabs */}
          <div className="flex gap-6 mb-8 border-b border-zinc-800 pb-4">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`text-sm pb-1 transition-colors relative ${
                isLogin ? 'text-white font-medium' : 'text-zinc-500 hover:text-zinc-400'
              }`}
              style={{ borderRadius: 0, background: 'transparent' }}
            >
              Sign in
              {isLogin && <div className="absolute -bottom-[17px] left-0 right-0 h-[1px] bg-white" />}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`text-sm pb-1 transition-colors relative ${
                !isLogin ? 'text-white font-medium' : 'text-zinc-500 hover:text-zinc-400'
              }`}
              style={{ borderRadius: 0, background: 'transparent' }}
            >
              Create account
              {!isLogin && <div className="absolute -bottom-[17px] left-0 right-0 h-[1px] bg-white" />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl text-sm text-red-400 bg-red-500/8 border border-red-500/15">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-enter">
                <label className="label block mb-2">Name</label>
                <input
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  placeholder="Your full name"
                  className="w-full px-4 py-3 text-sm"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            )}

            <div>
              <label className="label block mb-2">Email</label>
              <input
                type="email"
                name="email"
                autoComplete="username"
                placeholder="you@company.com"
                className="w-full px-4 py-3 text-sm"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="label block mb-2">Password</label>
              <input
                type="password"
                name="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder="Enter password"
                className="w-full px-4 py-3 text-sm"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                isLogin ? 'Continue' : 'Create account'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-600 mt-8 animate-enter delay-3">
          Powered by Groq AI  ·  Built for builders
        </p>
      </div>
    </div>
  );
};

export default Login;