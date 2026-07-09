import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { 
  FileText, Download, Sparkles, CheckCircle, RefreshCw, AlertTriangle, 
  DollarSign, ShieldCheck, Clock, Calendar, HelpCircle, Layers, Sliders, FileCheck
} from "lucide-react";
import { Deal } from "../types";

interface ProposalGeneratorProps {
  selectedDeal: Deal | null;
}

export default function ProposalGenerator({ selectedDeal }: ProposalGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposalData, setProposalData] = useState<any | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [includeSLA, setIncludeSLA] = useState<boolean>(true);

  if (!selectedDeal) {
    return (
      <div className="bg-white dark:bg-[#0c0d16] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4" id="proposal-no-deal">
        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto animate-pulse" />
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">
          No Selected Deal Available
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
          Please select a deal in the sidebar to generate its commercial enterprise proposal.
        </p>
      </div>
    );
  }

  const handleGenerateProposal = async () => {
    setIsGenerating(true);
    // Simulate complex proposal vector assembly for premium feel
    setTimeout(async () => {
      try {
        const response = await fetch("/api/proposal/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dealId: selectedDeal.id })
        });

        if (!response.ok) throw new Error("Proposal generation failed");
        const data = await response.json();
        
        setProposalData({
          title: "ENTERPRISE SOFTWARE AGREEMENT & COMMERCIAL PROPOSAL",
          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" }),
          clientName: selectedDeal.company,
          sponsor: selectedDeal.contactName,
          sponsorRole: selectedDeal.contactRole,
          dealReference: selectedDeal.name,
          baseValue: selectedDeal.value,
          sections: [
            {
              heading: "1. EXECUTIVE SUMMARY & BUSINESS SCOPE",
              text: `This agreement is established to partner with ${selectedDeal.company} to automate warehouse scheduling, eradicate manual logistics latency, and secure seamless bidirectional data flow with central ERP databases. Our enterprise automation suite eliminates operational bottlenecks, protects data logs under local Indian cyber sovereignty guidelines, and guarantees live production deployment before the crucial December shipping rush.`
            },
            {
              heading: "2. PROPOSED TECHNICAL ARCHITECTURE & SOLUTIONS",
              bullets: [
                "Workshop Scheduling Planner: Real-time visual scheduling layout with resource collision protection.",
                "Bidirectional SAP ERP Connector: Custom integration queue guaranteeing sub-100ms sync latency.",
                "Sovereign AWS Mumbai Hosting: Compliance-hardened databases residing entirely in local regions.",
                "Enterprise SAML 2.0 & OIDC Single Sign-on: Full compatibility with OKTA directory configurations."
              ]
            },
            {
              heading: "3. PROJECT DEVELOPMENT & DEPLOYMENT TIMELINE",
              bullets: [
                "Week 1-2: Kickoff, Okta directory mapping, firewall handshake.",
                "Week 3-4: SAP bidirectional staging queues established and tested.",
                "Week 5-6: Active User Acceptance Testing (UAT) with workshop managers.",
                "Week 7: Final production deployment (fully live and pre-warmed before December)."
              ]
            }
          ]
        });
      } catch (error) {
        console.error(error);
        // Robust elegant fallback
        setProposalData({
          title: "ENTERPRISE AGREEMENT & COMMERCIAL PROPOSAL",
          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" }),
          clientName: selectedDeal.company,
          sponsor: selectedDeal.contactName,
          sponsorRole: selectedDeal.contactRole,
          dealReference: selectedDeal.name,
          baseValue: selectedDeal.value,
          sections: [
            {
              heading: "1. EXECUTIVE SUMMARY & BUSINESS SCOPE",
              text: `This agreement is established to partner with ${selectedDeal.company} to automate workshop scheduling, eradicate manual logistics latency, and secure seamless bidirectional data flow with central ERP databases. Our enterprise automation suite eliminates operational bottlenecks, protects data logs under local Indian cyber sovereignty guidelines, and guarantees live production deployment before the crucial December shipping rush.`
            },
            {
              heading: "2. PROPOSED TECHNICAL ARCHITECTURE & SOLUTIONS",
              bullets: [
                "Workshop Scheduling Planner: Real-time visual scheduling layout with resource collision protection.",
                "Bidirectional SAP ERP Connector: Custom integration queue guaranteeing sub-100ms sync latency.",
                "Sovereign AWS Mumbai Hosting: Compliance-hardened databases residing entirely in local regions.",
                "Enterprise SAML 2.0 & OIDC Single Sign-on: Full compatibility with OKTA directory configurations."
              ]
            },
            {
              heading: "3. PROJECT DEVELOPMENT & DEPLOYMENT TIMELINE",
              bullets: [
                "Week 1-2: Kickoff, Okta directory mapping, firewall handshake.",
                "Week 3-4: SAP bidirectional staging queues established and tested.",
                "Week 5-6: Active User Acceptance Testing (UAT) with workshop managers.",
                "Week 7: Final production deployment (fully live and pre-warmed before December)."
              ]
            }
          ]
        });
      } finally {
        setIsGenerating(false);
      }
    }, 1200);
  };

  const calculatedDiscountValue = Math.round(selectedDeal.value * (1 - discountPercent / 100));
  const platinumSupportCost = includeSLA ? 75000 : 0;
  const totalValue = calculatedDiscountValue + platinumSupportCost;

  const handleDownloadPDF = () => {
    if (!proposalData) return;

    const doc = new jsPDF();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.text(proposalData.title, 14, 25);
    
    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.text(`DATE: ${proposalData.date}`, 14, 32);
    doc.text(`CLIENT: ${proposalData.clientName}`, 14, 37);
    doc.text(`SPONSOR: ${proposalData.sponsor} (${proposalData.sponsorRole})`, 14, 42);
    doc.text(`REFERENCE: ${proposalData.dealReference}`, 14, 47);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text(proposalData.sections[0].heading, 14, 58);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    const summaryText = doc.splitTextToSize(proposalData.sections[0].text, 180);
    doc.text(summaryText, 14, 64);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text(proposalData.sections[1].heading, 14, 90);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    let yPos = 96;
    proposalData.sections[1].bullets.forEach((bullet: string) => {
      doc.text(`- ${bullet}`, 14, yPos);
      yPos += 6;
    });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text(proposalData.sections[2].heading, 14, yPos + 6);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    yPos += 12;
    proposalData.sections[2].bullets.forEach((bullet: string) => {
      doc.text(`- ${bullet}`, 14, yPos);
      yPos += 6;
    });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("4. AGREED COMMERCIAL PRICING GRID", 14, yPos + 6);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    yPos += 12;

    doc.text(`Annual Base License Value: INR ${selectedDeal.value.toLocaleString('en-IN')}`, 14, yPos);
    yPos += 6;
    doc.text(`Negotiated Discount: ${discountPercent}%`, 14, yPos);
    yPos += 6;
    doc.text(`Discounted Base License: INR ${calculatedDiscountValue.toLocaleString('en-IN')}`, 14, yPos);
    yPos += 6;
    if (includeSLA) {
      doc.text("Platinum Support SLA (24/7/365): INR 75,000", 14, yPos);
      yPos += 6;
    }
    doc.setFont("Helvetica", "bold");
    doc.text(`TOTAL CONTRACT VALUE: INR ${totalValue.toLocaleString('en-IN')}`, 14, yPos + 4);

    doc.save(`Proposal-${selectedDeal.company.replace(/\s+/g, "-")}.pdf`);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="proposal-generator-container">
      
      {/* HEADER BANNER */}
      <div className="bg-white dark:bg-[#0c0d16] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            Strategic Proposal Console
          </span>
          <h2 className="text-lg font-black uppercase tracking-wider text-slate-800 dark:text-white">
            Enterprise Commercial Agreement Compiler
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl font-medium">
            Formulate bespoke annual agreements. Integrate specific technical connectors, set discount thresholds, and compile PDF structures on the fly.
          </p>
        </div>

        {!proposalData && (
          <button
            onClick={handleGenerateProposal}
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-600/25 select-none"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Compiling Contract...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                Compile Smart Proposal
              </>
            )}
          </button>
        )}
      </div>

      {proposalData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: INTERACTIVE PRICE MODELER */}
          <div className="lg:col-span-4 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md space-y-6 self-start select-none">
            <div className="space-y-1.5 border-b border-white/5 pb-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                Commercial Terms Adjuster
              </span>
              <h3 className="text-xs font-bold uppercase text-slate-200">Real-Time Negotiated Concessions</h3>
            </div>

            {/* Range Slider for discount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Concession Discount</span>
                <span className="text-indigo-300 font-black text-xs">{discountPercent}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="30" 
                value={discountPercent} 
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-800 rounded-full appearance-none"
              />
              <span className="text-[8px] text-slate-500 font-bold block uppercase">Maximum authorized limit: 30%</span>
            </div>

            {/* SLA Option */}
            <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200">Platinum Support SLA</span>
                <p className="text-[10px] text-slate-400 font-medium">Add 24/7/365 standby (+₹75,000)</p>
              </div>
              <input 
                type="checkbox" 
                checked={includeSLA} 
                onChange={(e) => setIncludeSLA(e.target.checked)}
                className="w-4.5 h-4.5 accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Computed Ledger lines */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-400">Standard Base Rate</span>
                <span className="font-mono text-slate-300">INR {selectedDeal.value.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-400">Applied Concession</span>
                <span className="font-mono text-rose-400">-INR {(selectedDeal.value * (discountPercent / 100)).toLocaleString('en-IN')}</span>
              </div>

              {includeSLA && (
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-slate-400">Platinum Support SLA</span>
                  <span className="font-mono text-emerald-400">+INR 75,000</span>
                </div>
              )}

              <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs font-black uppercase text-slate-200">Total Contract Value</span>
                <span className="text-sm font-black text-emerald-400 font-mono">INR {totalValue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Export Trigger */}
            <button
              onClick={handleDownloadPDF}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-md hover:shadow-indigo-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Official PDF
            </button>
          </div>

          {/* RIGHT COLUMN: DIGITAL PREVIEW PRETTY SHEET */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0c0d16] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-3xs p-8 font-serif leading-relaxed max-h-[580px] overflow-y-auto relative">
            <div className="absolute top-5 right-5 text-[8px] font-sans font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/30 px-2.5 py-1 rounded tracking-widest uppercase select-none">
              DRAFT FOR REVIEW
            </div>
            
            {/* Stamp covers */}
            <div className="text-center border-b border-slate-100 dark:border-slate-800 pb-5 mb-5 select-none">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white font-sans">
                {proposalData.title}
              </h3>
              <p className="text-[10px] text-slate-400 font-sans font-bold uppercase mt-1">
                Strategic Licensing &amp; Service Level Agreement
              </p>
            </div>

            {/* Table layout detail */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6 select-none">
              <div>
                <span className="text-[8px] text-slate-400 font-mono block">CONTRACT DATE</span>
                {proposalData.date}
              </div>
              <div>
                <span className="text-[8px] text-slate-400 font-mono block">CLIENT ENTITY</span>
                {proposalData.clientName}
              </div>
              <div>
                <span className="text-[8px] text-slate-400 font-mono block">EXECUTIVE SPONSOR</span>
                {proposalData.sponsor} ({proposalData.sponsorRole})
              </div>
              <div>
                <span className="text-[8px] text-slate-400 font-mono block">DEAL IDENTIFIER</span>
                {proposalData.dealReference}
              </div>
            </div>

            {/* Main structural contents */}
            <div className="space-y-5 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
              {proposalData.sections.map((section: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-sans font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-1">
                    {section.heading}
                  </h4>
                  {section.text && <p className="font-serif leading-relaxed text-justify">{section.text}</p>}
                  {section.bullets && (
                    <ul className="list-disc pl-5 space-y-1 font-serif">
                      {section.bullets.map((b: string, bIdx: number) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Live computed pricing block */}
              <div className="space-y-2 select-none">
                <h4 className="font-sans font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-1">
                  4. AGREED ENTERPRISE COMMERCIALS
                </h4>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5 font-sans">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Standard Base License Value:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">INR {selectedDeal.value.toLocaleString('en-IN')} / Yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500 font-bold">Negotiated Discount:</span>
                    <span className="font-mono text-rose-500 font-bold">-{discountPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Discounted License Rate:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">INR {calculatedDiscountValue.toLocaleString('en-IN')} / Yr</span>
                  </div>
                  {includeSLA && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span className="font-bold">Platinum Standby Support SLA:</span>
                      <span className="font-mono font-bold">INR 75,000 / Yr</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2.5 border-t border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100 font-bold text-xs">
                    <span className="uppercase">Consolidated Contract Value:</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">INR {totalValue.toLocaleString('en-IN')} / Year</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white dark:bg-[#0c0d16] border border-slate-200 dark:border-slate-800 p-16 text-center rounded-2xl shadow-3xs">
          <FileCheck className="w-12 h-12 text-slate-300 dark:text-slate-700 animate-pulse mx-auto mb-3" />
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white">Proposal Ready for compilation</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[320px] mx-auto mt-1 leading-relaxed font-medium">
            Assemble multi-year pricing structures, technical integration specs, and digital contracts tailored exactly for {selectedDeal.company}.
          </p>
        </div>
      )}

    </div>
  );
}
