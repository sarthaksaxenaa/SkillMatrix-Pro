import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, ArrowLeft, Volume2, RotateCcw } from 'lucide-react';

const VoiceInterview = ({ onGoBack, jobRole }) => {
  const [question, setQuestion] = useState("Initializing Voice Engine...");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(null);
  
  // Voice State
  const [femaleVoice, setFemaleVoice] = useState(null);
  const [isVoiceReady, setIsVoiceReady] = useState(false); // NEW: Wait flag
  
  const recognitionRef = useRef(null);

  // 1. SETUP & LOAD VOICES (The Critical Fix)
  useEffect(() => {
    // A. Speech Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        setTranscript(event.results[current][0].transcript);
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }

    // B. Voice Loading Logic
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length > 0) {
        // Priority List
        const preferredVoices = [
          "Microsoft Zira",    
          "Microsoft Aria",    
          "Google US English", 
          "Samantha",          
          "Google UK English Female"
        ];

        // Find Female Voice
        const bestMatch = voices.find(v => preferredVoices.some(p => v.name.includes(p))) 
                       || voices.find(v => v.name.includes("Female"))
                       || voices[0];
        
        setFemaleVoice(bestMatch);
        setIsVoiceReady(true); // Ready to start!
      }
    };

    // Chrome needs this listener
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Try immediately in case they are already cached

    return () => window.speechSynthesis.cancel();
  }, []);

  // 2. START INTERVIEW (Only when Voice is Ready)
  useEffect(() => {
    if (isVoiceReady) {
      fetchQuestion();
    }
  }, [isVoiceReady]); // Dependencies: Runs only after voice is found

  // --- SPEAKING FUNCTION ---
  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // STRICTLY USE THE FOUND VOICE
    if (femaleVoice) {
        utterance.voice = femaleVoice;
    }
    
    utterance.pitch = 1.0; 
    utterance.rate = 1.0; 
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const fetchQuestion = async () => {
    setFeedback(null);
    setTranscript("");
    setQuestion("Loading Question..."); // UI Feedback
    
    try {
      const res = await fetch('http://localhost:5000/api/get-question', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ job_role: jobRole || "Software Engineer" })
      });
      const data = await res.json();
      setQuestion(data.question);
      
      // Speak immediately now that we know voice is ready
      speakText(data.question);
      
    } catch (err) {
      setQuestion("Error: Backend Offline.");
    }
  };

  const submitAnswer = async () => {
    stopListening();
    if (!transcript) return;
    
    speakText("Okay, analyzing your answer."); 

    try {
      const res = await fetch('http://localhost:5000/api/submit-answer', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ question, user_answer: transcript })
      });
      const data = await res.json();
      
      setScore(data.score);
      setFeedback(data.feedback);
      
      speakText(`I gave you a ${data.score}. ${data.feedback}`);
      
    } catch (err) {
      alert("Error grading.");
    }
  };

  const startListening = () => {
    window.speechSynthesis.cancel();
    setIsListening(true);
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current?.stop();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* HEADER */}
      <div className="z-20 w-full max-w-4xl flex justify-between items-center mb-10 absolute top-6 left-6 right-6">
        <button onClick={onGoBack} className="text-slate-400 hover:text-white flex items-center gap-2 font-bold px-4 py-2 bg-slate-800 rounded-full transition-all hover:bg-slate-700">
            <ArrowLeft size={20} /> Exit Interview
        </button>
      </div>

      {/* MAIN UI */}
      <div className="z-10 text-center max-w-2xl w-full mt-10">
        
        {/* PULSING AVATAR */}
        <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
           {isSpeaking && <div className="absolute inset-0 border-4 border-indigo-500/50 rounded-full animate-ping"></div>}
           <div className={`w-40 h-40 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.5)] transition-all duration-300 ${isSpeaking ? 'scale-110' : 'scale-100'}`}>
             {isSpeaking ? <Volume2 size={64} className="text-white animate-pulse" /> : <Mic size={64} className="text-white/80" />}
           </div>
        </div>

        {/* QUESTION AREA */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4 min-h-[80px] flex items-center justify-center">
            "{question}"
          </h1>
          
          <button 
            onClick={() => speakText(question)}
            disabled={!isVoiceReady} // Disable until ready
            className="text-indigo-300 hover:text-white text-sm font-bold flex items-center justify-center gap-2 mx-auto bg-indigo-500/10 hover:bg-indigo-500/30 px-4 py-2 rounded-full transition-colors disabled:opacity-50"
          >
            <RotateCcw size={16} /> Repeat Question
          </button>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col items-center gap-6">
           {!isListening ? (
             <button 
               onClick={startListening}
               disabled={!isVoiceReady}
               className="bg-white text-slate-900 px-10 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform flex items-center gap-3 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <Mic size={24} className="text-indigo-600" /> Tap to Answer
             </button>
           ) : (
             <button 
               onClick={submitAnswer}
               className="bg-red-500 text-white px-10 py-5 rounded-full font-bold text-xl animate-pulse hover:bg-red-600 transition-colors flex items-center gap-3 shadow-2xl"
             >
               <MicOff size={24} /> Stop & Submit
             </button>
           )}

           {/* Transcript Preview */}
           <div className="h-12 flex items-center justify-center w-full max-w-lg">
              <p className="text-slate-400 text-lg italic truncate px-4">
                {!isVoiceReady ? "Initializing Voice Engine..." : (transcript || (isListening ? "Listening..." : "Your answer will appear here..."))}
              </p>
           </div>
        </div>

        {/* FEEDBACK CARD */}
        {feedback && (
          <div className="mt-6 p-6 bg-slate-800/80 backdrop-blur-md rounded-2xl animate-fade-in-up border border-slate-700 shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-slate-400 text-sm uppercase font-bold tracking-wider">Score</span>
              <span className={`text-3xl font-black ${score >= 7 ? 'text-emerald-400' : 'text-amber-400'}`}>{score}/10</span>
            </div>
            <p className="text-slate-200 mb-6 leading-relaxed">{feedback}</p>
            <button 
              onClick={fetchQuestion} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25"
            >
              Next Question →
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default VoiceInterview;