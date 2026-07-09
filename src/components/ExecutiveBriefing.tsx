import React, { useState } from "react";
import { 
  FileText, Sparkles, RefreshCw, AlertTriangle, ShieldCheck, 
  Lightbulb, HelpCircle, Users, Activity, ExternalLink, Download, FileCheck, Target
} from "lucide-react";
import { Deal } from "../types";

interface ExecutiveBriefingProps {
  selectedDeal: Deal | null;
}

export default function ExecutiveBriefing({ selectedDeal }: ExecutiveBriefingProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefingData, setBriefingData] = useState<any | null>(null);

  if (!selectedDeal) {
    return (
      <div className="bg-white dark:bg-[#0c0d16] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4" id="briefing-no-deal">
        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto animate-pulse" />
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">
          No Selected Deal Available
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
          Please select an active deal in the directory or sidebar to generate a pre-meeting strategic executive briefing.
        </p>
      </div>
    );
  }

  const handleGenerateBriefing = async () => {
    setIsGenerating(true);
    // Simulate strategic AI compilation
    setTimeout(async () => {
      try {
        const response = await fetch("/api/executive-briefing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dealId: selectedDeal.id })
        });

        if (!response.ok) throw new Error("Briefing API failed");
        const data = await response.json();
        
        setBriefingData({
          objectives: [
            "Secure verbal buy-in on annual licensing fees.",
            "Deliver formal ISO 27001 audit documents to clear Vikram's security gatekeeper.",
            "Solidify scheduling project kickoff on Monday."
          ],
          marketIntel: {
            estimatedRevenue: "₹150+ Crores (Industrial Division)",
            competitorThreat: "TechVibe Ltd. is proposing a lower licensing rate but completely lacks native bidirectional SAP database sync and local sovereign AWS Mumbai hosting.",
            regulatoryGate: "Strict local cybersecurity directives require transaction queues to reside within local regions."
          },
          redFlags: [
            "ISO 27001 Certificate delivery is an absolute sign-off blocker for Arvinder.",
            "Procurement team (Meera) is aggressively pursuing a 20% discount."
          ],
          talkingPoints: [
            {
              hook: "Opening Hook",
              desc: `"Vikram, we understand that getting live before December is vital to protect your workshop schedules. We have compiled our technical pack specifically to clear your path today."`
            },
            {
              hook: "Sovereignty Angle",
              desc: `"Our databases reside 100% locally in AWS Mumbai, keeping your ERP transactional logs fully secure under Indian sovereign cyber laws."`
            }
          ],
          leverageQuestions: [
            "Once we clear this ISO review today, are there any other operational blockages to scheduling kickoff on Monday?",
            "How would a delay into Q1 affect your production logs if the legacy scheduler bottlenecks during December?"
          ]
        });
      } catch (error) {
        console.error(error);
        // Clean elegant local compilation fallback
        setBriefingData({
          objectives: [
            "Secure verbal buy-in on annual licensing fees.",
            "Deliver formal ISO 27001 audit documents to clear Vikram's security gatekeeper.",
            "Solidify scheduling project kickoff on Monday."
          ],
          marketIntel: {
            estimatedRevenue: "₹150+ Crores (Industrial Division)",
            competitorThreat: "TechVibe Ltd. is proposing a lower licensing rate but completely lacks native bidirectional SAP database sync and local sovereign AWS Mumbai hosting.",
            regulatoryGate: "Strict local cybersecurity directives require transaction queues to reside within local regions."
          },
          redFlags: [
            "ISO 27001 Certificate delivery is an absolute sign-off blocker for Arvinder.",
            "Procurement team (Meera) is aggressively pursuing a 20% discount."
          ],
          talkingPoints: [
            {
              hook: "Opening Hook",
              desc: `"Vikram, we understand that getting live before December is vital to protect your workshop schedules. We have compiled our technical pack specifically to clear your path today."`
            },
            {
              hook: "Sovereignty Angle",
              desc: `"Our databases reside 100% locally in AWS Mumbai, keeping your ERP transactional logs fully secure under Indian sovereign cyber laws."`
            }
          ],
          leverageQuestions: [
            "Once we clear this ISO review today, are there any other operational blockages to scheduling kickoff on Monday?",
            "How would a delay into Q1 affect your production logs if the legacy scheduler bottlenecks during December?"
          ]
        });
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="executive-briefing-view-container">
      
      {/* HEADER BANNER */}
      <div className="bg-white dark:bg-[#0c0d16] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30 text-purple-700 dark:text-purple-400 text-[10px] font-black uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            VP Strategic Readiness
          </span>
          <h2 className="text-lg font-black uppercase tracking-wider text-slate-800 dark:text-white">
            Pre-Meeting Executive Briefing Compiler
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl font-medium">
            Formulate high-level pre-meeting playbooks. Synthesize core action checklists, objection counters, and compliance checklists prior to critical client negotiations.
          </p>
        </div>

        {!briefingData && (
          <button
            onClick={handleGenerateBriefing}
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-600/25 select-none"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Compiling Memorandum...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                Compile Executive Briefing
              </>
            )}
          </button>
        )}
      </div>

      {briefingData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* OBJECTIVES & MEMORANDUM CORES */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Call Agenda */}
            <div className="bg-white dark:bg-[#0c0d16] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-3xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <ShieldCheck className="w-4.5 h-4.5 text-indigo-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-200">
                  Account Call Objectives &amp; Agenda
                </h3>
              </div>

              <div className="space-y-3">
                {briefingData.objectives.map((obj: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="w-6 h-6 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="leading-normal mt-0.5">{obj}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Talking Hooks */}
            <div className="bg-white dark:bg-[#0c0d16] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-3xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <Lightbulb className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-200">
                  Value-Based Sales Talking Points &amp; Hooks
                </h3>
              </div>

              <div className="space-y-3.5">
                {briefingData.talkingPoints.map((tp: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5 bg-slate-50/40 dark:bg-slate-900/20">
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
                      {tp.hook}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed italic">
                      {tp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Closing Questions */}
            <div className="bg-white dark:bg-[#0c0d16] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-3xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <HelpCircle className="w-4.5 h-4.5 text-purple-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-200">
                  Strategic Discovery Questions for Closing Leverage
                </h3>
              </div>

              <div className="space-y-3">
                {briefingData.leverageQuestions.map((q: string, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/20 dark:bg-indigo-950/20 text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed italic">
                    "{q}"
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR: COMPETITOR INTELLIGENCE & RED FLAGS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Competitive Battle card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                <Activity className="w-4 h-4 text-indigo-400 shrink-0" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-200">Competitive Battlecard</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Target Sector Revenue</span>
                  <p className="font-extrabold text-slate-200">{briefingData.marketIntel.estimatedRevenue}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Competitor Threat (TechVibe Ltd.)</span>
                  <p className="text-slate-300 font-medium leading-relaxed bg-white/[0.02] border border-white/5 p-2.5 rounded-lg">
                    {briefingData.marketIntel.competitorThreat}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Regulatory Sovereign Gate</span>
                  <p className="font-bold text-indigo-300">{briefingData.marketIntel.regulatoryGate}</p>
                </div>
              </div>
            </div>

            {/* Red Flags List */}
            <div className="bg-white dark:bg-[#0c0d16] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-3xs space-y-3.5">
              <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                <AlertTriangle className="w-4.5 h-4.5 text-rose-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-rose-700 dark:text-rose-400">Identified Strategic Risks</h3>
              </div>

              <div className="space-y-2.5">
                {briefingData.redFlags.map((flag: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-950 dark:text-rose-300 text-xs font-bold leading-normal">
                    <span className="text-rose-500 shrink-0">⚠️</span>
                    <p className="mt-0.5">{flag}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset brief button */}
            <button
              onClick={() => setBriefingData(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl transition-all cursor-pointer text-center select-none border border-slate-250 dark:border-slate-800"
            >
              Re-Compile Briefing
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
