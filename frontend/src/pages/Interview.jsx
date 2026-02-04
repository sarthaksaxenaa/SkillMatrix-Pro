import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Clock, Send, CheckCircle, ChevronRight, Video, Volume2, AlertTriangle, Eye, ShieldAlert } from 'lucide-react';

const Interview = ({ role, mode, onEndSession }) => {
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
        setProctorMessage(`⚠️ ALERT: ${reason}`);
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
      stopEverything(); // Kill camera immediately
      onEndSession();   // Go back to dashboard
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

  // --- 6. BACKEND CALLS ---
  const fetchNewQuestion = async () => {
    setLoading(true); setFeedback(null); setAnswer("");
    try {
      const res = await fetch('http://localhost:8000/get-question', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_role: role })
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
      const res = await fetch('http://localhost:8000/grade-answer', {
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
    <div className={`min-h-screen text-white flex flex-col transition-colors duration-500 ${isCheating ? 'bg-red-950' : 'bg-slate-900'}`}>
      
      {/* HEADER */}
      <header className={`h-16 border-b flex items-center justify-between px-6 backdrop-blur-md transition-colors ${isCheating ? 'bg-red-900/50 border-red-700' : 'bg-slate-800/50 border-slate-700'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full animate-pulse flex items-center justify-center ${isCheating ? 'bg-white' : 'bg-red-500'}`}>
            {isCheating ? <AlertTriangle className="text-red-600" size={18}/> : <Video size={16} className="text-white"/>}
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide">{isCheating ? 'VIOLATION DETECTED' : 'LIVE INTERVIEW'}</h1>
            <p className={`text-xs font-mono uppercase ${isCheating ? 'text-red-200' : 'text-slate-400'}`}>
                {mode === 'voice' ? 'PRO VOICE MODE' : 'TEXT MODE'} • {role}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border font-mono font-bold ${warningCount > 0 ? 'bg-red-600 border-red-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                <ShieldAlert size={16} /> FLAGS: {warningCount}
            </div>
          
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 font-mono text-red-400">
                <Clock size={16} /> {formatTime(timer)}
            </div>
            
            {/* UPDATED END BUTTON */}
            <button onClick={handleEndSession} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                End Session
            </button>
        </div>
      </header>

      {/* MAIN ARENA */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        
        {/* LEFT: AI INTERVIEWER */}
        <div className="flex-1 flex flex-col gap-6">
          <div className={`bg-slate-800 border p-8 rounded-3xl shadow-2xl relative overflow-hidden group transition-all duration-300 ${isCheating ? 'border-red-500 shadow-red-500/20' : 'border-slate-700'} ${aiSpeaking ? 'ring-2 ring-indigo-500' : ''}`}>
            <div className={`absolute top-0 left-0 w-2 h-full ${isCheating ? 'bg-red-500' : 'bg-indigo-500'}`}></div>
            <div className="flex justify-between items-center mb-4">
                <h2 className={`font-bold text-sm uppercase tracking-wider ${isCheating ? 'text-red-400' : 'text-slate-400'}`}>
                    {isCheating ? "⚠️ PROCTORING ALERT" : "Current Question"}
                </h2>
                {aiSpeaking && <Volume2 className="text-indigo-400 animate-pulse" />}
            </div>
            {isCheating ? (
                <p className="text-2xl font-bold text-red-200">PLEASE RETURN TO THE INTERVIEW SCREEN IMMEDIATELY.</p>
            ) : (
                <p className="text-2xl font-medium leading-relaxed text-indigo-100">"{question}"</p>
            )}
          </div>

          <div className="flex-1 bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col relative shadow-inner">
             <textarea 
               value={answer}
               onChange={(e) => setAnswer(e.target.value)}
               placeholder={mode === 'voice' ? "Listening..." : "Type answer..."}
               className="flex-1 bg-transparent resize-none outline-none text-lg text-slate-200 placeholder-slate-600"
               disabled={feedback !== null || isCheating}
             />
             <div className="flex justify-between items-center mt-4">
                {mode === 'voice' && (
                  <button onClick={toggleMic} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${isListening ? 'bg-red-500/20 text-red-400 border border-red-500 animate-pulse' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                    {isListening ? <><MicOff size={18}/> Stop</> : <><Mic size={18}/> Speak</>}
                  </button>
                )}
                {!feedback && (
                    <button onClick={submitAnswer} disabled={!answer.trim() || loading || isCheating} className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all">
                    {loading ? "Grading..." : <>Submit <Send size={18}/></>}
                    </button>
                )}
             </div>
          </div>
        </div>

        {/* RIGHT: REAL WEBCAM + PROCTOR OVERLAY */}
        {feedback ? (
            <div className="w-1/3 bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col animate-fade-in-right">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><CheckCircle className="text-green-400" /> AI Feedback</h3>
               <div className="flex items-center justify-center mb-8">
                  <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center text-4xl font-black ${feedback.score >= 7 ? 'border-green-500 text-green-400' : 'border-amber-500 text-amber-400'}`}>
                    {feedback.score}/10
                  </div>
               </div>
               <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mb-6 flex-1 overflow-y-auto">
                 <p className="text-slate-300 italic text-sm leading-relaxed">"{feedback.feedback}"</p>
               </div>
               <button onClick={fetchNewQuestion} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">Next <ChevronRight size={20}/></button>
            </div>
        ) : (
            <div className={`w-1/3 rounded-3xl relative overflow-hidden flex items-center justify-center border shadow-2xl transition-all duration-300 ${isCheating ? 'border-red-500 shadow-red-500/50' : 'border-slate-700 bg-black'}`}>
                <video ref={videoRef} autoPlay muted playsInline className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 transition-opacity ${isCheating ? 'opacity-50' : 'opacity-100'}`} />
                
                <div className="absolute top-4 left-4 z-20 bg-black/60 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10 flex items-center gap-2">
                    <Eye size={14} className={isCheating ? "text-red-500" : "text-green-500"} />
                    <span className={`text-xs font-mono font-bold ${isCheating ? "text-red-400" : "text-green-400"}`}>
                        {proctorMessage}
                    </span>
                </div>

                {isCheating && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-red-900/40 backdrop-blur-sm animate-pulse">
                        <AlertTriangle size={64} className="text-red-500" />
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Interview;