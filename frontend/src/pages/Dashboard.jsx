import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Upload, FileText, Zap, BookOpen, Youtube, Trophy, ChevronRight, Search, Target, LogOut, Mic, Briefcase, FileSearch, History, Trash2, Clock, CheckCircle2 } from 'lucide-react';

// --- 1. IMPORT THE NEW CHART COMPONENT ---
import SkillsChart from '../components/SkillsChart';

const COMMON_ROLES = [
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Scientist", "Data Analyst", "Product Manager", "UI/UX Designer", "DevOps Engineer",
  "Cybersecurity Analyst", "Cloud Architect", "Mobile App Developer", "QA Engineer", "System Administrator"
];

const COLORS = ['#6366f1', '#e2e8f0']; 
const BAR_COLORS = ['#6366f1', '#3b82f6', '#10b981']; 

const LOADING_STEPS = [
  "📄 Extracting text from your resume...",
  "🔍 Analyzing technical keywords...",
  "🤖 AI is judging your life choices (Roasting)...",
  "📊 Calculating Role Readiness Score...",
  "🚀 Generating Study Roadmap..."
];

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
      const response = await fetch('http://localhost:8000/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6 fixed h-full z-10">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold">SM</div>
          <span className="text-xl font-bold text-slate-800">SkillMatrix</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button onClick={() => setViewState('input')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-colors ${viewState === 'input' || viewState === 'results' || viewState === 'analyzing' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Target size={20} /> Career Coach
          </button>
          <button onClick={() => setViewState('history')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-colors ${viewState === 'history' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
            <History size={20} /> My Resumes
          </button>
          <button onClick={() => setViewState('interviews')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-colors ${viewState === 'interviews' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Zap size={20} /> Interviews
          </button>
        </nav>

        <button onClick={onLogout} className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-700 mt-auto">
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      <main className="flex-1 md:ml-64 p-8 transition-all">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {viewState === 'interviews' ? 'Interview Arena ⚔️' : viewState === 'history' ? 'Resume History 📂' : 'Career Coach 🚀'}
              </h1>
              <p className="text-slate-500">
                {viewState === 'interviews' ? 'Select your challenge mode.' : viewState === 'history' ? 'Review your past analyses.' : 'Your personalized roadmap to getting hired.'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-400">LOGGED IN AS</p>
              <p className="font-bold text-indigo-600">{userName}</p>
            </div>
          </div>

          {viewState === 'input' && (
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center max-w-2xl mx-auto mt-10 animate-fade-in-up">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                <Target size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Let's check your eligibility</h2>
              <p className="text-slate-500 mb-8">Enter your dream role and upload your resume.</p>
              <div className="space-y-4 text-left relative"> 
                <div className="relative">
                  <label className="block text-sm font-bold text-slate-700 mb-2">TARGET ROLE</label>
                  <input type="text" value={targetRole} onChange={handleRoleChange} onFocus={() => targetRole && setShowSuggestions(true)} placeholder="e.g. SDE-1, Data Analyst, React Developer..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                  {showSuggestions && roleSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl mt-2 shadow-2xl z-50 max-h-60 overflow-y-auto">
                      {roleSuggestions.map((role, i) => (
                        <div key={i} onClick={() => selectRole(role)} className="p-3 hover:bg-indigo-50 cursor-pointer text-slate-700 font-medium border-b border-slate-50">
                          {role}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">UPLOAD RESUME (PDF)</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors relative">
                    <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <FileText className="mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-600 font-medium">{file ? file.name : "Click to select file"}</p>
                  </div>
                </div>
                <button onClick={handleAnalyze} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform mt-4">
                  Analyze Now
                </button>
              </div>
            </div>
          )}

          {viewState === 'history' && (
            <div className="animate-fade-in max-w-4xl mx-auto">
              {resumeHistory.length === 0 ? (
                <div className="text-center py-20 bg-slate-100 rounded-3xl">
                   <History size={48} className="mx-auto text-slate-300 mb-4" />
                   <h3 className="text-xl font-bold text-slate-600">No History Yet</h3>
                   <p className="text-slate-400 mt-2">Analyze a resume to save it here automatically.</p>
                   <button onClick={() => setViewState('input')} className="mt-6 text-indigo-600 font-bold hover:underline">Go to Analyzer</button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {resumeHistory.map((item) => (
                    <div key={item.id} onClick={() => loadHistoryItem(item)} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${item.score >= 80 ? 'bg-green-100 text-green-700' : item.score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {item.score}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">{item.role}</h3>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                             <span className="flex items-center gap-1"><FileText size={14}/> {item.fileName}</span>
                             <span className="flex items-center gap-1"><Clock size={14}/> {item.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-sm">View Report <ChevronRight size={16}/></span>
                        <button onClick={(e) => deleteHistoryItem(e, item.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewState === 'interviews' && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl hover:border-indigo-200 transition-all group cursor-pointer" onClick={() => { if(!file) return alert("Please upload a resume in the Career Coach tab first!"); onStartInterview(targetRole || 'Software Engineer', 'text'); }}>
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform"><FileSearch size={32} /></div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Resume-Based</h3>
                <p className="text-slate-500 mb-6 text-sm">Deep dive into your specific projects, experience, and claimed skills.</p>
                <button className="text-blue-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">Start Resume Mock <ChevronRight size={16} /></button>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl hover:border-indigo-200 transition-all group cursor-pointer" onClick={() => { const role = targetRole || prompt("Enter the field you want to practice:", "Software Engineer"); if(role) onStartInterview(role, 'text'); }}>
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform"><Briefcase size={32} /></div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Field-Based</h3>
                <p className="text-slate-500 mb-6 text-sm">Standard industry questions for your target role. Perfect for testing theory.</p>
                <button className="text-purple-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">Start Field Mock <ChevronRight size={16} /></button>
              </div>
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-3xl shadow-xl text-white hover:shadow-2xl hover:scale-[1.02] transition-all group cursor-pointer border border-indigo-700" onClick={() => onStartInterview(targetRole || 'Software Engineer', 'voice')}>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-white/20 transition-colors"><Mic size={32} /></div>
                <h3 className="text-xl font-bold text-white mb-2">Pro Voice Interview</h3>
                <p className="text-indigo-200 mb-6 text-sm">Real-time voice conversation combining resume details AND field knowledge.</p>
                <button className="text-white font-bold flex items-center gap-2 group-hover:gap-4 transition-all bg-indigo-600 px-4 py-2 rounded-lg">Start Speaking <Zap size={16} /></button>
              </div>
            </div>
          )}

          {/* === SMART LOADING SCREEN === */}
          {viewState === 'analyzing' && (
            <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
              <div className="relative">
                 <div className="w-24 h-24 border-4 border-slate-100 rounded-full mb-8"></div>
                 <div className="w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                 <div className="absolute inset-0 flex items-center justify-center mb-8">
                    <Target className="text-indigo-600 animate-pulse" size={32} />
                 </div>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                {LOADING_STEPS[loadingStepIndex]}
              </h2>
              
              <div className="flex flex-col gap-3 w-64">
                {LOADING_STEPS.map((step, i) => (
                   <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i <= loadingStepIndex ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-4'}`}>
                      {i < loadingStepIndex ? <CheckCircle2 size={16} className="text-green-500"/> : 
                       i === loadingStepIndex ? <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"/> :
                       <div className="w-4 h-4 rounded-full border border-slate-300"/>}
                      <span className={i === loadingStepIndex ? "font-bold text-indigo-700" : "text-slate-500"}>{step}</span>
                   </div>
                ))}
              </div>
            </div>
          )}

          {viewState === 'results' && analysisData && (
            <div className="animate-fade-in space-y-8">
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 p-6 rounded-2xl flex items-start gap-4">
                <div className="text-3xl">🔥</div>
                <div>
                  <h3 className="font-bold text-orange-800 text-sm uppercase tracking-wide mb-1">Reality Check (Friendly Roast)</h3>
                  <p className="text-orange-900 font-medium text-lg italic">"{analysisData.roast}"</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center">
                  
                  {/* --- FIXED LABEL HERE --- */}
                  <h3 className="text-slate-500 font-medium mb-4 uppercase tracking-wider text-xs">Role Readiness Score</h3>
                  
                  <div className="w-48 h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{ value: analysisData.readiness_score }, { value: 100 - analysisData.readiness_score }]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                          <Cell fill={COLORS[0]} />
                          <Cell fill={COLORS[1]} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-indigo-600">{analysisData.readiness_score}%</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 lg:col-span-2">
                  <h3 className="font-bold text-slate-700 mb-4">Global Competition Standing</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{ name: 'You', score: analysisData.global_standing?.you || 0 }, { name: 'Average', score: analysisData.global_standing?.average || 60 }, { name: 'Top Tier', score: analysisData.global_standing?.top_performer || 90 }]} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 14, fontWeight: 'bold'}} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="score" radius={[0, 10, 10, 0]} barSize={40}>
                           <Cell fill={BAR_COLORS[0]} />
                           <Cell fill={BAR_COLORS[1]} />
                           <Cell fill={BAR_COLORS[2]} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* --- 2. ADDED THE SKILLS CHART HERE --- */}
              <SkillsChart />

              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mt-4"><BookOpen className="text-indigo-600" /> Missing Basic Skills (Action Plan)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysisData.missing_basic_skills && analysisData.missing_basic_skills.map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 hover:shadow-xl transition-shadow">
                    <h4 className="font-bold text-lg text-slate-800 mb-4">{item.skill}</h4>
                    <div className="space-y-3">
                      <button onClick={() => openNotes(item.notes_topic)} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-green-50 text-green-700 font-bold hover:bg-green-100 transition-colors text-sm"><FileText size={16} /> Read Notes</button>
                      <button onClick={() => openVideo(item.video_topic)} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 text-red-700 font-bold hover:bg-red-100 transition-colors text-sm"><Youtube size={16} /> Watch Video</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                <h3 className="font-bold text-slate-700 mb-6">Current Skill Impact Analysis</h3>
                {analysisData.has_skills ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analysisData.skill_importance_data || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="skill" tick={{fill: '#64748b'}} />
                        <YAxis hide />
                        <Tooltip />
                        <Line type="monotone" dataKey="importance" stroke="#6366f1" strokeWidth={4} dot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-indigo-50 rounded-2xl">
                    <Trophy size={48} className="mx-auto text-indigo-400 mb-4" />
                    <h4 className="text-xl font-bold text-indigo-900">A Fresh Start!</h4>
                    <p className="text-indigo-700 mt-2 max-w-lg mx-auto">"{analysisData.motivational_msg}"</p>
                  </div>
                )}
              </div>
              <div className="text-center pt-10 pb-4">
                 <button onClick={() => setViewState('input')} className="text-slate-400 hover:text-indigo-600 font-bold flex items-center justify-center gap-2 mx-auto transition-colors"><Search size={16}/> Analyze Another Role</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;