import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react';

const ResumeAnalyzer = ({ onGoBack }) => {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("Software Engineer");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  
  // Animation State
  const [displayScore, setDisplayScore] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null); 
    setDisplayScore(0);
  };

  // ANIMATE SCORE FUNCTION
  useEffect(() => {
    if (result && result.match_percentage > 0) {
      let start = 0;
      const end = result.match_percentage;
      const duration = 1000; // 1 second animation
      const increment = end / (duration / 16); // 60fps

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayScore(end);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [result]);

  const analyzeResume = async () => {
    if (!file) return alert("Please upload a PDF first!");
    
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_role', jobRole);

    try {
      const res = await fetch('http://localhost:8000/api/analyze-resume', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Error analyzing resume. Make sure Python backend is running!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 font-sans flex flex-col items-center">
      
      {/* HEADER */}
      <div className="w-full max-w-5xl flex items-center mb-8">
        <button onClick={onGoBack} className="text-slate-400 hover:text-white flex items-center gap-2 font-bold px-4 py-2 bg-slate-800 rounded-lg transition-all">
           <ArrowLeft size={20} /> Back to Dashboard
        </button>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: INPUT */}
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl h-fit border border-slate-700">
           <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
             Smart Resume Analyzer
           </h1>
           <p className="text-slate-400 mb-8">Get a strict, AI-powered critique of your resume.</p>

           <div className="mb-6">
             <label className="block text-sm font-bold text-slate-300 mb-2">TARGET ROLE</label>
             <input 
               type="text" 
               value={jobRole}
               onChange={(e) => setJobRole(e.target.value)}
               className="w-full bg-slate-900 text-white p-4 rounded-xl outline-none border border-slate-600 focus:border-indigo-500 font-bold"
             />
           </div>

           <div className="border-2 border-dashed border-slate-600 rounded-xl p-10 flex flex-col items-center justify-center hover:bg-slate-700/30 cursor-pointer relative group">
             <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
             <div className="bg-slate-700 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Upload size={32} className="text-indigo-400" />
             </div>
             <p className="text-white font-bold">{file ? file.name : "Click to Upload PDF"}</p>
           </div>

           <button 
             onClick={analyzeResume}
             disabled={isAnalyzing || !file}
             className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2"
           >
             {isAnalyzing ? <><Loader2 className="animate-spin"/> Analyzing...</> : "Analyze Resume"}
           </button>
        </div>

        {/* RIGHT: RESULTS */}
        <div className="flex flex-col gap-6">
          {!result && (
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl flex flex-col items-center justify-center text-center h-full min-h-[400px]">
               <FileText size={80} className="text-slate-700 mb-6" />
               <h3 className="text-xl font-bold text-slate-300">Ready to Review</h3>
               <p className="text-slate-500 mt-2">Your ATS Score will appear here.</p>
            </div>
          )}

          {result && (
            <>
              {/* SCORE CARD */}
              <div className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-between relative overflow-hidden">
                 <div className="z-10">
                   <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">ATS Compatibility Score</h3>
                   {/* ANIMATED NUMBER */}
                   <p className="text-6xl font-black text-white">{displayScore}%</p> 
                 </div>
                 
                 {/* CIRCLE INDICATOR */}
                 <div className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold border-8 shadow-[0_0_30px_rgba(0,0,0,0.3)] ${
                    displayScore >= 80 ? "border-emerald-500 text-emerald-400 shadow-emerald-500/20" :
                    displayScore >= 50 ? "border-amber-500 text-amber-400 shadow-amber-500/20" :
                    "border-red-500 text-red-400 shadow-red-500/20"
                 }`}>
                   {displayScore}
                 </div>
              </div>

              {/* CRITIQUE */}
              <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
                 <h3 className="text-indigo-300 font-bold mb-4 flex items-center gap-2">
                   <AlertCircle size={20} /> Professional Critique
                 </h3>
                 <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                   {result.critique}
                 </p>
              </div>

              {/* MISSING SKILLS */}
              <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
                 <h3 className="text-red-300 font-bold mb-4 flex items-center gap-2">
                   <XCircle size={20} /> Missing Critical Skills
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {result.missing_skills?.map((skill, i) => (
                      <span key={i} className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded-md text-sm font-bold border border-red-500/20">
                        {skill}
                      </span>
                    ))}
                 </div>
              </div>

              {/* TIP */}
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 rounded-2xl shadow-lg border border-indigo-500/30">
                 <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                   <CheckCircle size={20} className="text-emerald-400"/> Quick Tip
                 </h3>
                 <p className="text-indigo-200 italic">"{result.improvement_tip}"</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;