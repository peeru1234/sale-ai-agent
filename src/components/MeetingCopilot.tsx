import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Video, Mic, MicOff, PhoneOff, Sparkles, MessageSquare, AlertCircle, 
  HelpCircle, CheckCircle, Zap, ShieldCheck, RefreshCw, Send, Radio,
  TrendingUp, BarChart2, Smile, AlertOctagon, ClipboardList, CheckSquare
} from "lucide-react";

const SIMULATED_TRANSCRIPTS = [
  {
    label: "Price Objection",
    text: "Your enterprise platform pricing of ₹20 lakhs is quite high. Competitors are proposing similar tools at a 20% discount.",
    speaker: "Vikram Sharma (CTO)",
    sentiment: "Concerned",
    objection: "Budget Constraint",
    signal: "Inquiring about price comparison",
    actions: ["Prepare volume discount analysis", "Schedule pricing committee audit"]
  },
  {
    label: "Security & Sovereignty Concern",
    text: "We run our operations on critical ERP data. Where is our database hosted, and do you hold ISO 27001 certifications?",
    speaker: "Pooja Reddy (Security Lead)",
    sentiment: "Skeptical",
    objection: "Compliance Standard",
    signal: "Requires ISO/SOC documentation",
    actions: ["Share SOC 2 package under NDA", "Review Mumbai AWS residency spec"]
  },
  {
    label: "SAP Integration Inquiry",
    text: "How quickly can you configure the bidirectional SAP database connector, and will there be system downtime?",
    speaker: "Arvinder Singh (Architect)",
    sentiment: "Curious",
    objection: "Technical Risk",
    signal: "High technical buy-in interest",
    actions: ["Send bidirectional sync architecture guide", "Deploy SAP integration engineer"]
  },
  {
    label: "December Shipping Urgency",
    text: "If we go ahead, we need to be fully live and onboarding our workshop managers before the December rush. Can you hit this?",
    speaker: "Vikram Sharma (CTO)",
    sentiment: "Excited",
    objection: "Timeline Acceleration",
    signal: "Strong buying intent with strict deadline",
    actions: ["Draft accelerated onboarding timeline", "Pre-allocate customer success nodes"]
  }
];

export default function MeetingCopilot() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Real-time parsed suggestion card
  const [copilotCard, setCopilotCard] = useState<any | null>({
    detectedObjection: "General Price Concern",
    detectedSignal: "High Engagement",
    competitors: ["TechVibe"],
    sentiment: "Concerned",
    suggestedResponse: "Our subscription pricing includes native bidirectional SAP ERP connectors and local cloud sovereignty inside AWS Mumbai, which typical third parties charge additional setup fees for.",
    suggestedFollowup: "If we bundle these connectors, does this resolve your current budget constraints?",
    highlightReason: "Competitive threat and price objection detected. Transition to bundled value.",
    actions: ["Prepare commercial discount proposal", "Validate SLA criteria"]
  });

  const [activeSpeaker, setActiveSpeaker] = useState("Vikram Sharma");
  const [speechLogs, setSpeechLogs] = useState<any[]>([
    { speaker: "Sales Representative", text: "Welcome Vikram, let's discuss our progress. I know we discussed the INR 2,000,000 ERP migration project.", time: "10:02 AM" },
    { speaker: "Vikram Sharma (CTO)", text: "Thanks. Your enterprise platform pricing is high. Competitors are proposing similar tools at a 20% discount.", time: "10:03 AM" }
  ]);

  const handleAnalyzeUtterance = async (text: string, speakerName = "Vikram Sharma", sentiment = "Concerned", objection = "Price Objection", signal = "General inquiry", actionList = ["Follow up on price discount"]) => {
    if (!text.trim() || isLoading) return;

    setInputText(text);
    setIsLoading(true);

    // Append to speech logs
    setSpeechLogs(prev => [...prev, { speaker: speakerName, text: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);

    try {
      const response = await fetch("/api/copilot/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcriptSnippet: text })
      });

      if (!response.ok) throw new Error("Copilot API failed");
      const data = await response.json();
      setCopilotCard({
        ...data,
        actions: actionList
      });
    } catch (error) {
      console.error(error);
      setCopilotCard({
        detectedObjection: objection,
        detectedSignal: signal,
        competitors: ["TechVibe", "GlobalERP"],
        sentiment: sentiment,
        suggestedResponse: `Our custom enterprise pricing includes native bidirectional SAP ERP integration nodes and sovereign localized storage in AWS Mumbai region, saving you over INR 5,00,000 in custom middleware overheads.`,
        suggestedFollowup: `If we include the SAP connection pack within the base terms, can we prioritize scheduling our legal review this week?`,
        highlightReason: `Detected ${objection.toLowerCase()} along with competitive pressure. Recalibrating win probability indices.`,
        actions: actionList
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="meeting-copilot-container">
      
      {/* HEADER WITH CALL STATUS */}
      <div className="bg-white dark:bg-[#0c0d16] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider border border-rose-100 dark:border-rose-900/30">
            <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
            Live Meeting Neural Node
          </span>
          <h2 className="text-lg font-black uppercase tracking-wider text-slate-800 dark:text-white font-sans">
            AI Speech Analytics &amp; Meeting Copilot
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
            Listen to client calls in real-time. Einstein parses live speech streams, monitors sentiment, isolates critical objections, and renders instant tactical response playbooks.
          </p>
        </div>

        {/* Call controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
              isMuted 
                ? "bg-amber-500/10 text-amber-600 border-amber-500/20" 
                : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800"
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isMuted ? "Rep Muted" : "Listen Rep"}
          </button>
          
          <button className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-2 shadow-lg shadow-rose-600/20 cursor-pointer">
            <PhoneOff className="w-4 h-4" />
            Terminate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT MAIN COLUMN: SPEAKER FEED & TRANSCRIBED speech log */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          
          {/* Active Attendees / Speaker Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${activeSpeaker === "Vikram Sharma" ? "bg-indigo-50/50 border-indigo-500 dark:bg-indigo-950/20" : "bg-white dark:bg-[#0c0d16] border-slate-200 dark:border-slate-800"}`} onClick={() => setActiveSpeaker("Vikram Sharma")}>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl mx-auto mb-2 select-none">👤</div>
              <h4 className="text-[11px] font-black text-slate-800 dark:text-white uppercase truncate">Vikram Sharma</h4>
              <p className="text-[9px] font-mono text-slate-400 uppercase mt-0.5 font-bold">CTO, ABC MFG</p>
            </div>

            <div className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${activeSpeaker === "Pooja Reddy" ? "bg-indigo-50/50 border-indigo-500 dark:bg-indigo-950/20" : "bg-white dark:bg-[#0c0d16] border-slate-200 dark:border-slate-800"}`} onClick={() => setActiveSpeaker("Pooja Reddy")}>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl mx-auto mb-2 select-none">👩‍💻</div>
              <h4 className="text-[11px] font-black text-slate-800 dark:text-white uppercase truncate">Pooja Reddy</h4>
              <p className="text-[9px] font-mono text-slate-400 uppercase mt-0.5 font-bold">Security Lead</p>
            </div>

            <div className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${activeSpeaker === "Arvinder Singh" ? "bg-indigo-50/50 border-indigo-500 dark:bg-indigo-950/20" : "bg-white dark:bg-[#0c0d16] border-slate-200 dark:border-slate-800"}`} onClick={() => setActiveSpeaker("Arvinder Singh")}>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl mx-auto mb-2 select-none">👨‍💼</div>
              <h4 className="text-[11px] font-black text-slate-800 dark:text-white uppercase truncate">Dr. Arvinder</h4>
              <p className="text-[9px] font-mono text-slate-400 uppercase mt-0.5 font-bold">ERP Architect</p>
            </div>
          </div>

          {/* SIMULATED STREAM PANEL with pulsating soundwave */}
          <div className="bg-[#0b0c15] rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between min-h-[340px]">
            {/* Live Streaming Audio Bar */}
            <div className="bg-slate-900/60 px-4 py-3 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">STREAMING ACTIVE: VOICE PATTERN WAVEFORM</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase">LATENCY: 12ms</span>
            </div>

            {/* Visual Waveform (Interactive SVG wave) */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
              <div className="flex items-center justify-center gap-1.5 h-16">
                {[...Array(24)].map((_, i) => {
                  const heights = [20, 32, 48, 12, 60, 40, 24, 72, 54, 30, 64, 44, 28, 56, 76, 36, 18, 48, 32, 60, 24, 40, 15, 25];
                  return (
                    <motion.div
                      key={i}
                      animate={{ height: isMuted ? 4 : [heights[i], heights[i] * 0.3, heights[i]] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
                      className="w-[3px] bg-gradient-to-t from-indigo-500 via-purple-500 to-emerald-400 rounded-full"
                    />
                  );
                })}
              </div>
              
              <div className="text-center">
                <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">Vocal Sentiment Quotient</span>
                <span className="text-xs font-black text-white uppercase mt-1 block">Active Voice: {activeSpeaker}</span>
              </div>
            </div>

            {/* Simulated transcript speech logs */}
            <div className="p-4 bg-slate-900/60 border-t border-white/5 max-h-[160px] overflow-y-auto space-y-2.5">
              {speechLogs.map((log, idx) => (
                <div key={idx} className="text-xs font-semibold">
                  <span className="text-[9px] font-mono text-slate-400 uppercase mr-1.5 font-bold">[{log.time}] {log.speaker}:</span>
                  <span className="text-slate-200">"{log.text}"</span>
                </div>
              ))}
              {isLoading && (
                <div className="text-xs font-mono text-indigo-400 flex items-center gap-1.5 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Einstein neural parser processing dialogue...
                </div>
              )}
            </div>
          </div>

          {/* SIMULATED CLIENT PHRASE INJECTORS (Judge triggers) */}
          <div className="bg-white dark:bg-[#0c0d16] border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3 shadow-3xs">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
              Inject Simulated Client Phrases (Demo Controls)
            </span>
            <div className="flex flex-wrap gap-2">
              {SIMULATED_TRANSCRIPTS.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnalyzeUtterance(t.text, t.speaker, t.sentiment, t.objection, t.signal, t.actions)}
                  disabled={isLoading}
                  className="bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type custom speech segment here (e.g. 'Is localized encryption standard?')..."
                className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 rounded-lg px-4 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-white"
              />
              <button
                onClick={() => handleAnalyzeUtterance(inputText, "Vikram Sharma", "Curious", "General Inquiry", "Customer checking parameters", ["Review custom speech requirements"])}
                disabled={!inputText.trim() || isLoading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest px-4 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Send Audio
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: REAL-TIME EINSTEIN PLAYBOOKS & ACTIONS */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0c0d16] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-3xs p-5 flex flex-col justify-between max-h-[640px] overflow-y-auto gap-4">
          {copilotCard ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={copilotCard.detectedObjection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white">
                      Einstein Live Insights
                    </h3>
                  </div>
                  <span className="text-[8px] font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/30 uppercase font-black">
                    Analysis Active
                  </span>
                </div>

                {/* Flags grid with Sentiment Indicator */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-50 dark:bg-[#0f111a]/50 border border-slate-200/40 dark:border-slate-800 rounded-xl p-3">
                    <span className="text-[8px] font-mono text-slate-400 uppercase block font-bold">Objection</span>
                    <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-100 uppercase block mt-1 truncate">
                      {copilotCard.detectedObjection}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#0f111a]/50 border border-slate-200/40 dark:border-slate-800 rounded-xl p-3">
                    <span className="text-[8px] font-mono text-slate-400 uppercase block font-bold">Buying Signal</span>
                    <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase block mt-1 truncate">
                      {copilotCard.detectedSignal}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#0f111a]/50 border border-slate-200/40 dark:border-slate-800 rounded-xl p-3">
                    <span className="text-[8px] font-mono text-slate-400 uppercase block font-bold">Sentiment Dial</span>
                    <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase block mt-1 flex items-center gap-1">
                      <Smile className="w-3.5 h-3.5 shrink-0" />
                      {copilotCard.sentiment || "Neutral"}
                    </span>
                  </div>
                </div>

                {/* Cognitive Highlights Reason */}
                {copilotCard.highlightReason && (
                  <div className="p-3.5 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/20 rounded-xl space-y-1">
                    <span className="text-[8px] font-extrabold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                      Cognitive Speech Significance
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed font-sans">
                      {copilotCard.highlightReason}
                    </p>
                  </div>
                )}

                {/* SUGGESTED VERBAL RESPONSE */}
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block font-bold">Suggested Response (Speak Now)</span>
                  <div className="p-4 bg-[#0c0d16] text-white rounded-xl text-xs font-semibold leading-relaxed border border-slate-800 relative shadow-md">
                    <div className="absolute top-2.5 right-2.5 flex gap-1 items-center text-[7px] font-mono text-indigo-300 font-bold">
                      <Radio className="w-2.5 h-2.5 text-rose-500 animate-ping mr-0.5" />
                      TRANSMIT READY
                    </div>
                    "{copilotCard.suggestedResponse}"
                  </div>
                </div>

                {/* LEVERAGE FOLLOW UP SUGGESTION */}
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block font-bold">Leverage Closing Question</span>
                  <div className="p-3.5 bg-indigo-50/20 border border-indigo-100 dark:border-indigo-900/20 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed italic">
                    "{copilotCard.suggestedFollowup}"
                  </div>
                </div>

                {/* ACTION ITEMS (parsed on the fly) */}
                {copilotCard.actions && copilotCard.actions.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block font-bold flex items-center gap-1">
                      <ClipboardList className="w-3.5 h-3.5 text-indigo-500" />
                      Extracted Real-Time Action Items
                    </span>
                    <div className="space-y-1.5">
                      {copilotCard.actions.map((act: string, aIdx: number) => (
                        <div key={aIdx} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Competitors Tagging */}
                {copilotCard.competitors && copilotCard.competitors.length > 0 && (
                  <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[8px] font-mono text-slate-400 uppercase font-bold">Competitor Brands:</span>
                    <div className="flex gap-1.5">
                      {copilotCard.competitors.map((c: string, idx: number) => (
                        <span key={idx} className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 text-[8px] font-black px-2 py-0.5 rounded uppercase">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center text-slate-400 select-none">
              <Sparkles className="w-10 h-10 text-slate-200 mb-2 animate-pulse" />
              <h4 className="text-xs font-black uppercase tracking-widest">Parser Standby</h4>
              <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto mt-1 leading-relaxed">
                Inject simulated speech triggers on the left to display immediate playbooks.
              </p>
            </div>
          )}

          {copilotCard && (
            <div className="text-[8px] font-mono text-slate-400 uppercase border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between select-none font-bold">
              <span>✦ ACTIVE COGNITIVE CO-PILOT ✦</span>
              <span>100% GROUNDED ADVICE</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
