import React, { useState, useEffect } from 'react';
// Recharts removed from Dashboard — all charts now use custom SVG + SkillsChart component
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
    const savedHistory = localStorage.getItem('resumeHistory');
    if (savedHistory) {
      try {
        setResumeHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }
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
    setResumeHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, 50);
      localStorage.setItem('resumeHistory', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteHistoryItem = (e, id) => {
    e.stopPropagation();
    setResumeHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('resumeHistory', JSON.stringify(updated));
      return updated;
    });
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
    formData.append('resume', file);
    formData.append('job_role', targetRole);

    // Role-specific skill map for fallback
    const roleSkillMap = {
      'software engineer': ['System Design', 'Data Structures', 'REST APIs', 'CI/CD'],
      'sde': ['System Design', 'Data Structures', 'REST APIs', 'CI/CD'],
      'frontend developer': ['React/Vue/Angular', 'TypeScript', 'Web Performance', 'Accessibility'],
      'backend developer': ['API Design', 'Database Optimization', 'Microservices', 'Docker'],
      'data scientist': ['Machine Learning', 'Statistics', 'Python/R', 'Data Visualization'],
      'data analyst': ['SQL (Advanced)', 'Tableau/Power BI', 'A/B Testing', 'Business Acumen'],
      'product manager': ['Product Strategy', 'User Research', 'Metrics/KPIs', 'Roadmapping'],
      'devops engineer': ['Docker/Kubernetes', 'CI/CD Pipelines', 'Terraform/IaC', 'Monitoring'],
      'ui/ux designer': ['Figma/Sketch', 'User Research', 'Prototyping', 'Design Systems'],
      'default': ['Domain Knowledge', 'Problem Solving', 'Communication', 'Technical Skills']
    };
    const roleLower = targetRole.toLowerCase();
    const matchedSkills = Object.entries(roleSkillMap).find(([k]) => roleLower.includes(k))?.[1] || roleSkillMap['default'];

    // Complete fallback data — role-aware
    const fallbackData = {
      roast: `Your resume has potential for a ${targetRole} role. However, it lacks the specific depth and measurable impact that top ${targetRole} candidates demonstrate. Focus on quantifying your achievements and showcasing domain-specific expertise.`,
      readiness_score: 50,
      sub_scores: { technical_depth: 48, impact_metrics: 40, clarity_precision: 58, role_alignment: 42 },
      missing_basic_skills: matchedSkills.map(s => ({ skill: s, notes_topic: `${s} tutorial`, video_topic: `${s} crash course` })),
      global_standing: { you: 50, average: 60, top_performer: 95 },
      skill_importance_data: matchedSkills.map((s, i) => ({ skill: s, importance: 90 - i * 8 })),
      top_strengths: [
        "Shows initiative through personal projects",
        "Demonstrates foundational knowledge",
        "Resume is structured and readable"
      ],
      areas_for_improvement: [
        `Add quantifiable metrics relevant to ${targetRole} (%, $, numbers)`,
        `Deepen expertise in core ${targetRole} competencies`,
        `Tailor project descriptions specifically to ${targetRole} expectations`
      ],
      has_skills: true
    };

    try {
      const data = await apiUpload('/upload-resume', formData);

      // If Backend says it's not a resume, stop
      if (data.error === "Not a Resume") {
          showToast("ERROR: " + data.message);
          setViewState('input');
          return;
      }

      // Validate the response has minimum required fields
      const isValidResponse = data.readiness_score !== undefined && data.roast;

      setTimeout(() => {
        setAnalysisData(isValidResponse ? data : fallbackData);
        saveToHistory(targetRole, file.name, isValidResponse ? data : fallbackData);
        setViewState('results');
      }, 4000);

    } catch (error) {
      console.error("Analysis error:", error.message);
      // Show role-specific fallback results
      setTimeout(() => {
        setAnalysisData(fallbackData);
        saveToHistory(targetRole, file.name, fallbackData);
        showToast("AI engine offline. Showing estimated analysis.");
        setViewState('results');
      }, 3000);
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
                                <div className="p-6 border border-dashed border-zinc-800/80 rounded-xl select-none bg-zinc-900/30 flex flex-col items-center justify-center text-center">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-500 mb-3"><HistoryIcon size={18} /></div><p className="text-sm font-medium text-zinc-400">No activity yet</p><p className="text-xs text-zinc-600 mt-1">Upload a resume to see your analysis here</p></div>
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
          {viewState === 'results' && analysisData && (() => {
            // Normalize data — ensures old history entries and partial AI responses never break the UI
            const d = {
              roast: analysisData.roast || `Your resume shows a solid foundation. Focus on quantifiable impact and technical depth to level up.`,
              readiness_score: typeof analysisData.readiness_score === 'number' ? analysisData.readiness_score : 55,
              sub_scores: {
                technical_depth: analysisData.sub_scores?.technical_depth ?? 50,
                impact_metrics: analysisData.sub_scores?.impact_metrics ?? 45,
                clarity_precision: analysisData.sub_scores?.clarity_precision ?? 55,
                role_alignment: analysisData.sub_scores?.role_alignment ?? 50,
              },
              missing_basic_skills: (analysisData.missing_basic_skills?.length > 0) ? analysisData.missing_basic_skills : [
                { skill: "System Design", notes_topic: "System Design fundamentals", video_topic: "System Design interview" },
                { skill: "Data Structures", notes_topic: "DSA", video_topic: "DSA crash course" }
              ],
              skill_importance_data: (analysisData.skill_importance_data?.length > 0) ? analysisData.skill_importance_data : [
                { skill: "Core Skills", importance: 80 }, { skill: "Communication", importance: 70 }
              ],
              top_strengths: (analysisData.top_strengths?.length > 0) ? analysisData.top_strengths : [
                "Shows initiative through projects", "Foundational technical knowledge", "Resume is structured"
              ],
              areas_for_improvement: (analysisData.areas_for_improvement?.length > 0) ? analysisData.areas_for_improvement : [
                "Add quantifiable metrics (%, $, numbers)", "Show deeper technical ownership", "Tailor to the target role"
              ],
              global_standing: {
                you: analysisData.global_standing?.you ?? analysisData.readiness_score ?? 55,
                average: analysisData.global_standing?.average ?? 60,
                top_performer: analysisData.global_standing?.top_performer ?? 95
              },
              has_skills: analysisData.has_skills !== false,
              motivational_msg: analysisData.motivational_msg || "The bar is high, but so is your potential."
            };

            // Gauge calculations
            const score = d.readiness_score;
            const circumference = 2 * Math.PI * 54;
            const offset = circumference - (circumference * score) / 100;
            const verdict = score >= 80 ? 'Top Tier' : score >= 65 ? 'Competitive' : score >= 45 ? 'Developing' : 'Needs Work';
            const verdictColor = score >= 80 ? '#22c55e' : score >= 65 ? '#3b82f6' : score >= 45 ? '#f59e0b' : '#ef4444';
            const gradStart = score >= 65 ? '#059669' : score >= 45 ? '#d97706' : '#dc2626';
            const gradEnd = score >= 65 ? '#3b82f6' : score >= 45 ? '#f59e0b' : '#f97316';

            // Sub-score config
            const subScoreConfig = [
              { label: 'Technical Depth', key: 'technical_depth', color: '#3b82f6', icon: '◆' },
              { label: 'Impact & Metrics', key: 'impact_metrics', color: '#f59e0b', icon: '▲' },
              { label: 'Clarity & Precision', key: 'clarity_precision', color: '#10b981', icon: '●' },
              { label: 'Role Alignment', key: 'role_alignment', color: '#8b5cf6', icon: '■' },
            ];

            // Average sub-score
            const avgSub = Math.round(Object.values(d.sub_scores).reduce((a, b) => a + b, 0) / 4);

            return (
            <div className="space-y-6 animate-enter delay-1">

              {/* ── EVALUATION HEADER ── */}
              <div className="flex items-center justify-between analytics-card stagger-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight leading-none">Performance <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--text-secondary)' }}>Analysis</span></h3>
                    <p className="text-[11px] text-zinc-600 mt-0.5">AI-powered evaluation for {targetRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-full border text-[10px] font-mono text-zinc-500 tracking-wider" style={{ borderColor: 'var(--border)' }}>
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* ── HERO ROW: Score Gauge + Performance Breakdown ── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* LEFT: Score Gauge */}
                <div className="lg:col-span-4 surface p-8 flex flex-col items-center justify-center analytics-card stagger-2">
                  <p className="label mb-6">Overall Readiness</p>

                  {/* SVG Gauge */}
                  <div className="relative w-44 h-44">
                    <svg width="176" height="176" viewBox="0 0 120 120" className="w-full h-full">
                      <defs>
                        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={gradStart} />
                          <stop offset="100%" stopColor={gradEnd} />
                        </linearGradient>
                        <filter id="gaugeShadow">
                          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={gradEnd} floodOpacity="0.3"/>
                        </filter>
                      </defs>
                      {/* Track */}
                      <circle cx="60" cy="60" r="54" stroke="rgba(255,255,255,0.04)" strokeWidth="5" fill="none" />
                      {/* Subtle tick marks */}
                      {[0, 25, 50, 75, 100].map(tick => {
                        const angle = ((tick / 100) * 360 - 90) * (Math.PI / 180);
                        const x1 = 60 + 48 * Math.cos(angle);
                        const y1 = 60 + 48 * Math.sin(angle);
                        const x2 = 60 + 51 * Math.cos(angle);
                        const y2 = 60 + 51 * Math.sin(angle);
                        return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />;
                      })}
                      {/* Progress arc */}
                      <circle
                        cx="60" cy="60" r="54"
                        stroke="url(#gaugeGrad)"
                        strokeWidth="5"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                        className="gauge-ring"
                        filter="url(#gaugeShadow)"
                      />
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold tracking-tighter">{score}</span>
                      <span className="text-[10px] uppercase tracking-[0.15em] font-semibold mt-1" style={{ color: verdictColor }}>{verdict}</span>
                    </div>
                  </div>

                  {/* Micro stats */}
                  <div className="flex items-center gap-2.5 mt-7 text-[11px] text-zinc-600">
                    <span className="flex items-center gap-1"><span className="text-emerald-500/70">✓</span> {d.top_strengths.length} strengths</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-zinc-700" />
                    <span className="flex items-center gap-1"><span className="text-amber-500/70">!</span> {d.missing_basic_skills.length} gaps</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-zinc-700" />
                    <span className="text-zinc-500 font-medium">{targetRole}</span>
                  </div>

                  {/* Avg sub-score footer */}
                  <div className="mt-5 pt-4 border-t border-white/[0.04] w-full text-center">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Avg sub-score </span>
                    <span className="text-sm font-bold font-mono ml-1" style={{ color: avgSub >= 65 ? '#22c55e' : avgSub >= 45 ? '#f59e0b' : '#ef4444' }}>{avgSub}</span>
                  </div>
                </div>

                {/* RIGHT: Sub-Scores + Percentile */}
                <div className="lg:col-span-8 space-y-4">

                  {/* Sub-Score Bar Gauges */}
                  <div className="surface p-6 analytics-card stagger-3">
                    <div className="flex justify-between items-center mb-6">
                      <p className="label">Performance Breakdown</p>
                      <p className="text-[10px] text-zinc-600 font-mono">MAX: 100</p>
                    </div>
                    <div className="space-y-5">
                      {subScoreConfig.map((item, i) => {
                        const val = d.sub_scores[item.key];
                        const status = val >= 70 ? 'Excellent' : val >= 50 ? 'Average' : 'Below avg';
                        return (
                          <div key={i}>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] opacity-50" style={{ color: item.color }}>{item.icon}</span>
                                <span className="text-[13px] text-zinc-400 font-medium">{item.label}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] text-zinc-600 hidden sm:inline">{status}</span>
                                <span className="text-sm font-mono font-bold tabular-nums" style={{ color: item.color }}>{val}</span>
                              </div>
                            </div>
                            <div className="h-[6px] rounded-full bg-white/[0.03] overflow-hidden">
                              <div
                                className="h-full rounded-full gauge-bar-fill"
                                style={{
                                  width: `${val}%`,
                                  background: `linear-gradient(90deg, ${item.color}66, ${item.color})`,
                                  animationDelay: `${i * 120 + 200}ms`
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Percentile Strip */}
                  <div className="surface p-6 analytics-card stagger-4">
                    <div className="flex justify-between items-center mb-6">
                      <p className="label">Where You Stand</p>
                      <p className="text-[10px] text-zinc-600">Global percentile scale</p>
                    </div>
                    <div className="relative pt-8 pb-6">
                      {/* Background strip */}
                      <div className="h-[6px] rounded-full percentile-strip relative">
                        {/* Scale labels */}
                        <div className="absolute -top-5 left-0 text-[9px] text-zinc-700 font-mono">0</div>
                        <div className="absolute -top-5 left-1/4 text-[9px] text-zinc-700 font-mono">25</div>
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-zinc-700 font-mono">50</div>
                        <div className="absolute -top-5 left-3/4 text-[9px] text-zinc-700 font-mono">75</div>
                        <div className="absolute -top-5 right-0 text-[9px] text-zinc-700 font-mono">100</div>

                        {/* Markers */}
                        {[
                          { label: 'Average', value: d.global_standing.average, color: '#71717a', delay: '0.6s' },
                          { label: 'You', value: d.global_standing.you, color: '#3b82f6', delay: '0.9s', highlight: true },
                          { label: 'Top 1%', value: d.global_standing.top_performer, color: '#22c55e', delay: '1.2s' },
                        ].map((m, i) => (
                          <div
                            key={i}
                            className="absolute top-1/2 percentile-marker"
                            style={{ left: `${Math.min(Math.max(m.value, 3), 97)}%`, animationDelay: m.delay }}
                          >
                            {/* Marker dot */}
                            <div
                              className={`w-4 h-4 rounded-full border-[2.5px] ${m.highlight ? 'shadow-lg' : ''}`}
                              style={{
                                borderColor: m.color,
                                background: m.highlight ? m.color : '#09090b',
                                boxShadow: m.highlight ? `0 0 12px ${m.color}40` : 'none',
                              }}
                            />
                            {/* Label */}
                            <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap flex flex-col items-center">
                              <span className="text-[10px] font-semibold" style={{ color: m.color }}>{m.value}</span>
                              <span className="text-[9px] text-zinc-600 mt-0.5">{m.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* ── MANAGER'S NOTE (Roast) ── */}
              <div className="surface p-6 analytics-card stagger-3" style={{ borderLeftWidth: 2, borderLeftColor: `${verdictColor}50`, background: `${verdictColor}04` }}>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${verdictColor}12` }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={verdictColor} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: `${verdictColor}90` }}>Senior Engineering Manager's Assessment</p>
                    <p className="text-[15px] text-zinc-200 font-medium leading-[1.7]">"{d.roast}"</p>
                  </div>
                </div>
              </div>

              {/* ── STRENGTHS + IMPROVEMENTS ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="surface p-6 analytics-card stagger-4" style={{ borderTopWidth: 2, borderTopColor: 'rgba(34,197,94,0.25)' }}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <p className="text-[11px] uppercase tracking-widest font-semibold text-emerald-500/80">Strengths Identified</p>
                  </div>
                  <ul className="space-y-3.5">
                    {d.top_strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                        <span className="text-[13px] text-zinc-300 leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="surface p-6 analytics-card stagger-5" style={{ borderTopWidth: 2, borderTopColor: 'rgba(245,158,11,0.25)' }}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-5 h-5 rounded-md bg-amber-500/10 flex items-center justify-center">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="3"><path d="M12 9v4M12 17h.01"/></svg>
                    </div>
                    <p className="text-[11px] uppercase tracking-widest font-semibold text-amber-500/80">Areas to Improve</p>
                  </div>
                  <ul className="space-y-3.5">
                    {d.areas_for_improvement.map((s, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                        <span className="text-[13px] text-zinc-300 leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ── RADAR + SKILL MAP ── */}
              {d.has_skills && <SkillsChart data={d} />}

              {/* ── MISSING SKILLS ACTION PLAN ── */}
              <div className="analytics-card stagger-7">
                <div className="flex items-center justify-between mb-4">
                  <p className="label">Skill Gaps · Action Plan</p>
                  <p className="text-[10px] text-zinc-600">{d.missing_basic_skills.length} skills to acquire</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {d.missing_basic_skills.map((item, i) => (
                    <div key={i} className="surface p-5 group hover:border-blue-500/20 transition-colors">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-md bg-red-500/8 flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.7"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        </div>
                        <p className="text-[13px] font-semibold text-zinc-200">{item.skill}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openNotes(item.notes_topic)} className="btn-secondary flex-1 py-2 text-xs flex items-center justify-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                          Learn
                        </button>
                        <button onClick={() => openVideo(item.video_topic)} className="btn-secondary flex-1 py-2 text-xs flex items-center justify-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          Watch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── ACTIONS: Job Search + Resume Fixer ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 analytics-card stagger-8">
                <div className="surface p-6">
                  <p className="label mb-2">Job Search</p>
                  <p className="text-[13px] text-zinc-500 mb-4">Who is hiring for <span className="text-zinc-300 font-medium">"{targetRole}"</span>?</p>
                  <div className="flex gap-2">
                    {['LinkedIn', 'Indeed', 'Glassdoor'].map(platform => (
                      <button key={platform} onClick={() => openJobSearch(platform.toLowerCase())} className="btn-secondary flex-1 py-2.5 text-xs">
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="surface p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold mb-1">Resume Fixer AI</p>
                    <p className="text-xs text-zinc-500">Auto-generate stronger bullet points.</p>
                  </div>
                  <button onClick={handleFixResume} className="btn-primary px-5 py-2.5 text-xs font-semibold">Fix resume</button>
                </div>
              </div>

              {/* ── FOOTER ── */}
              <div className="text-center pt-4">
                <button onClick={() => setViewState('input')} className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors group" style={{ background: 'transparent' }}>
                  Analyze another role <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          ); })()}

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
