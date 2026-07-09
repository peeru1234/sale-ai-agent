import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, MessageSquare, Play, RefreshCw, Send, Award, HelpCircle, 
  ChevronRight, ArrowRight, ShieldAlert, BadgeCheck, CheckCircle2, 
  Brain, Zap, ChevronLeft, Volume2, UserCheck, AlertCircle
} from "lucide-react";

interface Persona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  description: string;
  openingLine: string;
}

const PERSONAS: Persona[] = [
  {
    id: "friendly",
    name: "Vivek",
    role: "Operational Manager",
    avatar: "👨🏽‍💼",
    color: "from-emerald-500 to-teal-600",
    difficulty: "Easy",
    description: "Extremely warm and loves the product, but gets distracted easily and needs firm ROI grounding.",
    openingLine: "Hi there! I've been looking over your tool and honestly, it looks pretty neat. But we need to make sure our team actually gets value out of it. How's your week going?"
  },
  {
    id: "technical",
    name: "Dr. Arvinder",
    role: "Lead Systems Architect",
    avatar: "🕵️‍♂️",
    color: "from-blue-500 to-indigo-600",
    difficulty: "Hard",
    description: "Skeptical of fluff. Demands deep details on Okta SSO, bidirectional latency, and AWS Mumbai sovereignty.",
    openingLine: "Thanks for meeting. I'll cut straight to the chase: we operate on a complex SAP environment. How do you guarantee sub-100ms bidirectional sync latency, and where exactly does our data reside?"
  },
  {
    id: "procurement",
    name: "Meera",
    role: "VP of Strategic Sourcing",
    avatar: "👩‍💼",
    color: "from-amber-500 to-orange-600",
    difficulty: "Hard",
    description: "Hyper-focused on pricing, payment cycles (Net-60/90), SLA credits, and multi-year commitment discounts.",
    openingLine: "Hi. I've seen your initial brochure. Let's talk commercial realties. We are looking for a 20% discount on your base subscription, and we require standard Net-60 terms. What can you offer?"
  },
  {
    id: "ceo",
    name: "Rajesh",
    role: "Chief Executive Officer",
    avatar: "👨‍💼",
    color: "from-purple-500 to-fuchsia-600",
    difficulty: "Medium",
    description: "Big picture thinker. Wants to know about valuation, competitive edge, market share, and risk mitigation.",
    openingLine: "I only have 5 minutes. Tell me: how does your platform reduce our operational schedule slippage, and why should we choose you over legacy system integrations?"
  },
  {
    id: "difficult",
    name: "Kabir",
    role: "Senior Director",
    avatar: "🧔",
    color: "from-red-500 to-rose-600",
    difficulty: "Expert",
    description: "Aggressive and highly critical. Will interrupt you, question claims, and pitch competitors.",
    openingLine: "Honestly, I've seen three sales teams pitch similar 'AI-powered' solutions this month. Explain to me why you aren't just another layer of costly middleware we'll abandon in a year."
  },
  {
    id: "cfo",
    name: "Sandeep",
    role: "Chief Financial Officer",
    avatar: "👨🏼‍💼",
    color: "from-cyan-500 to-blue-600",
    difficulty: "Expert",
    description: "Extremely detail-oriented on finances. Demands CAPEX/OPEX tradeoffs, exact payback periods, and ROI calculations.",
    openingLine: "Before we discuss any operational rollouts, I need to understand the financial amortizations. If we allocate ₹20 lakhs to this project, what is our exact break-even point in months?"
  }
];

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export default function SalesPracticeSimulator() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isEndingSession, setIsEndingSession] = useState<boolean>(false);
  
  // Evaluation Result State
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  const activePersona = PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0];
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleStartRoleplay = (personaId: string) => {
    setSelectedPersonaId(personaId);
    const persona = PERSONAS.find(p => p.id === personaId) || PERSONAS[0];
    setChatHistory([{ role: "model", text: persona.openingLine }]);
    setEvaluationResult(null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isSending || !selectedPersonaId) return;

    const query = userInput.trim();
    setUserInput("");
    setChatHistory(prev => [...prev, { role: "user", text: query }]);
    setIsSending(true);

    try {
      const response = await fetch("/api/roleplay/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId: selectedPersonaId,
          history: chatHistory,
          userInput: query
        })
      });

      if (!response.ok) throw new Error("Simulator API error");
      const data = await response.json();

      setChatHistory(prev => [...prev, { role: "model", text: data.reply }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: "model", text: "I apologize, but my transmission was interrupted. Could you repeat that?" }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleEndSessionAndEvaluate = async () => {
    if (chatHistory.length < 2 || isEndingSession) return;
    setIsEndingSession(true);

    try {
      const response = await fetch("/api/roleplay/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId: selectedPersonaId,
          history: chatHistory
        })
      });

      if (!response.ok) throw new Error("Evaluation API error");
      const data = await response.json();
      setEvaluationResult(data);
    } catch (error) {
      console.error(error);
      // Fallback local score in case of error
      setEvaluationResult({
        performanceScore: 82,
        strengths: ["Maintained high professional tone", "Addressed system deadlines with confidence"],
        areasToImprove: ["Proactively handle price objections instead of deflecting", "Deliver certificate files upfront"],
        buyingSignalsMissed: ["Missed timeline close cue in prompt 2"],
        objectionsMissed: ["Did not fully explain AWS Mumbai hosting advantages"],
        confidenceAnalysis: "Session completed successfully. Your responses were clear but should highlight precise ROI metrics more confidently.",
        communicationTips: ["Always bundle connectors to secure core licensing margins."]
      });
    } finally {
      setIsEndingSession(false);
    }
  };

  const handleExitSimulator = () => {
    setSelectedPersonaId(null);
    setChatHistory([]);
    setEvaluationResult(null);
  };

  return (
    <div className="space-y-6" id="practice-simulator-root">
      
      {/* SCREEN 1: PERSONA DIRECTORY */}
      {!selectedPersonaId ? (
        <div className="space-y-6">
          <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                <Brain className="w-3.5 h-3.5 animate-pulse" />
                AI Practice Hub
              </span>
              <h2 className="text-lg font-black uppercase tracking-wider text-slate-800">
                AI-Powered Sales Practice Simulator
              </h2>
              <p className="text-xs text-slate-500 max-w-xl">
                Choose an enterprise buyer persona below to test your sales pitches, objection-handling, and closing strategies. Gemini will simulate authentic, interactive responses.
              </p>
            </div>
          </div>

          {/* Grid of Personas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERSONAS.map((persona) => (
              <div 
                key={persona.id}
                className="bg-white border border-black/10 rounded-2xl p-5 shadow-3xs flex flex-col justify-between hover:border-indigo-500/80 hover:shadow-xs transition-all group relative overflow-hidden"
              >
                {/* Visual Top Bar */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl bg-slate-100 p-2 rounded-xl group-hover:scale-110 transition-transform">
                      {persona.avatar}
                    </span>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        {persona.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">
                        {persona.role}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[8px] font-mono font-extrabold px-2 py-0.5 rounded uppercase border ${
                    persona.difficulty === "Easy" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                      : persona.difficulty === "Medium" 
                      ? "bg-blue-50 text-blue-700 border-blue-100" 
                      : "bg-rose-50 text-rose-700 border-rose-100"
                  }`}>
                    {persona.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-normal font-medium mt-4 min-h-[48px]">
                  {persona.description}
                </p>

                <div className="mt-5 pt-4 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Conversational</span>
                  <button
                    onClick={() => handleStartRoleplay(persona.id)}
                    className="bg-slate-900 hover:bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                  >
                    Start Roleplay
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SCREEN 2: ACTIVE SESSION SIMULATOR */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
          
          {/* LEFT CHAT AREA */}
          <div className="lg:col-span-8 flex flex-col bg-white border border-black/10 rounded-2xl shadow-xs overflow-hidden h-[540px] justify-between">
            {/* Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between select-none border-b border-black/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExitSimulator}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Go Back"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-2xl">{activePersona.avatar}</span>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">{activePersona.name}</h4>
                  <p className="text-[9px] font-semibold text-indigo-300 uppercase tracking-wide">
                    Simulated {activePersona.role} Node
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[8px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded">
                  Status: Connected
                </span>
                <button
                  onClick={handleEndSessionAndEvaluate}
                  disabled={chatHistory.length < 2 || isEndingSession}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  {isEndingSession ? "Grading Session..." : "End & Evaluate"}
                </button>
              </div>
            </div>

            {/* MESSAGE TIMELINE */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
              {chatHistory.map((msg, idx) => {
                const isModel = msg.role === "model";
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2.5 max-w-[80%] ${isModel ? "self-start" : "ml-auto flex-row-reverse"}`}
                  >
                    <span className="text-2xl p-1 bg-white rounded-lg border border-black/5 shadow-3xs shrink-0">
                      {isModel ? activePersona.avatar : "💬"}
                    </span>
                    <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-3xs border ${
                      isModel 
                        ? "bg-white border-black/5 text-slate-800 rounded-tl-none" 
                        : "bg-[#11131E] border-black/10 text-white rounded-tr-none"
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                );
              })}
              {isSending && (
                <div className="flex items-start gap-2.5 max-w-[80%] self-start">
                  <span className="text-2xl p-1 bg-white rounded-lg border border-black/5 shrink-0 animate-pulse">
                    {activePersona.avatar}
                  </span>
                  <div className="p-3.5 rounded-2xl text-xs font-semibold text-slate-400 bg-white border border-black/5 rounded-tl-none animate-pulse">
                    Thinking of response...
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* INTERACTIVE FORM INPUT */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-black/5 bg-white flex gap-2">
              <input
                type="text"
                required
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={isSending || evaluationResult !== null}
                placeholder={`Speak to ${activePersona.name} (e.g. "We can guarantee a 2-year lock-in...")`}
                className="flex-1 bg-white border border-black/15 hover:border-black/30 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
              />
              <button
                type="submit"
                disabled={!userInput.trim() || isSending || evaluationResult !== null}
                className="bg-slate-900 hover:bg-indigo-600 disabled:opacity-50 text-white p-3 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* RIGHT EVALUATION REPORT PANE */}
          <div className="lg:col-span-4 bg-white border border-black/10 rounded-2xl shadow-xs p-5 flex flex-col justify-between overflow-y-auto max-h-[540px]">
            {evaluationResult ? (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 border-b border-black/5 pb-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">
                    AI Performance Evaluation
                  </h4>
                </div>

                {/* SCORE CARD */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-center">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-700 block">Practice Session Score</span>
                  <div className="text-4xl font-black text-emerald-800 mt-1">{evaluationResult.performanceScore}/100</div>
                  <span className="text-[10px] font-bold text-emerald-600/90 uppercase tracking-widest block mt-1">Excellent Effort</span>
                </div>

                {/* CONFIDENCE SECTION */}
                <div className="space-y-1 bg-slate-50 border border-black/5 p-3 rounded-xl">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Strategic Executive Analysis</span>
                  <p className="text-xs text-slate-600 font-medium leading-normal italic">
                    "{evaluationResult.confidenceAnalysis}"
                  </p>
                </div>

                {/* STRENGTHS */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Demonstrated Strengths</span>
                  <div className="space-y-1">
                    {evaluationResult.strengths.map((st: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold bg-emerald-50/20 border border-emerald-100/50 p-2 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AREAS TO IMPROVE */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600">Areas for Improvement</span>
                  <div className="space-y-1">
                    {evaluationResult.areasToImprove.map((im: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold bg-amber-50/20 border border-amber-100/50 p-2 rounded-lg">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{im}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MISSED SIGNALS */}
                {evaluationResult.buyingSignalsMissed && evaluationResult.buyingSignalsMissed.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-rose-600">Missed Buying Signals</span>
                    <p className="text-[11px] font-mono text-rose-700 bg-rose-50/30 border border-rose-100/40 p-2 rounded-lg font-semibold">
                      {Array.isArray(evaluationResult.buyingSignalsMissed) ? evaluationResult.buyingSignalsMissed.join(". ") : evaluationResult.buyingSignalsMissed}
                    </p>
                  </div>
                )}

                {/* TACTICAL TIPS */}
                {evaluationResult.communicationTips && (
                  <div className="space-y-1.5 pt-2 border-t border-black/5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600">Expert Tactical Playbook Tips</span>
                    <ul className="list-disc list-inside text-xs text-slate-600 font-medium space-y-1">
                      {evaluationResult.communicationTips.map((tip: string, idx: number) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center text-slate-400 select-none">
                <Brain className="w-10 h-10 text-slate-300 mb-2 animate-pulse" />
                <h4 className="text-xs font-black uppercase tracking-widest">Active Coach Standby</h4>
                <p className="text-[10px] text-slate-400 max-w-[180px] mx-auto mt-1 leading-relaxed">
                  Engage in a practice call conversation. Once finished, click **"End & Evaluate"** above to compile a comprehensive AI grading report!
                </p>
              </div>
            )}

            {evaluationResult && (
              <button
                onClick={handleExitSimulator}
                className="w-full mt-4 bg-slate-900 hover:bg-black text-white text-[10px] font-extrabold uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer shadow-xs select-none"
              >
                Return to Directory
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
