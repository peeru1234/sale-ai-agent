import React, { useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, 
  Legend, LineChart, Line 
} from "recharts";
import { 
  TrendingUp, Award, DollarSign, Calendar, Sparkles, AlertTriangle, 
  ShieldCheck, HelpCircle, Activity, Sun, Moon, ArrowUpRight, 
  Clock, Briefcase, Zap, UserCheck, Layers, ChevronRight, CheckSquare, 
  Square, Search, Bell, Filter, User, Compass, ArrowRight, ShieldAlert
} from "lucide-react";
import { motion } from "motion/react";
import { Deal } from "../types";

const ARR_FORECAST_DATA = {
  expected: [
    { quarter: "Q3 2026", Forecast: 150, Actual: 120, Optimistic: 160, Pessimistic: 110 },
    { quarter: "Q4 2026", Forecast: 220, Actual: 185, Optimistic: 250, Pessimistic: 160 },
    { quarter: "Q1 2027", Forecast: 280, Actual: 210, Optimistic: 320, Pessimistic: 190 },
    { quarter: "Q2 2027", Forecast: 350, Actual: 290, Optimistic: 410, Pessimistic: 240 }
  ],
  optimistic: [
    { quarter: "Q3 2026", Forecast: 160, Actual: 120 },
    { quarter: "Q4 2026", Forecast: 250, Actual: 185 },
    { quarter: "Q1 2027", Forecast: 320, Actual: 210 },
    { quarter: "Q2 2027", Forecast: 410, Actual: 290 }
  ],
  pessimistic: [
    { quarter: "Q3 2026", Forecast: 110, Actual: 120 },
    { quarter: "Q4 2026", Forecast: 160, Actual: 185 },
    { quarter: "Q1 2027", Forecast: 190, Actual: 160 },
    { quarter: "Q2 2027", Forecast: 240, Actual: 195 }
  ]
};

const STAGE_FUNNEL_DATA = [
  { stage: "Lead Qualification", value: 12, percentage: "100%", color: "bg-indigo-600" },
  { stage: "Discovery & Analysis", value: 8, percentage: "66%", color: "bg-violet-500" },
  { stage: "Objection Resolution", value: 5, percentage: "41%", color: "bg-purple-500" },
  { stage: "Commercial Negotiation", value: 3, percentage: "25%", color: "bg-emerald-500" }
];

const COLORS = ["#6366F1", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

interface ExecutiveDashboardProps {
  deals: Deal[];
  onSelectDeal?: (deal: Deal) => void;
  onSetMainView?: (view: any) => void;
  isDarkMode?: boolean;
}

export default function ExecutiveDashboard({ 
  deals, 
  onSelectDeal, 
  onSetMainView,
  isDarkMode = true 
}: ExecutiveDashboardProps) {
  const [forecastScenario, setForecastScenario] = useState<"expected" | "optimistic" | "pessimistic">("expected");
  const [completedRecommendations, setCompletedRecommendations] = useState<string[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState("Corporate Accounts - India");

  // Calculations
  const totalARR = deals.reduce((sum, d) => sum + d.value, 0);
  const activeDealsCount = deals.filter(d => d.status !== "Won" && d.status !== "Lost").length;
  const wonDealsCount = deals.filter(d => d.status === "Won").length;
  const avgProbability = Math.round(deals.reduce((sum, d) => sum + d.prediction.probability, 0) / (deals.length || 1));
  const totalWeightedPipeline = deals.reduce((sum, d) => sum + (d.value * (d.prediction.probability / 100)), 0);

  // Deal distributions data
  const statusCounts = deals.reduce((acc: any, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {});

  const distributionData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  const activeObjectionsCount = deals.reduce((sum, d) => {
    return sum + d.meetings.reduce((mSum, m) => {
      return mSum + m.objections.filter(o => o.status !== "Resolved").length;
    }, 0);
  }, 0);

  // Dynamic recommendations feed
  const AI_RECOMMENDATIONS = [
    {
      id: "rec-1",
      title: "Deliver ISO 27001 Package to ABC Manufacturing",
      desc: "Dr. Arvinder flagged compliance standard as critical blocker. Resolving this will boost win probability to 94% (+12% gain).",
      type: "risk",
      impact: "High Impact",
      dealId: "abc-mfg-101",
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />
    },
    {
      id: "rec-2",
      title: "Finalize Bundled SAP ERP Promo Concession",
      desc: "Offset TechVibe Ltd.'s 20% discount pressure by showcasing our zero-middleware bidirectional SAP scheduling sync.",
      type: "negotiation",
      impact: "Medium Impact",
      dealId: "abc-mfg-101",
      icon: <Zap className="w-4 h-4 text-amber-500" />
    },
    {
      id: "rec-3",
      title: "Book Technical Demo for Healthcare Alliance Team",
      desc: "Chief Medical Officer has remained inactive for 14 days. Re-establish contact immediately with automated followup.",
      type: "relationship",
      impact: "High Impact",
      dealId: "health-alliance-302",
      icon: <Activity className="w-4 h-4 text-indigo-500" />
    }
  ];

  const toggleRecommendation = (id: string) => {
    setCompletedRecommendations(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className={`space-y-6 transition-all duration-300 p-0 ${isDarkMode ? "text-slate-100" : "text-slate-850"}`} id="executive-dashboard-view">
      
      {/* 1. FUTURISTIC BENTO HERO SECTION & AI COMMAND CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: AI Cognitive Stream Greeting & Next Steps */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`lg:col-span-8 relative rounded-3xl p-6 shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col justify-between min-h-[300px] border ${
            isDarkMode 
              ? "bg-gradient-to-r from-slate-950 via-[#070b18]/90 to-slate-950 text-white border-indigo-500/15" 
              : "bg-gradient-to-r from-white via-indigo-50/20 to-white text-slate-900 border-slate-200/80 shadow-md"
          }`}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none ${isDarkMode ? "opacity-25" : "opacity-10"}`} />

          <div>
            <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <span className={`px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.15)] border ${
                  isDarkMode 
                    ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/25" 
                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
                }`}>
                  <Sparkles className="w-3 h-3 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
                  COGNITIVE OPERATIVE AGENT LAYER ACTIVE
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              {/* Workspace selector in-card */}
              <div className={`flex items-center gap-2 border px-3 py-1 rounded-xl ${isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <Layers className={`w-3.5 h-3.5 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                <select 
                  value={activeWorkspace} 
                  onChange={(e) => setActiveWorkspace(e.target.value)}
                  className={`bg-transparent text-[10px] font-bold uppercase tracking-wide focus:outline-none cursor-pointer ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                >
                  <option value="Corporate Accounts - India" className={isDarkMode ? "bg-[#0f111a] text-slate-200" : "bg-white text-slate-750"}>India Enterprise</option>
                  <option value="APAC Logistics Corridor" className={isDarkMode ? "bg-[#0f111a] text-slate-200" : "bg-white text-slate-750"}>APAC Logistics</option>
                  <option value="EU Scaling Nodes" className={isDarkMode ? "bg-[#0f111a] text-slate-200" : "bg-white text-slate-750"}>EU Pipeline</option>
                </select>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <h2 className={`text-xl md:text-3xl font-black uppercase tracking-tight font-display bg-clip-text text-transparent ${
                isDarkMode 
                  ? "bg-gradient-to-r from-white via-indigo-100 to-slate-300" 
                  : "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-850"
              }`}>
                Welcome Back, Command Strategist
              </h2>
              <p className={`text-xs max-w-3xl font-medium leading-relaxed font-sans ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Our cooperative multi-agent neural network has synthesized CRM status: <strong className="text-rose-500">3 critical red flags</strong> require AE intervention. Dispatch certificates to <span className={`font-bold underline decoration-indigo-500/40 ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>ABC Industrial ERP</span> to preserve win momentum.
              </p>
            </div>
          </div>

          {/* Inline Live Action Recommendations Panel */}
          <div className={`mt-6 pt-5 border-t ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
            <div className={`flex items-center gap-1.5 mb-3 text-[10px] font-mono font-bold tracking-widest uppercase ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
              <Activity className="w-3.5 h-3.5" />
              Dynamic Priority Action Items
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {AI_RECOMMENDATIONS.map((rec) => {
                const isCompleted = completedRecommendations.includes(rec.id);
                return (
                  <div 
                    key={rec.id}
                    onClick={() => toggleRecommendation(rec.id)}
                    className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-start gap-2.5 ${
                      isCompleted 
                        ? (isDarkMode ? "bg-emerald-950/20 border-emerald-500/20 opacity-55" : "bg-emerald-50 border-emerald-200 opacity-60") 
                        : (isDarkMode ? "bg-white/[0.02] border-white/5 hover:border-indigo-500/20 hover:bg-white/[0.04]" : "bg-slate-50 border-slate-200/60 hover:border-indigo-500/20 hover:bg-white")
                    }`}
                  >
                    <div className={`p-1 rounded-lg shrink-0 ${isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-500'}`}>
                      {isCompleted ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> : rec.icon}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className={`text-[10px] font-bold uppercase truncate tracking-wide ${isCompleted ? 'line-through text-slate-400' : (isDarkMode ? 'text-slate-200' : 'text-slate-800')}`}>
                        {rec.title}
                      </h4>
                      <p className={`text-[9px] line-clamp-2 leading-tight ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {rec.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Card: AI Pipeline Health & Dial */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`lg:col-span-4 relative rounded-3xl p-6 shadow-2xl flex flex-col justify-between min-h-[300px] glass-card-premium ${
            isDarkMode 
              ? "dark-glass text-white border-indigo-500/15" 
              : "light-glass text-slate-850 border-slate-200/80 shadow-md"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05),transparent_60%)] pointer-events-none" />
          
          <div className={`flex items-center justify-between pb-3 border-b relative z-10 ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
            <span className={`text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
              <Zap className="w-3.5 h-3.5" />
              Intelligence Dial
            </span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className={`text-[8px] font-mono uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Live Prediction Node</span>
            </div>
          </div>

          <div className="flex items-center justify-center py-4 relative z-10">
            <div className="relative flex items-center justify-center">
              {/* Radial gradient background ring */}
              <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
                <div className="text-center">
                  <span className={`text-[10px] font-mono uppercase tracking-widest block ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Health Index</span>
                  <span className={`text-4xl font-black text-transparent bg-clip-text font-display ${
                    isDarkMode 
                      ? "bg-gradient-to-r from-emerald-400 via-indigo-300 to-indigo-400" 
                      : "bg-gradient-to-r from-emerald-600 via-indigo-600 to-indigo-700"
                  }`}>
                    {avgProbability}%
                  </span>
                  <span className="text-[8px] font-bold text-emerald-500 uppercase block tracking-wider mt-0.5">Optimal Range</span>
                </div>
              </div>
              {/* Outer dynamic glowing particle ring */}
              <div className={`absolute inset-[-10px] rounded-full border border-dashed animate-spin ${isDarkMode ? "border-indigo-500/20" : "border-indigo-500/30"}`} style={{ animationDuration: '40s' }} />
            </div>
          </div>

          {/* Quick Scenario Toggles */}
          <div className={`space-y-3 relative z-10 pt-4 border-t ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
            <div className="flex items-center justify-between">
              <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Forecast Model Simulation</span>
            </div>
            <div className={`flex p-1 rounded-xl border ${isDarkMode ? "bg-white/[0.03] border-white/10" : "bg-slate-50 border-slate-200"}`}>
              {(["pessimistic", "expected", "optimistic"] as const).map((sc) => (
                <button
                  key={sc}
                  onClick={() => setForecastScenario(sc)}
                  className={`flex-1 px-2.5 py-1 text-[9.5px] font-extrabold uppercase rounded-lg transition-all cursor-pointer ${
                    forecastScenario === sc
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : (isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-indigo-600")
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. METRIC CARDS BENTO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pipeline ARR */}
        <motion.div 
          whileHover={{ scale: 1.025, translateY: -4 }}
          className={`rounded-2xl p-5 shadow-xl flex items-center justify-between relative overflow-hidden group transition-all duration-300 border glass-card-premium ${
            isDarkMode ? "dark-glass border-indigo-500/15" : "light-glass border-slate-200/80 shadow-md"
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/20 group-hover:scale-150 transition-all duration-500" />
          <div className="space-y-1 relative z-10">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>Gross Pipeline ARR</span>
            <h3 className={`text-3xl font-black tracking-tight font-display ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              ₹{(totalARR / 100000).toFixed(1)} Lakhs
            </h3>
            <p className="text-[10px] text-emerald-500 font-bold uppercase flex items-center gap-1.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              +18.4% ARR Momentum
            </p>
          </div>
          <div className={`p-3 rounded-xl border shrink-0 relative z-10 shadow-inner group-hover:scale-105 transition-all duration-300 ${
            isDarkMode 
              ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20" 
              : "bg-indigo-50 text-indigo-600 border-indigo-100"
          }`}>
            <DollarSign className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 2: Weighted Close */}
        <motion.div 
          whileHover={{ scale: 1.025, translateY: -4 }}
          className={`rounded-2xl p-5 shadow-xl flex items-center justify-between relative overflow-hidden group transition-all duration-300 border glass-card-premium ${
            isDarkMode ? "dark-glass border-indigo-500/15" : "light-glass border-slate-200/80 shadow-md"
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 group-hover:scale-150 transition-all duration-500" />
          <div className="space-y-1 relative z-10">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>Weighted Forecast</span>
            <h3 className={`text-3xl font-black tracking-tight font-display ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              ₹{(totalWeightedPipeline / 100000).toFixed(1)} Lakhs
            </h3>
            <p className="text-[10px] text-indigo-500 font-bold uppercase flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              {avgProbability}% Win Probability
            </p>
          </div>
          <div className={`p-3 rounded-xl border shrink-0 relative z-10 shadow-inner group-hover:scale-105 transition-all duration-300 ${
            isDarkMode 
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" 
              : "bg-emerald-50 text-emerald-600 border-emerald-100"
          }`}>
            <Award className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 3: Active Deals */}
        <motion.div 
          whileHover={{ scale: 1.025, translateY: -4 }}
          className={`rounded-2xl p-5 shadow-xl flex items-center justify-between relative overflow-hidden group transition-all duration-300 border glass-card-premium ${
            isDarkMode ? "dark-glass border-indigo-500/15" : "light-glass border-slate-200/80 shadow-md"
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/20 group-hover:scale-150 transition-all duration-500" />
          <div className="space-y-1 relative z-10">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>Active Pipelines</span>
            <h3 className={`text-3xl font-black tracking-tight font-display ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              {activeDealsCount} Active Deals
            </h3>
            <p className="text-[10px] text-purple-500 font-bold uppercase flex items-center gap-1.5 mt-1">
              <CheckSquare className="w-3.5 h-3.5 text-purple-500" />
              {wonDealsCount} Won This Quarter
            </p>
          </div>
          <div className={`p-3 rounded-xl border shrink-0 relative z-10 shadow-inner group-hover:scale-105 transition-all duration-300 ${
            isDarkMode 
              ? "bg-purple-500/10 text-purple-300 border-purple-500/20" 
              : "bg-purple-50 text-purple-600 border-purple-100"
          }`}>
            <Calendar className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 4: Risks */}
        <motion.div 
          whileHover={{ scale: 1.025, translateY: -4 }}
          className={`rounded-2xl p-5 shadow-xl flex items-center justify-between relative overflow-hidden group transition-all duration-300 border glass-card-premium ${
            isDarkMode ? "dark-glass border-indigo-500/15" : "light-glass border-slate-200/80 shadow-md"
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/20 group-hover:scale-150 transition-all duration-500" />
          <div className="space-y-1 relative z-10">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-rose-400" : "text-rose-600"}`}>Active Red Flags</span>
            <h3 className={`text-3xl font-black tracking-tight font-display ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              {activeObjectionsCount} Objections
            </h3>
            <p className="text-[10px] text-rose-500 font-bold uppercase flex items-center gap-1.5 mt-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              Sovereignty Blockers Flagged
            </p>
          </div>
          <div className={`p-3 rounded-xl border shrink-0 relative z-10 shadow-inner group-hover:scale-105 transition-all duration-300 ${
            isDarkMode 
              ? "bg-rose-500/10 text-rose-300 border-rose-500/20" 
              : "bg-rose-50 text-rose-600 border-rose-100"
          }`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* 4. CORE GRAPHICAL ANALYTICS SECTION (Interactive Area Charts & Pie Segment Density) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MULTI-SCENARIO REVENUE FORECAST CHART */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`lg:col-span-8 rounded-2xl p-5 shadow-2xl flex flex-col justify-between glass-card-premium ${
            isDarkMode ? "dark-glass text-slate-200" : "light-glass text-slate-800 shadow-md"
          }`}
        >
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 mb-4 gap-2 ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>
              <TrendingUp className="w-4 h-4" />
              Strategic Revenue &amp; ARR Scenario Simulator
            </span>
            <div className={`flex items-center gap-2 text-[9px] font-mono ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              <span className="uppercase">Scenario: <strong className="text-indigo-500 font-extrabold">{forecastScenario}</strong></span>
              <span>•</span>
              <span>Values in INR Lakhs</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ARR_FORECAST_DATA.expected} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis dataKey="quarter" stroke={isDarkMode ? "#64748b" : "#475569"} fontSize={10} tickLine={false} />
                <YAxis stroke={isDarkMode ? "#64748b" : "#475569"} fontSize={10} tickLine={false} tickFormatter={(val) => `₹${val}L`} />
                <Tooltip 
                  contentStyle={
                    isDarkMode 
                      ? { backgroundColor: "#090a14", borderColor: "rgba(255,255,255,0.08)", color: "#f8fafc", borderRadius: "12px" } 
                      : { backgroundColor: "#ffffff", borderColor: "rgba(0,0,0,0.08)", color: "#0f172a", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }
                  }
                  formatter={(value: any, name: any) => [`₹${value} Lakhs`, name]} 
                />
                <Legend wrapperStyle={{ fontSize: "10px", color: isDarkMode ? "#94a3b8" : "#475569" }} />
                
                {forecastScenario === "expected" && (
                  <>
                    <Area type="monotone" name="Expected Target" dataKey="Forecast" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorForecast)" />
                    <Area type="monotone" name="Actual Closed" dataKey="Actual" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActual)" />
                  </>
                )}
                {forecastScenario === "optimistic" && (
                  <>
                    <Area type="monotone" name="Optimistic Best Case" dataKey="Optimistic" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorForecast)" />
                    <Area type="monotone" name="Actual Closed" dataKey="Actual" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActual)" />
                  </>
                )}
                {forecastScenario === "pessimistic" && (
                  <>
                    <Area type="monotone" name="Pessimistic Floor Case" dataKey="Pessimistic" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorForecast)" />
                    <Area type="monotone" name="Actual Closed" dataKey="Actual" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActual)" />
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* STAGE DENSITY RING CHART */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className={`lg:col-span-4 rounded-2xl p-5 shadow-2xl flex flex-col justify-between glass-card-premium ${
            isDarkMode ? "dark-glass text-slate-200" : "light-glass text-slate-800 shadow-md"
          }`}
        >
          <div className={`border-b pb-3 mb-4 ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>
              CRM Stage Density Index
            </span>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center">
            {distributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={
                      isDarkMode 
                        ? { backgroundColor: "#090a14", borderColor: "rgba(255,255,255,0.08)", color: "#f8fafc", borderRadius: "12px" } 
                        : { backgroundColor: "#ffffff", borderColor: "rgba(0,0,0,0.08)", color: "#0f172a", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }
                    }
                    formatter={(value: any) => [`${value} Deals`, ""]} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-xs uppercase font-bold tracking-widest">
                No active deals
              </div>
            )}
            
            {/* Center Absolute Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <h4 className={`text-2xl font-black leading-none font-display ${isDarkMode ? "text-white" : "text-slate-900"}`}>{deals.length}</h4>
              <span className={`text-[8px] font-bold uppercase tracking-widest block mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Total Deals</span>
            </div>
          </div>

          {/* Color Indicators Legend */}
          <div className={`flex flex-wrap gap-x-3 gap-y-1.5 pt-3 border-t ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
            {distributionData.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className={`text-[9px] font-bold uppercase tracking-wide ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 5. VISUAL PIPELINE FUNNEL CHART & RISK HEURISTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Deal Funnel Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className={`lg:col-span-5 rounded-2xl p-5 shadow-2xl space-y-4 glass-card-premium ${
            isDarkMode ? "dark-glass text-slate-200" : "light-glass text-slate-800 shadow-md"
          }`}
        >
          <div>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>
              Interactive Conversion Funnel
            </span>
            <p className={`text-[9px] font-mono uppercase mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Weighted progress indicators</p>
          </div>

          <div className="space-y-3.5">
            {STAGE_FUNNEL_DATA.map((item, index) => (
              <div key={index} className="space-y-1.5">
                <div className={`flex items-center justify-between text-[11px] font-bold uppercase ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  <span>{item.stage}</span>
                  <span className={`font-mono ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>{item.value} Accounts ({item.percentage})</span>
                </div>
                <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isDarkMode ? "bg-white/5 border-white/5" : "bg-slate-100 border-slate-200/50"}`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: item.percentage }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RED FLAG COMPLIANCE MONITOR */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.22 }}
          className={`lg:col-span-7 rounded-2xl p-5 shadow-2xl space-y-4 glass-card-premium ${
            isDarkMode ? "dark-glass text-slate-200" : "light-glass text-slate-800 shadow-md"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>
                AI Compliance &amp; Red-Flag Auditing
              </span>
              <p className="text-[9px] font-mono text-rose-500 uppercase mt-0.5">Active risk triggers</p>
            </div>
            <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-500 text-[8px] font-mono uppercase tracking-widest rounded border border-rose-500/20">
              High Risk
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-3.5 rounded-xl border space-y-2 transition-all duration-300 ${
              isDarkMode 
                ? "border-rose-500/20 bg-rose-500/[0.02] hover:bg-rose-500/[0.05] text-slate-300" 
                : "border-rose-200 bg-rose-500/[0.02] hover:bg-rose-100/30 text-slate-700 shadow-3xs"
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-rose-500">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                AWS Mumbai Latency
              </div>
              <p className="text-[11px] leading-relaxed font-medium font-sans">
                ABC Industrial security lead requires localized database containers in the Central India region to address global sovereignty latency.
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-2 transition-all duration-300 ${
              isDarkMode 
                ? "border-amber-500/20 bg-amber-500/[0.02] hover:bg-amber-500/[0.05] text-slate-300" 
                : "border-amber-200 bg-amber-500/[0.02] hover:bg-amber-100/30 text-slate-700 shadow-3xs"
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-amber-500">
                <Zap className="w-4 h-4 shrink-0 animate-pulse" />
                Unresolved SOC 2 File
              </div>
              <p className="text-[11px] leading-relaxed font-medium font-sans">
                Customer audit cannot proceed until we deliver our customized compliance bundle under a strict non-disclosure agreement.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 6. PIPELINE DIRECTORY & DEALS LAUNCHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* DIRECTORY LISTING */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className={`md:col-span-7 rounded-2xl p-5 shadow-2xl space-y-4 glass-card-premium ${
            isDarkMode ? "dark-glass text-slate-200" : "light-glass text-slate-800 shadow-md"
          }`}
        >
          <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>
              <Briefcase className="w-4 h-4 text-purple-500" />
              Active Accounts Pipeline Directory
            </span>
            <span className={`text-[9px] font-mono uppercase tracking-widest font-bold ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>Interactive Drilldown</span>
          </div>

          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {deals.map((deal) => (
              <div 
                key={deal.id}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all gap-4 shadow-sm ${
                  isDarkMode 
                    ? "bg-white/[0.01] hover:bg-white/[0.04] border-white/5 hover:border-indigo-500/30" 
                    : "bg-slate-50/55 hover:bg-indigo-50/40 border-slate-100 hover:border-indigo-200 shadow-3xs"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? "text-white" : "text-slate-800"}`}>{deal.company}</h4>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-widest border ${
                      isDarkMode 
                        ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20" 
                        : "bg-indigo-50 text-indigo-700 border-indigo-200"
                    }`}>
                      {deal.status}
                    </span>
                  </div>
                  <p className={`text-[11px] font-serif italic truncate max-w-[280px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {deal.name}
                  </p>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Contract Value</span>
                    <span className={`text-xs font-extrabold ${isDarkMode ? "text-indigo-200" : "text-indigo-600"}`}>
                      ₹{(deal.value / 100000).toFixed(1)} Lakhs
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Win Probability</span>
                    <span className="text-xs font-black text-emerald-500">
                      {deal.prediction.probability}%
                    </span>
                  </div>

                  {/* LAUNCH DEEP DRILLDOWN */}
                  <div className="flex items-center gap-1">
                    {onSelectDeal && (
                      <button
                        onClick={() => {
                          onSelectDeal(deal);
                          if (onSetMainView) onSetMainView("deal-intelligence");
                        }}
                        className={`p-2 rounded-lg transition-all cursor-pointer shadow-3xs hover:scale-105 active:scale-95 border ${
                          isDarkMode 
                            ? "bg-white/[0.04] hover:bg-indigo-600 text-slate-300 hover:text-white border-white/5" 
                            : "bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white border-slate-200"
                        }`}
                        title="Analyze Deal Intelligence"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* EINSTEIN REAL-TIME STRATEGIC ADVISORY FEED */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.28 }}
          className={`md:col-span-5 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between glass-card-premium ${
            isDarkMode 
              ? "dark-glass text-white" 
              : "light-glass text-slate-850 shadow-md"
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <div className={`flex items-center justify-between border-b pb-2 ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                <h4 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? "text-white" : "text-slate-800"}`}>Einstein Real-Time Advisory Feed</h4>
              </div>
              <span className="text-[8px] font-mono text-indigo-500 uppercase">AI Neural Node</span>
            </div>

            <div className="space-y-3.5">
              {AI_RECOMMENDATIONS.map((rec) => {
                const isCompleted = completedRecommendations.includes(rec.id);
                return (
                  <div 
                    key={rec.id} 
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                      isCompleted 
                        ? (isDarkMode ? "bg-emerald-950/20 border-emerald-500/30 opacity-60" : "bg-emerald-50 border-emerald-200/50 opacity-70") 
                        : (isDarkMode ? "bg-white/[0.02] border-white/5 hover:border-indigo-500/20" : "bg-slate-50 border-slate-100 hover:border-indigo-200/50 hover:bg-slate-100/70")
                    }`}
                  >
                    <button 
                      onClick={() => toggleRecommendation(rec.id)}
                      className={`mt-0.5 shrink-0 transition-colors ${isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"}`}
                      title={isCompleted ? "Mark active" : "Resolve recommendation"}
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${
                          rec.impact === "High Impact" 
                            ? "bg-red-500/10 text-red-400 border-red-500/25" 
                            : "bg-amber-500/10 text-amber-400 border-amber-500/25"
                        }`}>
                          {rec.impact}
                        </span>
                        <span className="text-[8px] font-mono text-slate-500">
                          {rec.type.toUpperCase()}
                        </span>
                      </div>
                      <h5 className={`text-xs font-bold leading-tight mt-1 ${isCompleted ? "line-through text-slate-400" : (isDarkMode ? "text-slate-200" : "text-slate-800")}`}>
                        {rec.title}
                      </h5>
                      <p className={`text-[11px] leading-normal mt-1 font-medium font-sans ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                        {rec.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`pt-4 border-t text-right relative z-10 flex justify-between items-center text-[9px] font-mono uppercase mt-4 ${isDarkMode ? "border-white/5 text-indigo-300" : "border-slate-100 text-indigo-600"}`}>
            <span>✦ GROUNDED ACCURACY INDEX: 94.5% ✦</span>
            <span>{completedRecommendations.length} of 3 RESOLVED</span>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
