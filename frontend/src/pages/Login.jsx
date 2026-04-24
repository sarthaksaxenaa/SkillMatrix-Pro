import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/signup`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        localStorage.setItem('userName', data.user || 'User');
        onLogin();
      } else {
        setError(data.detail || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="aurora-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="grid-overlay" />

      {/* Glass Card */}
      <div
        className="relative z-10 w-full max-w-md mx-4 animate-fade-in-scale"
      >
        <div className="animated-border rounded-3xl">
          <div className="glass-card p-10 rounded-3xl">

            {/* Logo */}
            <div className="text-center mb-10 animate-fade-in-up delay-100">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 opacity-20 blur-xl animate-breathe" />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <path d="M18 4L6 10V18C6 25.2 11.04 31.84 18 34C24.96 31.84 30 25.2 30 18V10L18 4Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" fill="none" opacity="0.9"/>
                    <path d="M13 18L16.5 21.5L24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-gradient tracking-tight">SkillMatrix Pro</h1>
              <p className="text-sm text-slate-400 mt-2 tracking-wide">AI-Powered Career Acceleration</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-8 animate-fade-in-up delay-200">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isLogin
                    ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-white shadow-lg shadow-indigo-500/10 border border-indigo-500/20'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  !isLogin
                    ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-white shadow-lg shadow-indigo-500/10 border border-indigo-500/20'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3 animate-fade-in-up">
                <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold">!</span>
                </div>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="animate-fade-in-up">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">Full Name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      autoComplete="name"
                      placeholder="Your name"
                      className="w-full pl-11 pr-4 py-3.5 glass-input text-sm"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="animate-fade-in-up delay-200">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M22 7l-10 6L2 7"/></svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    autoComplete="username"
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 glass-input text-sm"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="animate-fade-in-up delay-300">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    placeholder="Enter password"
                    className="w-full pl-11 pr-4 py-3.5 glass-input text-sm"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="animate-fade-in-up delay-400 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-white text-sm flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : (
                    <>
                      {isLogin ? 'Enter Dashboard' : 'Create Account'}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center animate-fade-in-up delay-500">
              <p className="text-xs text-slate-600">
                Powered by Groq AI
                <span className="mx-2 text-slate-700">|</span>
                Built for builders
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;