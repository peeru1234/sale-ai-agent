import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Circle, 
  Send, 
  Inbox, 
  Wrench, 
  Copy, 
  Check, 
  Terminal, 
  Code, 
  Activity, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle,
  Server,
  Key,
  ShieldAlert
} from 'lucide-react';

export interface CrmDebugStep {
  id: string;
  name: string;
  description: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  details?: string;
}

export interface CrmSyncDebugTrace {
  timestamp: string;
  endpoint: string;
  method: string;
  requestHeaders: Record<string, string>;
  requestBody: any;
  steps: CrmDebugStep[];
  responseStatus?: number;
  responseStatusText?: string;
  responseHeaders?: Record<string, string>;
  responseBody?: any;
}

interface CrmSyncDebuggerProps {
  trace: CrmSyncDebugTrace | null;
  onRetryFailed?: (failedInsights: string[]) => void;
  onRetryFull?: () => void;
  isCrmSyncing: boolean;
}

export const CrmSyncDebugger: React.FC<CrmSyncDebuggerProps> = ({
  trace,
  onRetryFailed,
  onRetryFull,
  isCrmSyncing
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'request' | 'response' | 'troubleshoot'>('pipeline');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>('payload');

  if (!trace) {
    return (
      <div className="p-8 text-center border border-dashed border-slate-200 rounded bg-slate-50 text-slate-400 font-sans text-xs">
        <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
        No active CRM synchronization telemetry available. Trigger a sync to capture traces.
      </div>
    );
  }

  const handleCopy = (textObj: any, label: string) => {
    const text = typeof textObj === 'string' ? textObj : JSON.stringify(textObj, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getStatusColor = (status: 'success' | 'failed' | 'pending') => {
    switch (status) {
      case 'success': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'failed': return 'text-rose-500 bg-rose-50 border-rose-100';
      case 'pending': return 'text-slate-400 bg-slate-50 border-slate-100 animate-pulse';
    }
  };

  const getStatusIcon = (status: 'success' | 'failed' | 'pending') => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-rose-500" />;
      case 'pending': return <Circle className="w-4 h-4 text-slate-300 animate-spin" />;
    }
  };

  // Determine error category for troubleshooting recommendations
  const isAuthError = trace.responseStatus === 401 || trace.responseStatus === 403 || 
                      JSON.stringify(trace.responseBody).toUpperCase().includes('AUTH') ||
                      JSON.stringify(trace.responseBody).toUpperCase().includes('TOKEN') ||
                      JSON.stringify(trace.responseBody).toUpperCase().includes('CREDENTIALS');

  const isTimeoutError = trace.responseStatus === 504 || trace.responseStatus === 502 ||
                         JSON.stringify(trace.responseBody).toUpperCase().includes('TIMEOUT') ||
                         JSON.stringify(trace.responseBody).toUpperCase().includes('GATEWAY');

  const isValidationError = trace.responseStatus === 400 || 
                           JSON.stringify(trace.responseBody).toUpperCase().includes('VALIDATION') ||
                           JSON.stringify(trace.responseBody).toUpperCase().includes('INVALID');

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs font-sans" id="crm-sync-debugger">
      {/* Header Bar */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-rose-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
            Enterprise CRM Sync Debugger & Telemetry
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] border border-slate-700 uppercase">
            {trace.method}
          </span>
          <span className="truncate max-w-[150px] md:max-w-xs">{trace.endpoint}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-100 border-b border-slate-200 px-2 pt-1.5 flex gap-1">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-t text-[10px] font-semibold transition-colors cursor-pointer ${
            activeTab === 'pipeline' 
              ? 'bg-white text-slate-800 border-t border-x border-slate-200 font-bold' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-3 h-3" />
          Pipeline Steps
        </button>
        <button
          onClick={() => setActiveTab('request')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-t text-[10px] font-semibold transition-colors cursor-pointer ${
            activeTab === 'request' 
              ? 'bg-white text-slate-800 border-t border-x border-slate-200 font-bold' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-3 h-3" />
          Request Payload
        </button>
        <button
          onClick={() => setActiveTab('response')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-t text-[10px] font-semibold transition-colors cursor-pointer ${
            activeTab === 'response' 
              ? 'bg-white text-slate-800 border-t border-x border-slate-200 font-bold' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Inbox className="w-3 h-3" />
          Response Payload
          {trace.responseStatus && (
            <span className={`ml-1 px-1 rounded-sm text-[8px] font-mono font-bold ${
              trace.responseStatus >= 400 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {trace.responseStatus}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('troubleshoot')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-t text-[10px] font-semibold transition-colors cursor-pointer ml-auto ${
            activeTab === 'troubleshoot' 
              ? 'bg-amber-500 text-white border-t border-x border-amber-600 font-bold' 
              : 'text-amber-600 hover:text-amber-800 hover:bg-amber-50/50'
          }`}
        >
          <Wrench className="w-3 h-3" />
          Troubleshooting
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-4 bg-white min-h-[220px] max-h-[350px] overflow-y-auto">
        
        {/* PIPELINE STEPS PANEL */}
        {activeTab === 'pipeline' && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
              Step-by-step transaction log for high-fidelity sync pipeline:
            </p>
            <div className="relative pl-4 border-l-2 border-slate-100 space-y-4">
              {trace.steps.map((step) => {
                const isExpanded = expandedStep === step.id;
                return (
                  <div key={step.id} className="relative group">
                    {/* Step node icon */}
                    <span className="absolute -left-[25px] top-0.5 bg-white p-0.5 rounded-full border border-slate-100">
                      {getStatusIcon(step.status)}
                    </span>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedStep(isExpanded ? null : step.id)}>
                        <h5 className="text-[11px] font-bold text-slate-800 hover:text-slate-900 flex items-center gap-1">
                          {step.name}
                          <span className={`text-[8px] font-mono font-medium px-1 rounded uppercase ${
                            step.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                            step.status === 'failed' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'
                          }`}>
                            {step.status}
                          </span>
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-slate-400">
                            {step.timestamp ? new Date(step.timestamp).toLocaleTimeString() : ''}
                          </span>
                          {isExpanded ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
                        </div>
                      </div>
                      
                      <p className="text-[10px] text-slate-500 font-sans leading-normal">
                        {step.description}
                      </p>

                      {isExpanded && step.details && (
                        <div className="mt-1.5 p-2 bg-slate-50 border border-slate-150 rounded text-[10px] font-mono text-slate-600 leading-normal whitespace-pre-wrap break-words">
                          <span className="font-extrabold uppercase text-[8px] text-slate-400 block mb-0.5">Pipeline Output:</span>
                          {step.details}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REQUEST PAYLOAD PANEL */}
        {activeTab === 'request' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
              <span className="text-[10px] font-mono text-slate-600 font-semibold">
                Endpoint URL: <strong className="text-slate-800">{trace.endpoint}</strong>
              </span>
              <button
                onClick={() => handleCopy(trace.endpoint, 'url')}
                className="text-[9px] text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:bg-slate-100 px-1.5 py-0.5 rounded transition-colors"
              >
                {copiedText === 'url' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedText === 'url' ? 'Copied URL!' : 'Copy URL'}
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Request Headers ({Object.keys(trace.requestHeaders).length})
                </span>
                <button
                  onClick={() => handleCopy(trace.requestHeaders, 'req_headers')}
                  className="text-[9px] text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:bg-slate-100 px-1.5 py-0.5 rounded"
                >
                  {copiedText === 'req_headers' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  Copy Headers
                </button>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-900 font-mono text-[10px] text-slate-300 overflow-x-auto max-h-[120px]">
                {Object.entries(trace.requestHeaders).map(([key, val]) => (
                  <div key={key} className="flex gap-2 py-0.5">
                    <span className="text-purple-400">{key}:</span>
                    <span className="text-amber-200 truncate">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Request Payload Body
                </span>
                <button
                  onClick={() => handleCopy(trace.requestBody, 'req_body')}
                  className="text-[9px] text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:bg-slate-100 px-1.5 py-0.5 rounded"
                >
                  {copiedText === 'req_body' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  Copy Body
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded border border-slate-900 font-mono text-[9px] text-emerald-400 overflow-x-auto max-h-[140px] whitespace-pre">
                {JSON.stringify(trace.requestBody, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* RESPONSE PAYLOAD PANEL */}
        {activeTab === 'response' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded border border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${trace.responseStatus && trace.responseStatus >= 400 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-mono font-semibold">
                  HTTP Status: <strong className={trace.responseStatus && trace.responseStatus >= 400 ? 'text-rose-600' : 'text-emerald-600'}>
                    {trace.responseStatus || 'N/A'} {trace.responseStatusText || ''}
                  </strong>
                </span>
              </div>
              <span className="text-[9px] font-mono bg-slate-200/60 px-1.5 py-0.5 rounded text-slate-600 uppercase">
                Transport: REST/JSON over HTTPS
              </span>
            </div>

            {trace.responseHeaders && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Response Headers ({Object.keys(trace.responseHeaders).length})
                  </span>
                  <button
                    onClick={() => handleCopy(trace.responseHeaders, 'res_headers')}
                    className="text-[9px] text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:bg-slate-100 px-1.5 py-0.5 rounded"
                  >
                    {copiedText === 'res_headers' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    Copy Headers
                  </button>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-900 font-mono text-[10px] text-slate-300 overflow-x-auto max-h-[100px]">
                  {Object.entries(trace.responseHeaders).map(([key, val]) => (
                    <div key={key} className="flex gap-2 py-0.5">
                      <span className="text-teal-400">{key}:</span>
                      <span className="text-amber-100 truncate">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Parsed JSON Response Body
                </span>
                <button
                  onClick={() => handleCopy(trace.responseBody, 'res_body')}
                  className="text-[9px] text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:bg-slate-100 px-1.5 py-0.5 rounded"
                >
                  {copiedText === 'res_body' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  Copy Response
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded border border-slate-900 font-mono text-[9px] text-rose-400 overflow-x-auto max-h-[140px] whitespace-pre">
                {trace.responseBody ? JSON.stringify(trace.responseBody, null, 2) : '// No response body received (TCP pipeline breakdown)'}
              </pre>
            </div>
          </div>
        )}

        {/* TROUBLESHOOTING PANEL */}
        {activeTab === 'troubleshoot' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-900 leading-relaxed flex gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-amber-950 mb-1">
                  Automatic AI Diagnostic Evaluation
                </h4>
                {isAuthError && (
                  <p>
                    The corporate CRM integration platform rejected the request because the authentication bearer token lease has expired or possesses invalid write scopes.
                  </p>
                )}
                {isTimeoutError && (
                  <p>
                    The secure hub gateway did not respond within the allocated 5000ms Service Level Agreement (SLA). The remote integration server is likely experiencing extreme load or high-latency handshakes.
                  </p>
                )}
                {isValidationError && (
                  <p>
                    The payload failed schema verification rules inside the HubSpot/Salesforce parsing layers. Specifically, several curated highlights violated the required structure boundaries or contain invalid characters.
                  </p>
                )}
                {!isAuthError && !isTimeoutError && !isValidationError && (
                  <p>
                    A critical TCP or TLS connection error occurred between the web client and the enterprise gateway endpoint, resulting in a standard handshake breakdown.
                  </p>
                )}
              </div>
            </div>

            {/* Step-by-Step Remediation Plan */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Actionable Remediation Checklist
              </h5>
              
              <ul className="space-y-2.5 text-[11px] font-sans text-slate-600">
                {isAuthError && (
                  <>
                    <li className="flex gap-2">
                      <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <div>
                        <strong>Renew Security Token Lease:</strong> Run the credential refresh tool in the settings panel or dispatch a renewed authentication token to clear expired leases.
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <div>
                        <strong>Verify Permissions (OAuth Scope):</strong> Confirm your corporate account role has the <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-[10px]">write_deals</code> and <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-[10px]">write_insights</code> policy permissions assigned.
                      </div>
                    </li>
                  </>
                )}

                {isTimeoutError && (
                  <>
                    <li className="flex gap-2">
                      <Server className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <div>
                        <strong>Retry with Curated Subset:</strong> Large payloads with many highlights increase processing times. Use the <strong>"Retry Failed"</strong> pipeline to split and retransmit failed chunks rather than a full sync.
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <div>
                        <strong>CRM Sandbox Status Check:</strong> Ensure outbound security gateways or remote CRM sandboxes are fully operational.
                      </div>
                    </li>
                  </>
                )}

                {isValidationError && (
                  <>
                    <li className="flex gap-2">
                      <Code className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <div>
                        <strong>Sanitize Highlight Strings:</strong> Click on individual failed highlights to verify that they do not contain forbidden symbol maps, excess text blocks (max 500 chars), or unescaped markdown.
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <Server className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <div>
                        <strong>Run Schema Linter:</strong> Verify the local JSON-LD structure conforms exactly to the Salesforce curating hooks before pushing to production.
                      </div>
                    </li>
                  </>
                )}

                {!isAuthError && !isTimeoutError && !isValidationError && (
                  <>
                    <li className="flex gap-2">
                      <Server className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <div>
                        <strong>Check Gateway Routing:</strong> Verify proxy settings are not blocking the REST endpoint.
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <Terminal className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <div>
                        <strong>Inspect Platform Console:</strong> Check browser and Node.js logs for underlying container status signals.
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
