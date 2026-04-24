import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/api';

const I = ({ d, size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{typeof d === 'string' ? <path d={d}/> : d}</svg>
);
const Mic = (p) => <I {...p} d={<><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>}/>;
const MicOff = (p) => <I {...p} d={<><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.13 1.49-.35 2.17"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>}/>;
const Clock = (p) => <I {...p} d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}/>;
const Send = (p) => <I {...p} d={<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>}/>;
const CheckCircle = (p) => <I {...p} d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>}/>;
const ChevronRight = (p) => <I {...p} d="M9 18l6-6-6-6"/>;
const Video = (p) => <I {...p} d={<><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>}/>;
const Volume2 = (p) => <I {...p} d={<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></>}/>;
const AlertTriangle = (p) => <I {...p} d={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}/>;
const Eye = (p) => <I {...p} d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}/>;
const ShieldAlert = (p) => <I {...p} d={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}/>;

const Interview = ({ jobRole, mode, onEnd }) => {
  const [question, setQuestion] = useState("Initializing interview environment...");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  
  // Proctoring
  const [warningCount, setWarningCount] = useState(0);
  const [isCheating, setIsCheating] = useState(false);
  const [proctorMessage, setProctorMessage] = useState("Secure Environment Active");

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null); // Keep track of the stream to kill it later

  // --- 1. PROCTORING ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) handleCheatingDetection("Tab Switch Detected");
    };
    const handleBlur = () => handleCheatingDetection("Focus Lost");

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const handleCheatingDetection = (reason) => {
    setIsCheating(true);
    setWarningCount(prev => {
        const newCount = prev + 1;
        const warningMsg = `Warning ${newCount}. ${reason}. Stay focused.`;
        speakText(warningMsg, true);
        setProctorMessage(`ALERT: ${reason}`);
        return newCount;
    });
    setTimeout(() => {
        setIsCheating(false);
        setProctorMessage("Secure Environment Active");
    }, 4000);
  };

  // --- 2. SETUP ---
  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);

    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream; // Save stream reference
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) { console.error("No camera:", err); }
    };
    startCamera();
    
    fetchNewQuestion();
    
    return () => {
      clearInterval(interval);
      stopEverything(); // Cleanup on unmount
    };
  }, []);

  // --- 3. HARD STOP FUNCTION ---
  const stopEverything = () => {
    window.speechSynthesis.cancel(); // Stop talking
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop()); // Kill Camera
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
  };

  const handleEndSession = () => {
      stopEverything();
      onEnd();
  };

  // --- 4. AI VOICE ---
  const speakText = (text, force = false) => {
    if (!force && mode !== 'voice') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Zira') || v.name.includes('female'));
    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.pitch = 1.1;
    utterance.onstart = () => setAiSpeaking(true);
    utterance.onend = () => setAiSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // --- 5. SPEECH RECOGNITION ---
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
            }
            if (finalTranscript) setAnswer(prev => prev + " " + finalTranscript);
        };
    }
  }, []);

  const toggleMic = () => {
    if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
    } else {
        window.speechSynthesis.cancel(); 
        setAiSpeaking(false);
        recognitionRef.current?.start();
        setIsListening(true);
    }
  };

  const fetchNewQuestion = async () => {
    setLoading(true); setFeedback(null); setAnswer("");
    try {
      const res = await fetch(`${API_BASE_URL}/get-question`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_role: jobRole })
      });
      const data = await res.json();
      setQuestion(data.question);
      speakText(data.question);
    } catch (e) { setQuestion("Tell me about your experience."); }
    finally { setLoading(false); }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    if (isListening) toggleMic();
    try {
      const res = await fetch(`${API_BASE_URL}/grade-answer`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, user_answer: answer })
      });
      const data = await res.json();
      setFeedback(data);
      speakText(`You scored ${data.score}. ${data.feedback}`);
    } catch (e) { alert("Error grading answer."); }
    finally { setLoading(false); }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500`} style={{ background: isCheating ? '#1a0505' : 'var(--bg)' }}>
      
      {/* HEADER */}
      <header className={`h-16 border-b flex items-center justify-between px-8 backdrop-blur-md transition-colors`} style={{ borderColor: isCheating ? 'rgba(239,68,68,0.2)' : 'var(--border)', background: isCheating ? 'transparent' : 'var(--bg)' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            {isCheating ? <AlertTriangle className="text-red-500" size={18}/> : <Video size={16} className="text-zinc-400"/>}
          </div>
          <div>
            <h1 className="font-medium text-sm tracking-wide">{isCheating ? <span className="text-red-400">Violation Detected</span> : 'Live Interview'}</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-0.5">
                {mode === 'voice' ? 'Voice Mode' : 'Text Mode'} · {jobRole}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 text-xs font-medium ${warningCount > 0 ? 'text-red-400' : 'text-zinc-500'}`}>
                <ShieldAlert size={14} /> FLAGS: {warningCount}
            </div>
          
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Clock size={14} /> {formatTime(timer)}
            </div>
            
            <button onClick={handleEndSession} className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors bg-transparent border-none">
                End session
            </button>
        </div>
      </header>

      {/* MAIN ARENA */}
      <div className="flex-1 flex gap-6 p-8 max-w-7xl mx-auto w-full">
        
        {/* LEFT: AI INTERVIEWER */}
        <div className="flex-1 flex flex-col gap-6">
          <div className={`surface p-10 flex flex-col justify-center min-h-[200px] transition-all duration-300 ${isCheating ? 'border-red-500/30' : ''}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className={`label ${isCheating ? 'text-red-400/80' : 'text-zinc-500'}`}>
                    {isCheating ? "Proctoring Alert" : "Current Question"}
                </h2>
                {aiSpeaking && <Volume2 className="text-blue-400" size={16} />}
            </div>
            {isCheating ? (
                <p className="heading-display text-3xl text-red-400">Please return to the interview window immediately.</p>
            ) : (
                <p className="heading-display text-3xl leading-tight">"{question}"</p>
            )}
          </div>

          <div className="surface flex-1 p-8 flex flex-col relative">
             <textarea 
               value={answer}
               onChange={(e) => setAnswer(e.target.value)}
               placeholder={mode === 'voice' ? "Listening..." : "Type your answer..."}
               className="flex-1 bg-transparent resize-none outline-none text-base text-zinc-300 placeholder-zinc-600 border-none"
               style={{ border: 'none', background: 'transparent' }}
               disabled={feedback !== null || isCheating}
             />
             <div className="flex justify-between items-center mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                {mode === 'voice' && (
                  <button onClick={toggleMic} className={`btn-secondary flex items-center gap-2 px-4 py-2 text-sm ${isListening ? '!text-red-400 !border-red-400/30' : ''}`}>
                    {isListening ? <><MicOff size={16}/> Stop listening</> : <><Mic size={16}/> Start speaking</>}
                  </button>
                )}
                {!feedback && (
                    <button onClick={submitAnswer} disabled={!answer.trim() || loading || isCheating} className="ml-auto btn-primary px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50">
                    {loading ? "Grading..." : <>Submit answer <Send size={14}/></>}
                    </button>
                )}
             </div>
          </div>
        </div>

        {/* RIGHT: REAL WEBCAM + PROCTOR OVERLAY */}
        {feedback ? (
            <div className="w-[340px] surface p-8 flex flex-col animate-enter">
               <h3 className="label mb-8 flex items-center gap-2"><CheckCircle className="text-emerald-500" size={14}/> AI Evaluation</h3>
               <div className="flex items-center justify-center mb-10">
                  <div className={`w-32 h-32 rounded-full border flex items-center justify-center text-4xl font-bold ${feedback.score >= 7 ? 'border-emerald-500/30 text-emerald-400' : 'border-amber-500/30 text-amber-400'}`}>
                    {feedback.score}<span className="text-lg text-zinc-600">/10</span>
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto mb-8">
                 <p className="text-zinc-400 text-sm leading-relaxed">"{feedback.feedback}"</p>
               </div>
               <button onClick={fetchNewQuestion} className="w-full btn-secondary py-3 text-sm flex items-center justify-center gap-2">Next question <ChevronRight size={16}/></button>
            </div>
        ) : (
            <div className={`w-[340px] surface relative overflow-hidden flex items-center justify-center transition-all duration-300 ${isCheating ? 'border-red-500/50' : ''}`}>
                <video ref={videoRef} autoPlay muted playsInline className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 transition-opacity ${isCheating ? 'opacity-30' : 'opacity-100'}`} />
                
                <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg backdrop-blur-md flex items-center gap-2" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Eye size={12} className={isCheating ? "text-red-400" : "text-emerald-400"} />
                    <span className={`text-[10px] uppercase tracking-widest font-medium ${isCheating ? "text-red-400" : "text-emerald-400"}`}>
                        {proctorMessage}
                    </span>
                </div>

                {isCheating && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-sm" style={{ background: 'rgba(239,68,68,0.1)' }}>
                        <AlertTriangle size={48} className="text-red-500/50" />
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Interview;