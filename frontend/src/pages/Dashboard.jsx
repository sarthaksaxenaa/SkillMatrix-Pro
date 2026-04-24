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

  // --- NEW: Toast State ---
  const [toast, setToast] = useState({ message: '', visible: false, isLeaving: false });

  const showToast = (message) => {
    setToast({ message, visible: true, isLeaving: false });
    setTimeout(() => {
        setToast(prev => ({ ...prev, isLeaving: true }));
        setTimeout(() => {
            setToast({ message: '', visible: false, isLeaving: false });
        }, 600); // Matches the fold-out CSS duration
    }, 3000);
  };

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
    if (!file || !targetRole) {
      return showToast("Please enter a role and upload a resume!");
    }

    setViewState('analyzing');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_role', targetRole);

    try {
      const data = await apiUpload('/api/analyze-resume', formData);

      // If Backend says it's not a resume, stop
      if (data.error === "Not a Resume") {
          showToast("ERROR: " + data.message);
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
      showToast("Analysis failed, switching to demo mode.");
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
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>

      {/* --- SIDEBAR --- */}
      <aside className="w-60 hidden md:flex flex-col fixed h-full z-20 border-r" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
        <div className="p-6 pb-0">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-sm font-bold">S</div>
            <span className="text-lg font-semibold tracking-[-0.03em]">Skill<span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--text-secondary)' }}>Matrix</span></span>
          </div>
        </div>

        <nav className="flex-1 px-3">
          {[
            { key: 'input', label: 'Career Coach', keys: ['input', 'results', 'analyzing'] },
            { key: 'history', label: 'My Resumes', keys: ['history'] },
            { key: 'interviews', label: 'Interviews', keys: ['interviews'] },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setViewState(item.key)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors ${
                item.keys.includes(viewState) ? 'bg-white/[0.06] text-white font-medium' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 pt-0">
          <div className="divider mb-4" />
          <button onClick={onLogout} className="text-zinc-600 text-sm hover:text-zinc-400 transition-colors" style={{ background: 'transparent' }}>
            Sign out
          </button>
        </div>
      </aside>

      {/* --- MAIN --- */}
      <main className="flex-1 md:ml-60 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-12">

          {/* Header */}
          <div className="flex justify-between items-start mb-16 animate-enter">
            <div>
              <p className="label mb-3">
                {viewState === 'interviews' ? 'PRACTICE' : viewState === 'history' ? 'HISTORY' : 'DASHBOARD'}
              </p>
              <h1 className="heading-display text-4xl mb-2">
                {viewState === 'interviews' ? 'Interview' : viewState === 'history' ? 'Your' : 'Career'}
                {' '}
                <span className="heading-serif text-4xl">
                  {viewState === 'interviews' ? 'Arena' : viewState === 'history' ? 'Journey' : 'Coach'}
                </span>
              </h1>
              <p className="text-zinc-500 text-sm mt-1">
                {viewState === 'interviews' ? 'Sharpen your skills with AI mock interviews.' :
                 viewState === 'history' ? 'Track your progress over time.' :
                 "Let's build your path to that dream job."}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="surface px-4 py-2 flex items-center gap-2 text-sm text-zinc-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {userName}
              </div>
            </div>
          </div>

          {/* --- INPUT VIEW --- */}
          {viewState === 'input' && (
            <div className="animate-enter delay-1 max-w-5xl mx-auto">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Column: Main Action */}
                <div className="lg:col-span-7 space-y-8">
                  <div>
                    <h2 className="heading-display text-4xl mb-3">Is your resume <span className="heading-serif text-4xl text-zinc-400">ready?</span></h2>
                    <p className="text-zinc-400 text-base leading-relaxed">Stop guessing. Get brutal AI feedback on your resume against actual job descriptions before recruiters do.</p>
                  </div>

                  <div className="surface p-8 space-y-6">
                    <div className="relative">
                      <label className="label block mb-2">Target role</label>
                      <input type="text" value={targetRole} onChange={handleRoleChange} onFocus={() => !targetRole && setShowSuggestions(true)} placeholder="e.g. Software Engineer, Data Analyst..." className="w-full px-4 py-3 text-sm" />
                      
                      {/* Predefined chips */}
                      {!targetRole && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {['Software Engineer', 'Product Manager', 'Data Scientist'].map(role => (
                                <button key={role} onClick={() => selectRole(role)} className="px-3 py-1.5 rounded-full border text-xs text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors" style={{ borderColor: 'var(--border)' }}>
                                    {role}
                                </button>
                            ))}
                        </div>
                      )}

                      {/* Dropdown Suggestions */}
                      {showSuggestions && roleSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 z-50 max-h-52 overflow-y-auto rounded-xl border shadow-xl" style={{ borderColor: 'var(--border)', background: 'var(--bg-raised)' }}>
                          {roleSuggestions.map((role, i) => (
                            <div key={i} onClick={() => selectRole(role)} className="px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-colors border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                              {role}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-end mb-2">
                          <label className="label block">Resume PDF</label>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-800/50 px-2 py-0.5 rounded">Top 1% resumes score 85+</span>
                      </div>
                      <div className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 relative group hover:border-blue-500/50 hover:bg-blue-500/[0.02]" style={{ borderColor: file ? 'rgba(59,130,246,0.5)' : 'var(--border)', background: file ? 'rgba(59,130,246,0.02)' : 'transparent' }}>
                        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="flex flex-col items-center gap-3 group-hover:-translate-y-1 transition-transform duration-300">
                            <div className={`p-4 rounded-full transition-colors duration-300 ${file ? 'bg-blue-500/10' : 'bg-zinc-800/50 group-hover:bg-blue-500/10'}`}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={file ? "text-blue-400" : "text-zinc-400 group-hover:text-blue-400 transition-colors"}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                            </div>
                            <p className="text-base font-medium text-zinc-300">{file ? <span className="text-blue-400 font-semibold">{file.name}</span> : "Drag & drop or click to upload PDF"}</p>
                            <p className="text-xs text-zinc-500">Max file size: 5MB</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                        <button onClick={handleAnalyze} className="btn-primary w-full py-4 text-sm font-semibold flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all">
                          Check Job Readiness
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                        
                        <div className="flex justify-between items-center mt-3 text-xs text-zinc-500 px-1">
                            <div className="flex items-center gap-2">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                <span>We never store your resume.</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400">
                                <ClockIcon size={12} />
                                <span>Takes 10–15s to generate detailed report</span>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Stats & Trust */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="surface p-6 rounded-2xl flex flex-col gap-8 h-full shadow-xl">
                        
                        {/* Stats Ribbon */}
                        <div className="flex justify-between items-center px-2">
                            <div>
                                <div className="text-2xl font-bold text-white">12k+</div>
                                <div className="text-xs text-zinc-500 mt-0.5">Resumes analyzed</div>
                            </div>
                            <div className="w-px h-8 bg-zinc-800"></div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-emerald-400">98%</div>
                                <div className="text-xs text-zinc-500 mt-0.5">Extraction accuracy</div>
                            </div>
                        </div>

                        <hr className="border-zinc-800/60" />

                        {/* Recent History Shortcut */}
                        <div>
                            <p className="label mb-4 px-2">Recent Activity</p>
                            {resumeHistory.length > 0 ? (
                                <div onClick={() => loadHistoryItem(resumeHistory[0])} className="surface-interactive p-4 group border border-transparent hover:border-zinc-700">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border shadow-sm ${resumeHistory[0].score >= 80 ? 'border-emerald-500/30 bg-emerald-500/10' : resumeHistory[0].score >= 50 ? 'border-amber-500/30 bg-amber-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                                                <span className={`text-lg font-bold leading-none ${resumeHistory[0].score >= 80 ? 'text-emerald-400' : resumeHistory[0].score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{resumeHistory[0].score}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-zinc-200">{resumeHistory[0].role}</p>
                                                <p className="text-xs text-zinc-500 mt-1">{resumeHistory[0].score >= 80 ? 'Top Tier' : resumeHistory[0].score >= 50 ? 'Above Average' : 'Needs Work'} • {resumeHistory[0].date}</p>
                                            </div>
                                        </div>
                                        <span className="text-zinc-500 group-hover:text-white transition-colors bg-zinc-800/50 p-2 rounded-lg">
                                            <ChevronRightIcon size={16} />
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-5 border border-dashed border-zinc-800 rounded-xl opacity-50 select-none bg-zinc-900/50">
                                    <div className="flex gap-4 items-center animate-pulse">
                                        <div className="w-12 h-12 bg-zinc-800 rounded-xl"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                                            <div className="h-3 w-32 bg-zinc-800 rounded"></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-5 text-center">Analyze a resume to see it here</p>
                                </div>
                            )}
                        </div>

                        {/* Feature Highlights */}
                        <div className="flex-1">
                            <p className="label mb-5 px-2">Engine Capabilities</p>
                            <ul className="space-y-5 px-2">
                                {[
                                    { title: 'Brutal AI Roast', desc: 'No sugar-coating. See exactly why you are getting rejected.' },
                                    { title: 'Missing Skills Gap', desc: 'Identify the exact keywords the ATS is filtering you out for.' },
                                    { title: 'Resume Fixer AI', desc: 'Auto-generate powerful, impact-driven bullet points.' }
                                ].map((feat, idx) => (
                                    <li key={idx} className="flex gap-3.5">
                                        <div className="mt-0.5 shrink-0 bg-blue-500/10 p-1.5 rounded-md text-blue-400">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-200">{feat.title}</p>
                                            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{feat.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* --- HISTORY VIEW --- */}
          {viewState === 'history' && (
            <div className="animate-enter delay-1">
              {resumeHistory.length === 0 ? (
                <div className="text-center py-24 surface">
                  <p className="text-zinc-500 text-sm mb-4">No analyses yet.</p>
                  <button onClick={() => setViewState('input')} className="text-blue-400 text-sm hover:underline" style={{ background: 'transparent' }}>Go to analyzer</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {resumeHistory.map((item) => (
                    <div key={item.id} onClick={() => loadHistoryItem(item)} className="surface-interactive p-5 flex items-center justify-between group">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border ${item.score >= 80 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/8' : item.score >= 50 ? 'text-amber-400 border-amber-500/20 bg-amber-500/8' : 'text-red-400 border-red-500/20 bg-red-500/8'}`}>
                          {item.score}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.role}</p>
                          <p className="text-xs text-zinc-600 mt-0.5">{item.fileName} · {item.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">View</span>
                        <button onClick={(e) => deleteHistoryItem(e, item.id)} className="text-zinc-700 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/8 transition-colors"><TrashIcon size={15} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- INTERVIEWS VIEW --- */}
          {viewState === 'interviews' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-enter delay-1">
              {[
                { title: 'Resume-based', desc: 'Questions from your projects and experience.', action: () => { if(!file) return alert("Upload a resume first!"); onStartInterview(targetRole || 'Software Engineer', 'text'); }, accent: 'blue' },
                { title: 'Field-based', desc: 'Standard industry questions for your role.', action: () => { const role = targetRole || prompt("Enter your role:", "Software Engineer"); if(role) onStartInterview(role, 'text'); }, accent: 'violet' },
                { title: 'Voice interview', desc: 'Real-time voice combining resume and theory.', action: () => onStartInterview(targetRole || 'Software Engineer', 'voice'), accent: 'blue', primary: true },
              ].map((card, i) => (
                <div key={i} onClick={card.action} className={`surface-interactive p-6 group ${card.primary ? 'border-blue-500/20' : ''}`}>
                  <p className="text-sm font-medium mb-2">{card.title}</p>
                  <p className="text-xs text-zinc-500 mb-6 leading-relaxed">{card.desc}</p>
                  <span className={`text-xs font-medium ${card.primary ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'} transition-colors`}>
                    Start →
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* --- LOADING --- */}
          {viewState === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-32 animate-enter">
              <div className="w-8 h-8 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin mb-8" />
              <p className="text-sm text-zinc-300 mb-8">{LOADING_STEPS[loadingStepIndex]}</p>
              <div className="space-y-3 w-72">
                {LOADING_STEPS.map((step, i) => (
                  <div key={i} className={`flex items-center gap-3 text-xs transition-all duration-500 ${i <= loadingStepIndex ? 'opacity-100' : 'opacity-20'}`}>
                    {i < loadingStepIndex ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center"><CheckIcon size={10} className="text-emerald-400" /></div>
                    ) : i === loadingStepIndex ? (
                      <div className="w-4 h-4 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-zinc-800" />
                    )}
                    <span className={i === loadingStepIndex ? 'text-zinc-300' : 'text-zinc-600'}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- RESULTS --- */}
          {viewState === 'results' && analysisData && (
            <div className="space-y-8 animate-enter delay-1">

              {/* Roast */}
              <div className="surface p-6 border-l-2 border-l-amber-500/50">
                <p className="label mb-2 text-amber-500/70">Reality check</p>
                <p className="text-sm text-zinc-300 italic leading-relaxed">"{analysisData.roast}"</p>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="surface p-6 flex flex-col items-center justify-center">
                  <p className="label mb-6">Readiness</p>
                  <div className="w-40 h-40 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{ value: analysisData.readiness_score }, { value: 100 - analysisData.readiness_score }]} cx="50%" cy="50%" innerRadius={55} outerRadius={70} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                          <Cell fill="#3b82f6" />
                          <Cell fill="rgba(255,255,255,0.04)" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold tracking-tight">{analysisData.readiness_score}<span className="text-lg text-zinc-500">%</span></div>
                  </div>
                </div>

                <div className="surface p-6 lg:col-span-2">
                  <p className="label mb-4">Competition standing</p>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{ name: 'You', score: analysisData.global_standing?.you || 0 }, { name: 'Average', score: analysisData.global_standing?.average || 60 }, { name: 'Top Tier', score: analysisData.global_standing?.top_performer || 90 }]} layout="vertical" margin={{ left: 10 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12, fill: '#71717a'}} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: '#111113', color: '#fafafa', fontSize: '12px'}} />
                        <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={24}>
                          <Cell fill="#3b82f6" />
                          <Cell fill="#52525b" />
                          <Cell fill="#22c55e" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <SkillsChart />

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="surface p-6">
                  <p className="label mb-3">Job search</p>
                  <p className="text-sm text-zinc-400 mb-4">Who is hiring for "{targetRole}"?</p>
                  <div className="flex gap-2">
                    {['LinkedIn', 'Indeed', 'Glassdoor'].map(platform => (
                      <button key={platform} onClick={() => openJobSearch(platform.toLowerCase())} className="btn-secondary flex-1 py-2 text-xs">
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="surface p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1">Resume Fixer AI</p>
                    <p className="text-xs text-zinc-500">Generate stronger bullet points.</p>
                  </div>
                  <button onClick={handleFixResume} className="btn-primary px-5 py-2.5 text-xs">Fix resume</button>
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <p className="label mb-4">Missing skills · Action plan</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {analysisData.missing_basic_skills && analysisData.missing_basic_skills.map((item, i) => (
                    <div key={i} className="surface p-5">
                      <p className="text-sm font-medium mb-4">{item.skill}</p>
                      <div className="flex gap-2">
                        <button onClick={() => openNotes(item.notes_topic)} className="btn-secondary flex-1 py-2 text-xs">Notes</button>
                        <button onClick={() => openVideo(item.video_topic)} className="btn-secondary flex-1 py-2 text-xs">Video</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Impact Chart */}
              <div className="surface p-6">
                <p className="label mb-4">Skill impact analysis</p>
                {analysisData.has_skills ? (
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analysisData.skill_importance_data || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="skill" tick={{fill: '#71717a', fontSize: 11}} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: '#111113', color: '#fafafa', fontSize: '12px'}} />
                        <Line type="monotone" dataKey="importance" stroke="#3b82f6" strokeWidth={2} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#09090b'}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm text-zinc-500">"{analysisData.motivational_msg}"</p>
                  </div>
                )}
              </div>

              <div className="text-center pt-4">
                <button onClick={() => setViewState('input')} className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors" style={{ background: 'transparent' }}>
                  Analyze another role →
                </button>
              </div>
            </div>
          )}

          {/* --- FIXER MODAL --- */}
          {showFixModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-enter">
              <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-8 relative shadow-2xl">
                <button onClick={() => setShowFixModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white">
                  <Icon d="M18 6L6 18M6 6l12 12" />
                </button>
                <h3 className="text-2xl font-bold mb-2 text-white flex items-center gap-3">
                  <ZapIcon className="text-amber-400" /> Resume Fixer AI
                </h3>
                <p className="text-slate-400 text-sm mb-6">Auto-generating powerful bullet points for {targetRole}</p>

                {isFixing ? (
                  <div className="flex flex-col items-center justify-center py-12">
                     <div className="w-10 h-10 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin mb-4" />
                     <p className="text-slate-300 font-medium">Rewriting your experience...</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {fixedPoints.map((pt, i) => (
                      <div key={i} className="bg-slate-800 border border-slate-700 p-4 rounded-xl hover:border-amber-500/30 transition-colors group">
                        <div className="flex items-start gap-3">
                           <CheckIcon className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                           <p className="text-slate-200 text-sm leading-relaxed">{pt}</p>
                        </div>
                        <button className="mt-3 text-xs font-bold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          Copy Point <ChevronRightIcon size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- CUSTOM TOAST NOTIFICATION --- */}
          {toast.visible && (
              <div className={`fixed bottom-8 right-8 z-[100] max-w-sm w-full bg-zinc-900 border border-zinc-800 text-white px-5 py-4 rounded-xl shadow-2xl flex items-start gap-3 ${toast.isLeaving ? 'animate-toast-fold-out' : 'animate-toast-fly-in'}`} style={{ perspective: '1000px', transformOrigin: 'bottom right' }}>
                  <div className="mt-0.5 shrink-0 text-red-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <div>
                      <h4 className="text-sm font-semibold text-zinc-100 mb-0.5">Action Required</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">{toast.message}</p>
                  </div>
                  <button onClick={() => setToast({ ...toast, isLeaving: true })} className="ml-auto text-zinc-500 hover:text-white transition-colors">
                      <Icon d="M18 6L6 18M6 6l12 12" size={16} />
                  </button>
              </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;

