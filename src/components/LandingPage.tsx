import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Shield, Cpu, Activity, ArrowRight, CheckCircle2, 
  UserCheck, Play, Briefcase, ChevronDown, Star, MessageSquare, 
  DollarSign, Globe, Layers, ArrowUpRight, Check, HelpCircle, TrendingUp,
  Sun, Moon
} from "lucide-react";

interface LandingPageProps {
  onLoginSuccess: (userEmail: string) => void;
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"product" | "sandbox">("sandbox");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const handleDemoLogin = (demoEmail: string) => {
    setIsLoggingIn(true);
    setTimeout(() => {
      onLoginSuccess(demoEmail);
      setIsLoggingIn(false);
    }, 800);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoggingIn(true);
    setTimeout(() => {
      onLoginSuccess(email);
      setIsLoggingIn(false);
    }, 1000);
  };

  const FAQS = [
    {
      question: "How does the Multi-Agent framework orchestrate deal audits?",
      answer: "The platform deploys 7 specialized cooperative agents simultaneously. The Research Agent crawls competitor intelligence, the Meeting Agent parses transcripts for sentiment cues, the Risk Agent flags compliance issues, and the Forecast Agent runs predictive close modeling. They communicate via a secure shared state buffer to prevent conflicting recommendations."
    },
    {
      question: "Is my customer transcripts data secure?",
      answer: "Yes, fully. All conversational records, sales pitches, and custom contract PDFs are indexed locally using semantic embedding structures in our secure memory buffer. Our system complies with SOC 2 Type II guidelines and enforces data isolation per corporate account tenant."
    },
    {
      question: "Can I connect my real production CRM (Salesforce, HubSpot)?",
      answer: "Absolutely. The Auto-Sync agent supports bi-directional mapping with Salesforce, HubSpot, and MS Dynamics. You can review and edit mapped insights locally before pushing them live, keeping your CRM records pristine with zero manual typing."
    }
  ];

  const STATISTICS = [
    { label: "ARR Increase", value: "+38%", desc: "Average contract value expansion" },
    { label: "Cycle Acceleration", value: "4.2x", desc: "Faster lead-to-close timelines" },
    { label: "CRM Sync Accuracy", value: "99.8%", desc: "Reduction in field input errors" },
    { label: "Win Probability Gain", value: "+14%", desc: "Driven by smart objection advice" }
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 selection:bg-indigo-500 selection:text-white overflow-x-hidden relative ${
      isDarkMode ? "bg-[#06070a] text-[#f8fafc]" : "bg-[#f8fafc] text-[#0f172a]"
    }`}>
      {/* Interactive Floating Particles Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-[1px] ${
              isDarkMode ? "bg-indigo-400/15" : "bg-indigo-500/10"
            }`}
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.15, 0.5, 0.15],
            }}
            transition={{
              duration: Math.random() * 12 + 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Dynamic Background Mesh Grid */}
      <div className={`absolute inset-0 pointer-events-none opacity-45 z-0 ${
        isDarkMode 
          ? "bg-[linear-gradient(to_right,#11131e_1px,transparent_1px),linear-gradient(to_bottom,#11131e_1px,transparent_1px)]" 
          : "bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)]"
      } bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]`} />
      
      {/* Floating Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none animate-pulse duration-[8000ms] ${
          isDarkMode ? "bg-indigo-500/10" : "bg-indigo-500/5"
        }`} />
        <div className={`absolute top-[60vh] right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none animate-pulse duration-[6000ms] ${
          isDarkMode ? "bg-emerald-500/5" : "bg-emerald-500/3"
        }`} />
      </div>

      {/* Global Hackathon Glow Ribbon */}
      <div className={`border-b py-2.5 px-6 text-center text-[10px] md:text-xs font-mono tracking-widest uppercase z-50 flex items-center justify-center gap-2 transition-colors ${
        isDarkMode 
          ? "bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-emerald-500/10 border-indigo-500/10 text-indigo-200" 
          : "bg-slate-100 border-slate-200 text-indigo-700 font-semibold"
      }`}>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <span>Enterprise AI Sales Platform // Hackathon Presentation Workspace v2.0</span>
      </div>

      {/* Modern Navigation Header */}
      <header className={`px-6 md:px-12 py-5 flex items-center justify-between border-b backdrop-blur-md sticky top-0 z-40 transition-colors ${
        isDarkMode ? "border-white/5 bg-[#06070a]/80" : "border-slate-200 bg-[#f8fafc]/80"
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-500 p-[1.5px] flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${
              isDarkMode ? "bg-[#0c0d15]" : "bg-white"
            }`}>
              <Cpu className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          <div>
            <h1 className={`text-sm md:text-base font-black tracking-tight uppercase ${
              isDarkMode ? "bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent" : "text-slate-900"
            }`}>
              Deal Intelligence Platform
            </h1>
            <p className="text-[9px] font-mono tracking-widest text-indigo-500 uppercase font-bold">
              Multi-Agent Executive SaaS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <a href="#features" className={`text-xs font-bold uppercase tracking-wider transition-colors hidden md:block ${
            isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-black"
          }`}>Features</a>
          <a href="#pricing" className={`text-xs font-bold uppercase tracking-wider transition-colors hidden md:block ${
            isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-black"
          }`}>Pricing</a>
          <a href="#faq" className={`text-xs font-bold uppercase tracking-wider transition-colors hidden md:block ${
            isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-black"
          }`}>FAQ</a>
          
          {/* Light/Dark Mode Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isDarkMode 
                ? "bg-slate-900 border-white/10 text-amber-400 hover:bg-slate-800" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button 
            onClick={() => handleDemoLogin("guest@ai-studio-build.com")}
            className="relative inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer shadow-md shadow-indigo-600/10"
          >
            Quick Guest Login
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-24 py-16 lg:py-24 gap-12 max-w-7xl mx-auto w-full">
        {/* Left Hero: Headline and Subtext */}
        <div className="flex-1 space-y-8 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-xs text-indigo-500 font-bold font-mono tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            Cooperative Sales Multi-Agent Suite v2.0
          </div>

          <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}>
            Transform client calls into <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 bg-clip-text text-transparent">closed ARR pipeline.</span>
          </h1>

          <p className={`text-sm sm:text-base md:text-lg leading-relaxed font-medium ${
            isDarkMode ? "text-slate-400" : "text-slate-600"
          }`}>
            Orchestrate multiple specialized, cooperative AI agents acting as competitive researchers, transcript analysts, compliance auditors, and proposal writers. Synthesize raw recordings into secure contracts and mapped CRM updates in seconds.
          </p>

          {/* ANIMATED AI BRAIN VISUALIZATION NETWORK */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 ${
            isDarkMode ? "bg-slate-950/40 border-white/5" : "bg-white border-slate-200 shadow-lg shadow-indigo-100"
          }`}>
            <div className="space-y-2 max-w-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-500">Cognitive Neural Synapses</h4>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"} font-medium leading-relaxed`}>
                Watch cooperative AI agents analyze the deal simultaneously in a decentralized state buffer.
              </p>
              <div className="flex items-center gap-2 pt-2 text-[10px] font-mono uppercase tracking-wider text-emerald-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Hub Connectivity: Online
              </div>
            </div>

            {/* Pulsing Interactive SVG Brain Grid */}
            <div className="w-48 h-32 relative flex items-center justify-center bg-slate-950/80 rounded-xl border border-white/10 shrink-0">
              <svg className="w-full h-full p-2" viewBox="0 0 200 120">
                {/* Connections (Synapses) */}
                <motion.line x1="40" y1="60" x2="100" y2="30" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="1" animate={{ strokeDashoffset: [0, -10] }} strokeDasharray="5,2" transition={{ repeat: Infinity, duration: 4, ease: "linear" }} />
                <motion.line x1="40" y1="60" x2="100" y2="90" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="1" animate={{ strokeDashoffset: [0, 10] }} strokeDasharray="5,2" transition={{ repeat: Infinity, duration: 4, ease: "linear" }} />
                <motion.line x1="100" y1="30" x2="160" y2="60" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1" />
                <motion.line x1="100" y1="90" x2="160" y2="60" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" />
                <motion.line x1="100" y1="30" x2="100" y2="90" stroke="rgba(236, 72, 153, 0.3)" strokeWidth="1" strokeDasharray="3,3" />

                {/* Nodes (Agents) */}
                {/* Research Agent */}
                <circle cx="40" cy="60" r="8" fill="#6366f1" className="animate-pulse" />
                <text x="40" y="75" fill="#f8fafc" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">RESEARCH</text>
                
                {/* Negotiation Coach */}
                <circle cx="100" cy="30" r="10" fill="#a855f7" />
                <text x="100" y="18" fill="#f8fafc" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">COACH</text>
                
                {/* Risk Guard */}
                <circle cx="100" cy="90" r="10" fill="#f43f5e" />
                <text x="100" y="108" fill="#f8fafc" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">RISK</text>
                
                {/* Executive Intelligence */}
                <circle cx="160" cy="60" r="12" fill="#10b981" />
                <text x="160" y="80" fill="#f8fafc" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">EXEC IQ</text>

                {/* Pulsing Core */}
                <circle cx="100" cy="60" r="4" fill="#14b8a6">
                  <animate attributeName="r" values="3;7;3" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a 
              href="#sandbox-card" 
              className="px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Access Demo Sandbox
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#features" 
              className={`px-6 py-4 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:scale-[1.02] transition-all cursor-pointer ${
                isDarkMode 
                  ? "bg-slate-900 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300" 
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs"
              }`}
            >
              Explore Capabilities
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t ${
            isDarkMode ? "border-slate-900" : "border-slate-200"
          }`}>
            {STATISTICS.map((st, i) => (
              <div key={i} className="space-y-1">
                <span className={`text-2xl sm:text-3xl font-black bg-gradient-to-r bg-clip-text text-transparent ${
                  isDarkMode ? "from-white to-slate-400" : "from-slate-900 to-slate-600"
                }`}>
                  {st.value}
                </span>
                <h4 className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{st.label}</h4>
                <p className={`text-[10px] font-medium leading-snug ${
                  isDarkMode ? "text-slate-500" : "text-slate-500"
                }`}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Hero: Glass Login & Sandbox Portal */}
        <div className="w-full lg:w-[460px] shrink-0" id="sandbox-card">
          <div className={`border rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 ${
            isDarkMode 
              ? "bg-gradient-to-b from-[#0d0f19] to-[#08090f] border-slate-800/80" 
              : "bg-white border-slate-200/90 shadow-xl shadow-indigo-100"
          }`}>
            <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Tab Selection */}
            <div className={`flex p-1.5 rounded-xl border mb-6 ${
              isDarkMode ? "bg-slate-950/80 border-slate-900" : "bg-slate-100 border-slate-200"
            }`}>
              <button 
                onClick={() => setActiveTab("sandbox")}
                className={`flex-1 text-[10px] font-black tracking-widest uppercase py-2.5 rounded-lg transition-all cursor-pointer text-center ${
                  activeTab === "sandbox" 
                    ? "bg-indigo-600 text-white shadow" 
                    : isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-black"
                }`}
              >
                ✦ HACKATHON SANDBOXES
              </button>
              <button 
                onClick={() => setActiveTab("product")}
                className={`flex-1 text-[10px] font-black tracking-widest uppercase py-2.5 rounded-lg transition-all cursor-pointer text-center ${
                  activeTab === "product" 
                    ? "bg-indigo-600 text-white shadow" 
                    : isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-black"
                }`}
              >
                ENTERPRISE SIGN IN
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "product" ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleCustomSubmit} 
                  className="space-y-4"
                >
                  <div>
                    <label className={`block text-[10px] font-bold tracking-widest uppercase mb-1.5 ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}>
                      Enterprise Email Address
                    </label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className={`w-full px-4 py-3 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs transition-all placeholder:text-slate-500 font-medium ${
                        isDarkMode ? "bg-slate-950/80 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold tracking-widest uppercase mb-1.5 ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}>
                      Security Password
                    </label>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs transition-all placeholder:text-slate-500 ${
                        isDarkMode ? "bg-slate-950/80 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:bg-indigo-700/50 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 transition-all cursor-pointer"
                  >
                    {isLoggingIn ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Secure Sign In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-[9px] text-slate-500 font-mono tracking-wider">
                      Protected by Sandboxed Multi-Tenant JWT Tokens
                    </span>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="sandbox"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <p className={`text-[11px] leading-relaxed font-mono ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}>
                    // Pre-loaded strategic profiles to showcase full Multi-Agent pipeline orchestration instantly.
                  </p>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => handleDemoLogin("corporate-sales@abc-mfg.com")}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                        isDarkMode 
                          ? "bg-slate-950/50 border-slate-800 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02]" 
                          : "bg-slate-50 border-slate-200 hover:border-indigo-500/30 hover:bg-indigo-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-100" : "text-slate-850"}`}>ABC Industrial ERP</h4>
                          <p className="text-[10px] text-emerald-500 font-mono font-bold">INR 2,000,000 (Close Phase)</p>
                        </div>
                      </div>
                      <Play className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0" />
                    </button>

                    <button
                      onClick={() => handleDemoLogin("enterprise-ae@mumbai-tech.com")}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                        isDarkMode 
                          ? "bg-slate-950/50 border-slate-800 hover:border-purple-500/30 hover:bg-purple-500/[0.02]" 
                          : "bg-slate-50 border-slate-200 hover:border-purple-500/30 hover:bg-purple-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 shrink-0">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-100" : "text-slate-850"}`}>Apex Global Logistics</h4>
                          <p className="text-[10px] text-emerald-500 font-mono font-bold">INR 4,500,000 (Discovery Phase)</p>
                        </div>
                      </div>
                      <Play className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0" />
                    </button>

                    <button
                      onClick={() => handleDemoLogin("guest@ai-studio-build.com")}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                        isDarkMode 
                          ? "bg-gradient-to-r from-emerald-500/[0.03] to-indigo-500/[0.03] border-slate-800/80 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]" 
                          : "bg-white border-slate-200 hover:border-emerald-500/30 hover:bg-emerald-50 shadow-xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                          <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-100" : "text-slate-850"}`}>Standard Sandbox Guest</h4>
                          <p className="text-[10px] text-indigo-500 font-mono font-bold">Simulate multi-user nodes</p>
                        </div>
                      </div>
                      <Play className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CLIENT LOGOS SECTION */}
      <section className={`border-y py-10 relative z-10 transition-colors ${
        isDarkMode ? "border-slate-900 bg-[#06070a]/50" : "border-slate-200 bg-slate-50"
      }`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-6 font-bold">
            TRUSTED BY STRATEGIC TEAMS AT WORLD-CLASS ENTERPRISES
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-35 grayscale hover:opacity-55 transition-opacity">
            <span className={`text-sm font-black tracking-widest ${isDarkMode ? "text-white" : "text-slate-800"}`}>S A L E S F O R C E</span>
            <span className={`text-sm font-black tracking-widest ${isDarkMode ? "text-white" : "text-slate-800"}`}>S T R I P E</span>
            <span className={`text-sm font-black tracking-widest ${isDarkMode ? "text-white" : "text-slate-800"}`}>A W S</span>
            <span className={`text-sm font-black tracking-widest ${isDarkMode ? "text-white" : "text-slate-800"}`}>S N O W F L A K E</span>
            <span className={`text-sm font-black tracking-widest ${isDarkMode ? "text-white" : "text-slate-800"}`}>H U B S P O T</span>
          </div>
        </div>
      </section>

      {/* AGENTS BENTO GRID SECTION */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center space-y-3 mb-16">
          <span className="text-[10px] font-mono tracking-widest text-indigo-500 uppercase bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/10 font-bold">
            COMPREHENSIVE COOPERATIVE WORKFLOW
          </span>
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Meet Your Specialized Sales AI Co-Pilots
          </h2>
          <p className={`text-xs sm:text-sm max-w-2xl mx-auto font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Multiple specialized agents collaborate simultaneously in a secure memory structure to analyze meetings, coach teams, forecast revenues, and eliminate deal blockers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Deal Research */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDarkMode 
              ? "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-[#0c0e18]" 
              : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5"
          }`}>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 border border-blue-500/10 shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>Deal Research Agent</h3>
            <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Crawls recent corporate funding announcements, competitive battlecards, and executive directories to identify customer pain points and opportunities.
            </p>
          </div>

          {/* Negotiation Coach */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDarkMode 
              ? "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-[#0c0e18]" 
              : "bg-white border-slate-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/5"
          }`}>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 border border-purple-500/10 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>AI Negotiation Coach</h3>
            <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Analyzes client conversations to detect objections, formulate counter-strategies, identify buying signals, and estimate closing probability.
            </p>
          </div>

          {/* Executive Agent */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDarkMode 
              ? "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-[#0c0e18]" 
              : "bg-white border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5"
          }`}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 border border-emerald-500/10 shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>Executive Intelligence Agent</h3>
            <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Drives secure revenue forecasting, aggregates pipeline health metrics, charts active conversions, and delivers stakeholder briefing notes.
            </p>
          </div>

          {/* Proposal Agent */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDarkMode 
              ? "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-[#0c0e18]" 
              : "bg-white border-slate-200 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/5"
          }`}>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-4 border border-cyan-500/10 shadow-xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>Proposal Draftsman</h3>
            <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Drafts SaaS multi-year discounts, compiles standard pricing sheets, and structures commercial proposals matching discussed criteria.
            </p>
          </div>

          {/* Risk Guard */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDarkMode 
              ? "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-[#0c0e18]" 
              : "bg-white border-slate-200 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-500/5"
          }`}>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4 border border-rose-500/10 shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>Compliance Risk Guard</h3>
            <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Audits agreements for timeline risks, flags stalled sales, traces missing stakeholders, and triggers instant mitigation safeguards.
            </p>
          </div>

          {/* Email Automation */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDarkMode 
              ? "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-[#0c0e18]" 
              : "bg-white border-slate-200 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5"
          }`}>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 border border-amber-500/10 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>Email Automation Agent</h3>
            <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Generates beautifully formatted follow-up outreach emails, thank-you letters, and meeting action items with single-click copying.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="pricing" className={`py-20 border-t transition-colors ${
        isDarkMode ? "border-slate-900 bg-slate-950/20" : "border-slate-200 bg-slate-50"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-mono tracking-widest text-indigo-500 uppercase font-bold">
              STRATEGIC SAAS COMMITMENT
            </span>
            <h2 className={`text-3xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>Transparent Enterprise Licensing</h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto font-medium ${isDarkMode ? "text-slate-400" : "text-slate-650"}`}>
              Select the license grade built to scale your strategic accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Tier 1 */}
            <div className={`border p-8 rounded-2xl flex flex-col justify-between transition-all ${
              isDarkMode ? "bg-[#0c0d15] border-slate-900" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="space-y-4">
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-slate-500">Developer Tier</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>INR 0</span>
                  <span className="text-slate-500 text-xs">/mo</span>
                </div>
                <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Perfect for local offline model analysis and evaluating custom JSON multi-agent systems.
                </p>
                <div className={`h-[1px] ${isDarkMode ? "bg-slate-900" : "bg-slate-100"}`} />
                <ul className="space-y-2.5 text-xs font-medium text-slate-500">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Standard 3 Copilot Agents</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Local RAG Data Room</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> 10 Uploaded Transcripts</li>
                </ul>
              </div>
              <button 
                onClick={() => handleDemoLogin("guest@ai-studio-build.com")}
                className="mt-8 w-full py-2.5 text-xs uppercase tracking-widest font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all cursor-pointer"
              >
                Launch Sandbox
              </button>
            </div>

            {/* Tier 2 - Enterprise Pro */}
            <div className={`border-2 p-8 rounded-2xl flex flex-col justify-between relative shadow-xl transition-all ${
              isDarkMode 
                ? "bg-[#0f111c] border-indigo-500/40 shadow-indigo-500/5" 
                : "bg-white border-indigo-600 shadow-indigo-100 shadow-lg"
            }`}>
              <div className="absolute top-4 right-4 px-2.5 py-0.5 bg-indigo-500/20 text-indigo-500 border border-indigo-500/30 text-[8px] font-mono uppercase tracking-widest rounded-full font-bold">
                Popular Choice
              </div>
              <div className="space-y-4">
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-indigo-500">Enterprise Scale</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>INR 8,200</span>
                  <span className="text-slate-500 text-xs">/user/mo</span>
                </div>
                <p className={`text-xs leading-relaxed font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                  Our flagship multi-user orchestration framework designed for mature mid-market and enterprise sales nodes.
                </p>
                <div className={`h-[1px] ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`} />
                <ul className={`space-y-2.5 text-xs font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-650"}`}>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> All 7 Specialized Co-Pilots</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Bidirectional CRM Auto-Sync</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Infinite PDF &amp; Document Indexing</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Platinum 1-Hour SLA Support</li>
                </ul>
              </div>
              <button 
                onClick={() => handleDemoLogin("corporate-sales@abc-mfg.com")}
                className="mt-8 w-full py-3 text-xs uppercase tracking-widest font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.01] rounded-lg transition-all shadow-md cursor-pointer"
              >
                Access ABC Enterprise Demo
              </button>
            </div>

            {/* Tier 3 */}
            <div className={`border p-8 rounded-2xl flex flex-col justify-between transition-all ${
              isDarkMode ? "bg-[#0c0d15] border-slate-900" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="space-y-4">
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-slate-500">Global Scale</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>INR 21,500</span>
                  <span className="text-slate-500 text-xs">/user/mo</span>
                </div>
                <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  For corporate sales teams requiring sovereign local servers, custom training models, and dedicated compliance nodes.
                </p>
                <div className={`h-[1px] ${isDarkMode ? "bg-slate-900" : "bg-slate-100"}`} />
                <ul className="space-y-2.5 text-xs font-medium text-slate-500">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Infinite Multi-Agent Pipelines</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Dedicated Tenant Databases</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Sovereign Mumbai Regional Nodes</li>
                </ul>
              </div>
              <button 
                onClick={() => handleDemoLogin("enterprise-ae@mumbai-tech.com")}
                className="mt-8 w-full py-2.5 text-xs uppercase tracking-widest font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all cursor-pointer"
              >
                Access Apex Tech Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center space-y-3 mb-16">
          <span className="text-[10px] font-mono tracking-widest text-indigo-500 uppercase font-bold">
            CLEARING UNCERTAINTIES
          </span>
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                isDarkMode ? "bg-[#0c0d15] border-slate-900" : "bg-white border-slate-200 shadow-xs"
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className={`w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  isDarkMode ? "text-slate-100 hover:bg-slate-900/40" : "text-slate-800 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                  {faq.question}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openFaq === index ? "rotate-180 text-white" : ""}`} />
              </button>
              
              <AnimatePresence initial={false}>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`p-5 pt-0 text-xs leading-relaxed border-t font-medium ${
                      isDarkMode ? "text-slate-400 border-slate-900/40" : "text-slate-600 border-slate-100"
                    }`}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-12 px-6 md:px-12 border-t text-center relative z-10 transition-colors ${
        isDarkMode ? "border-slate-900 bg-black/60" : "border-slate-200 bg-slate-100"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">
              ✦ MULTI-AGENT DEAL INTELLIGENCE PLATFORM ✦
            </span>
          </div>
          <p className="text-[10px] tracking-widest text-slate-500 uppercase font-bold">
            © 2026 DEAL-INTELLIGENCE SAAS • GOOGLE CLOUD HACKATHON NODE
          </p>
        </div>
      </footer>
    </div>
  );
}
