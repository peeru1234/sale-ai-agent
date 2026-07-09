import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Brain, Cpu, MessageSquare, ChevronRight, Play, RefreshCw, 
  AlertCircle, FileText, Send, BadgeCheck, Network, Layers, ShieldAlert,
  ArrowRight, CheckCircle2, UserCheck, HelpCircle, Mail, DollarSign, Calendar
} from "lucide-react";
import { Deal } from "../types";

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  description: string;
  systemPrompt: string;
}

const AGENTS: Agent[] = [
  {
    id: "research",
    name: "Deal Research Agent",
    role: "Competitive Intelligence & Corporate Positioning",
    avatar: "🔬",
    color: "from-blue-500 to-indigo-600",
    description: "Gathers competitive updates, funding history, and strategic corporate positioning.",
    systemPrompt: "You are the Deal Research Agent. Your job is to research client companies, analyze market positions, news, competitor battlecards, and funding to give sales teams an edge."
  },
  {
    id: "meeting",
    name: "Meeting Agent",
    role: "Speech Cadence & Conversation Sentiment Analyst",
    avatar: "🎙️",
    color: "from-purple-500 to-indigo-600",
    description: "Transcribes calls, segments Rep vs Client dialogue, parses emotion levels, and extracts meeting minutes.",
    systemPrompt: "You are the Meeting Agent. You specialize in transcript diaries, vocal waveform cue analysis, sentiment detection, and structured action item extracts."
  },
  {
    id: "crm",
    name: "CRM Auto-Sync Agent",
    role: "Account Status & Pipeline Sync Master",
    avatar: "🗄️",
    color: "from-emerald-500 to-teal-600",
    description: "Maps decision makers, updates fields, lists memory profiles, and synchronizes sales pipeline logs.",
    systemPrompt: "You are the CRM Auto-Sync Agent. You translate conversation records into structured CRM updates. You ensure fields like budget, timeline, and champions are mapped perfectly."
  },
  {
    id: "email",
    name: "Email Follow-up Agent",
    role: "Hyper-Personalized Client Communication Designer",
    avatar: "✉️",
    color: "from-pink-500 to-rose-600",
    description: "Generates custom follow-up emails, proposal outreach, and negotiation letters with single-click copying.",
    systemPrompt: "You are the Email Agent. You write context-aware sales and follow-up emails with excellent formatting, custom tones, and summaries of discussed agreements."
  },
  {
    id: "proposal",
    name: "Proposal Agent",
    role: "SaaS Enterprise Proposal & Contract Draftsman",
    avatar: "📄",
    color: "from-cyan-500 to-blue-600",
    description: "Assembles custom-tailored multi-year SaaS agreements, commercial tables, and service level descriptions.",
    systemPrompt: "You are the Proposal Agent. Your job is to draft customized commercial software proposals, pricing grids, and multi-year contract options based on client requirements, budget limits, and technical integrations."
  },
  {
    id: "forecast",
    name: "Forecast Agent",
    role: "Close Probability & ARR Revenue Forecaster",
    avatar: "📈",
    color: "from-amber-500 to-orange-600",
    description: "Projects Close probability, ARR values, and calculates the rigorous AI Deal Score (0-100).",
    systemPrompt: "You are the Forecast Agent. You look at deal progress, budget alignments, decision-maker buy-in, and competitor risks to calculate mathematical close probabilities and deal scores."
  },
  {
    id: "risk",
    name: "Risk & Compliance Guard",
    role: "Red-Flag & Security Constraint Auditor",
    avatar: "🛡️",
    color: "from-red-500 to-orange-600",
    description: "Identifies contract barriers, compliance risks, database residency, and timeline bottlenecks.",
    systemPrompt: "You are the Risk Agent. Your role is to look for obstacles, unaddressed objections, compliance gaps (e.g. SOC2, GDPR, Local sovereignty), and schedule risk areas."
  },
  {
    id: "coach",
    name: "Negotiation Coach",
    role: "Tactical Objection & Counter-Strategy Consultant",
    avatar: "🧠",
    color: "from-violet-500 to-fuchsia-600",
    description: "Formulates smart handling counter-statements, pricing concession scripts, and closing guides.",
    systemPrompt: "You are the Negotiation Coach. You give tactical advice on objection handling, pricing negotiations, and positioning against competitors to save slipping sales."
  },
  {
    id: "followup",
    name: "Follow-up Agent",
    role: "Next-Best-Action Workflow Recommender",
    avatar: "🎯",
    color: "from-teal-500 to-indigo-500",
    description: "Recommends key task follow-ups, calendars, and schedules next actions to keep deals moving.",
    systemPrompt: "You are the Follow-up Agent. You analyze meetings and deal progress to generate highly specific next actions (pricing drafts, scheduling architects, booking demos) with logical due dates and clear ownership guidelines."
  },
  {
    id: "executive",
    name: "Executive Agent",
    role: "Executive Summary & VP Stakeholder Diarist",
    avatar: "👑",
    color: "from-violet-600 to-purple-600",
    description: "Synthesizes multi-meeting accounts into single-page briefs for sales VPs, executive champions, or decision makers.",
    systemPrompt: "You are the Executive Agent. Your core competency is distilling large accounts, complex integrations, and multi-week negotiation logs into clean, high-impact executive summaries for stakeholders and leadership."
  }
];

interface MultiAgentHubProps {
  deal: Deal;
  onRefreshDeal: () => void;
  isDarkMode?: boolean;
}

interface OrchestrationStep {
  agentId: string;
  senderName: string;
  receiverName: string;
  message: string;
  outputKey?: string;
}

export default function MultiAgentHub({ deal, onRefreshDeal, isDarkMode = true }: MultiAgentHubProps) {
  const [activeHubView, setActiveHubView] = useState<"consult" | "orchestration">("consult");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("research");
  const [userQuery, setUserQuery] = useState<string>("");
  const [isConsulting, setIsConsulting] = useState<boolean>(false);
  const [consultResult, setConsultResult] = useState<string>("");
  const [consultHistory, setConsultHistory] = useState<{ agentId: string; query: string; reply: string }[]>([]);

  // LangGraph Orchestrator Simulator State
  const [isOrchestrating, setIsOrchestrating] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [orchestrationLogs, setOrchestrationLogs] = useState<OrchestrationStep[]>([]);
  const [orchestrationCompleted, setOrchestrationCompleted] = useState<boolean>(false);

  // Simulated Agent outputs
  const [generatedProposal, setGeneratedProposal] = useState<any>(null);
  const [generatedEmail, setGeneratedEmail] = useState<any>(null);
  const [generatedCrmUpdate, setGeneratedCrmUpdate] = useState<any>(null);
  const [explainableAiMetric, setExplainableAiMetric] = useState<any>(null);

  const selectedAgent = AGENTS.find((a) => a.id === selectedAgentId) || AGENTS[0];

  const handleConsultAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isConsulting) return;

    const queryToSubmit = userQuery.trim();
    setUserQuery("");
    setIsConsulting(true);
    setConsultResult("");

    try {
      const response = await fetch("/api/agent-consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          dealId: deal.id,
          query: queryToSubmit
        })
      });

      if (!response.ok) throw new Error("Consultation API error");
      const data = await response.json();
      
      setConsultResult(data.reply);
      setConsultHistory(prev => [
        { agentId: selectedAgent.id, query: queryToSubmit, reply: data.reply },
        ...prev
      ]);
    } catch (error) {
      console.error(error);
      setConsultResult("Consultation failed. Make sure server is running and your API key is correctly configured.");
    } finally {
      setIsConsulting(false);
    }
  };

  const loadPresetQuery = (query: string) => {
    setUserQuery(query);
  };

  // Run LangGraph Simulated Multi-Agent collaboration workflow
  const triggerLangGraphCollaboration = () => {
    if (isOrchestrating) return;

    setIsOrchestrating(true);
    setCurrentStepIndex(0);
    setOrchestrationCompleted(false);
    setOrchestrationLogs([]);
    setGeneratedProposal(null);
    setGeneratedEmail(null);
    setGeneratedCrmUpdate(null);
    setExplainableAiMetric(null);

    const steps: OrchestrationStep[] = [
      {
        agentId: "research",
        senderName: "Deal Research Agent",
        receiverName: "Meeting Agent",
        message: `Synthesized background on ${deal.company}. They operate in the industrial automation sector. Stated annual budget: INR ${deal.value.toLocaleString('en-IN')}. Competitor TechVibe Ltd. is actively pitching their lower-tier SAP plugin.`
      },
      {
        agentId: "meeting",
        senderName: "Meeting Agent",
        receiverName: "Risk Agent",
        message: "Scanned transcripts. Security head highlighted that ISO 27001 is a strict dealbreaker objection, while CTO Vikram Sharma loves our 5-minute SAP bidirectional API sync."
      },
      {
        agentId: "risk",
        senderName: "Risk & Compliance Guard",
        receiverName: "Negotiation Coach",
        message: "Compliance audit logged. Our platform meets all parameters. Data residency constraints dictate that transaction queues reside locally in the Mumbai region to guarantee Indian sovereignty. SOC 2 Type II certificate is active."
      },
      {
        agentId: "coach",
        senderName: "Negotiation Coach",
        receiverName: "Proposal Agent",
        message: "Formulated response playbook: Mitigate TechVibe price friction by bundling our advanced SAP connector for free, and highlight local Indian sovereignty hosting vs TechVibe's US-based cloud hosting."
      },
      {
        agentId: "proposal",
        senderName: "Proposal Agent",
        receiverName: "Forecast Agent",
        message: `Generated custom proposal for ${deal.company}. Term: 2 Years. Pricing: INR ${(deal.value * 0.9).toLocaleString('en-IN')}/year. Bundled SLA (99.95%), Okta SSO directory sync, and zero complex middleware fees.`,
        outputKey: "proposal"
      },
      {
        agentId: "forecast",
        senderName: "Forecast Agent",
        receiverName: "Email Agent",
        message: "Mathematical analysis of close probability: Upgraded deal score to 94/100 (+12% jump) following resolution of the ISO 27001 compliance risk. High confidence.",
        outputKey: "forecast"
      },
      {
        agentId: "email",
        senderName: "Email Follow-up Agent",
        receiverName: "CRM Agent",
        message: "Customized executive proposal follow-up email compiled with bulleted agreements, technical specifications, and a digital contract link.",
        outputKey: "email"
      },
      {
        agentId: "crm",
        senderName: "CRM Auto-Sync Agent",
        receiverName: "System Dashboard",
        message: "Direct database synchronization complete. Updated deal stage to 'Proposal/Negotiation', logged requirements (ISO 27001, SAP Sync, Okta SSO) as 'Agreed', and set next action to 'Send Contract'.",
        outputKey: "crm"
      }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setOrchestrationLogs(prev => [...prev, steps[currentStep]]);
        setCurrentStepIndex(currentStep);
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Populate generated outputs at the end
        setGeneratedProposal({
          title: `Enterprise Agreement for ${deal.company}`,
          duration: "24 Months (Annual Recurring Billing)",
          pricing: `INR ${(deal.value * 0.9).toLocaleString('en-IN')} / Year`,
          terms: [
            "Includes bidirectional real-time SAP ERP Connector",
            "SAML 2.0 & OIDC directory single sign-on (Okta supported)",
            "Local sovereign AWS Mumbai cloud environment residency",
            "99.95% Server Uptime Service Level Agreement (SLA)"
          ],
          paymentTerm: "Net-30 from contract activation date"
        });

        setGeneratedEmail({
          subject: `Proposal: Enterprise Automation Platform - ${deal.company}`,
          body: `Dear ${deal.contactName || "Team"},\n\nFollowing our productive technical and security discussions, our team has finalized a customized Enterprise Agreement for ${deal.company}.\n\nHere is a brief outline of what is bundled in this proposal:\n• Real-time Bidirectional SAP ERP Connector (included at zero middleware fees)\n• Compliant ISO 27001 & SOC 2 Type II security framework hosted in AWS Mumbai (fully local sovereignty)\n• Okta SSO Directory Synchronization\n• 99.95% Server Uptime Guarantee\n\nCommercials:\n• Annual Contract Value: INR ${(deal.value * 0.9).toLocaleString('en-IN')} (Special 10% discount applied)\n• Term: 24 Months\n\nWe are excited to partner with ABC Manufacturing to streamline your workshop schedule ahead of the December peak season. Let us know if we can schedule a 10-minute kickoff review on Monday.\n\nBest regards,\nSales Operations & Deal Intel Intelligence`
        });

        setGeneratedCrmUpdate({
          status: "Proposal / Negotiation",
          addedNotes: `LangGraph Multi-Agent audit executed. Handled ISO 27001 security objections successfully. Local sovereignty and SAP connectors locked as primary leverage points.`,
          stageStatus: "CRM Auto-Synced Successfully",
          tasksAssigned: [
            { task: "Deliver Enterprise compliance pack with ISO certificate", due: "Tomorrow" },
            { task: "Schedule 15-min DocuSign review with CTO Vikram", due: "Friday" }
          ]
        });

        setExplainableAiMetric({
          confidence: "94%",
          confidenceLevel: "HIGH CONFIDENCE",
          evidence: "1. Budget approved by procurement\n2. ISO 27001 security objection resolved\n3. Bidirectional SAP latency requirements agreed\n4. Direct decision-maker Vikram (CTO) fully engaged in negotiation.",
          reasoning: "The deal shows exceptional technical and commercial alignment. The free bundling of the SAP connector successfully offset competitor discount pressure, and local Mumbai hosting cleared the regulatory barrier. Timeline is urgent to meet December deadlines."
        });

        setOrchestrationCompleted(true);
        setIsOrchestrating(false);
        onRefreshDeal(); // Refresh deal context
      }
    }, 1800); // 1.8 seconds delay per agent step
  };

  const getPresetQueriesForAgent = (agentId: string) => {
    switch (agentId) {
      case "research":
        return [
          `Research competitors and outline key differentiators for ${deal.company}`,
          `List funding history and strategic background for ${deal.company}`
        ];
      case "crm":
        return [
          `What decision makers and contacts have been logged so far?`,
          `Draft a structured CRM sync log for our recent status change`
        ];
      case "meeting":
        return [
          `Provide an emotional mapping of client responses across our meetings`,
          `Highlight key agreements and immediate action deadlines`
        ];
      case "email":
        return [
          `Draft a high-impact multi-year commitment email offering a minor concession`,
          `Write a technical follow-up detail sheet about our database connectors`
        ];
      case "proposal":
        return [
          `Generate an commercial agreement for ${deal.company} with SAP connector included`,
          `Draft a detailed multi-year subscription comparison table`
        ];
      case "forecast":
        return [
          `Detail the weighted parameters behind our Deal Score of ${deal.prediction.probability}%`,
          `Analyze what pipeline impacts we face if implementation is delayed 4 weeks`
        ];
      case "risk":
        return [
          `Run a comprehensive audit for unresolved security and sovereignty blockers`,
          `Identify top 3 timeline risks threatening a close before December`
        ];
      case "coach":
        return [
          `Give me a roleplay coaching script to handle: 'The budget is limited this quarter'`,
          `How should I position our product vs traditional SAP integrations?`
        ];
      case "followup":
        return [
          `Recommend next actions based on the recent meeting sentiment and notes`,
          `Draft a chronological checklist for a successful project kickoff`
        ];
      case "executive":
        return [
          `Compile a 1-page account brief summarizing all meetings and open items`,
          `Draft an executive alignment slide deck outline for our sales VP`
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex flex-col gap-6" id="multi-agent-hub-root">
      
      {/* Header and Mode Selector */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl p-5 shadow-md glass-card-premium ${
        isDarkMode ? "dark-glass text-white" : "light-glass text-slate-800"
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-500 animate-pulse" />
            <h2 className={`text-sm font-extrabold uppercase tracking-widest ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              Cooperative AI Multi-Agent Hub
            </h2>
          </div>
          <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Toggle between querying individual specialized agents, or trigger a full multi-agent orchestration workflow using a LangGraph pipeline simulation.
          </p>
        </div>

        <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border self-start sm:self-center ${
          isDarkMode ? "bg-slate-950/80 border-white/5" : "bg-slate-100 border-slate-200"
        }`}>
          <button
            onClick={() => setActiveHubView("consult")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeHubView === "consult"
                ? (isDarkMode ? "bg-indigo-600 text-white" : "bg-[#11131E] text-white shadow-xs")
                : (isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800")
            }`}
          >
            1. Agent Consultation
          </button>
          <button
            onClick={() => setActiveHubView("orchestration")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
              activeHubView === "orchestration"
                ? "bg-indigo-600 text-white shadow-xs"
                : (isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800")
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            2. LangGraph Orchestrator
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeHubView === "consult" ? (
          <motion.div
            key="consult-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* LEFT COLUMN: Agent Selection & Info */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className={`rounded-xl p-4 shadow-md glass-card-premium ${isDarkMode ? "dark-glass" : "light-glass"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="w-4 h-4 text-indigo-500" />
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                    Cooperative Multi-Agent Node
                  </h3>
                </div>
                <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  We have assembled **10 specialized AI agents** dedicated to researching companies, analyzing transcripts, and formulating winning sales strategies.
                </p>
              </div>

              {/* Agents Grid List */}
              <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                {AGENTS.map((agent) => {
                  const isSelected = agent.id === selectedAgentId;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => {
                        setSelectedAgentId(agent.id);
                        setConsultResult("");
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden group cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-slate-900 to-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-500/10"
                          : isDarkMode 
                          ? "bg-slate-900/20 border-white/5 hover:border-white/10 text-slate-300 hover:bg-slate-900/40"
                          : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50 shadow-xs"
                      }`}
                    >
                      {/* Decorative glow on selection */}
                      {isSelected && (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                      )}

                      <div className="flex items-start gap-3 relative z-10">
                        <div className={`text-xl p-2 rounded-lg ${isSelected ? "bg-white/10" : isDarkMode ? "bg-white/5 group-hover:bg-white/10" : "bg-slate-100 group-hover:bg-slate-200"} transition-colors`}>
                          {agent.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider truncate">
                              {agent.name}
                            </h4>
                            {isSelected ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0">
                                <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
                                Active
                              </span>
                            ) : (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0 ${isDarkMode ? "text-slate-400 bg-white/5" : "text-slate-400 bg-slate-100"}`}>
                                Standby
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] font-medium mt-0.5 ${isSelected ? "text-indigo-300" : isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                            {agent.role}
                          </p>
                          <p className={`text-xs mt-1.5 line-clamp-1 font-medium ${isSelected ? "text-slate-300" : isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                            {agent.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Identity, Presets & Chat Consult */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Identity & Core Instruction Card */}
              <div className={`rounded-2xl p-5 shadow-lg relative overflow-hidden glass-card-premium ${
                isDarkMode ? "dark-glass text-white" : "light-glass text-slate-900 border-slate-950"
              }`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-4.5 mb-4">
                  <span className="text-3xl bg-white/10 p-2.5 rounded-xl">{selectedAgent.avatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">
                        {selectedAgent.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[9px] font-mono rounded uppercase border border-indigo-500/30">
                        SYSTEM AGENT
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-200 tracking-wide mt-0.5">
                      {selectedAgent.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                  <div>
                    <h5 className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Active System Prompt / Directive
                    </h5>
                    <p className="text-[11px] font-mono text-indigo-200/90 leading-relaxed mt-1 whitespace-pre-line bg-black/40 p-2.5 rounded border border-white/5">
                      {selectedAgent.systemPrompt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Grounded Context: Updated with {deal.meetings.length} meeting records
                    </span>
                  </div>
                </div>
              </div>

              {/* Console Box / Workspace */}
              <div className={`rounded-2xl p-5 shadow-md flex-1 flex flex-col min-h-[380px] justify-between glass-card-premium ${
                isDarkMode ? "dark-glass" : "light-glass"
              }`}>
                <div className="flex-1 flex flex-col">
                  <div className={`flex items-center justify-between border-b pb-2 mb-4 ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDarkMode ? "text-white" : "text-slate-600"}`}>
                      <Brain className="w-3.5 h-3.5 text-indigo-500" />
                      Interactive Consultation Console
                    </span>
                    <span className={`text-[9px] font-mono uppercase ${isDarkMode ? "text-slate-400" : "text-slate-400"}`}>
                      Active Deal: {deal.company}
                    </span>
                  </div>

                  {/* Response area */}
                  <div className={`flex-1 overflow-y-auto max-h-[260px] mb-4 space-y-3 rounded-xl p-3 border ${
                    isDarkMode ? "bg-slate-950/80 border-white/5" : "bg-slate-50 border-slate-200/50"
                  }`}>
                    <AnimatePresence mode="wait">
                      {isConsulting ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center h-full py-12 text-center"
                        >
                          <RefreshCw className="w-6 h-6 animate-spin text-indigo-500 mb-2" />
                          <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                            Agent is processing deal metadata...
                          </p>
                          <p className={`text-[11px] mt-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                            Generating responsive context-based reasoning path using Gemini 3.5
                          </p>
                        </motion.div>
                      ) : consultResult ? (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-3.5 bg-indigo-500 rounded-sm" />
                            <h4 className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                              {selectedAgent.name} Analysis Response
                            </h4>
                          </div>
                          <div className={`text-xs leading-relaxed font-semibold border p-4 rounded-xl shadow-2xs whitespace-pre-wrap font-sans ${
                            isDarkMode ? "bg-slate-900 border-white/5 text-slate-200" : "bg-white border-slate-200 text-slate-800"
                          }`}>
                            {consultResult}
                          </div>
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-center text-slate-400">
                          <MessageSquare className="w-8 h-8 text-slate-500 mb-2" />
                          <p className="text-xs font-bold uppercase tracking-wider">
                            Console Empty
                          </p>
                          <p className="text-[11px] max-w-[280px] mx-auto mt-1 leading-normal text-slate-500 font-semibold">
                            Select one of the quick consultant queries below or type a custom question to query this agent.
                          </p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Quick Presets */}
                  <div className="space-y-1.5 mb-4">
                    <h5 className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Suggested Account Scenarios
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {getPresetQueriesForAgent(selectedAgent.id).map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => loadPresetQuery(preset)}
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg text-left transition-all max-w-full truncate cursor-pointer ${
                            isDarkMode 
                              ? "bg-indigo-500/10 hover:bg-indigo-500/25 border-indigo-500/20 text-indigo-300" 
                              : "bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700"
                          }`}
                        >
                          ✦ {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form input */}
                <form onSubmit={handleConsultAgent} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder={`Consult ${selectedAgent.name} (e.g. "What is our primary leverage?")`}
                    className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${
                      isDarkMode 
                        ? "bg-slate-950 border-white/5 text-white placeholder:text-slate-500" 
                        : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!userQuery.trim() || isConsulting}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-sm transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="orchestration-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* LangGraph Collaborative Workspace Control */}
            <div className={`rounded-2xl p-6 shadow-md glass-card-premium ${
              isDarkMode ? "dark-glass text-white" : "light-glass text-slate-800"
            }`}>
              <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b ${
                isDarkMode ? "border-white/5" : "border-slate-100"
              }`}>
                <div className="space-y-1">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isDarkMode ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" : "bg-indigo-50 border border-indigo-100 text-indigo-700"
                  }`}>
                    <Network className="w-3.5 h-3.5" />
                    LangGraph State Machine Engine
                  </span>
                  <h3 className={`text-sm font-extrabold uppercase tracking-wider ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                    Direct Multi-Agent Collective Collaboration (Grounded Solves)
                  </h3>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    By launching this pipeline, our 10 agents collaborate synchronously. Each agent consumes state updates from the prior nodes, processes risk assessments, and automatically outputs a pricing proposal, follow-up email, and synchronized CRM updates.
                  </p>
                </div>

                <button
                  onClick={triggerLangGraphCollaboration}
                  disabled={isOrchestrating}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-350 text-white font-extrabold uppercase tracking-wider text-xs px-5 py-3 rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer select-none shrink-0"
                >
                  {isOrchestrating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      LangGraph Executing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white text-indigo-600" />
                      Launch LangGraph Solution
                    </>
                  )}
                </button>
              </div>

              {/* LANGGRAPH ANIMATED GRAPHICAL CANVAS MAP */}
              <div className="my-6 bg-[#0E1017] border border-white/5 rounded-2xl p-6 text-white min-h-[160px] relative overflow-hidden flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                
                {AGENTS.map((agent, idx) => {
                  const isActive = currentStepIndex === idx;
                  const isCompleted = currentStepIndex > idx;
                  const isFuture = currentStepIndex < idx;

                  return (
                    <React.Fragment key={agent.id}>
                      <div 
                        className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-500 z-10 w-[110px] text-center ${
                          isActive 
                            ? "bg-indigo-600/20 border-indigo-500 scale-110 shadow-md shadow-indigo-500/20" 
                            : isCompleted 
                            ? "bg-emerald-500/10 border-emerald-500/50" 
                            : "bg-white/[0.02] border-white/5 opacity-40"
                        }`}
                      >
                        <span className="text-xl mb-1">{agent.avatar}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white truncate max-w-full">
                          {agent.id}
                        </span>
                        <span className="text-[7px] text-slate-400 truncate max-w-full">
                          {agent.name.split(" ")[0]} Node
                        </span>

                        {isActive && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                          </span>
                        )}
                        {isCompleted && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5 bg-emerald-500 rounded-full items-center justify-center text-[6px] font-bold text-black">
                            ✓
                          </span>
                        )}
                      </div>

                      {idx < AGENTS.length - 1 && (
                        <div className={`hidden lg:block h-0.5 w-6 transition-colors duration-500 ${
                          isCompleted ? "bg-emerald-500" : isActive ? "bg-indigo-500 animate-pulse" : "bg-white/5"
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* LANGGRAPH RUNNING CHAT TRACE */}
              <div className={`space-y-4 max-h-[380px] overflow-y-auto pr-2 rounded-xl p-4 border ${
                isDarkMode ? "bg-slate-950/80 border-white/5" : "bg-slate-50 border-slate-200"
              }`}>
                {orchestrationLogs.length === 0 && (
                  <div className="py-12 text-center text-slate-400">
                    <Layers className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                    <p className="text-xs font-bold uppercase tracking-wider">State Machine Idle</p>
                    <p className={`text-[11px] mt-1 max-w-[280px] mx-auto ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                      Click "Launch LangGraph Solution" above to run the 10-agent collaborative workflow simulation for {deal.company}.
                    </p>
                  </div>
                )}

                {orchestrationLogs.map((log, index) => {
                  const agentObj = AGENTS.find(a => a.id === log.agentId);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-start gap-3 p-3 rounded-xl border shadow-3xs ${
                        isDarkMode ? "bg-slate-900/60 border-white/5" : "bg-white border-slate-150"
                      }`}
                    >
                      <span className={`text-2xl p-1 rounded-lg ${isDarkMode ? "bg-white/5" : "bg-slate-100"}`}>{agentObj?.avatar || "🤖"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-extrabold uppercase tracking-wider ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                              {log.senderName}
                            </span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.2 rounded uppercase">
                              {log.receiverName}
                            </span>
                          </div>
                          <span className="text-[8px] font-mono text-slate-400 uppercase">
                            State transition log #{index + 1}
                          </span>
                        </div>
                        <p className={`text-xs font-semibold leading-relaxed mt-1 whitespace-pre-wrap ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                          {log.message}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}

                {isOrchestrating && (
                  <div className={`flex items-center gap-2 p-3 rounded-xl border ${
                    isDarkMode ? "bg-indigo-950/20 border-indigo-500/20" : "bg-indigo-50/50 border border-indigo-100"
                  }`}>
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                    <span className={`text-xs font-bold animate-pulse ${isDarkMode ? "text-indigo-300" : "text-slate-600"}`}>
                      Graph Routing: Message passing to next agent node...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ORCHESTRATION PIPELINE ARTIFACTS / GENERATED OUTPUTS */}
            <AnimatePresence>
              {orchestrationCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                  {/* Proposal & Email Artifact */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Proposal Document */}
                    {generatedProposal && (
                      <div className={`rounded-2xl p-6 shadow-md space-y-4 glass-card-premium ${
                        isDarkMode ? "dark-glass" : "light-glass"
                      }`}>
                        <div className={`flex items-center justify-between border-b pb-3 ${
                          isDarkMode ? "border-white/5" : "border-slate-100"
                        }`}>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-cyan-500" />
                            <h4 className={`text-xs font-extrabold uppercase tracking-widest ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                              AI-Generated Enterprise Commercial Proposal
                            </h4>
                          </div>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md uppercase font-bold ${
                            isDarkMode ? "text-cyan-300 bg-cyan-500/10 border border-cyan-500/20" : "text-cyan-700 bg-cyan-50 border border-cyan-100"
                          }`}>
                            Proposal Agent Output
                          </span>
                        </div>
                        <div className={`border rounded-xl p-5 space-y-4 ${
                          isDarkMode ? "bg-slate-950/60 border-white/5" : "bg-slate-50 border-slate-150"
                        }`}>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                              <h5 className={`text-xs font-extrabold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{generatedProposal.title}</h5>
                              <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">Standard Enterprise SLA Framework</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CONTRACTED VALUE</span>
                              <span className="text-xs font-black text-indigo-500">{generatedProposal.pricing}</span>
                            </div>
                          </div>
                          
                          <div className={`h-px ${isDarkMode ? "bg-white/5" : "bg-slate-200"}`} />

                          <div className="space-y-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Bundled Specifications</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {generatedProposal.terms.map((term: string, idx: number) => (
                                <div key={idx} className={`flex items-center gap-2 text-xs font-semibold border p-2.5 rounded-lg ${
                                  isDarkMode ? "text-slate-300 bg-slate-900/60 border-white/5" : "text-slate-600 bg-white border-slate-100 shadow-3xs"
                                }`}>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  <span>{term}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                            <span>SaaS Contract Duration: {generatedProposal.duration}</span>
                            <span>Billing Terms: {generatedProposal.paymentTerm}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Email Copy */}
                    {generatedEmail && (
                      <div className={`rounded-2xl p-6 shadow-md space-y-4 glass-card-premium ${
                        isDarkMode ? "dark-glass" : "light-glass"
                      }`}>
                        <div className={`flex items-center justify-between border-b pb-3 ${
                          isDarkMode ? "border-white/5" : "border-slate-100"
                        }`}>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-pink-500" />
                            <h4 className={`text-xs font-extrabold uppercase tracking-widest ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                              AI-Generated Client Follow-up Email
                            </h4>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`${generatedEmail.subject}\n\n${generatedEmail.body}`);
                              alert("Email copied to clipboard!");
                            }}
                            className={`text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider cursor-pointer ${
                              isDarkMode ? "text-pink-300 bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/25" : "text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-100"
                            }`}
                          >
                            Copy to Clipboard
                          </button>
                        </div>
                        <div className={`border rounded-xl p-4.5 space-y-3 font-mono text-[11px] leading-relaxed ${
                          isDarkMode ? "bg-slate-950/60 border-white/5 text-slate-300" : "bg-slate-50 border-slate-150 text-slate-700"
                        }`}>
                          <div>
                            <span className="text-slate-400 uppercase tracking-widest">Subject:</span> {generatedEmail.subject}
                          </div>
                          <div className={`h-px ${isDarkMode ? "bg-white/5" : "bg-slate-200 my-2"}`} />
                          <p className={`whitespace-pre-line leading-relaxed font-sans font-medium text-xs ${
                            isDarkMode ? "text-slate-300" : "text-slate-700"
                          }`}>
                            {generatedEmail.body}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CRM Update Log & Explainable AI Metric */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Explainable AI Score Metric */}
                    {explainableAiMetric && (
                      <div className={`rounded-2xl p-6 shadow-lg space-y-4 glass-card-premium ${
                        isDarkMode ? "dark-glass text-white" : "light-glass text-slate-900 border-slate-950"
                      }`}>
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <div className="flex items-center gap-1.5">
                            <Brain className="w-4 h-4 text-indigo-400" />
                            <h4 className="text-[10px] font-bold uppercase tracking-wider">
                              Explainable AI Deal Score Parameters
                            </h4>
                          </div>
                          <span className="text-[9px] font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded uppercase">
                            Forecast Agent Output
                          </span>
                        </div>

                        <div className="flex items-center gap-4 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                          <span className="text-4xl font-black text-indigo-400">{explainableAiMetric.confidence}</span>
                          <div>
                            <span className="text-[10px] font-extrabold text-emerald-400 block tracking-wide">
                              {explainableAiMetric.confidenceLevel}
                            </span>
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest">
                              Calculated Win Probability
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                              Confidence Evidence Points
                            </span>
                            <div className="text-[11px] text-slate-300 space-y-1 font-sans font-medium whitespace-pre-line leading-relaxed bg-black/40 p-3 rounded border border-white/5">
                              {explainableAiMetric.evidence}
                            </div>
                          </div>
                          <div>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                              Mathematical Forecast Reasoning
                            </span>
                            <p className="text-[11px] text-slate-300 font-sans font-medium leading-relaxed bg-black/40 p-3 rounded border border-white/5">
                              {explainableAiMetric.reasoning}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CRM Sync Logs */}
                    {generatedCrmUpdate && (
                      <div className={`rounded-2xl p-6 shadow-md space-y-4 glass-card-premium ${
                        isDarkMode ? "dark-glass" : "light-glass"
                      }`}>
                        <div className={`flex items-center justify-between border-b pb-3 ${
                          isDarkMode ? "border-white/5" : "border-slate-100"
                        }`}>
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-emerald-500" />
                            <h4 className={`text-xs font-extrabold uppercase tracking-widest ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                              CRM Auto-Sync Verification Log
                            </h4>
                          </div>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md uppercase font-bold ${
                            isDarkMode ? "text-emerald-300 bg-emerald-500/10 border border-emerald-500/20" : "text-emerald-700 bg-emerald-50 border border-emerald-100"
                          }`}>
                            CRM Agent Output
                          </span>
                        </div>

                        <div className="space-y-3.5">
                          <div className={`flex justify-between items-center border p-3 rounded-xl ${
                            isDarkMode ? "bg-emerald-500/5 border-emerald-500/20 text-slate-100" : "bg-emerald-50 border-emerald-100 text-slate-800"
                          }`}>
                            <div>
                              <span className={`text-[9px] font-bold uppercase tracking-wide block ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>PIPELINE STAGE ADVANCED</span>
                              <span className="text-xs font-black uppercase">{generatedCrmUpdate.status}</span>
                            </div>
                            <span className="text-[9px] font-extrabold bg-[#2A5C43] text-white px-2 py-1 rounded-md uppercase">
                              LOCKED
                            </span>
                          </div>

                          <div className={`p-3 rounded-xl border ${
                            isDarkMode ? "bg-slate-950/60 border-white/5 text-slate-300" : "bg-slate-50 border-slate-150 text-slate-600"
                          }`}>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 block mb-1">CRM Logged Memory</span>
                            <p className="text-xs font-semibold leading-relaxed font-sans">{generatedCrmUpdate.addedNotes}</p>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 block">Assigned Pipeline Actions</span>
                            <div className="space-y-1.5">
                              {generatedCrmUpdate.tasksAssigned.map((taskObj: any, idx: number) => (
                                <div key={idx} className={`flex justify-between items-center text-xs font-semibold px-3 py-2 rounded-lg border ${
                                  isDarkMode ? "bg-slate-950/40 border-white/5 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-700"
                                }`}>
                                  <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                    {taskObj.task}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-400 uppercase">Due: {taskObj.due}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
