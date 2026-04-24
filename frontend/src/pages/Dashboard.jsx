import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import SkillsChart from '../components/SkillsChart';
import { apiUpload, apiPost } from '../config/api';
import { COMMON_ROLES, CHART_COLORS as COLORS, BAR_COLORS, LOADING_STEPS } from '../config/constants';

// Inline SVG icon components (replacing Lucide)
const Icon = ({ d, size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{typeof d === 'string' ? <path d={d}/> : d}</svg>
);
const TargetIcon = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>}/>;
const HistoryIcon = (p) => <Icon {...p} d={<><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></>}/>;
const ZapIcon = (p) => <Icon {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>;
const LogOutIcon = (p) => <Icon {...p} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>}/>;
const FileIcon = (p) => <Icon {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>}/>;
const SearchIcon = (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>}/>;
const TrashIcon = (p) => <Icon {...p} d={<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>}/>;
const ChevronRightIcon = (p) => <Icon {...p} d="M9 18l6-6-6-6"/>;
const ClockIcon = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}/>;
const CheckIcon = (p) => <Icon {...p} d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>}/>;
const MicIcon = (p) => <Icon {...p} d={<><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>}/>;
const BriefcaseIcon = (p) => <Icon {...p} d={<><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>}/>;
const BookIcon = (p) => <Icon {...p} d={<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>}/>;
const FlameIcon = (p) => <Icon {...p} d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>;
const ExternalLinkIcon = (p) => <Icon {...p} d={<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>}/>;

const Dashboard = ({ onStartInterview, onLogout }) => {
  const [userName] = useState(localStorage.getItem('userName') || 'User');
  const [targetRole, setTargetRole] = useState('');
  const [file, setFile] = useState(null);
  const [roleSuggestions, setRoleSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewState, setViewState] = useState('input'); 
  const [analysisData, setAnalysisData] = useState(null);
  const [resumeHistory, setResumeHistory] = useState([]);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  // --- Gamification State ---
  const [streak, setStreak] = useState(3);

  // --- NEW: Fixer State ---
  const [showFixModal, setShowFixModal] = useState(false);
  const [fixedPoints, setFixedPoints] = useState([]);
  const [isFixing, setIsFixing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('resumeHistory');
    if (saved) setResumeHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    let interval;
    if (viewState === 'analyzing') {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [viewState]);

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setTargetRole(value);
    if (value.length > 0) {
      setRoleSuggestions(COMMON_ROLES.filter(r => r.toLowerCase().includes(value.toLowerCase())));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectRole = (role) => {
    setTargetRole(role);
    setShowSuggestions(false);
  };

  const saveToHistory = (role, fileName, data) => {
    const newEntry = {
      id: Date.now(),
      role: role,
      fileName: fileName,
      date: new Date().toLocaleDateString(),
      score: data.readiness_score,
      fullData: data
    };
    const updatedHistory = [newEntry, ...resumeHistory];
    setResumeHistory(updatedHistory);
    localStorage.setItem('resumeHistory', JSON.stringify(updatedHistory));
  };

  const deleteHistoryItem = (e, id) => {
    e.stopPropagation();
    const updated = resumeHistory.filter(item => item.id !== id);
    setResumeHistory(updated);
    localStorage.setItem('resumeHistory', JSON.stringify(updated));
  };

  const loadHistoryItem = (item) => {
    setAnalysisData(item.fullData);
    setTargetRole(item.role);
    setViewState('results');
  };

  const handleAnalyze = async () => {
    if (!file || !targetRole) return alert("Please enter a role and upload a resume!");

    setViewState('analyzing');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_role', targetRole);

    try {
      const data = await apiUpload('/api/analyze-resume', formData);

      // If Backend says it's not a resume, stop
      if (data.error === "Not a Resume") {
          alert("ERROR: " + data.message);
          setViewState('input');
          return;
      }

      // Generic fallback (e.g., AI down)
      if (data.error && !data.roast) {
         const dummyData = {
           roast: "Resume not found? No worries, let's pretend it's perfect.",
           readiness_score: 70,
           missing_basic_skills: [],
           global_standing: { you: 70, average: 60, top_performer: 90 },
           skill_importance_data: [],
           pro_recommendations: ["System Design"],
           has_skills: true
        };
        setTimeout(() => {
            setAnalysisData(dummyData);
            saveToHistory(targetRole, file.name, dummyData);
            setViewState('results');
        }, 3000);
        return;
      }

      setTimeout(() => {
        setAnalysisData(data);
        saveToHistory(targetRole, file.name, data);
        setViewState('results');
      }, 4000);

    } catch (error) {
      console.error(error);
      alert("Analysis failed, switching to demo mode.");
      setViewState('input');
    }
  };

  const openNotes = (query) => window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  const openVideo = (query) => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');

  const openJobSearch = (platform) => {
    if (!targetRole) return;
    let url = "";
    const query = encodeURIComponent(targetRole);
    if (platform === 'linkedin') url = `https://www.linkedin.com/jobs/search/?keywords=${query}`;
    if (platform === 'indeed') url = `https://www.indeed.com/jobs?q=${query}`;
    if (platform === 'glassdoor') url = `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${query}`;
    window.open(url, '_blank');
  };

  const handleFixResume = async () => {
    if (!analysisData) return;
    setIsFixing(true);
    setShowFixModal(true);

    try {
      const data = await apiPost('/fix-resume', {
        resume_text: "My resume content...",
        job_role: targetRole
      });
      setFixedPoints(data.fixed_points || []);
    } catch (error) {
      console.error(error);
      setFixedPoints(["Error connecting to AI Fixer."]);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="min-h-screen flex relative" style={{ background: '#050510', color: '#f1f5f9' }}>
      <div className="aurora-bg"><div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" /></div>
      <div className="grid-overlay" />

      {/* --- SIDEBAR --- */}
      <aside className="w-64 hidden md:flex flex-col p-6 fixed h-full z-20 border-r border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white font-black text-xl">S</div>
          <span className="text-2xl font-extrabold tracking-tight">Skill<span className="text-gradient">Matrix</span></span>
        </div>

        <nav className="space-y-2 flex-1">
          <button onClick={() => setViewState('input')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${viewState === 'input' || viewState === 'results' || viewState === 'analyzing' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'}`}>
            <TargetIcon size={18} /> Career Coach
          </button>
          <button onClick={() => setViewState('history')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${viewState === 'history' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'}`}>
            <HistoryIcon size={18} /> My Resumes
          </button>
          <button onClick={() => setViewState('interviews')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${viewState === 'interviews' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'}`}>
            <ZapIcon size={18} /> Interviews
          </button>
        </nav>

        <button onClick={onLogout} className="flex items-center gap-2 text-rose-400/70 text-sm font-semibold hover:text-rose-400 mt-auto pl-3 transition-colors">
          <LogOutIcon size={16} /> Sign Out
        </button>
      </aside>

      <main className="flex-1 md:ml-64 p-8 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* --- HEADER --- */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                {viewState === 'interviews' ? <span className="text-gradient">Interview Arena</span> :
                 viewState === 'history' ? <span className="text-gradient">Your Journey</span> :
                 <span>Career <span className="text-gradient">Coach</span></span>}
              </h1>
              <p className="text-slate-400 font-medium text-lg">
                {viewState === 'interviews' ? 'Sharpen your skills with AI mock interviews.' :
                 viewState === 'history' ? 'Track your progress over time.' :
                 'Let\'s build your path to that dream job.'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-orange-500/10 text-orange-400 px-4 py-2 rounded-full border border-orange-500/20 font-semibold text-sm">
                <FlameIcon size={16} /> {streak} Day Streak
              </div>
              <div className="hidden sm:block">
                <div className="px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.04] font-semibold text-indigo-300 flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {userName}
                </div>
              </div>
            </div>
          </div>

          {/* --- INPUT VIEW --- */}
          {viewState === 'input' && (
            <div className="glass-card p-10 text-center max-w-2xl mx-auto mt-10 animate-fade-in-up relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500"></div>

              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-indigo-500/10 border border-indigo-500/20">
                <TargetIcon size={36} className="text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Check Eligibility</h2>
              <p className="text-slate-400 mb-8 text-lg">Enter your dream role and upload your resume to get started.</p>

              <div className="space-y-6 text-left relative">
                <div className="relative">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">Target Job Role</label>
                  <input type="text" value={targetRole} onChange={handleRoleChange} onFocus={() => targetRole && setShowSuggestions(true)} placeholder="e.g. SDE-1, Data Analyst..." className="w-full p-4 font-semibold text-lg glass-input" />
                  {showSuggestions && roleSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 shadow-2xl z-50 max-h-60 overflow-y-auto rounded-xl border border-white/[0.08]" style={{ background: 'rgba(15,15,30,0.95)', backdropFilter: 'blur(20px)' }}>
                      {roleSuggestions.map((role, i) => (
                        <div key={i} onClick={() => selectRole(role)} className="p-3 hover:bg-indigo-500/10 cursor-pointer text-slate-300 font-medium border-b border-white/[0.04] last:border-0">
                          {role}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">Resume (PDF)</label>
                  <div className="border-2 border-dashed border-white/[0.1] rounded-xl p-8 text-center cursor-pointer hover:bg-white/[0.03] hover:border-indigo-500/30 transition-all relative">
                    <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <FileIcon className="mx-auto text-slate-500 mb-2" size={32} />
                    <p className="text-slate-400 font-semibold">{file ? <span className="text-indigo-400">{file.name}</span> : "Click to select PDF"}</p>
                  </div>
                </div>
                <button onClick={handleAnalyze} className="btn-primary w-full py-4 text-white text-lg mt-4">
                  Analyze Profile
                </button>
              </div>
            </div>
          )}

          {/* --- HISTORY VIEW --- */}
          {viewState === 'history' && (
            <div className="animate-fade-in-up max-w-4xl mx-auto">
              {resumeHistory.length === 0 ? (
                <div className="text-center py-20 glass-card">
                   <HistoryIcon size={48} className="mx-auto text-slate-600 mb-4" />
                   <h3 className="text-xl font-bold text-slate-300">No History Yet</h3>
                   <p className="text-slate-500 mt-2">Analyze a resume to save it here automatically.</p>
                   <button onClick={() => setViewState('input')} className="mt-6 text-indigo-400 font-bold hover:underline">Go to Analyzer</button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {resumeHistory.map((item) => (
                    <div key={item.id} onClick={() => loadHistoryItem(item)} className="glass-card p-6 cursor-pointer flex items-center justify-between group">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${item.score >= 80 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : item.score >= 50 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'}`}>
                          {item.score}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{item.role}</h3>
                          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                             <span className="flex items-center gap-1"><FileIcon size={14}/> {item.fileName}</span>
                             <span className="flex items-center gap-1"><ClockIcon size={14}/> {item.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-sm">View Report <ChevronRightIcon size={16}/></span>
                        <button onClick={(e) => deleteHistoryItem(e, item.id)} className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"><TrashIcon size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- INTERVIEWS VIEW --- */}
          {viewState === 'interviews' && (
            <div className="animate-fade-in-up grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="glass-card p-8 group cursor-pointer relative overflow-hidden" onClick={() => { if(!file) return alert("Please upload a resume in the Career Coach tab first!"); onStartInterview(targetRole || 'Software Engineer', 'text'); }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform bg-blue-500/10 border border-blue-500/20"><FileIcon size={28} /></div>
                <h3 className="text-xl font-bold mb-2">Resume-Based</h3>
                <p className="text-slate-400 mb-6 text-sm font-medium leading-relaxed">Deep dive into your specific projects, experience, and claimed skills.</p>
                <button className="text-blue-400 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">Start Resume Mock <ChevronRightIcon size={16} /></button>
              </div>

              <div className="glass-card p-8 group cursor-pointer relative overflow-hidden" onClick={() => { const role = targetRole || prompt("Enter the field you want to practice:", "Software Engineer"); if(role) onStartInterview(role, 'text'); }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform bg-violet-500/10 border border-violet-500/20"><BriefcaseIcon size={28} /></div>
                <h3 className="text-xl font-bold mb-2">Field-Based</h3>
                <p className="text-slate-400 mb-6 text-sm font-medium leading-relaxed">Standard industry questions for your target role. Perfect for testing theory.</p>
                <button className="text-violet-400 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">Start Field Mock <ChevronRightIcon size={16} /></button>
              </div>

              <div className="glass-card p-8 group cursor-pointer relative overflow-hidden border-indigo-500/20 animate-pulse-glow" onClick={() => onStartInterview(targetRole || 'Software Engineer', 'voice')}>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5" />
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-300 mb-6 group-hover:scale-110 transition-transform bg-indigo-500/10 border border-indigo-500/20 relative z-10"><MicIcon size={28} /></div>
                <h3 className="text-xl font-bold mb-2 relative z-10">Pro Voice Interview</h3>
                <p className="text-slate-400 mb-6 text-sm font-medium leading-relaxed relative z-10">Real-time voice conversation combining resume details AND field knowledge.</p>
                <button className="btn-primary text-white font-semibold flex items-center gap-2 px-4 py-2 relative z-10">Start Speaking <ZapIcon size={16} /></button>
              </div>
            </div>
          )}

          {/* --- LOADING SCREEN --- */}
          {viewState === 'analyzing' && (
            <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in-up">
              <div className="relative mb-8">
                 <div className="w-24 h-24 border-2 border-white/[0.06] rounded-full" />
                 <div className="w-24 h-24 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <TargetIcon className="text-indigo-400 animate-pulse" size={32} />
                 </div>
              </div>

              <h2 className="text-2xl font-bold mb-6 text-center">
                {LOADING_STEPS[loadingStepIndex]}
              </h2>

              <div className="flex flex-col gap-3 w-80 glass-card p-6">
                {LOADING_STEPS.map((step, i) => (
                   <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i <= loadingStepIndex ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-4'}`}>
                      {i < loadingStepIndex ? <CheckIcon size={18} className="text-emerald-400"/> :
                       i === loadingStepIndex ? <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/> :
                       <div className="w-4 h-4 rounded-full border border-white/[0.1]"/>}
                      <span className={i === loadingStepIndex ? "font-semibold text-indigo-300" : "text-slate-500 font-medium"}>{step}</span>
                   </div>
                ))}
              </div>
            </div>
          )}

          {/* --- RESULTS VIEW --- */}
          {viewState === 'results' && analysisData && (
            <div className="animate-fade-in-up space-y-8">
              <div className="glass-card p-6 flex items-start gap-4 border-orange-500/20" style={{ background: 'rgba(249,115,22,0.05)' }}>
                <div className="text-3xl">*</div>
                <div>
                  <h3 className="font-bold text-orange-400 text-xs uppercase tracking-widest mb-1">Reality Check (Friendly Roast)</h3>
                  <p className="text-orange-200/80 font-medium text-lg italic leading-relaxed">"{analysisData.roast}"</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="glass-card p-6 flex flex-col items-center justify-center">
                  <h3 className="text-slate-400 font-semibold mb-4 uppercase tracking-widest text-xs">Role Readiness</h3>
                  <div className="w-48 h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{ value: analysisData.readiness_score }, { value: 100 - analysisData.readiness_score }]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                          <Cell fill="#6366f1" />
                          <Cell fill="rgba(255,255,255,0.05)" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center text-5xl font-black text-gradient tracking-tighter">{analysisData.readiness_score}%</div>
                  </div>
                </div>

                <div className="glass-card p-6 lg:col-span-2">
                  <h3 className="font-bold text-slate-300 mb-6">Global Competition Standing</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{ name: 'You', score: analysisData.global_standing?.you || 0 }, { name: 'Average', score: analysisData.global_standing?.average || 60 }, { name: 'Top Tier', score: analysisData.global_standing?.top_performer || 90 }]} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 14, fontWeight: 600, fill: '#94a3b8'}} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,15,30,0.9)', color: '#f1f5f9'}} />
                        <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={32}>
                           <Cell fill="#6366f1" />
                           <Cell fill="#3b82f6" />
                           <Cell fill="#10b981" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <SkillsChart />

              {/* JOB SEARCH & AI FIXER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="glass-card p-8">
                    <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2"><BriefcaseIcon size={20}/> Who is hiring for "{targetRole}"?</h3>
                    <div className="flex gap-3">
                       <button onClick={() => openJobSearch('linkedin')} className="flex-1 py-3 rounded-xl font-semibold text-slate-300 hover:text-blue-400 transition-colors flex items-center justify-center gap-2 border border-white/[0.08] bg-white/[0.03] hover:border-blue-500/30"><SearchIcon size={16}/> LinkedIn</button>
                       <button onClick={() => openJobSearch('indeed')} className="flex-1 py-3 rounded-xl font-semibold text-slate-300 hover:text-blue-400 transition-colors flex items-center justify-center gap-2 border border-white/[0.08] bg-white/[0.03] hover:border-blue-500/30"><SearchIcon size={16}/> Indeed</button>
                       <button onClick={() => openJobSearch('glassdoor')} className="flex-1 py-3 rounded-xl font-semibold text-slate-300 hover:text-emerald-400 transition-colors flex items-center justify-center gap-2 border border-white/[0.08] bg-white/[0.03] hover:border-emerald-500/30"><SearchIcon size={16}/> Glassdoor</button>
                    </div>
                 </div>

                 <div className="glass-card p-8 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-200 mb-1 flex items-center gap-2"><ZapIcon size={20}/> Resume Fixer AI</h3>
                      <p className="text-slate-400 text-sm">Generate better bullet points instantly.</p>
                    </div>
                    <button onClick={handleFixResume} className="btn-primary text-white px-6 py-3 flex items-center gap-2">
                       Fix My Resume <ZapIcon size={16}/>
                    </button>
                 </div>
              </div>

              <h3 className="text-2xl font-bold flex items-center gap-3 mt-8">
                <BookIcon className="text-indigo-400" /> Missing Basic Skills <span className="text-sm font-medium text-slate-500 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">Action Plan</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysisData.missing_basic_skills && analysisData.missing_basic_skills.map((item, i) => (
                  <div key={i} className="glass-card p-6 group">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                      {item.skill}
                    </h4>
                    <div className="space-y-3 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openNotes(item.notes_topic)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-semibold hover:bg-emerald-500/15 transition-colors text-sm border border-emerald-500/20"><FileIcon size={16} /> Read Notes</button>
                      <button onClick={() => openVideo(item.video_topic)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/10 text-rose-400 font-semibold hover:bg-rose-500/15 transition-colors text-sm border border-rose-500/20"><ExternalLinkIcon size={16} /> Watch Video</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card p-8">
                <h3 className="font-bold text-slate-300 mb-6">Current Skill Impact Analysis</h3>
                {analysisData.has_skills ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analysisData.skill_importance_data || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="skill" tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,15,30,0.9)', color: '#f1f5f9'}} />
                        <Line type="monotone" dataKey="importance" stroke="#6366f1" strokeWidth={3} dot={{r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#050510'}} activeDot={{r: 7}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-10 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                    <TargetIcon size={48} className="mx-auto text-indigo-400 mb-4" />
                    <h4 className="text-xl font-bold text-indigo-300">A Fresh Start!</h4>
                    <p className="text-indigo-400/70 mt-2 max-w-lg mx-auto">"{analysisData.motivational_msg}"</p>
                  </div>
                )}
              </div>

              <div className="text-center pt-10 pb-4">
                 <button onClick={() => setViewState('input')} className="text-slate-500 hover:text-indigo-400 font-semibold flex items-center justify-center gap-2 mx-auto transition-colors"><SearchIcon size={16}/> Analyze Another Role</button>
              </div>
            </div>
          )}

          {/* --- RESUME FIXER MODAL --- */}
          {showFixModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-up">
              <div className="glass-card p-8 max-w-lg w-full relative">
                 <button onClick={() => setShowFixModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                 </button>

                 <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto bg-violet-500/15 border border-violet-500/20">
                    <ZapIcon size={32} className="text-violet-400" />
                 </div>

                 <h3 className="text-2xl font-bold text-center mb-2">AI Resume Upgrade</h3>
                 <p className="text-center text-slate-400 mb-8">Copy these "Power Bullets" to your resume.</p>

                 {isFixing ? (
                    <div className="flex flex-col items-center py-8">
                       <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                       <p className="text-violet-400 font-semibold animate-pulse">Polishing your achievements...</p>
                    </div>
                 ) : (
                    <div className="space-y-4">
                       {fixedPoints.map((point, i) => (
                          <div key={i} className="glass-card p-4 text-slate-300 font-medium flex gap-3">
                             <div className="mt-1 text-emerald-400"><CheckIcon size={18} /></div>
                             {point}
                          </div>
                       ))}
                       <button onClick={() => setShowFixModal(false)} className="btn-primary w-full py-4 text-white mt-4">
                          Done
                       </button>
                    </div>
                 )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;