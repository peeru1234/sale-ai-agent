import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, X, Send, Bot, Zap, AlertTriangle, 
  TrendingUp, CheckCircle, HelpCircle, Activity, Play 
} from "lucide-react";
import { Deal } from "../types";

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface FloatingAssistantProps {
  deals: Deal[];
  currentView: string;
  onSetView: (view: any) => void;
  userEmail: string;
}

export default function FloatingAssistant({ deals, currentView, onSetView, userEmail }: FloatingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "agent",
      text: "System initialized. I am your cognitive Deal Intelligence Agent. Ask me about your gross pipeline ARR, active objections, critical win-probabilities, or request executive recommendations.",
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking]);

  // Extract statistics dynamically
  const totalARR = deals.reduce((sum, d) => sum + d.value, 0);
  const activeDeals = deals.filter(d => d.status !== "Won" && d.status !== "Lost");
  const avgProbability = Math.round(deals.reduce((sum, d) => sum + d.prediction.probability, 0) / (deals.length || 1));
  const activeObjections = deals.reduce((sum, d) => {
    return sum + d.meetings.reduce((mSum, m) => {
      return mSum + m.objections.filter(o => o.status !== "Resolved").length;
    }, 0);
  }, 0);

  const handleCommand = (command: string, label: string) => {
    if (isThinking) return;

    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: label,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    setTimeout(() => {
      let replyText = "";
      if (command === "pipeline_health") {
        replyText = `### Pipeline Health Synthesis\n\n- **Gross Pipeline ARR:** ₹${(totalARR / 100000).toFixed(1)} Lakhs\n- **Active Opportunities:** ${activeDeals.length} deals in progress\n- **Average Win Confidence:** ${avgProbability}%\n- **Active Objections:** ${activeObjections} red flags remaining.\n\n*Critical Path Recommendation:* Focus engineering resources on resolving ABC Manufacturing's ISO 27001 objection to lock in ₹20L in immediate contract revenue.`;
      } else if (command === "blocker_risks") {
        const objectionDeals = deals.filter(d => 
          d.meetings.some(m => m.objections.some(o => o.status !== "Resolved"))
        );
        const blockerDetails = objectionDeals.map(d => {
          const list = d.meetings.flatMap(m => m.objections.filter(o => o.status !== "Resolved").map(o => o.description));
          return `- **${d.company}** (${d.status}): ${list.join(", ")}`;
        }).join("\n");

        replyText = `### Active Risk Profile\n\nI detected **${activeObjections} outstanding objections** across the active pipeline:\n\n${blockerDetails || "No severe security or compliance objections logged in active pipelines."}\n\n*Strategic Suggestion:* Deploy our pre-approved Security Compliance pack to clear enterprise procurement blocks immediately.`;
      } else if (command === "next_best_action") {
        replyText = `### Next Best Actions Queue\n\n1. **ABC Manufacturing:** Dispatch ISO 27001 Package and SOC2 credentials to Arvinder (Tech Lead).\n2. **Digital Twin Simulation:** Run a trial role-play call with 'Dr. Arvinder' in the Sales Coach to rehearse objections.\n3. **Proposal compiler:** Draft an enterprise pricing model for the India Corporate Account.`;
      } else {
        replyText = "I have updated my semantic index with the latest workspace data. Type a custom query or select an action chip to run a strategic simulation!";
      }

      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: "agent",
        text: replyText,
        timestamp: new Date()
      }]);
      setIsThinking(false);
    }, 1200);
  };

  const handleSendCustomMessage = () => {
    if (!inputText.trim() || isThinking) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);

    // Natural NLP response simulation based on keywords
    setTimeout(() => {
      const query = userMsg.text.toLowerCase();
      let reply = "";

      if (query.includes("pipeline") || query.includes("arr") || query.includes("value") || query.includes("lakhs")) {
        reply = `### Real-time Workspace Sync\n\nYour gross pipeline ARR is currently valued at **₹${(totalARR / 100000).toFixed(1)} Lakhs** across **${deals.length} opportunities**.\n\n- Weighted Forecast: ₹${((totalARR * (avgProbability / 100)) / 100000).toFixed(1)} Lakhs\n- Target Close Win rate: **${avgProbability}%**`;
      } else if (query.includes("objection") || query.includes("blocker") || query.includes("risk") || query.includes("compliance")) {
        reply = `### Security & compliance audit\n\nThere are **${activeObjections} active customer objections** flagged. The most critical is from **ABC Manufacturing** regarding ISO 27001 validation.\n\n*Action suggested:* Open the **Contract RAG Room** or initiate a **Digital Twin** consultation to prepare technical counterpoints.`;
      } else if (query.includes("coach") || query.includes("role") || query.includes("practice")) {
        reply = "To practice sales negotiations, I suggest switching to the **AI Sales Coach** node from the left sidebar to start an interactive role-play simulator with real-time feedback.";
        onSetView("sales-practice");
      } else if (query.includes("twin") || query.includes("mindset")) {
        reply = "I recommend booting the **Digital Twin** node to ask targeted questions directly to customer decision-makers' cognitive profiles.";
        onSetView("digital-twin");
      } else {
        reply = `### Cognitive OS Assistant\n\nI parsed your request: *"${userMsg.text}"*.\n\nBased on the active account metrics, here is your daily status digest:\n- **Gross Value:** ₹${(totalARR / 100000).toFixed(1)} Lakhs\n- **SSO Status:** Okta OIDC fully configured for top accounts\n- **Active Blockers:** ${activeObjections} issues\n\nLet me know if you would like to run a specific simulation!`;
      }

      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: "agent",
        text: reply,
        timestamp: new Date()
      }]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating launcher trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 border border-indigo-400/30 group relative"
          id="global-ai-assistant-trigger"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Bot className="w-6 h-6 text-white group-hover:animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Slide-out floating glass chat console */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-[#05070e]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
            id="global-ai-assistant-panel"
          >
            {/* Console Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-950/40 via-[#070a13] to-indigo-950/40 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200 block uppercase tracking-wide">
                    DEAL COGNITIVE CORE
                  </span>
                  <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500 block">
                    Workspace Intelligence Node
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-mono uppercase tracking-widest">
                  Live Sync
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-indigo-600/20 text-indigo-100 border border-indigo-500/30 rounded-br-none"
                      : "bg-white/[0.03] border border-white/5 text-slate-200 rounded-bl-none"
                  }`}>
                    {/* Render markdown style items */}
                    {msg.text.split("\n\n").map((para, i) => {
                      if (para.startsWith("###")) {
                        return <h4 key={i} className="font-bold text-slate-100 uppercase tracking-wide text-[10.5px] border-b border-white/5 pb-1 mb-1">{para.replace("###", "")}</h4>;
                      }
                      if (para.startsWith("-") || para.startsWith("*")) {
                        return (
                          <ul key={i} className="space-y-1 list-disc pl-4 my-1">
                            {para.split("\n").map((li, liIdx) => (
                              <li key={liIdx}>{li.replace(/^[-\*\s]+/, "")}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={i} className="mb-1.5 last:mb-0">{para}</p>;
                    })}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl rounded-bl-none p-3.5 flex items-center gap-2 text-xs text-slate-400">
                    <Activity className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    <span>Synthesizing pipeline memory...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Command chips */}
            <div className="px-3 py-2 bg-[#020409] border-t border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
              <button
                onClick={() => handleCommand("pipeline_health", "🔍 Pipeline Diagnostic")}
                className="px-2.5 py-1 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1 shrink-0"
              >
                <TrendingUp className="w-2.5 h-2.5" /> Pipeline Diagnostic
              </button>
              <button
                onClick={() => handleCommand("blocker_risks", "⚠️ Risk & Objections")}
                className="px-2.5 py-1 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1 shrink-0"
              >
                <AlertTriangle className="w-2.5 h-2.5" /> Risk &amp; Objections
              </button>
              <button
                onClick={() => handleCommand("next_best_action", "⚡ Next Best Actions")}
                className="px-2.5 py-1 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1 shrink-0"
              >
                <Zap className="w-2.5 h-2.5" /> Next Best Actions
              </button>
            </div>

            {/* Footer Input Console */}
            <div className="p-3 bg-black border-t border-white/5 flex gap-2 items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendCustomMessage()}
                placeholder="Ask Deal Core Agent..."
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
                disabled={isThinking}
              />
              <button
                onClick={handleSendCustomMessage}
                disabled={isThinking || !inputText.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
