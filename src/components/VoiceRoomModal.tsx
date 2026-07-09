import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Square, X, Volume2, VolumeX, Sparkles, AlertCircle, Play, Info, RefreshCw, Disc } from "lucide-react";
import { Deal } from "../types";

interface VoiceRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
  deals: Deal[];
}

export default function VoiceRoomModal({ isOpen, onClose, deal, deals }: VoiceRoomModalProps) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  
  const [userTranscript, setUserTranscript] = useState<string>("");
  const [aiSpeechResponse, setAiSpeechResponse] = useState<string>("");
  
  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Math metrics for high-fidelity responses
  const totalARR = deals.reduce((sum, d) => sum + d.value, 0);
  const activeDealsCount = deals.filter(d => d.status !== "Won" && d.status !== "Lost").length;
  const wonDealsCount = deals.filter(d => d.status === "Won").length;
  const averageProbability = Math.round(deals.reduce((sum, d) => sum + d.prediction.probability, 0) / (deals.length || 1));

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        setUserTranscript("Listening for your voice...");
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
        if (e.error === "not-allowed") {
          setSpeechError("Microphone permission was denied. Please allow mic access in your browser.");
        } else {
          setSpeechError(`Speech error detected: ${e.error || "Unknown"}`);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserTranscript(transcript);
        processSpeechQuery(transcript);
      };

      recognitionRef.current = rec;
    } else {
      console.warn("SpeechRecognition not supported in this browser.");
    }

    return () => {
      // Cancel speech on unmount
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [deal, deals]);

  // Live Sound Wave visualizer
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 100;

    let phase = 0;

    const drawWave = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      ctx.lineWidth = 2;

      // Draw multiple waves overlayed for depth
      const numWaves = 3;
      const waveColors = ["rgba(99, 102, 241, 0.6)", "rgba(168, 85, 247, 0.4)", "rgba(59, 130, 246, 0.3)"];
      
      for (let w = 0; w < numWaves; w++) {
        ctx.strokeStyle = waveColors[w];
        ctx.beginPath();
        
        let amplitude = isListening ? 25 : isSpeaking ? 35 : 6; // Pulse height depending on voice states
        if (isSpeaking) {
          amplitude += Math.sin(phase * 4) * 8; // Extra fluctuation when speaking
        }

        const frequency = 0.02 + w * 0.005;

        for (let x = 0; x < width; x++) {
          const y = midY + Math.sin(x * frequency + phase + w * 1.5) * amplitude * Math.sin((x / width) * Math.PI);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      phase += 0.08;
      animationFrameRef.current = requestAnimationFrame(drawWave);
    };

    drawWave();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, isListening, isSpeaking]);

  // Handle Trigger Speak
  const handleSpeak = (text: string) => {
    if (!window.speechSynthesis) {
      console.warn("SpeechSynthesis not supported.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Customize voice rate & pitch for a clean executive sound
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error(e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Main intelligence mapping query engine
  const processSpeechQuery = (query: string) => {
    const q = query.toLowerCase();
    let responseText = "";

    // Pipeline Revenue / Values query
    if (q.includes("revenue") || q.includes("pipeline") || q.includes("money") || q.includes("arr") || q.includes("value") || q.includes("how much")) {
      responseText = `Our current ARR pipeline is exceptionally strong, standing at a total value of ${totalARR / 100000} Lakh Rupees across ${activeDealsCount} active enterprise pipeline accounts. We have successfully secured ${wonDealsCount} contracts this cycle with a stellar weighted close ratio of ${averageProbability} percent.`;
    }
    // Security risk / objection query
    else if (q.includes("security") || q.includes("risk") || q.includes("objection") || q.includes("compliance") || q.includes("blocker") || q.includes("iso")) {
      if (deal) {
        responseText = `Regarding our account with ${deal.company}, our Risk Guard Agent identified a critical ISO 27001 objection raised by the client's information security lead. Our Negotiation Coach successfully resolved this by establishing a localized data sovereignty layout within the AWS Mumbai region, ensuring zero transaction logs cross Indian borders.`;
      } else {
        responseText = `Our active accounts are running with zero compliance slippages. Our core risk is a standard ISO 27001 certification requirement on manufacturing accounts, which has been successfully mitigated across our template contracts.`;
      }
    }
    // Decision maker / contact query
    else if (q.includes("cto") || q.includes("contact") || q.includes("decision") || q.includes("vikram") || q.includes("who is")) {
      if (deal) {
        responseText = `The primary decision maker is ${deal.contactName}, who serves as the ${deal.contactRole} for ${deal.company}. They have actively approved our bidirectional SAP ERP API connector and are currently coordinating the Okta directory integration.`;
      } else {
        responseText = "The primary contact across our manufacturing pipeline is Vikram Sharma, Chief Technology Officer at ABC Manufacturing. He is highly motivated to complete onboarding before the December peak shipping season.";
      }
    }
    // Summary of deal
    else if (q.includes("summary") || q.includes("explain") || q.includes("what is the deal") || q.includes("tell me about")) {
      if (deal) {
        responseText = `Here is our active deal briefing: We are tracking ${deal.name} for ${deal.company}, valued at ${deal.value / 100000} Lakh Rupees. The deal is currently in the ${deal.status} stage, with a high win probability of ${deal.prediction.probability} percent. Key agreements include real-time SAP integration and Okta directory sync.`;
      } else {
        responseText = "We are currently orchestrating multiple enterprise pipeline opportunities. Our leading deal is with ABC Manufacturing, which is in the commercial negotiation phase and carries an AI deal score of 94 out of 100.";
      }
    }
    // Greeting
    else if (q.includes("hello") || q.includes("hi ") || q.includes("hey") || q.includes("greet")) {
      responseText = "Hello there. I am your specialized AI Deal Voice Assistant. Ask me anything about our enterprise ARR pipeline, active deal statuses, or client objections, and I will summarize our multi-agent metrics for you.";
    }
    // Default smart summary fallback
    else {
      if (deal) {
        responseText = `I have received your query: "${query}". Based on our multi-agent audit for ${deal.company}, our Forecast Agent predicts a ${deal.prediction.probability} percent close ratio. Our recommended next action is to schedule the final DocuSign kickoff for next Monday ahead of the December shipping deadline.`;
      } else {
        responseText = `I've evaluated your query: "${query}". Our overall pipeline is healthy, with total recurring commercials of ${totalARR / 100000} Lakh Rupees and average close probability of ${averageProbability} percent. Let me know if you would like me to summarize any specific company details.`;
      }
    }

    setAiSpeechResponse(responseText);
    handleSpeak(responseText);
  };

  // Manual Mic Trigger
  const startListening = () => {
    if (!recognitionRef.current) {
      setSpeechError("Speech recognition is not supported on this browser or environment.");
      return;
    }
    
    // Stop speaking first
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn("Recognition already started:", e);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div 
        className="bg-white border border-black/10 rounded-3xl p-6 shadow-2xl max-w-md w-full relative overflow-hidden flex flex-col gap-5"
        id="voice-ai-modal-container"
      >
        {/* Subtle decorative color gradients */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin-slow" />
            </span>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">AI Deal Voice Room</h3>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">
                {deal ? `Grounded in: ${deal.company}` : "Pipeline General Sync"}
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              stopSpeaking();
              stopListening();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Voice Visualizer Stage */}
        <div className="bg-[#0E1017] rounded-2xl p-6 text-center flex flex-col justify-center items-center gap-4 border border-white/5 relative min-h-[160px]">
          {isSpeaking && (
            <span className="absolute top-3 right-3 flex items-center gap-1.5 text-[8px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
              <Volume2 className="w-3 h-3 text-indigo-400 animate-pulse" />
              AI Speaking
            </span>
          )}
          {isListening && (
            <span className="absolute top-3 right-3 flex items-center gap-1.5 text-[8px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
              <Disc className="w-3 h-3 text-rose-400 animate-spin" />
              Mic On
            </span>
          )}

          {/* Glowing waveform background circles */}
          <div className="relative flex justify-center items-center h-20 w-20">
            <div className={`absolute inset-0 rounded-full bg-indigo-500/10 transition-all duration-700 blur-md ${
              isSpeaking ? "scale-[1.8] opacity-60 animate-ping" : isListening ? "scale-[1.5] opacity-40 animate-pulse" : "scale-100"
            }`} />
            <div className={`absolute inset-2 rounded-full bg-purple-500/10 transition-all duration-500 blur-sm ${
              isSpeaking ? "scale-[1.4] opacity-50" : isListening ? "scale-110 opacity-30" : "scale-100"
            }`} />
            
            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative h-14 w-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                isListening 
                  ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20" 
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20"
              }`}
            >
              <Mic className={`w-6 h-6 text-white ${isListening ? "animate-bounce" : ""}`} />
            </button>
          </div>

          <canvas ref={canvasRef} className="w-full h-12 pointer-events-none" />

          <p className="text-[11px] font-mono tracking-wider uppercase text-slate-400">
            {isListening ? "Listening... Speak naturally" : isSpeaking ? "Voice synthesis active" : "Tap the Mic and speak"}
          </p>
        </div>

        {/* Real-time transcribed text & Response dialogues */}
        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
          {userTranscript && (
            <div className="space-y-1">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-indigo-600">User Speech Input</span>
              <div className="bg-indigo-50/50 border border-indigo-100/30 p-3 rounded-2xl text-xs font-semibold text-slate-700">
                {userTranscript}
              </div>
            </div>
          )}

          {aiSpeechResponse && (
            <div className="space-y-1">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-purple-600">AI Spoken Answer</span>
              <div className="bg-purple-50/50 border border-purple-100/30 p-3 rounded-2xl text-xs font-semibold text-slate-800 leading-relaxed font-sans">
                {aiSpeechResponse}
              </div>
            </div>
          )}

          {speechError && (
            <div className="p-3 bg-red-50 text-red-800 text-[11px] rounded-xl border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-semibold">{speechError}</span>
            </div>
          )}
        </div>

        {/* Context preset suggestions */}
        <div className="space-y-1.5 border-t border-black/5 pt-3">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Suggested Voice Questions (Click mic, then ask):
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                setUserTranscript("Summarize our active pipeline ARR metrics.");
                processSpeechQuery("Summarize our active pipeline ARR metrics.");
              }}
              className="text-[9px] font-bold uppercase text-slate-500 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              Pipeline ARR
            </button>
            <button
              onClick={() => {
                setUserTranscript("What is the main security risk on the manufacturing account?");
                processSpeechQuery("What is the main security risk on the manufacturing account?");
              }}
              className="text-[9px] font-bold uppercase text-slate-500 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              Security Risk
            </button>
            {deal && (
              <button
                onClick={() => {
                  setUserTranscript(`Give me a quick briefing on ${deal.company}.`);
                  processSpeechQuery(`Give me a quick briefing on ${deal.company}.`);
                }}
                className="text-[9px] font-bold uppercase text-slate-500 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                Deal Brief
              </button>
            )}
          </div>
        </div>

        {/* Stop synthesis controls */}
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
          >
            Mute Speech Output
          </button>
        )}
      </div>
    </div>
  );
}
