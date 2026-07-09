import React, { useState, useEffect, useRef, Component, ReactNode, ErrorInfo } from "react";
import { motion } from "motion/react";
import {
  Plus,
  Shield,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Send,
  Mail,
  Play,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Check,
  Users,
  ArrowRight,
  Info,
  ChevronRight,
  FileCheck,
  DollarSign,
  Calendar,
  Layers,
  ChevronUp,
  ChevronDown,
  X,
  Volume2,
  VolumeX,
  Pause,
  Square,
  Music,
  Download,
  Search,
  Bell,
  Clock,
  Copy,
  Upload,
  FileAudio,
  Mic,
  Lightbulb,
  Bookmark,
  Star,
  Trash2,
  Database,
  CloudUpload,
  Brain,
  Video,
  FileText,
  Sun,
  Moon
} from "lucide-react";
import { jsPDF } from "jspdf";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  CartesianGrid
} from "recharts";
import { Deal, Meeting, Objection, Requirement, BuyingSignal, NextBestAction, AppNotification, ObjectionStatus } from "./types";
import LandingPage from "./components/LandingPage";
import ExecutiveDashboard from "./components/ExecutiveDashboard";
import MultiAgentHub from "./components/MultiAgentHub";
import CompanyResearch from "./components/CompanyResearch";
import RagDataRoom from "./components/RagDataRoom";
import AudioRecorder from "./components/AudioRecorder";
import VoiceRoomModal from "./components/VoiceRoomModal";
import SalesPracticeSimulator from "./components/SalesPracticeSimulator";
import CustomerDigitalTwin from "./components/CustomerDigitalTwin";
import MeetingCopilot from "./components/MeetingCopilot";
import ProposalGenerator from "./components/ProposalGenerator";
import ExecutiveBriefing from "./components/ExecutiveBriefing";
import FloatingAssistant from "./components/FloatingAssistant";
import { CrmSyncDebugger, CrmSyncDebugTrace, CrmDebugStep } from "./components/CrmSyncDebugger";

// High-quality transcript simulation templates to make the hackathon demo spectacular and easy to play with!
const TRANSCRIPT_PRESETS = [
  {
    title: "Meeting 5: SOC 2 Details & AWS Latency",
    transcript: `Customer (Security Lead): We require a formal copy of your SOC 2 Type II report for our compliance record. [emphasis] Also, can you confirm that all design data is hosted on AWS Mumbai region to avoid global latency?
Salesperson: Yes, our platform runs on AWS, and we can configure your tenant specifically in the Mumbai region. I am happy to share our SOC 2 Type II report under NDA.
Customer (Vikram): [excitement] Excellent. Hosting design assets in Mumbai is perfect for our onshore staff. Let's prioritize getting that security report reviewed.`,
    description: "Resolves AWS data residency and initiates SOC 2 documentation sharing."
  },
  {
    title: "Negotiation: Multi-Year Discount & Support SLA",
    transcript: `Customer (Procurement Lead): [hesitation] Your subscription is ₹20 lakhs annually. If we sign a 3-year commitment, can you offer a 15% discount, and does that include 24/7 dedicated support SLA?
Salesperson: Yes, for a 3-year agreement, we can offer a 15% volume discount, bringing the annual cost to ₹17 lakhs. We will also include our Platinum 24/7 Support SLA with a 1-hour response guarantee.
Customer (Vikram): [excitement] That 3-year plan matches our roadmap perfectly. Send over the revised agreement and we will approve it.`,
    description: "Commercial negotiation regarding 3-year commitment and SLA terms."
  },
  {
    title: "Discovery: Phase 2 Logistics Module",
    transcript: `Customer (Pooja Reddy): [hesitation] We eventually want to expand this to our external logistics carriers. Do you have webhooks or APIs so carriers can submit shipping updates directly into our dashboard?
Salesperson: Yes, we provide full API keys and customizable webhooks. Your external carriers can post status changes in JSON format directly.
Customer (Pooja): [excitement] That makes Phase 2 scaling very simple. Let's document this as a core requirement for our post-launch timeline.`,
    description: "Explores carrier integration webhooks for logistical scaling."
  }
];

const getDueDateCountdown = (dueDateStr: string | undefined, completed: boolean | undefined) => {
  if (completed) return null;
  if (!dueDateStr) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(dueDateStr);
  targetDate.setHours(0, 0, 0, 0);
  
  if (isNaN(targetDate.getTime())) return null;
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return {
      text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`,
      severity: 'overdue' as const
    };
  } else if (diffDays === 0) {
    return {
      text: "Due today",
      severity: 'high' as const
    };
  } else if (diffDays === 1) {
    return {
      text: "Due tomorrow",
      severity: 'high' as const
    };
  } else if (diffDays <= 3) {
    return {
      text: `Due in ${diffDays} days`,
      severity: 'medium' as const
    };
  } else {
    return {
      text: `Due in ${diffDays} days`,
      severity: 'low' as const
    };
  }
};

class ErrorBoundary extends React.Component<any, any> {
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    const errorStr = String(error?.message || error || "").toLowerCase();
    const isWebSocketError = errorStr.includes("websocket") || 
      errorStr.includes("hmr") || 
      errorStr.includes("connection closed") ||
      errorStr.includes("closed without opened") ||
      errorStr.includes("socket");

    if (isWebSocketError) {
      // Suppress WebSocket errors silently
      console.warn("ErrorBoundary silently suppressed WebSocket/HMR disconnect error:", error);
    } else {
      console.error("ErrorBoundary caught a generic error:", error, errorInfo);
    }
  }

  render() {
    const self = this as any;
    if (self.state?.hasError) {
      const errorStr = String(self.state.error?.message || self.state.error || "").toLowerCase();
      const isWebSocketError = errorStr.includes("websocket") || 
        errorStr.includes("hmr") || 
        errorStr.includes("connection closed") ||
        errorStr.includes("closed without opened") ||
        errorStr.includes("socket");

      if (isWebSocketError) {
        // Recover instantly and silently for WebSocket issues
        setTimeout(() => {
          self.setState({ hasError: false, error: null });
        }, 50);
        return self.props.children;
      }

      return (
        <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white border border-black/15 p-8 max-w-md shadow-sm rounded">
            <h1 className="text-sm font-bold uppercase tracking-wider text-red-600 mb-2 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Interface Notice
            </h1>
            <p className="text-xs text-black/60 mb-4 font-serif italic">
              A local presentation or connection notice occurred. Your offline account data remains safely loaded.
            </p>
            <button
              onClick={() => {
                self.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="bg-black text-white hover:bg-black/80 px-4 py-1.5 rounded text-xs font-semibold transition-colors"
            >
              Reload Interface
            </button>
          </div>
        </div>
      );
    }

    return self.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  // Main app states
  const [userEmail, setUserEmail] = useState<string>(() => localStorage.getItem("user_email") || "");
  const [mainView, setMainView] = useState<"dashboard" | "deal-intelligence" | "multi-agent" | "competitor-research" | "contract-rag" | "sales-practice" | "digital-twin" | "meeting-copilot" | "proposal-generator" | "executive-briefing">("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string>("");
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isVoiceRoomOpen, setIsVoiceRoomOpen] = useState<boolean>(false);
  
  // CRM Sync States
  const [isCrmSyncing, setIsCrmSyncing] = useState<boolean>(false);
  const [crmSyncSuccessPayload, setCrmSyncSuccessPayload] = useState<any>(null);
  const [showCrmSyncSuccess, setShowCrmSyncSuccess] = useState<boolean>(false);
  const [shouldSimulateCrmError, setShouldSimulateCrmError] = useState<boolean>(false);
  const [simulatedCrmErrorType, setSimulatedCrmErrorType] = useState<'auth' | 'timeout' | 'validation'>('timeout');
  const [crmSyncErrorPayload, setCrmSyncErrorPayload] = useState<any>(null);
  const [showCrmSyncError, setShowCrmSyncError] = useState<boolean>(false);
  const [crmSyncDebugTrace, setCrmSyncDebugTrace] = useState<CrmSyncDebugTrace | null>(null);

  interface CrmToast {
    id: string;
    type: 'error' | 'success' | 'warning' | 'info';
    title: string;
    message: string;
    category: 'authentication' | 'timeout' | 'validation' | 'unknown';
    suggestedAction?: string;
    failedInsightsCount?: number;
  }
  const [crmToasts, setCrmToasts] = useState<CrmToast[]>([]);

  const addCrmToast = (
    type: 'error' | 'success' | 'warning' | 'info',
    title: string,
    message: string,
    category: 'authentication' | 'timeout' | 'validation' | 'unknown',
    suggestedAction?: string,
    failedInsightsCount?: number
  ) => {
    const newToast: CrmToast = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title,
      message,
      category,
      suggestedAction,
      failedInsightsCount
    };
    setCrmToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setCrmToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 8000);
  };

  // UI state
  const [activeTab, setActiveTab] = useState<"summary" | "transcript" | "memory">("summary");
  
  // Manually curated highlights / Key Insights per meeting
  interface CuratedHighlight {
    id: string;
    lineIndex: number;
    text: string;
    speaker: string;
    timestamp: number;
    category?: string;
  }
  
  const [curatedHighlights, setCuratedHighlights] = useState<Record<string, CuratedHighlight[]>>(() => {
    try {
      const stored = localStorage.getItem("curated_highlights_by_meeting");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("curated_highlights_by_meeting", JSON.stringify(curatedHighlights));
  }, [curatedHighlights]);

  const handleToggleHighlight = (meetingId: string, lineIndex: number, text: string, speaker: string, timestamp: number) => {
    setCuratedHighlights(prev => {
      const meetingHighlights = prev[meetingId] || [];
      const exists = meetingHighlights.some(h => h.lineIndex === lineIndex);
      let updated: CuratedHighlight[];
      if (exists) {
        updated = meetingHighlights.filter(h => h.lineIndex !== lineIndex);
      } else {
        const newHighlight: CuratedHighlight = {
          id: `${meetingId}-${lineIndex}-${Date.now()}`,
          lineIndex,
          text,
          speaker,
          timestamp,
          category: "General Insight"
        };
        updated = [...meetingHighlights, newHighlight].sort((a, b) => a.lineIndex - b.lineIndex);
      }
      return {
        ...prev,
        [meetingId]: updated
      };
    });
  };

  const handleUpdateHighlightCategory = (meetingId: string, highlightId: string, category: string) => {
    setCuratedHighlights(prev => {
      const meetingHighlights = prev[meetingId] || [];
      const updated = meetingHighlights.map(h => h.id === highlightId ? { ...h, category } : h);
      return {
        ...prev,
        [meetingId]: updated
      };
    });
  };
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFieldFilter, setSearchFieldFilter] = useState<"all" | "meeting" | "deal" | "manager" | "requirement">("all");
  const [semanticMatches, setSemanticMatches] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [copiedResults, setCopiedResults] = useState<boolean>(false);

  // Audio file upload states for AI transcription
  const [uploadedAudioFile, setUploadedAudioFile] = useState<File | null>(null);
  const [audioMode, setAudioMode] = useState<"upload" | "record">("upload");
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [transcribingStatus, setTranscribingStatus] = useState<string>("");
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  // Native HTML5 audio player controls and states
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [customAudioUrls, setCustomAudioUrls] = useState<Record<string, string>>({});

  const MEETING_TIMESTAMPS: Record<string, number[]> = {
    "meeting-1": [0, 10, 28, 45],
    "meeting-2": [0, 12, 30, 48, 65],
    "meeting-3": [0, 10, 22, 38, 52, 68],
    "delta-meeting-1": [0, 10, 25, 40, 58],
  };

  const getMeetingAudioUrl = (meetingId: string): string => {
    if (customAudioUrls[meetingId]) {
      return customAudioUrls[meetingId];
    }
    if (meetingId === "meeting-1") {
      return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    }
    if (meetingId === "meeting-2") {
      return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";
    }
    if (meetingId === "meeting-3") {
      return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3";
    }
    if (meetingId === "delta-meeting-1") {
      return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
    }
    return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3";
  };

  const getActiveLineIndex = (meetingId: string, currentTime: number, linesCount: number): number => {
    const timestamps = MEETING_TIMESTAMPS[meetingId];
    if (timestamps) {
      let activeIdx = 0;
      for (let i = 0; i < timestamps.length; i++) {
        if (currentTime >= timestamps[i]) {
          activeIdx = i;
        } else {
          break;
        }
      }
      return Math.min(activeIdx, linesCount - 1);
    }
    const index = Math.floor(currentTime / 15);
    return Math.min(index, linesCount - 1);
  };

  const getLineTimestamp = (meetingId: string, lineIndex: number): number => {
    const timestamps = MEETING_TIMESTAMPS[meetingId];
    if (timestamps && timestamps[lineIndex] !== undefined) {
      return timestamps[lineIndex];
    }
    return lineIndex * 15;
  };

  const formatAudioTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds === Infinity) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Audio playback failed:", err);
      });
    }
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setAudioCurrentTime(0);
    setIsPlaying(false);
  };

  const handleSeek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setAudioCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      audioRef.current.muted = false;
    }
  };

  const handleToggleMute = () => {
    if (!audioRef.current) return;
    const nextMute = !isMuted;
    audioRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const handlePlayFromTimestamp = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = seconds;
    setAudioCurrentTime(seconds);
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.warn("Audio playback from timestamp failed:", err);
    });
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setAudioCurrentTime(0);
    }
  }, [selectedMeetingId]);

  // Copy semantic search results format
  const handleCopySearchResults = () => {
    if (semanticMatches.length === 0) return;
    
    const textToCopy = semanticMatches
      .map((match) => {
        const matchedDeal = deals.find(d => d.id === match.dealId);
        if (!matchedDeal) return "";
        const matchedMeeting = match.meetingId 
          ? matchedDeal.meetings.find(m => m.id === match.meetingId)
          : null;
          
        return `Company: ${matchedDeal.company}
Type: ${match.type.toUpperCase()}
Context: ${matchedMeeting ? matchedMeeting.title : "Account Memory"}
Relevance Score: ${match.score}/10
Reason / Snippet: ${match.reason}
--------------------------------------------------`;
      })
      .filter(Boolean)
      .join("\n\n");

    navigator.clipboard.writeText(textToCopy);
    setCopiedResults(true);
    setTimeout(() => setCopiedResults(false), 2000);
  };

  // Recent Searches state management
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("recent_searches");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      try {
        localStorage.setItem("recent_searches", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save recent searches", err);
      }
      return updated;
    });
  };

  const handleSelectRecentSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(true);
  };

  const handleClearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem("recent_searches");
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger Semantic Search RAG backend when query changes (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSemanticMatches([]);
      return;
    }

    setShowSearchResults(true);
    setIsSearching(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery })
        });
        if (res.ok) {
          const data = await res.json();
          setSemanticMatches(data.matches || []);
          addRecentSearch(searchQuery);
        }
      } catch (err) {
        console.error("Semantic search fetch error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // RAG Chat states
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Email Generator states
  const [isGeneratingEmail, setIsGeneratingEmail] = useState<boolean>(false);
  const [generatedEmail, setGeneratedEmail] = useState<string>("");
  const [emailMeetingId, setEmailMeetingId] = useState<string>("");

  // Add Meeting state
  const [isAddingMeeting, setIsAddingMeeting] = useState<boolean>(false);
  const [newMeetingTitle, setNewMeetingTitle] = useState<string>("");
  const [newMeetingTranscript, setNewMeetingTranscript] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("draft_meeting_transcript");
      return saved || "";
    } catch {
      return "";
    }
  });
  const [newMeetingDate, setNewMeetingDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [newMeetingTime, setNewMeetingTime] = useState<string>("10:00");
  const [newMeetingPriority, setNewMeetingPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [enableReminder, setEnableReminder] = useState<boolean>(false);
  const [activeReminder, setActiveReminder] = useState<{ title: string; date: string; time: string } | null>(null);
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([]);
  const [probabilityTrendLimit, setProbabilityTrendLimit] = useState<"5" | "10" | "all">("5");
  const [transcriptSearchQuery, setTranscriptSearchQuery] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("transcript_search_query");
      return saved || "";
    } catch {
      return "";
    }
  });
  const [transcriptSearchCaseSensitive, setTranscriptSearchCaseSensitive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("transcript_search_case_sensitive");
      return saved === "true";
    } catch {
      return false;
    }
  });
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);

  // Create Deal state
  const [isCreatingDeal, setIsCreatingDeal] = useState<boolean>(false);
  const [newDealForm, setNewDealForm] = useState({
    name: "",
    company: "",
    value: "",
    contactName: "",
    contactRole: "",
    summary: ""
  });

  // Action status/recalculate loaders
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Theme & Command Palette States
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("app_dark_mode");
      return saved === null ? true : saved === "true";
    } catch {
      return true;
    }
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [commandPaletteSearch, setCommandPaletteSearch] = useState<string>("");
  const [commandPaletteResponse, setCommandPaletteResponse] = useState<string>("");
  const [isCommandPaletteLoading, setIsCommandPaletteLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem("app_dark_mode", String(isDarkMode));
    } catch (err) {
      console.error(err);
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCommandPaletteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandPaletteSearch.trim()) return;
    setIsCommandPaletteLoading(true);
    setCommandPaletteResponse("");
    
    const q = commandPaletteSearch.toLowerCase();
    setTimeout(() => {
      setIsCommandPaletteLoading(false);
      if (q.includes("vikram") || q.includes("contact")) {
        setCommandPaletteResponse("Executive Intelligence Agent: Vikram is the Security Lead and primary stakeholder. He showed [excitement] regarding local AWS hosting and requested immediate SOC 2 Type II audits.");
      } else if (q.includes("arr") || q.includes("value") || q.includes("revenue") || q.includes("deal")) {
        setCommandPaletteResponse("Forecast Agent: Total active enterprise pipeline size is ₹4,500,000. Under current conditions, Vikram's ABC ERP is modeled at 82% closing probability.");
      } else if (q.includes("risk") || q.includes("objection") || q.includes("compliance") || q.includes("soc")) {
        setCommandPaletteResponse("Compliance Risk Guard: Security audits identified a missing SOC 2 document. Corrective Action: Sync your local PDF contract to index the legal safety nodes.");
      } else if (q.includes("discount") || q.includes("price") || q.includes("negotiate")) {
        setCommandPaletteResponse("Negotiation Coach: Vikram requested 15% discount for 3-year commitments. Retain margins by offering Platinum Support SLAs as custom offsets.");
      } else {
        setCommandPaletteResponse(`Cooperative AI Agent Hub: Analyzing your query "${commandPaletteSearch}". We recommend referencing AWS Mumbai deployment options and volume discount tiers to accelerate closing.`);
      }
    }, 900);
  };

  // Collaborators form state
  const [collabFormName, setCollabFormName] = useState<string>("");
  const [collabFormRole, setCollabFormRole] = useState<string>("");
  const [collabFormEmail, setCollabFormEmail] = useState<string>("");
  const [isAddingCollab, setIsAddingCollab] = useState<boolean>(false);

  // Automated notification states
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem("app_notifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState<boolean>(false);
  const [viewingEmailNotification, setViewingEmailNotification] = useState<AppNotification | null>(null);

  // Update deal memory via server
  const handleUpdateDealMemory = async (updatedMemory: any) => {
    if (!selectedDealId) return;
    try {
      const res = await fetch(`/api/deals/${selectedDealId}/memory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memory: updatedMemory })
      });
      if (res.ok) {
        fetchDeals(selectedDealId, false);
      } else {
        console.error("Server refused to save memory update");
      }
    } catch (err) {
      console.error("Failed to update crm memory", err);
    }
  };

  // Fetch all deals
  const fetchDeals = async (selectId?: string, isManual?: boolean) => {
    if (isManual) {
      setIsRefreshing(true);
    }
    try {
      setErrorMessage("");
      const res = await fetch("/api/deals");
      if (!res.ok) throw new Error("Failed to load deals database.");
      const data: Deal[] = await res.json();
      setDeals(data);
      setLastSyncTime(new Date());
      
      if (data.length > 0) {
        // Decide which deal to select
        const nextId = selectId || selectedDealId || data[0].id;
        setSelectedDealId(nextId);
        
        const currentDeal = data.find(d => d.id === nextId) || data[0];
        // Select meeting
        if (currentDeal.meetings && currentDeal.meetings.length > 0) {
          // If previous meeting selection is valid for this deal, keep it, else select the last one
          const hasSelected = currentDeal.meetings.some(m => m.id === selectedMeetingId);
          if (!hasSelected) {
            setSelectedMeetingId(currentDeal.meetings[currentDeal.meetings.length - 1].id);
          }
        } else {
          setSelectedMeetingId("");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong fetching deals.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    try {
      if (newMeetingTranscript) {
        localStorage.setItem("draft_meeting_transcript", newMeetingTranscript);
      } else {
        localStorage.removeItem("draft_meeting_transcript");
      }
    } catch (err) {
      console.error("Failed to auto-save draft transcript", err);
    }
  }, [newMeetingTranscript]);

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setTranscriptSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    try {
      if (transcriptSearchQuery) {
        localStorage.setItem("transcript_search_query", transcriptSearchQuery);
      } else {
        localStorage.removeItem("transcript_search_query");
      }
    } catch (err) {
      console.error("Failed to save transcript search query", err);
    }
  }, [transcriptSearchQuery]);

  useEffect(() => {
    try {
      localStorage.setItem("transcript_search_case_sensitive", String(transcriptSearchCaseSensitive));
    } catch (err) {
      console.error("Failed to save transcript search case sensitivity option", err);
    }
  }, [transcriptSearchCaseSensitive]);

  useEffect(() => {
    setCurrentMatchIndex(0);
  }, [transcriptSearchQuery, selectedMeetingId, transcriptSearchCaseSensitive]);

  useEffect(() => {
    if (activeTab === "transcript" && selectedMeeting) {
      const { matchingLineIndices } = getTranscriptMatches();
      if (matchingLineIndices && matchingLineIndices.length > 0) {
        const lineIdx = matchingLineIndices[currentMatchIndex];
        if (lineIdx !== undefined) {
          setTimeout(() => {
            const el = document.getElementById(`transcript-line-${lineIdx}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          }, 80);
        }
      }
    }
  }, [currentMatchIndex, activeTab, selectedMeetingId, transcriptSearchQuery, transcriptSearchCaseSensitive]);

  // Scroll chat to bottom when history updates
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // Filter deals by search query (including semantic RAG matches!)
  const filteredDeals = deals.filter(deal => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    
    if (searchFieldFilter === "meeting") {
      const meetingMatch = deal.meetings?.some(m => 
        m.title?.toLowerCase().includes(q) || m.summary?.toLowerCase().includes(q)
      );
      const semanticMeetingMatch = semanticMatches.some(m => 
        m.dealId === deal.id && 
        (m.type === "meeting" || m.meetingId !== null)
      );
      return meetingMatch || semanticMeetingMatch;
    }

    if (searchFieldFilter === "deal") {
      const dealMatch = (
        deal.name?.toLowerCase().includes(q) ||
        deal.company?.toLowerCase().includes(q)
      );
      const semanticDealMatch = semanticMatches.some(m =>
        m.dealId === deal.id &&
        (m.type === "deal" || m.meetingId === null)
      );
      return dealMatch || semanticDealMatch;
    }

    if (searchFieldFilter === "manager") {
      const managerMatch = (
        (deal.collaborators || []).some(c => 
          c.name?.toLowerCase().includes(q) || 
          c.role?.toLowerCase().includes(q) || 
          (c.role?.toLowerCase().includes("manager") && q === "manager")
        ) ||
        deal.contactName?.toLowerCase().includes(q) ||
        deal.contactRole?.toLowerCase().includes(q)
      );
      return managerMatch;
    }

    if (searchFieldFilter === "requirement") {
      const requirementMatch = deal.meetings?.some(m => 
        m.requirements?.some(r => 
          r.name?.toLowerCase().includes(q) || 
          r.description?.toLowerCase().includes(q)
        )
      );
      const semanticReqMatch = semanticMatches.some(m => 
        m.dealId === deal.id && 
        (m.reason?.toLowerCase().includes("requirement") || m.reason?.toLowerCase().includes("req"))
      );
      return requirementMatch || semanticReqMatch;
    }

    // Default "all" field filter
    const clientMatch = (
      deal.company?.toLowerCase().includes(q) ||
      deal.name?.toLowerCase().includes(q) ||
      (deal.contactName && deal.contactName.toLowerCase().includes(q)) ||
      (deal.contactRole && deal.contactRole.toLowerCase().includes(q))
    );

    const semanticMatch = semanticMatches.some(m => m.dealId === deal.id);

    return clientMatch || semanticMatch;
  });

  const getFilteredSemanticMatches = () => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    
    return semanticMatches.filter(match => {
      const matchedDeal = deals.find(d => d.id === match.dealId);
      if (!matchedDeal) return false;

      const matchedMeeting = match.meetingId 
        ? matchedDeal.meetings.find(m => m.id === match.meetingId)
        : null;

      if (searchFieldFilter === "meeting") {
        if (!matchedMeeting) return false;
        return matchedMeeting.title?.toLowerCase().includes(q) || match.reason?.toLowerCase().includes(q);
      }
      
      if (searchFieldFilter === "deal") {
        return matchedDeal.name?.toLowerCase().includes(q) || matchedDeal.company?.toLowerCase().includes(q);
      }

      if (searchFieldFilter === "manager") {
        const managerMatch = (
          (matchedDeal.collaborators || []).some(c => 
            c.name?.toLowerCase().includes(q) || c.role?.toLowerCase().includes(q)
          ) ||
          matchedDeal.contactName?.toLowerCase().includes(q) ||
          matchedDeal.contactRole?.toLowerCase().includes(q)
        );
        return managerMatch;
      }

      if (searchFieldFilter === "requirement") {
        const hasReq = matchedDeal.meetings?.some(m => 
          m.requirements?.some(r => 
            r.name?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q)
          )
        );
        return hasReq || match.reason?.toLowerCase().includes("requirement") || match.reason?.toLowerCase().includes("req");
      }

      return true; // "all"
    });
  };

  // Automatically select the first match if search query changes and current selection is not in the filtered list
  useEffect(() => {
    if (!searchQuery.trim()) return;
    if (filteredDeals.length > 0) {
      const exists = filteredDeals.some(m => m.id === selectedDealId);
      if (!exists) {
        handleSelectDeal(filteredDeals[0].id);
      }
    }
  }, [searchQuery, filteredDeals, selectedDealId]);

  const selectedDeal = deals.find(d => d.id === selectedDealId);
  const selectedMeeting = selectedDeal?.meetings.find(m => m.id === selectedMeetingId);

  // Select deal handler
  const handleSelectDeal = (id: string) => {
    setSelectedDealId(id);
    setChatHistory([]);
    setGeneratedEmail("");
    setEmailMeetingId("");
    setBulkSelectedIds([]);
    
    const deal = deals.find(d => d.id === id);
    if (deal && deal.meetings && deal.meetings.length > 0) {
      setSelectedMeetingId(deal.meetings[deal.meetings.length - 1].id);
    } else {
      setSelectedMeetingId("");
    }
  };

  // Select search match handler (loads matching deal & specific meeting)
  const handleSelectMatch = (dealId: string, meetingId: string | null) => {
    setSelectedDealId(dealId);
    setChatHistory([]);
    setGeneratedEmail("");
    setEmailMeetingId("");
    setBulkSelectedIds([]);

    const deal = deals.find(d => d.id === dealId);
    if (meetingId) {
      setSelectedMeetingId(meetingId);
      setActiveTab("transcript");
    } else if (deal && deal.meetings && deal.meetings.length > 0) {
      setSelectedMeetingId(deal.meetings[deal.meetings.length - 1].id);
      setActiveTab("summary");
    } else {
      setSelectedMeetingId("");
      setActiveTab("summary");
    }
  };

  // Toggle individual selection checkbox for bulk completion
  const handleToggleBulkSelect = (actionId: string) => {
    setBulkSelectedIds((prev) =>
      prev.includes(actionId)
        ? prev.filter((id) => id !== actionId)
        : [...prev, actionId]
    );
  };

  // Bulk complete selected actions
  const handleBulkCompleteActions = async () => {
    if (!selectedDealId || bulkSelectedIds.length === 0) return;
    try {
      const res = await fetch(`/api/deals/${selectedDealId}/actions/bulk-complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionIds: bulkSelectedIds })
      });
      if (res.ok) {
        setBulkSelectedIds([]);
        fetchDeals(selectedDealId);
      }
    } catch (err) {
      console.error("Error bulk completing actions", err);
    }
  };

  // Calculate trend of the 'Deal Close Probability' over the last 5, 10 or all meetings
  const getProbabilityTrendData = () => {
    if (!selectedDeal || !selectedDeal.meetings || selectedDeal.meetings.length === 0) {
      return [];
    }

    // Sort meetings chronologically
    const sortedMeetings = [...selectedDeal.meetings].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Determine slice range based on limit selection
    const limitValue = probabilityTrendLimit === "5" ? 5 : probabilityTrendLimit === "10" ? 10 : sortedMeetings.length;
    const targetMeetings = sortedMeetings.slice(-limitValue);

    // Get the current evaluation probability
    const finalProb = selectedDeal.prediction?.probability ?? 50;

    return targetMeetings.map((m, idx) => {
      const totalCount = targetMeetings.length;
      let calculatedProb = 35; // baseline start

      if (totalCount === 1) {
        calculatedProb = finalProb;
      } else {
        const progressFraction = idx / (totalCount - 1);
        const startProb = Math.max(25, Math.min(finalProb - 20, 45));
        calculatedProb = Math.round(startProb + progressFraction * (finalProb - startProb));
      }

      // Slightly modulate based on meeting sentiment
      if (m.sentiment === "Ready to Buy") {
        calculatedProb = Math.min(calculatedProb + 5, 99);
      } else if (m.sentiment === "Concerned" || m.sentiment === "Frustrated") {
        calculatedProb = Math.max(calculatedProb - 8, 15);
      } else if (m.sentiment === "Positive" || m.sentiment === "Interested") {
        calculatedProb = Math.min(calculatedProb + 3, 95);
      }

      // Ensure the last node reflects the exact current database probability
      if (idx === totalCount - 1) {
        calculatedProb = finalProb;
      }

      // Format simple label for meeting name
      const meetingLabel = m.title.includes(":") 
        ? m.title.split(":")[0] 
        : m.title.length > 15 
          ? m.title.substring(0, 12) + "..." 
          : m.title;

      return {
        name: meetingLabel,
        date: new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        probability: calculatedProb,
        sentiment: m.sentiment,
        fullTitle: m.title
      };
    });
  };

  // Update deal helper (PUT)
  const handleUpdateDeal = async (updatedDeal: any) => {
    try {
      const res = await fetch(`/api/deals/${updatedDeal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDeal)
      });
      if (res.ok) {
        await fetchDeals(updatedDeal.id);
      } else {
        console.error("Failed to update deal on the backend");
      }
    } catch (err) {
      console.error("Error updating deal", err);
    }
  };

  // Add collaborator
  const handleAddCollaborator = async (name: string, role: string, email: string) => {
    if (!selectedDeal || !name.trim() || !role.trim()) return;
    const newCollab = {
      id: `collab-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      email: email.trim() || undefined
    };
    const updatedDeal = {
      ...selectedDeal,
      collaborators: [...(selectedDeal.collaborators || []), newCollab]
    };
    await handleUpdateDeal(updatedDeal);
  };

  // Remove collaborator
  const handleRemoveCollaborator = async (collabId: string) => {
    if (!selectedDeal) return;
    const updatedDeal = {
      ...selectedDeal,
      collaborators: (selectedDeal.collaborators || []).filter(c => c.id !== collabId),
      meetings: selectedDeal.meetings.map(m => ({
        ...m,
        objections: m.objections.map(o => ({
          ...o,
          taggedCollaboratorIds: (o.taggedCollaboratorIds || []).filter(id => id !== collabId)
        })),
        requirements: m.requirements.map(r => ({
          ...r,
          taggedCollaboratorIds: (r.taggedCollaboratorIds || []).filter(id => id !== collabId)
        }))
      }))
    };
    await handleUpdateDeal(updatedDeal);
  };

  // Toggle Tagged Collaborator on Objection/Requirement
  const handleToggleTagCollaborator = async (collabId: string, type: "objection" | "requirement", itemId: string) => {
    if (!selectedDeal) return;
    const updatedMeetings = selectedDeal.meetings.map(m => {
      if (type === "objection") {
        return {
          ...m,
          objections: m.objections.map(o => {
            if (o.id === itemId) {
              const tags = o.taggedCollaboratorIds || [];
              const exists = tags.includes(collabId);
              return {
                ...o,
                taggedCollaboratorIds: exists ? tags.filter(id => id !== collabId) : [...tags, collabId]
              };
            }
            return o;
          })
        };
      } else {
        return {
          ...m,
          requirements: m.requirements.map(r => {
            if (r.id === itemId) {
              const tags = r.taggedCollaboratorIds || [];
              const exists = tags.includes(collabId);
              return {
                ...r,
                taggedCollaboratorIds: exists ? tags.filter(id => id !== collabId) : [...tags, collabId]
              };
            }
            return r;
          })
        };
      }
    });
    const updatedDeal = {
      ...selectedDeal,
      meetings: updatedMeetings
    };
    await handleUpdateDeal(updatedDeal);
  };

  // Trigger internal alerts & simulated email notifications
  const triggerNotifications = (
    collaboratorIds: string[],
    itemType: 'objection' | 'requirement',
    itemName: string,
    oldStatus: string,
    newStatus: string
  ) => {
    if (!selectedDeal) return;
    
    const newNotifications: AppNotification[] = [];
    
    collaboratorIds.forEach(cid => {
      const collab = (selectedDeal.collaborators || []).find(c => c.id === cid);
      if (!collab) return;
      
      const timestamp = new Date().toISOString();
      const typeLabel = itemType === 'objection' ? 'Objection' : 'Technical Requirement';
      const notificationIdBase = `${itemType}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // 1. Internal Alert Notification
      const internalAlert: AppNotification = {
        id: `alert-${notificationIdBase}`,
        type: 'alert',
        recipientName: collab.name,
        recipientEmail: collab.email,
        dealName: selectedDeal.name,
        itemName,
        itemType,
        oldStatus,
        newStatus,
        timestamp,
        read: false,
        body: `Internal Alert triggered for ${collab.name} (${collab.role}). Status of ${typeLabel} "${itemName}" transitioned from "${oldStatus}" to "${newStatus}" on Deal "${selectedDeal.name}".`
      };
      
      // 2. Simulated Email Notification
      const emailSubject = `[ALERT] Deal Tracking Status Changed: ${selectedDeal.company} - ${typeLabel}`;
      const emailBody = `Dear ${collab.name},

You are receiving this automated workspace alert because you are tagged as a key collaborator on the "${selectedDeal.name}" account representing ${selectedDeal.company}.

An active item relevant to your department or specialization has transitioned states:

• Category/Type: ${typeLabel}
• Title/Description: "${itemName}"
• State Change: [ ${oldStatus} ] ➔ [ ${newStatus} ]
• Updated At: ${new Date().toLocaleString()}

Please coordinate with the sales representatives and review any customer friction logs or solution architecture matrices in the CRM workspace.

Regards,
Sales Enablement Bot // Deal Intelligence CRM`;

      const simulatedEmail: AppNotification = {
        id: `email-${notificationIdBase}`,
        type: 'email',
        recipientName: collab.name,
        recipientEmail: collab.email || `${collab.name.toLowerCase().replace(/\s+/g, "")}@company.com`,
        dealName: selectedDeal.name,
        itemName,
        itemType,
        oldStatus,
        newStatus,
        timestamp,
        subject: emailSubject,
        body: emailBody,
        read: false
      };
      
      newNotifications.push(internalAlert, simulatedEmail);
    });
    
    setNotifications(prev => {
      const updated = [...newNotifications, ...prev];
      try {
        localStorage.setItem("app_notifications", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to persist notification in localStorage:", err);
      }
      return updated;
    });
  };

  // Synchronize manually curated insights with corporate CRM
  const handleSyncWithCrm = async (forceSimulate?: boolean, retryInsights?: string[]) => {
    if (!selectedDeal || !selectedMeeting) return;
    
    setIsCrmSyncing(true);
    // Clear any previous state
    setCrmSyncErrorPayload(null);
    setShowCrmSyncError(false);
    
    // Initialize standard request & telemetry pipeline steps
    const highlights = curatedHighlights[selectedMeeting.id] || [];
    const insightTexts = retryInsights || highlights.map(h => `${h.speaker}: "${h.text}"`);
    const isErrorSimulated = forceSimulate !== undefined ? forceSimulate : shouldSimulateCrmError;
    const endpointUrl = `/api/deals/${selectedDeal.id}/meetings/${selectedMeeting.id}/sync-crm`;
    const requestBodyObj = { 
      curatedInsights: insightTexts,
      simulateError: isErrorSimulated,
      simulateErrorType: simulatedCrmErrorType
    };

    const initialSteps: CrmDebugStep[] = [
      {
        id: 'payload',
        name: 'Payload Curating & Serialization',
        description: 'Compile and serialize curated meeting insights into secure CRM transaction payload.',
        status: 'success',
        timestamp: new Date().toISOString(),
        details: `Successfully packaged ${insightTexts.length} curated highlights into CRM-LD nested schemas.\nTarget Deal ID: ${selectedDeal.id}\nTarget Meeting ID: ${selectedMeeting.id}\nMode: ${retryInsights ? 'PARTIAL_RETRY' : 'FULL_TRANSMISSION'}`
      },
      {
        id: 'auth',
        name: 'Gateway Authorization Exchange',
        description: 'Verify OAuth lease authentication token with remote HubSpot/Salesforce proxy.',
        status: 'pending',
        timestamp: new Date().toISOString()
      },
      {
        id: 'dispatch',
        name: 'Secure Handshake & Transmission',
        description: 'Establish SSL/TLS tunnel with enterprise route and transmit JSON payload bytes.',
        status: 'pending',
        timestamp: new Date().toISOString()
      },
      {
        id: 'validation',
        name: 'Enterprise CRM Schema Validation',
        description: 'CRM parses received entities, executes deduplication hooks, and checks length bounds.',
        status: 'pending',
        timestamp: new Date().toISOString()
      }
    ];

    const debugTrace: CrmSyncDebugTrace = {
      timestamp: new Date().toISOString(),
      endpoint: endpointUrl,
      method: 'POST',
      requestHeaders: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer crm_live_tok_9f3a8b27c11d4e56920f01229a4fbcde37ae5',
        'X-Correlation-ID': `corr-${Math.random().toString(36).substring(2, 11)}-${Date.now()}`,
        'X-Enterprise-Client-ID': 'deal-intelligence-agent-v1.4',
        'Accept': 'application/json'
      },
      requestBody: requestBodyObj,
      steps: initialSteps
    };

    try {
      const res = await fetch(endpointUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBodyObj)
      });
      
      if (res.ok) {
        let data: any;
        try {
          data = await res.json();
        } catch {
          data = { message: retryInsights ? 'Successfully synchronized remaining failed insights with corporate CRM.' : 'Successfully synchronized insights with corporate CRM.' };
        }
        setCrmSyncSuccessPayload(data);
        setShowCrmSyncSuccess(true);
        setShowCrmSyncError(false); // Dismiss error modal if we just succeeded from a retry
        const toastTitle = retryInsights ? 'CRM Sync Retry Complete' : 'CRM Sync Complete';
        const toastMsg = data.message || (retryInsights ? 'Successfully synchronized remaining failed insights with corporate CRM.' : 'Successfully synchronized insights with corporate CRM.');
        addCrmToast('success', toastTitle, toastMsg, 'unknown');
        
        // Finalize success telemetry steps
        debugTrace.steps = debugTrace.steps.map(step => {
          if (step.id === 'auth') {
            return {
              ...step,
              status: 'success',
              timestamp: new Date().toISOString(),
              details: 'Token handshake successful. Valid OAuth lease session resolved for scope: write_deals, write_insights.'
            };
          }
          if (step.id === 'dispatch') {
            return {
              ...step,
              status: 'success',
              timestamp: new Date().toISOString(),
              details: `Transmission complete. HTTP ${res.status} OK received. Payload size: ${JSON.stringify(requestBodyObj).length} bytes over HTTPS.`
            };
          }
          if (step.id === 'validation') {
            return {
              ...step,
              status: 'success',
              timestamp: new Date().toISOString(),
              details: 'All insights successfully passed CRM schema constraints and data policies. (0 rejections).'
            };
          }
          return step;
        });
        debugTrace.responseStatus = res.status;
        debugTrace.responseStatusText = 'OK';
        debugTrace.responseHeaders = {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Enterprise-RateLimit-Limit': '1000',
          'X-Enterprise-RateLimit-Remaining': '994',
          'X-Enterprise-RateLimit-Reset': '3600',
          'X-Correlation-ID': debugTrace.requestHeaders['X-Correlation-ID']
        };
        debugTrace.responseBody = data;
        setCrmSyncDebugTrace(debugTrace);

        await fetchDeals(selectedDeal.id);
      } else {
        let errData: any;
        try {
          errData = await res.json();
        } catch {
          errData = {
            error: "UNPARSEABLE_RESPONSE",
            message: `The server returned an unparseable response with status code ${res.status}.`,
            suggestedAction: "Check server container logs or retry.",
            failedInsights: retryInsights || []
          };
        }
        setCrmSyncErrorPayload(errData);
        setShowCrmSyncError(true);
        
        // Parse specific error field
        const errorCode = (errData?.error || "").toUpperCase();
        const errorMessage = (errData?.message || "").toUpperCase();
        let category: 'authentication' | 'timeout' | 'validation' | 'unknown' = 'unknown';
        let toastTitle = retryInsights ? "CRM Retry Error" : "CRM Integration Error";
        let userMessage = errData?.message || errData?.error || "An unexpected error occurred during sync.";
        const suggestedAction = errData?.suggestedAction;
        const failedInsightsCount = Array.isArray(errData?.failedInsights) ? errData.failedInsights.length : undefined;

        if (
          res.status === 401 || 
          res.status === 403 || 
          errorCode.includes("AUTH") || 
          errorCode.includes("CREDENTIALS") || 
          errorCode.includes("TOKEN") ||
          errorMessage.includes("AUTHENTICATION") ||
          errorMessage.includes("CREDENTIALS") ||
          errorMessage.includes("LEASE EXPIRATION")
        ) {
          category = 'authentication';
          toastTitle = retryInsights ? "CRM Auth Retry Error" : "CRM Authentication Error";
          userMessage = `Authentication failed: ${errData?.message || "Verify your CRM access token lease."}`;
        } else if (
          res.status === 504 || 
          res.status === 502 ||
          errorCode.includes("TIMEOUT") || 
          errorCode.includes("GATEWAY") || 
          errorCode.includes("CONNECT") || 
          errorMessage.includes("TIMEOUT") ||
          errorMessage.includes("HANDSHAKE")
        ) {
          category = 'timeout';
          toastTitle = retryInsights ? "CRM Timeout Retry Error" : "CRM Network Timeout";
          userMessage = `Connection timed out: ${errData?.message || "Verify your secure HubSpot/Salesforce gateway endpoint."}`;
        } else if (
          res.status === 400 || 
          res.status === 404 || 
          errorCode.includes("VALIDATION") || 
          errorCode.includes("NOT_FOUND") || 
          errorCode.includes("INVALID") ||
          errorMessage.includes("VALIDATION") ||
          errorMessage.includes("NOT FOUND") ||
          errorMessage.includes("INVALID")
        ) {
          category = 'validation';
          toastTitle = retryInsights ? "CRM Validation Retry Error" : "CRM Validation Failure";
          userMessage = `Validation failed: ${errData?.message || "Verify payload formatting before syncing."}`;
        }

        // Finalize failed telemetry steps based on error category
        debugTrace.responseStatus = res.status;
        debugTrace.responseStatusText = res.status === 401 || res.status === 403 ? 'Unauthorized' : 
                                       res.status === 504 || res.status === 502 ? 'Gateway Timeout' : 
                                       res.status === 400 ? 'Bad Request' : 'Error';
        debugTrace.responseHeaders = {
          'Content-Type': 'application/json',
          'X-Enterprise-RateLimit-Limit': '1000',
          'X-Enterprise-RateLimit-Remaining': '984',
          'X-Enterprise-RateLimit-Reset': '3600',
          'X-Correlation-ID': debugTrace.requestHeaders['X-Correlation-ID']
        };
        debugTrace.responseBody = errData;

        if (category === 'authentication') {
          debugTrace.steps = debugTrace.steps.map(step => {
            if (step.id === 'auth') {
              return { 
                ...step, 
                status: 'failed', 
                timestamp: new Date().toISOString(), 
                details: `CRM Gateway rejected lease token. Code: ${errorCode || 'UNAUTHORIZED_LEASE'}.\nDetails: ${errData.message || 'The authorization lease for this client has expired. Re-authentication required.'}` 
              };
            }
            if (step.id === 'dispatch' || step.id === 'validation') {
              return { ...step, status: 'pending', details: 'Aborted. Downstream authorization check failed.' };
            }
            return step;
          });
        } else if (category === 'timeout') {
          debugTrace.steps = debugTrace.steps.map(step => {
            if (step.id === 'auth') {
              return { ...step, status: 'success', timestamp: new Date().toISOString(), details: 'Token validated successfully.' };
            }
            if (step.id === 'dispatch') {
              return { 
                ...step, 
                status: 'failed', 
                timestamp: new Date().toISOString(), 
                details: `Secure HTTP delivery broke down.\nError: ${errorCode || 'GATEWAY_TIMEOUT'}\nReason: Remote secure port failed to acknowledge payload frames within 5000ms SLA threshold.` 
              };
            }
            if (step.id === 'validation') {
              return { ...step, status: 'pending', details: 'Aborted. Transmission packets never fully delivered.' };
            }
            return step;
          });
        } else if (category === 'validation') {
          debugTrace.steps = debugTrace.steps.map(step => {
            if (step.id === 'auth') {
              return { ...step, status: 'success', timestamp: new Date().toISOString(), details: 'Token validated successfully.' };
            }
            if (step.id === 'dispatch') {
              return { ...step, status: 'success', timestamp: new Date().toISOString(), details: `HTTP payload dispatched successfully. Status: ${res.status}.` };
            }
            if (step.id === 'validation') {
              return { 
                ...step, 
                status: 'failed', 
                timestamp: new Date().toISOString(), 
                details: `Schema Validation Error.\nFailed items count: ${failedInsightsCount || 0}.\nError Message: ${errData.message || 'Payload failed enterprise regex boundaries.'}` 
              };
            }
            return step;
          });
        } else {
          debugTrace.steps = debugTrace.steps.map(step => {
            if (step.id === 'auth') return { ...step, status: 'success' };
            if (step.id === 'dispatch') return { ...step, status: 'success' };
            if (step.id === 'validation') return { ...step, status: 'failed', details: errData.message };
            return step;
          });
        }

        setCrmSyncDebugTrace(debugTrace);
        addCrmToast('error', toastTitle, userMessage, category, suggestedAction, failedInsightsCount);
        console.error("Failed to sync insights with CRM", errData);
      }
    } catch (err: any) {
      const fallbackError = {
        success: false,
        error: "NETWORK_CONNECTION_FAILURE",
        message: err?.message || "Failed to establish a secure handshake with the CRM synchronization route.",
        failedInsights: retryInsights || (curatedHighlights[selectedMeeting.id] || []).slice(0, 2).map(h => `${h.speaker}: "${h.text}"`),
        suggestedAction: "Please check your connectivity to the enterprise gateway and try again."
      };
      
      // Update trace for severe network connection crash
      debugTrace.responseStatus = 0;
      debugTrace.responseStatusText = 'Connection Error';
      debugTrace.responseBody = fallbackError;
      debugTrace.steps = debugTrace.steps.map(step => {
        if (step.id === 'auth') {
          return { ...step, status: 'success', details: 'Local credentials precheck passed.' };
        }
        if (step.id === 'dispatch') {
          return { 
            ...step, 
            status: 'failed', 
            timestamp: new Date().toISOString(), 
            details: `Severe Socket Exception: ${err?.message || 'ENOTFOUND'}.\nFailed to complete TCP/IP socket connection. Client offline or server route blocked.` 
          };
        }
        if (step.id === 'validation') {
          return { ...step, status: 'pending', details: 'Aborted due to client handshake breakdown.' };
        }
        return step;
      });
      setCrmSyncDebugTrace(debugTrace);

      setCrmSyncErrorPayload(fallbackError);
      setShowCrmSyncError(true);
      addCrmToast(
        'error', 
        retryInsights ? 'CRM Sync Retry Network Error' : 'Network Connection Error', 
        fallbackError.message, 
        'timeout', 
        fallbackError.suggestedAction, 
        fallbackError.failedInsights.length
      );
      console.error("Error syncing with CRM", err);
    } finally {
      setIsCrmSyncing(false);
    }
  };

  // Update Objection Status & trigger notification if tagged
  const handleUpdateObjectionStatus = async (meetingId: string, objectionId: string, newStatus: ObjectionStatus) => {
    if (!selectedDeal) return;
    
    let oldStatus = "";
    let objectionDesc = "";
    let taggedIds: string[] = [];
    
    const updatedMeetings = selectedDeal.meetings.map(m => {
      if (m.id === meetingId) {
        return {
          ...m,
          objections: m.objections.map(o => {
            if (o.id === objectionId) {
              oldStatus = o.status;
              objectionDesc = o.description;
              taggedIds = o.taggedCollaboratorIds || [];
              return { ...o, status: newStatus };
            }
            return o;
          })
        };
      }
      return m;
    });
    
    const updatedDeal = {
      ...selectedDeal,
      meetings: updatedMeetings
    };
    
    await handleUpdateDeal(updatedDeal);
    
    if (oldStatus && oldStatus !== newStatus && taggedIds.length > 0) {
      triggerNotifications(taggedIds, "objection", objectionDesc, oldStatus, newStatus);
    }
  };

  // Update Requirement Status & trigger notification if tagged
  const handleUpdateRequirementStatus = async (meetingId: string, requirementId: string, newStatus: 'Required' | 'In Discussion' | 'Agreed' | 'Delivered') => {
    if (!selectedDeal) return;
    
    let oldStatus = "";
    let reqName = "";
    let taggedIds: string[] = [];
    
    const updatedMeetings = selectedDeal.meetings.map(m => {
      if (m.id === meetingId) {
        return {
          ...m,
          requirements: m.requirements.map(r => {
            if (r.id === requirementId) {
              oldStatus = r.status;
              reqName = r.name;
              taggedIds = r.taggedCollaboratorIds || [];
              return { ...r, status: newStatus };
            }
            return r;
          })
        };
      }
      return m;
    });
    
    const updatedDeal = {
      ...selectedDeal,
      meetings: updatedMeetings
    };
    
    await handleUpdateDeal(updatedDeal);
    
    if (oldStatus && oldStatus !== newStatus && taggedIds.length > 0) {
      triggerNotifications(taggedIds, "requirement", reqName, oldStatus, newStatus);
    }
  };

  // Toggle Action Complete
  const handleToggleAction = async (actionId: string) => {
    if (!selectedDealId) return;
    try {
      const res = await fetch(`/api/deals/${selectedDealId}/actions/${actionId}/toggle`, {
        method: "POST"
      });
      if (res.ok) {
        // Refresh local data state
        fetchDeals(selectedDealId);
      }
    } catch (err) {
      console.error("Error toggling action status", err);
    }
  };

  // Update Next Best Action Status
  const handleUpdateActionStatus = async (actionId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    if (!selectedDeal) return;
    
    const isCompleted = newStatus === 'Completed';
    
    // Update nextActions in selectedDeal
    const updatedNextActions = (selectedDeal.nextActions || []).map(a => {
      if (a.id === actionId) {
        return { ...a, status: newStatus, completed: isCompleted };
      }
      return a;
    });

    // Also update inside meetings to keep fully synced
    const updatedMeetings = (selectedDeal.meetings || []).map(m => ({
      ...m,
      nextBestActions: (m.nextBestActions || []).map(a => {
        if (a.id === actionId) {
          return { ...a, status: newStatus, completed: isCompleted };
        }
        return a;
      })
    }));

    const updatedDeal = {
      ...selectedDeal,
      nextActions: updatedNextActions,
      meetings: updatedMeetings
    };

    await handleUpdateDeal(updatedDeal);
  };

  // Update Next Best Action Due Date
  const handleUpdateActionDueDate = async (actionId: string, newDueDate: string) => {
    if (!selectedDeal) return;
    
    // Update nextActions in selectedDeal
    const updatedNextActions = (selectedDeal.nextActions || []).map(a => {
      if (a.id === actionId) {
        return { ...a, dueDate: newDueDate };
      }
      return a;
    });

    // Also update inside meetings to keep fully synced
    const updatedMeetings = (selectedDeal.meetings || []).map(m => ({
      ...m,
      nextBestActions: (m.nextBestActions || []).map(a => {
        if (a.id === actionId) {
          return { ...a, dueDate: newDueDate };
        }
        return a;
      })
    }));

    const updatedDeal = {
      ...selectedDeal,
      nextActions: updatedNextActions,
      meetings: updatedMeetings
    };

    await handleUpdateDeal(updatedDeal);
  };

  // Recalculate prediction
  const handleRecalculatePrediction = async () => {
    if (!selectedDealId) return;
    setIsPredicting(true);
    try {
      const res = await fetch(`/api/deals/${selectedDealId}/predict`, {
        method: "POST"
      });
      if (res.ok) {
        fetchDeals(selectedDealId);
      }
    } catch (err) {
      console.error("Error updating prediction", err);
    } finally {
      setIsPredicting(false);
    }
  };

  // Submit chat RAG
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim() || !selectedDealId) return;

    const userMsg = chatMessage.trim();
    setChatMessage("");
    setChatHistory(prev => [...prev, { role: "user", text: userMsg }]);
    setIsChatLoading(true);

    try {
      const res = await fetch(`/api/deals/${selectedDealId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      setChatHistory(prev => [...prev, { role: "assistant", text: data.answer }]);
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        { role: "assistant", text: "I ran into an issue connecting with my long-term memory engine. Please verify the environment credentials." }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Prepopulate chip queries
  const handlePresetQuery = (query: string) => {
    setChatMessage(query);
  };

  // Create Email Followup
  const handleGenerateEmail = async (meetingId: string) => {
    if (!selectedDealId) return;
    setIsGeneratingEmail(true);
    setEmailMeetingId(meetingId);
    setGeneratedEmail("");
    try {
      const res = await fetch(`/api/deals/${selectedDealId}/generate-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setGeneratedEmail(data.email);
    } catch (err) {
      setGeneratedEmail("Failed to draft follow-up email. Please check internet connection.");
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  // Generate and Download PDF Meeting Summary report
  const handleDownloadPDF = () => {
    if (!selectedDeal || !selectedMeeting) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    let y = 20;

    // Helper to draw small page headers and lines on overflow pages
    const drawHeaderDecorations = () => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("GROUNDED CRM • MEETING INTELLIGENCE REPORT", margin, margin - 10);
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(margin, margin - 8, pageWidth - margin, margin - 8);
    };

    // Helper to add page breaks automatically
    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
        drawHeaderDecorations();
      }
    };

    const addSectionHeader = (title: string) => {
      checkPageBreak(18);
      y += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(26, 26, 26);
      doc.text(title.toUpperCase(), margin, y);
      
      y += 2.5;
      doc.setDrawColor(229, 229, 229);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
    };

    const addParagraph = (text: string, isItalic = false) => {
      doc.setFont("helvetica", isItalic ? "italic" : "normal");
      doc.setFontSize(10);
      doc.setTextColor(51, 51, 51);
      
      const lines = doc.splitTextToSize(text, contentWidth);
      const lineHeight = 6;
      const totalHeight = lines.length * lineHeight;
      
      checkPageBreak(totalHeight + 2);
      
      lines.forEach((line: string) => {
        doc.text(line, margin, y);
        y += lineHeight;
      });
      y += 3;
    };

    // Render Main Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(26, 26, 26);
    doc.text("Meeting Summary & Analysis", margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated on ${new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, y);
    y += 8;

    // Meta block
    const metaHeight = 35;
    checkPageBreak(metaHeight);
    doc.setDrawColor(229, 229, 229);
    doc.setFillColor(251, 251, 250);
    doc.rect(margin, y, contentWidth, metaHeight, "FD");

    // Company/Account column
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("ACCOUNT / CLIENT DETAILS", margin + 6, y + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(26, 26, 26);
    doc.text(selectedDeal.company || "N/A", margin + 6, y + 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(80, 80, 80);
    doc.text(`${selectedDeal.contactName || "Contact Name"} — ${selectedDeal.contactRole || "Contact Role"}`, margin + 6, y + 19);

    // Meeting Metadata column
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("MEETING METADATA", margin + 90, y + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(26, 26, 26);
    doc.text(selectedMeeting.title || "Meeting Notes", margin + 90, y + 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const dateStr = new Date(selectedMeeting.date).toLocaleDateString("en-US", {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
    doc.text(`Date: ${dateStr}   |   Sentiment: ${selectedMeeting.sentiment}`, margin + 90, y + 19);

    const prob = selectedDeal.prediction?.probability ?? 50;
    doc.text(`Deal Value: INR ${(selectedDeal.value / 100000).toFixed(1)} Lakhs   |   Close Prob: ${prob}%`, margin + 90, y + 25);

    y += metaHeight + 8;

    // Summary Card
    addSectionHeader("Meeting Focus & Summary");
    addParagraph(`"${selectedMeeting.summary}"`, true);

    // Vocal Tone Analysis
    if (selectedMeeting.vocalCuesSummary) {
      addSectionHeader("Vocal Cue & Sentiment Signals");
      addParagraph(selectedMeeting.vocalCuesSummary);
    }

    // Objections
    if (selectedMeeting.objections && selectedMeeting.objections.length > 0) {
      addSectionHeader("Tracked Objections");
      selectedMeeting.objections.forEach((o, index) => {
        checkPageBreak(25);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(26, 26, 26);
        doc.text(`${index + 1}. [Category: ${o.category}] — Status: ${o.status}`, margin, y);
        y += 5.5;

        doc.setFont("helvetica", "italic");
        doc.setFontSize(9.5);
        doc.setTextColor(80, 80, 80);
        const descLines = doc.splitTextToSize(`Concern: "${o.description}"`, contentWidth - 6);
        descLines.forEach((line: string) => {
          doc.text(line, margin + 4, y);
          y += 5;
        });

        if (o.notes) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          const notesLines = doc.splitTextToSize(`Resolution Plan: ${o.notes}`, contentWidth - 10);
          notesLines.forEach((line: string) => {
            doc.text(line, margin + 4, y);
            y += 4.5;
          });
        }
        y += 2.5;
      });
    }

    // Requirements Matrix
    if (selectedMeeting.requirements && selectedMeeting.requirements.length > 0) {
      addSectionHeader("Requirements Mapped");
      selectedMeeting.requirements.forEach((r, index) => {
        checkPageBreak(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(26, 26, 26);
        doc.text(`${index + 1}. ${r.name} (${r.priority} Priority)`, margin, y);
        y += 5.5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(80, 80, 80);
        const rLines = doc.splitTextToSize(r.description, contentWidth - 6);
        rLines.forEach((line: string) => {
          doc.text(line, margin + 4, y);
          y += 5;
        });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(110, 110, 110);
        doc.text(`Integration State: ${r.status}`, margin + 4, y);
        y += 6;
      });
    }

    // Buying signals
    if (selectedMeeting.buyingSignals && selectedMeeting.buyingSignals.length > 0) {
      addSectionHeader("Buying Intent Signals");
      selectedMeeting.buyingSignals.forEach((s) => {
        checkPageBreak(18);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(42, 92, 67); // Forest green
        doc.text(`✦ "${s.signalText}"`, margin, y);
        y += 5.5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Context: ${s.context}  |  Confidence Score: ${s.confidence}%`, margin + 4, y);
        y += 6;
      });
    }

    // Long Term Account Memory
    if (selectedDeal.memory) {
      addSectionHeader("Long-Term Account Memory Profile");

      checkPageBreak(15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(26, 26, 26);
      doc.text("Budget Profile:", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(80, 80, 80);
      const budgetLines = doc.splitTextToSize(selectedDeal.memory.budget || "No budget updates yet.", contentWidth);
      budgetLines.forEach((line: string) => {
        doc.text(line, margin, y);
        y += 5;
      });
      y += 2.5;

      checkPageBreak(15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(26, 26, 26);
      doc.text("Implementation Timeline:", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(80, 80, 80);
      const timelineLines = doc.splitTextToSize(selectedDeal.memory.timeline || "No timeline registered.", contentWidth);
      timelineLines.forEach((line: string) => {
        doc.text(line, margin, y);
        y += 5;
      });
      y += 2.5;

      if (selectedDeal.memory.securityConcerns && selectedDeal.memory.securityConcerns.length > 0) {
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(26, 26, 26);
        doc.text("Security Constraints Mapped:", margin, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        selectedDeal.memory.securityConcerns.forEach((sec) => {
          doc.text(`• ${sec}`, margin + 4, y);
          y += 5;
        });
        y += 2.5;
      }

      if (selectedDeal.memory.integrationsRequired && selectedDeal.memory.integrationsRequired.length > 0) {
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(26, 26, 26);
        doc.text("Required Connectors & Integrations:", margin, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        selectedDeal.memory.integrationsRequired.forEach((intg) => {
          doc.text(`• ${intg}`, margin + 4, y);
          y += 5;
        });
        y += 2.5;
      }

      if (selectedDeal.memory.decisionMakers && selectedDeal.memory.decisionMakers.length > 0) {
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(26, 26, 26);
        doc.text("Identified Decision Makers:", margin, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        selectedDeal.memory.decisionMakers.forEach((dm) => {
          doc.text(`• ${dm}`, margin + 4, y);
          y += 5;
        });
        y += 2.5;
      }
    }

    // Footers
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 15, pageHeight - 10);
      doc.text("Grounded Accounts Intelligence Engine • Confidential Client Record", margin, pageHeight - 10);
    }

    // Save and download PDF
    const safeCompany = selectedDeal.company.replace(/[^a-zA-Z0-9]/g, "_");
    const safeMeetingTitle = selectedMeeting.title.replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeCompany}_${safeMeetingTitle}_Summary.pdf`);
  };

  // Helper to schedule browser notifications for the next upcoming meeting
  const handleScheduleNotification = (meetingsList: any[]) => {
    if (!("Notification" in window)) return;

    const now = new Date();
    const futureMeetings = meetingsList
      .map(m => {
        const mTime = m.time || "10:00";
        const mDateTime = new Date(`${m.date}T${mTime}`);
        return { meeting: m, dateTime: mDateTime };
      })
      .filter(item => item.dateTime > now)
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

    if (futureMeetings.length > 0) {
      const nextMeeting = futureMeetings[0];
      
      // Store active reminder in state to display in UI
      setActiveReminder({
        title: nextMeeting.meeting.title || "Untitled Meeting",
        date: nextMeeting.meeting.date,
        time: nextMeeting.meeting.time || "10:00"
      });

      // Show notification if permitted
      if (Notification.permission === "granted") {
        const targetTime = new Date(nextMeeting.dateTime.getTime() - 60 * 60 * 1000);
        const delay = targetTime.getTime() - now.getTime();

        // Show instant confirmation
        new Notification("SyncAI Reminder Active", {
          body: `Reminder set 1 hour before: "${nextMeeting.meeting.title}" on ${nextMeeting.meeting.date} at ${nextMeeting.meeting.time || "10:00"}.`,
        });

        if (delay > 0) {
          setTimeout(() => {
            if (Notification.permission === "granted") {
              new Notification("Upcoming Meeting starting in 1 hour!", {
                body: `"${nextMeeting.meeting.title}" is scheduled to start at ${nextMeeting.meeting.time || "10:00"} today.`,
              });
            }
          }, delay);
        } else {
          // If less than an hour away, notify in a few seconds for immediate interactive feedback
          console.log("Meeting starts in less than an hour. Triggering short-delay alert.");
          setTimeout(() => {
            if (Notification.permission === "granted") {
              new Notification("Upcoming Meeting starting soon!", {
                body: `"${nextMeeting.meeting.title}" starts soon at ${nextMeeting.meeting.time || "10:00"}.`,
              });
            }
          }, 3000);
        }
      }
    } else {
      // No future meetings found in timeline
      alert("Reminder enabled, but no future scheduled meetings were found in the timeline of this deal.");
    }
  };

  const handleToggleReminder = async (checked: boolean) => {
    setEnableReminder(checked);
    if (checked && "Notification" in window) {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    }
  };

  // Drag over handler for audio upload area
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  // Drag leave handler for audio upload area
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  // Drag drop handler for audio upload area
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const isAudio = file.type.startsWith("audio/") || 
                      file.name.endsWith(".mp3") || 
                      file.name.endsWith(".wav") || 
                      file.name.endsWith(".m4a") || 
                      file.name.endsWith(".ogg") || 
                      file.name.endsWith(".aac");
      if (isAudio) {
        setUploadedAudioFile(file);
        setErrorMessage("");
      } else {
        setErrorMessage("Please drop a valid audio file (e.g. .mp3, .wav, .m4a).");
      }
    }
  };

  // Manual file input selection handler
  const handleFileSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedAudioFile(file);
      setErrorMessage("");
    }
  };

  // Close meeting logger drawer and reset audio file states
  const handleCloseAddMeeting = () => {
    setIsAddingMeeting(false);
    setUploadedAudioFile(null);
    setIsDragActive(false);
    setTranscribingStatus("");
    setIsTranscribing(false);
  };

  // Transcribe uploaded audio file using browser File API & simulated AI model
  const handleTranscribeAudioFile = (fileToTranscribe: File) => {
    if (!fileToTranscribe) return;

    setIsTranscribing(true);
    setTranscribingStatus("Initializing Speech Spectrogram model...");

    const reader = new FileReader();
    reader.onload = () => {
      // FileReader simulates loading audio binary stream via File API
      setTimeout(() => {
        setTranscribingStatus("Analyzing acoustic properties and vocal cues...");
        
        setTimeout(() => {
          setTranscribingStatus("Parsing speaker waveforms & separating Rep vs Client...");
          
          setTimeout(() => {
            setTranscribingStatus("Generating diarized meeting transcript...");
            
            setTimeout(() => {
              // Generate realistic transcript context based on the file name!
              const fileNameLower = fileToTranscribe.name.toLowerCase();
              let generatedText = "";

              if (fileNameLower.includes("price") || fileNameLower.includes("budget") || fileNameLower.includes("cost") || fileNameLower.includes("financial") || fileNameLower.includes("discount")) {
                generatedText = `Rep: Thanks for jumping on this pricing sync today. I wanted to align on the commercial proposal we sent over.
Customer (Vikram): Yes, we reviewed the 15 Lakhs quote. [hesitation] It's slightly above what our finance team allocated for middleware this quarter.
Rep: I understand. If we look at a multi-year commitment, we can find some room for a discount or offer a phased implementation timeline.
Customer (Vikram): A phased implementation could work. [emphasis] If we start with 8 Lakhs this quarter, can we defer the remaining scope to next fiscal year?
Rep: That is definitely something we can structure. Let me outline a phased SLA plan and send it over.`;
              } else if (fileNameLower.includes("security") || fileNameLower.includes("compliance") || fileNameLower.includes("iso") || fileNameLower.includes("soc") || fileNameLower.includes("sovereignty")) {
                generatedText = `Rep: Welcome everyone. Today we are joined by our Lead Security Architect to address compliance questions.
Customer (Pooja): Yes, [emphasis] security is our top concern before onboarding any SaaS vendor. Do you have a localized data center in India for compliance with regional residency rules?
Rep: Absolutely. We host our cloud services locally within the AWS Mumbai region, ensuring all transaction logs and account datasets never leave India boundaries.
Customer (Pooja): [excitement] Perfect, that covers data sovereignty. Are you also SOC 2 Type II certified?
Rep: Yes, we are fully SOC 2 Type II certified and we can share our latest report under NDA.
Customer (Pooja): [excited] Excellent. Send that over and we can fast-track the legal review.`;
              } else if (fileNameLower.includes("integration") || fileNameLower.includes("api") || fileNameLower.includes("sap") || fileNameLower.includes("webhook") || fileNameLower.includes("middleware")) {
                generatedText = `Rep: Let's discuss the core system integrations required for the ERP system.
Customer (Vikram): Our central logistics system runs on SAP. [emphasis] We need real-time sync with your API whenever an order status updates.
Rep: We have a native SAP connector that supports bidirectional event-driven synchronization via standard webhooks.
Customer (Vikram): [hesitation] That's perfect. How do you handle transient network failures or database latency during spike periods?
Rep: We implement a robust queueing mechanism with automatic retry policies and exponential backoff to handle spikes seamlessly.
Customer (Vikram): [excitement] Great, that addresses our main architectural blocker.`;
              } else {
                // Generic sales call
                generatedText = `Rep: Hello Vikram, Pooja. Thank you for setting aside some time for our bi-weekly status sync.
Customer (Vikram): Absolutely. We wanted to talk about our progress and verify some timeline requirements. [emphasis] We are aiming for a launch date in mid-October.
Rep: That aligns perfectly with our typical onboarding cycle, which spans 4-6 weeks including sandbox configuration.
Customer (Pooja): [hesitation] We also need to ensure our operations team is fully trained. Is training included in the standard pilot value?
Rep: Yes, we provide 3 dedicated hands-on training workshops for your operations team as part of our standard onboarding program.
Customer (Vikram): [excitement] That sounds very reasonable. Let's schedule the kickoff for next Monday.`;
              }

              setNewMeetingTranscript(generatedText);
              
              // Automatically infer a relevant meeting title based on file name if no title is present
              if (!newMeetingTitle.trim()) {
                const cleanName = fileToTranscribe.name
                  .replace(/\.[^/.]+$/, "") // remove extension
                  .replace(/[-_]/g, " ")     // replace dashes/underscores with spaces
                  .replace(/\b\w/g, c => c.toUpperCase()); // capitalize words
                setNewMeetingTitle(`Audio Sync: ${cleanName}`);
              }

              setIsTranscribing(false);
              setTranscribingStatus("");
            }, 800);
          }, 800);
        }, 800);
      }, 800);
    };

    reader.onerror = () => {
      setErrorMessage("Failed to read audio file via browser File API.");
      setIsTranscribing(false);
      setTranscribingStatus("");
    };

    // Read the file as an array buffer to activate browser File API logic
    reader.readAsArrayBuffer(fileToTranscribe);
  };

  // Upload/Add Meeting
  const handleAddMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDealId || !newMeetingTranscript.trim()) return;

    setErrorMessage("");
    setIsAddingMeeting(false); // Close drawer early to show action state
    setLoading(true);

    try {
      const res = await fetch(`/api/deals/${selectedDealId}/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newMeetingTitle || undefined,
          transcript: newMeetingTranscript,
          date: newMeetingDate || undefined,
          time: newMeetingTime,
          priority: newMeetingPriority
        })
      });

      if (!res.ok) throw new Error("Failed to process transcript via Gemini AI.");
      const data = await res.json();
      
      // Select the newly added meeting
      if (data.meeting && data.meeting.id) {
        setSelectedMeetingId(data.meeting.id);
        if (uploadedAudioFile) {
          const fileUrl = URL.createObjectURL(uploadedAudioFile);
          setCustomAudioUrls(prev => ({
            ...prev,
            [data.meeting.id]: fileUrl
          }));
        }
      }
      
      // Refresh deals
      await fetchDeals(selectedDealId);
      
      // Schedule notification reminder if enabled
      if (enableReminder && data.deal && data.deal.meetings) {
        handleScheduleNotification(data.deal.meetings);
      }

      // Reset form
      setNewMeetingTitle("");
      setNewMeetingTranscript("");
      setNewMeetingDate(new Date().toISOString().split("T")[0]);
      setNewMeetingTime("10:00");
      setNewMeetingPriority("Medium");
      setEnableReminder(false);
      setUploadedAudioFile(null);
      setIsDragActive(false);
      setTranscribingStatus("");
      setIsTranscribing(false);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to parse transcript.");
      setLoading(false);
    }
  };

  // Prepopulate transcript template
  const handleLoadTranscriptPreset = (presetIdx: number) => {
    const preset = TRANSCRIPT_PRESETS[presetIdx];
    setNewMeetingTitle(preset.title);
    setNewMeetingTranscript(preset.transcript);
  };

  // Submit Create Deal
  const handleCreateDealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, company, value, contactName, contactRole, summary } = newDealForm;
    if (!name || !company) return;

    setLoading(true);
    setIsCreatingDeal(false);

    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          value: Number(value) || 0,
          contactName,
          contactRole,
          summary
        })
      });

      if (!res.ok) throw new Error();
      const data: Deal = await res.json();
      
      // Reset form
      setNewDealForm({
        name: "",
        company: "",
        value: "",
        contactName: "",
        contactRole: "",
        summary: ""
      });

      // Select and load the new deal
      await fetchDeals(data.id);
    } catch (err) {
      setErrorMessage("Could not register new sales deal.");
      setLoading(false);
    }
  };

  const highlightKeywords = (text: string) => {
    if (!text) return "";
    const keywords = ["budget", "lakhs", "security", "iso", "compliance", "sap", "docusign", "sign", "middleware"];
    
    // Create a regex from the keywords
    const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
    const parts = text.split(regex);
    
    if (parts.length === 1) {
      return text;
    }
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span key={index} className="font-bold underline decoration-black/20 text-black">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const highlightSearchAndKeywords = (text: string, isLineActive: boolean = false): React.ReactNode => {
    if (!text) return "";
    const query = transcriptSearchQuery.trim() || searchQuery.trim();
    if (!query) {
      return highlightKeywords(text);
    }

    try {
      // Escape special regex characters
      const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const flags = transcriptSearchCaseSensitive ? "g" : "gi";
      const regex = new RegExp(`(${escapedQuery})`, flags);
      const parts = text.split(regex);

      if (parts.length === 1) {
        return highlightKeywords(text);
      }

      return parts.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <span 
              key={index} 
              className={`px-1 py-0.5 rounded font-bold mx-0.5 transition-all duration-300 ${
                isLineActive
                  ? "bg-amber-200 text-amber-950 ring-2 ring-amber-500 underline decoration-amber-950 decoration-2 shadow-xs"
                  : "bg-yellow-100 text-yellow-900 border-b border-yellow-300 shadow-2xs"
              }`}
            >
              {part}
            </span>
          );
        }
        return highlightKeywords(part);
      });
    } catch (e) {
      return highlightKeywords(text);
    }
  };

  const renderTextWithVocalCues = (text: string, isLineActive: boolean = false) => {
    if (!text) return "";
    
    // Split the text to parse bracketed vocal cues
    const regex = /\[(hesitation|emphasis|excitement|laughter|pause|sigh|confident|excited|hesitant|decisive)\]/gi;
    const parts = text.split(regex);
    
    if (parts.length === 1) {
      return highlightSearchAndKeywords(text, isLineActive);
    }
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const cue = part.toLowerCase();
        if (cue === "hesitation" || cue === "hesitant" || cue === "pause" || cue === "sigh") {
          return (
            <span 
              key={index} 
              className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/50 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mx-1 select-none align-middle"
              title="Vocal Cue: Hesitation"
            >
              <Clock className="w-3 h-3 text-amber-600 shrink-0" />
              hesitation
            </span>
          );
        } else if (cue === "emphasis" || cue === "confident" || cue === "decisive") {
          return (
            <span 
              key={index} 
              className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200/50 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mx-1 select-none align-middle"
              title="Vocal Cue: Emphasis"
            >
              <TrendingUp className="w-3 h-3 text-indigo-600 shrink-0" />
              emphasis
            </span>
          );
        } else if (cue === "excitement" || cue === "excited" || cue === "laughter") {
          return (
            <span 
              key={index} 
              className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mx-1 select-none align-middle"
              title="Vocal Cue: Excitement"
            >
              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
              excitement
            </span>
          );
        } else {
          return (
            <span 
              key={index} 
              className="inline-flex items-center gap-1 bg-slate-50 text-slate-800 border border-slate-200/50 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mx-1 select-none align-middle"
            >
              {cue}
            </span>
          );
        }
      }
      return highlightSearchAndKeywords(part, isLineActive);
    });
  };

  const getTranscriptMatches = () => {
    const query = transcriptSearchQuery.trim() || searchQuery.trim();
    if (!query || !selectedMeeting || !selectedMeeting.transcript) {
      return { count: 0, matchingLineIndices: [] as number[], totalLinesCount: 0 };
    }
    
    try {
      const lines = selectedMeeting.transcript.split("\n");
      let count = 0;
      const matchingLineIndices: number[] = [];
      
      const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const flags = transcriptSearchCaseSensitive ? "g" : "gi";
      const regex = new RegExp(escapedQuery, flags);
      
      lines.forEach((line, idx) => {
        const matches = line.match(regex);
        if (matches) {
          count += matches.length;
          matchingLineIndices.push(idx);
        }
      });
      
      return { count, matchingLineIndices, totalLinesCount: lines.length };
    } catch (e) {
      console.error("Error calculating transcript matches", e);
      return { count: 0, matchingLineIndices: [] as number[], totalLinesCount: 0 };
    }
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    alert("Follow-up email copied to clipboard!");
  };

  if (loading && deals.length === 0) {
    return (
      <div className="min-h-screen bg-[#030408] flex flex-col items-center justify-center font-sans relative overflow-hidden">
        {/* Animated ambient backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
        
        <div className="flex flex-col items-center space-y-6 relative z-10 glass-panel p-10 rounded-2xl border border-white/10 max-w-sm text-center shadow-2xl backdrop-blur-xl">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-indigo-500/10 border-t-indigo-400 animate-spin" />
            <Sparkles className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xs font-bold tracking-widest uppercase text-indigo-300">Initializing Neural Memory Engine...</h2>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Querying cooperative CRM nodes &amp; vector embeddings</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userEmail) {
    return (
      <LandingPage
        onLoginSuccess={(email) => {
          setUserEmail(email);
          localStorage.setItem("user_email", email);
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white relative transition-colors duration-300 ${
      isDarkMode ? "bg-[#030408] text-slate-100" : "bg-[#f8fafc] text-slate-900"
    }`}>
      {/* Premium Dynamic Animated Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none opacity-50 z-0" />
      
      {/* Floating Glowing Orbs (Hardware Accelerated Gradient Mesh) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[110px]" 
        />
        <motion.div 
          animate={{
            x: [0, -30, 50, 0],
            y: [0, 40, -30, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[25%] right-[10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[130px]" 
        />
        <motion.div 
          animate={{
            x: [0, 20, -40, 0],
            y: [0, 50, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-10%] left-[10%] w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-[120px]" 
        />
      </div>

      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="bg-red-50 border-b border-red-200 text-red-800 text-xs py-2 px-6 flex justify-between items-center">
          <span className="font-mono flex items-center gap-2">
            <AlertCircle className="w-4  h-4 text-red-600" />
            System Alert: {errorMessage}
          </span>
          <button onClick={() => setErrorMessage("")} className="text-red-500 hover:text-red-800 font-bold">×</button>
        </div>
      )}

      {/* HEADER SECTION (Editorial Typography, Uppercase tracking, Spaced details) */}
      <header className="flex flex-col md:flex-row md:items-baseline justify-between px-6 md:px-12 py-6 md:py-8 border-b border-white/5 gap-4 bg-[#06080f]/80 backdrop-blur-md sticky top-0 z-10 text-white">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight uppercase" id="app-title">
              Deal Intelligence Agent
            </h1>
            <span className="hidden md:inline-flex px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[9px] font-bold tracking-widest uppercase rounded">
              v1.4
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 md:mt-1.5">
            <span className="text-[10px] font-semibold tracking-widest uppercase opacity-60 text-slate-400">
              AI Sales Assistant // Long-Term Memory &amp; RAG System
            </span>
            <span className="text-white/10 text-[10px] hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5" id="crm-sync-status">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRefreshing ? 'bg-amber-400' : 'bg-green-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isRefreshing ? 'bg-amber-500' : 'bg-green-500'}`}></span>
              </span>
              <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400">
                CRM Synced: {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <div className="relative group/tooltip">
                <button
                  onClick={() => fetchDeals(selectedDealId, true)}
                  disabled={isRefreshing}
                  className={`inline-flex items-center justify-center p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-all duration-200 transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${isRefreshing ? 'animate-pulse bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20' : ''}`}
                  title="Sync CRM Deal Data"
                  id="crm-sync-refresh-btn"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-black' : ''}`} />
                </button>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    const formattedTime = lastSyncTime.toISOString();
                    navigator.clipboard.writeText(formattedTime);
                    addCrmToast('success', 'Copied!', `CRM Sync timestamp (${formattedTime}) copied to clipboard.`, 'unknown');
                  }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-950 text-white text-[9px] font-bold uppercase tracking-widest rounded shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto transition-all duration-200 scale-95 group-hover/tooltip:scale-100 origin-bottom z-50 border border-slate-800 cursor-pointer"
                >
                  <div className="relative">
                    Sync CRM Deal Data (Click to copy timestamp)
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-950 rotate-45 -mt-[4px] border-b border-r border-slate-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Deal Switcher & Quick Create */}
        <div className="flex flex-wrap items-baseline gap-4 md:gap-8">
          {/* Global Search & Scope Filters */}
          <div className="flex flex-wrap items-end gap-2.5">
            <div className="flex flex-col min-w-[200px] md:min-w-[240px]">
              <label className="text-[9px] font-bold uppercase opacity-40 mb-1 tracking-wider text-slate-300">Search Accounts & Contacts</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-40 text-slate-300 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search transcripts, summaries or accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                  className="bg-[#0b0c16]/90 border border-white/10 hover:border-indigo-500/50 text-white rounded-lg pl-8 pr-8 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full transition-colors shadow-inner"
                  id="global-search-bar"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                    title="Clear search"
                    type="button"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* FLOATING SEMANTIC SEARCH RESULTS OVERLAY */}
                {showSearchResults && (searchQuery.trim().length > 0 || recentSearches.length > 0) && (() => {
                  const filteredMatches = getFilteredSemanticMatches();
                  return (
                    <div 
                      className="absolute top-full left-0 right-0 mt-1.5 bg-[#090b14]/95 border border-white/10 shadow-2xl rounded-xl z-50 max-h-[380px] overflow-y-auto p-4 flex flex-col gap-3 min-w-[280px] sm:min-w-[340px] md:min-w-[420px] backdrop-blur-xl"
                      id="semantic-search-dropdown"
                    >
                      {searchQuery.trim().length === 0 ? (
                        // SHOW RECENT SEARCHES PANEL
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between pb-2 border-b border-white/5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              Recent Searches
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={handleClearRecentSearches}
                                className="text-[9px] uppercase font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 px-1.5 py-0.5 rounded transition-colors"
                              >
                                Clear All
                              </button>
                              <button 
                                onClick={() => setShowSearchResults(false)}
                                className="text-[10px] uppercase font-bold text-slate-400 hover:text-white hover:bg-white/5 px-1.5 py-0.5 rounded transition-colors"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1 py-1">
                            {recentSearches.map((query, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleSelectRecentSearch(query)}
                                className="w-full text-left p-2 hover:bg-white/[0.04] rounded transition-colors flex items-center justify-between border border-transparent hover:border-white/5 group animate-none"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <Search className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
                                  <span className="text-xs font-semibold text-slate-300 group-hover:text-white truncate">
                                    {query}
                                  </span>
                                </div>
                                <span className="text-[9px] font-mono opacity-0 group-hover:opacity-60 transition-opacity text-indigo-400">
                                  RE-RUN
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        // ACTIVE SEMANTIC SEARCH MATCHES RENDERING
                        <>
                          <div className="flex items-center justify-between pb-2 border-b border-white/5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                              AI Semantic RAG Matches
                            </span>
                            <div className="flex items-center gap-1.5">
                              {filteredMatches.length > 0 && !isSearching && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopySearchResults();
                                  }}
                                  className={`text-[10px] uppercase font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-all ${
                                    copiedResults 
                                      ? "bg-emerald-500/10 text-emerald-400" 
                                      : "text-emerald-400 hover:bg-emerald-500/10"
                                  }`}
                                  title="Copy matches as formatted text"
                                >
                                  {copiedResults ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span>Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3 text-emerald-400" />
                                      <span>Copy Results</span>
                                    </>
                                  )}
                                </button>
                              )}
                              <button 
                                onClick={() => setShowSearchResults(false)}
                                className="text-[10px] uppercase font-bold text-slate-400 hover:text-white hover:bg-white/5 px-1.5 py-0.5 rounded transition-colors"
                              >
                                Close
                              </button>
                            </div>
                          </div>
        
                          {isSearching ? (
                            <div className="py-8 flex flex-col items-center justify-center gap-2">
                              <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
                              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Querying Account Memory...</span>
                            </div>
                          ) : filteredMatches.length === 0 ? (
                            <div className="py-6 text-center">
                              <p className="text-xs font-serif italic text-slate-400">No deep matches found matching the filter.</p>
                              <p className="text-[9px] font-mono uppercase text-slate-500 mt-1">Try another category or broader query</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {filteredMatches.map((match, i) => {
                                const matchedDeal = deals.find(d => d.id === match.dealId);
                                if (!matchedDeal) return null;
                                
                                const matchedMeeting = match.meetingId 
                                  ? matchedDeal.meetings.find(m => m.id === match.meetingId)
                                  : null;
        
                                return (
                                  <div 
                                    key={i}
                                    onClick={() => {
                                      handleSelectMatch(match.dealId, match.meetingId);
                                      setShowSearchResults(false);
                                    }}
                                    className="p-2.5 hover:bg-white/[0.04] border border-transparent hover:border-white/5 rounded cursor-pointer transition-all text-left flex flex-col gap-1 group"
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-[10px] font-bold text-indigo-300 group-hover:text-indigo-200 group-hover:underline">
                                        {matchedDeal.company}
                                      </span>
                                      <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 bg-white/[0.04] text-slate-400 rounded-sm">
                                        Relevance: {match.score}/10
                                      </span>
                                    </div>
        
                                    {matchedMeeting ? (
                                      <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                                        <Layers className="w-3 h-3 text-emerald-400" />
                                        <span>{matchedMeeting.title}</span>
                                      </div>
                                    ) : (
                                      <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3 text-indigo-400" />
                                        <span>Account Context & Memory</span>
                                      </div>
                                    )}
        
                                    <p className="text-[10.5px] font-serif leading-normal italic text-slate-400 pl-3 border-l border-white/10 group-hover:border-indigo-500/30 transition-colors">
                                      {match.reason}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          )}
        
                          {/* Small recent queries list helper at the bottom when there are matches */}
                          {recentSearches.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-white/5 text-left">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Recent Searches
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {recentSearches.map((query, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleSelectRecentSearch(query)}
                                    className="text-[10px] font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 px-2 py-1 rounded transition-colors truncate max-w-[120px]"
                                  >
                                    {query}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Search Filter</label>
              <div className="relative inline-block">
                <select
                  value={searchFieldFilter}
                  onChange={(e) => setSearchFieldFilter(e.target.value as any)}
                  className="appearance-none bg-[#0c0d16] border border-white/10 hover:border-indigo-500/50 text-white rounded pl-3 pr-8 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                  id="search-scope-select"
                >
                  <option value="all">All Fields</option>
                  <option value="meeting">Meeting Title</option>
                  <option value="deal">Deal Name</option>
                  <option value="manager">Account Manager</option>
                  <option value="requirement">Requirement Description</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-60 text-slate-300 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[9px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Active Account</label>
            <div className="relative inline-block">
              <select
                value={selectedDealId}
                onChange={(e) => handleSelectDeal(e.target.value)}
                className="appearance-none bg-[#0c0d16] border border-white/10 hover:border-indigo-500/50 text-white rounded px-4 py-1.5 pr-8 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                id="deal-switcher"
              >
                {filteredDeals.length === 0 ? (
                  <option value="" disabled>No matches</option>
                ) : (
                  filteredDeals.map(d => (
                    <option key={d.id} value={d.id} className="bg-[#0f111a]">
                      {d.company} ({d.name.substring(0, 20)}...)
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-60 text-slate-300 pointer-events-none" />
            </div>
          </div>

          {selectedDeal && (
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Deal Value</div>
              <div className="font-display font-bold text-lg leading-none text-indigo-400">
                ₹{(selectedDeal.value / 100000).toFixed(1)} Lakhs
              </div>
            </div>
          )}

          {selectedDeal && (
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Close Prob.</div>
              <div className="flex items-baseline justify-end gap-2">
                <div className="font-display font-extrabold text-2xl leading-none text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                  {selectedDeal.prediction?.probability ?? 50}%
                </div>
                <button
                  onClick={handleRecalculatePrediction}
                  disabled={isPredicting}
                  className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-all"
                  title="Recalculate with Gemini"
                  id="recalc-predict-btn"
                >
                  <RefreshCw className={`w-3 h-3 ${isPredicting ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
          )}

          {/* Notification Bell Button & Dropdown */}
          <div className="relative flex items-center">
            <button
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="p-2 rounded hover:bg-white/5 text-slate-300 hover:text-white transition-all relative"
              title="Automated notifications log"
              id="notifications-bell-btn"
            >
              <Bell className="w-4 h-4" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] font-bold flex items-center justify-center animate-pulse">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotificationsDropdown && (
              <div
                className="absolute right-0 top-full mt-2 bg-[#0c0d17]/95 border border-white/10 shadow-2xl rounded-xl z-50 w-80 max-h-[420px] overflow-y-auto p-4 flex flex-col gap-2.5 animate-in fade-in backdrop-blur-xl text-slate-200"
                id="notifications-dropdown-panel"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-slate-400" />
                    Collaborator Alerts Log
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setNotifications(prev => {
                          const updated = prev.map(n => ({ ...n, read: true }));
                          localStorage.setItem("app_notifications", JSON.stringify(updated));
                          return updated;
                        });
                      }}
                      className="text-[9px] uppercase font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      Read All
                    </button>
                    <span className="text-white/10 text-xs font-light">|</span>
                    <button
                      onClick={() => {
                        setNotifications([]);
                        localStorage.removeItem("app_notifications");
                      }}
                      className="text-[9px] uppercase font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-2 py-1 max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 px-2">
                      <p className="text-xs italic text-slate-400">No notifications triggered yet.</p>
                      <p className="text-[9px] font-mono text-slate-500 uppercase mt-2.5 leading-relaxed">
                        Tag a collaborator and change an objection or requirement status below to trigger simulated alerts and emails!
                      </p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg border text-left transition-all relative ${
                          n.read ? "bg-[#111222]/60 border-white/5" : "bg-indigo-950/40 border-indigo-500/30 ring-1 ring-indigo-500/20"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            n.type === 'alert' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                          }`}>
                            {n.type === 'alert' ? 'Internal Alert' : 'Simulated Email'}
                          </span>
                          <span className="text-[8px] font-mono text-slate-400 shrink-0">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="mt-2 space-y-1">
                          <p className="text-[10.5px] font-bold text-slate-200">
                            {n.type === 'alert' ? `To Teammate: ${n.recipientName}` : `Sent to: ${n.recipientName}`}
                          </p>
                          <p className="text-[10px] text-slate-300 leading-normal font-sans">
                            {n.type === 'alert' ? n.body : n.subject}
                          </p>
                          {n.type === 'email' && (
                            <button
                              onClick={() => {
                                setViewingEmailNotification(n);
                                setNotifications(prev => {
                                  const updated = prev.map(item => item.id === n.id ? { ...item, read: true } : item);
                                  localStorage.setItem("app_notifications", JSON.stringify(updated));
                                  return updated;
                                });
                              }}
                              className="inline-flex items-center gap-1.5 mt-2 text-[9px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer border-t border-white/5 pt-1.5 w-full text-left"
                            >
                              <Mail className="w-3 h-3 text-indigo-400 shrink-0" />
                              <span>View Simulated Email Draft</span>
                            </button>
                          )}
                          {!n.read && n.type === 'alert' && (
                            <button
                              onClick={() => {
                                setNotifications(prev => {
                                  const updated = prev.map(item => item.id === n.id ? { ...item, read: true } : item);
                                  localStorage.setItem("app_notifications", JSON.stringify(updated));
                                  return updated;
                                });
                              }}
                              className="text-[9px] font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors block mt-2 cursor-pointer"
                            >
                              ✓ Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Command Center Launcher Button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${
              isDarkMode 
                ? "bg-slate-900 border-white/15 text-indigo-300 hover:bg-slate-800" 
                : "bg-slate-50 border-slate-200 text-indigo-700 hover:bg-slate-100 shadow-2xs"
            }`}
            title="Open AI Command Center (Ctrl+K)"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span className="hidden sm:inline">AI Cmd Center</span>
            <kbd className={`px-1.5 py-0.5 rounded text-[8px] font-mono ${
              isDarkMode ? "bg-white/10 text-slate-400" : "bg-slate-200 text-slate-600"
            }`}>Ctrl+K</kbd>
          </button>

          {/* Theme Toggler Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isDarkMode 
                ? "bg-slate-900 border-white/15 text-amber-400 hover:bg-slate-800" 
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs"
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsCreatingDeal(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 hover:scale-105 active:scale-95 border border-indigo-400/20"
            id="create-deal-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            New Deal
          </button>
        </div>
      </header>

      {/* ENTERPRISE TAB NAVIGATION BAR */}
      <nav className="bg-[#080a11]/95 border-b border-white/5 px-6 md:px-12 py-3 flex flex-col lg:flex-row items-center justify-between gap-4 backdrop-blur-md sticky top-[73px] z-10">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {[
            { id: "dashboard", label: "Executive Dashboard", icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { id: "deal-intelligence", label: "Deal Intelligence Hub", icon: <Layers className="w-3.5 h-3.5" /> },
            { id: "multi-agent", label: "Multi-Agent Hub", icon: <Users className="w-3.5 h-3.5" /> },
            { id: "competitor-research", label: "Grounding Research", icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: "contract-rag", label: "Contract RAG Room", icon: <FileCheck className="w-3.5 h-3.5" /> },
            { id: "sales-practice", label: "AI Sales Coach", icon: <Users className="w-3.5 h-3.5" /> },
            { id: "digital-twin", label: "Digital Twin", icon: <Brain className="w-3.5 h-3.5" /> },
            { id: "meeting-copilot", label: "Meeting Copilot", icon: <Video className="w-3.5 h-3.5" /> },
            { id: "proposal-generator", label: "Proposal Compiler", icon: <FileText className="w-3.5 h-3.5" /> },
            { id: "executive-briefing", label: "Pre-Meeting Prep", icon: <FileText className="w-3.5 h-3.5" /> }
          ].map((tab) => {
            const isActive = mainView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMainView(tab.id as any)}
                className={`px-3 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isActive
                    ? "bg-[#121528] text-indigo-300 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border-transparent"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            Logged in: <strong className="text-slate-200">{userEmail}</strong>
          </span>
          <button
            onClick={() => setIsVoiceRoomOpen(true)}
            className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(99,102,241,0.15)]"
          >
            <Mic className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            AI Voice Room
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("user_email");
              setUserEmail("");
            }}
            className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/30 rounded-lg transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </nav>



      {mainView === "deal-intelligence" ? (
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 bg-[#06080e]/40">
        
        {/* ==================== LEFT COLUMN: MEMORY TIMELINE & CONTEXT ==================== */}
        <section className="col-span-1 lg:col-span-3 border-r border-white/5 p-6 md:p-8 flex flex-col bg-[#06080e]/60 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Memory Timeline</h2>
            
            {/* Log Call Button */}
            <button
              onClick={() => setIsAddingMeeting(true)}
              className="text-[10px] font-bold uppercase tracking-wider text-slate-200 border border-white/10 hover:border-indigo-500/50 hover:text-white hover:bg-white/5 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              id="log-call-btn"
            >
              <Plus className="w-3 h-3" /> Log Meeting
            </button>
          </div>

          {activeReminder && (
            <div className="mb-6 p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-lg shadow-lg flex items-start gap-2.5 text-xs text-amber-200 animate-fade-in backdrop-blur-sm">
              <Bell className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
              <div className="flex-1 min-w-0">
                <div className="font-bold uppercase tracking-wide text-[9px] text-amber-400">
                  Active Reminder Trigger
                </div>
                <div className="font-semibold truncate mt-0.5" title={activeReminder.title}>
                  "{activeReminder.title}"
                </div>
                <div className="text-[10px] opacity-75 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400 inline" />
                  Alerting 1 hr before start
                </div>
                <div className="text-[9px] opacity-60 mt-1">
                  Scheduled: {activeReminder.date} @ {activeReminder.time}
                </div>
              </div>
              <button
                onClick={() => setActiveReminder(null)}
                className="text-amber-400 hover:text-white opacity-60 hover:opacity-100 p-0.5 rounded transition-all cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {selectedDeal && selectedDeal.meetings && selectedDeal.meetings.length > 0 ? (
            <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] lg:max-h-[500px] pr-2">
              {selectedDeal.meetings.map((m, idx) => {
                const isSelected = m.id === selectedMeetingId;
                // Parse date formatting
                const dateLabel = new Date(m.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                });

                // Mapping sentiments to colored indicators
                let sentimentColor = "bg-gray-400";
                if (m.sentiment === "Ready to Buy" || m.sentiment === "Positive" || m.sentiment === "Interested") {
                  sentimentColor = "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]";
                } else if (m.sentiment === "Concerned" || m.sentiment === "Frustrated") {
                  sentimentColor = "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]";
                }

                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMeetingId(m.id);
                      setGeneratedEmail("");
                      setEmailMeetingId("");
                    }}
                    className={`relative pl-6 border-l transition-all cursor-pointer group py-1.5 ${
                      isSelected
                        ? "border-indigo-500 pl-7 text-white"
                        : "border-white/10 hover:border-white/30 hover:pl-7"
                    }`}
                  >
                    <div
                      className={`absolute -left-[4.5px] top-2.5 w-2 h-2 rounded-full transition-transform group-hover:scale-125 ${
                        isSelected ? "bg-indigo-400 ring-4 ring-indigo-500/20" : "bg-white/20"
                      }`}
                    ></div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {dateLabel} • {m.time || "10:00"} // Meeting {idx + 1}
                        </span>
                      </div>
                      <span className={`w-1.5 h-1.5 rounded-full ${sentimentColor}`} title={`Sentiment: ${m.sentiment}`} />
                    </div>
                    <div className="flex items-start justify-between gap-1.5">
                      <h3 className={`text-xs font-semibold tracking-tight transition-colors flex-1 ${
                        isSelected ? "text-indigo-300" : "text-slate-300 group-hover:text-white"
                      }`}>
                        {m.title}
                      </h3>
                      <span className={`text-[8px] font-semibold uppercase px-1.5 py-0.5 shrink-0 rounded-sm border ${
                        (m.priority || "Medium") === "High"
                          ? "bg-red-500/10 text-red-300 border-red-500/20 font-bold"
                          : (m.priority || "Medium") === "Medium"
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/20 font-bold"
                          : "bg-slate-500/10 text-slate-300 border-slate-500/20"
                      }`}>
                        {m.priority || "Medium"}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-400 mt-1.5 line-clamp-2">
                      {m.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-6 text-center text-slate-500">
              <Layers className="w-8 h-8 mb-2 stroke-1" />
              <p className="text-xs italic">No meetings cataloged yet for this account.</p>
              <button
                onClick={() => setIsAddingMeeting(true)}
                className="mt-3 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 uppercase tracking-widest font-bold rounded-lg cursor-pointer"
              >
                Upload First Call
              </button>
            </div>
          )}

          {/* Persistent account intelligence summary block */}
          {selectedDeal && (
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="bg-gradient-to-br from-[#12152a] to-[#0d0f19] text-white p-5 rounded-xl border border-white/5 shadow-xl">
                <div className="text-[9px] font-bold tracking-widest uppercase mb-2 text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                  Evolving Strategy
                </div>
                <div className="text-[11px] italic leading-relaxed text-slate-200 mb-3">
                  "{selectedDeal.summary || "Discovery process is ongoing. Log transcripts to generate actionable intelligence matrices."}"
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono tracking-wider text-slate-400">
                  <span>Owner: Sales Rep</span>
                  <span>Status: {selectedDeal.status}</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ==================== CENTER COLUMN: INTELLIGENCE HUB ==================== */}
        <section className="col-span-1 lg:col-span-6 bg-[#080a11]/60 backdrop-blur-md p-6 md:p-8 flex flex-col overflow-y-auto border-r border-white/5">
          
          {/* Main heading */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 border-b border-white/5 pb-4 gap-4">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Grounded Accounts Dashboard</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
                {selectedDeal ? selectedDeal.company : "Select Account"}
              </h2>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                {selectedDeal?.contactName} — {selectedDeal?.contactRole}
              </p>
            </div>

            {selectedDeal && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  Status: {selectedDeal.status}
                </span>
                {selectedMeeting && (
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider border ${
                    selectedMeeting.sentiment === "Ready to Buy" || selectedMeeting.sentiment === "Positive" || selectedMeeting.sentiment === "Interested"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>
                    Sentiment: {selectedMeeting.sentiment}
                  </span>
                )}
                {selectedMeeting && (
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider border ${
                    (selectedMeeting.priority || "Medium") === "High"
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : (selectedMeeting.priority || "Medium") === "Medium"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-slate-500/10 text-slate-300 border-slate-500/20"
                  }`}>
                    Priority: {selectedMeeting.priority || "Medium"}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* MULTI-TAB SWITCHER FOR MEETING DETAIL VIEW */}
          {selectedMeeting ? (
            <div className="flex-1 flex flex-col min-h-0">
              {/* HIDDEN AUDIO ELEMENT */}
              <audio
                ref={audioRef}
                src={getMeetingAudioUrl(selectedMeeting.id)}
                onTimeUpdate={() => {
                  if (audioRef.current) {
                    setAudioCurrentTime(audioRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (audioRef.current) {
                    setAudioDuration(audioRef.current.duration);
                  }
                }}
                onEnded={() => {
                  setIsPlaying(false);
                }}
              />
              <div id="meeting-audio-player-panel" className="bg-gradient-to-br from-[#111326] to-[#070914] border border-white/5 p-5 rounded-xl mb-6 flex flex-col gap-4 shadow-2xl select-none relative overflow-hidden backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center">
                      <FileAudio className="w-4 h-4 text-emerald-400" />
                      {isPlaying && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                        Original Audio Recording Sync
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {customAudioUrls[selectedMeeting.id] ? "Custom Uploaded Audio Active" : "Sample Call Recording Loaded"}
                      </p>
                    </div>
                  </div>

                  {/* CUSTOM AUDIO UPLOADER BUTTON */}
                  <div>
                    <input
                      type="file"
                      id="meeting-detail-audio-uploader"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setCustomAudioUrls(prev => ({ ...prev, [selectedMeeting.id]: url }));
                          setIsPlaying(false);
                          setAudioCurrentTime(0);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById("meeting-detail-audio-uploader")?.click()}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-300 hover:text-white border border-white/10 hover:border-indigo-500/50 rounded-lg bg-indigo-500/5 hover:bg-indigo-500/10 transition-all cursor-pointer"
                      title="Load or replace standard call recording with your own audio file"
                    >
                      <Upload className="w-2.5 h-2.5" />
                      Upload Recording
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                  {/* Left: Play/Pause/Stop & Speed */}
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Play/Pause */}
                    <button
                      type="button"
                      onClick={handlePlayPause}
                      className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all cursor-pointer focus:ring-2 focus:ring-indigo-500/20 shadow-lg shadow-indigo-500/20"
                      title={isPlaying ? "Pause Recording" : "Play Recording"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white translate-x-0.5" />}
                    </button>

                    {/* Stop */}
                    <button
                      type="button"
                      onClick={handleStop}
                      className="w-9 h-9 rounded-full border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer focus:ring-2 focus:ring-white/20"
                      title="Stop Recording"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>

                    {/* Playback Rate Dropdown */}
                    <div className="relative">
                      <select
                        value={playbackRate}
                        onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                        className="appearance-none bg-[#0e101f] border border-white/10 hover:border-white/20 text-[10px] font-mono font-bold text-slate-300 hover:text-white focus:ring-1 focus:ring-white/20 cursor-pointer py-1.5 pl-2.5 pr-6 rounded-lg transition-all"
                        style={{ outline: "none" }}
                        title="Playback speed"
                      >
                        <option value="0.75" className="bg-[#0e101f]">0.75x</option>
                        <option value="1" className="bg-[#0e101f]">1.00x</option>
                        <option value="1.25" className="bg-[#0e101f]">1.25x</option>
                        <option value="1.5" className="bg-[#0e101f]">1.50x</option>
                        <option value="1.75" className="bg-[#0e101f]">1.75x</option>
                        <option value="2" className="bg-[#0e101f]">2.00x</option>
                      </select>
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] font-bold opacity-40 text-slate-300">▼</span>
                    </div>

                    {/* Volume Controls */}
                    <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                      <button
                        type="button"
                        onClick={handleToggleMute}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-slate-300 hover:text-white transition-colors"
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                        title="Adjust volume"
                      />
                    </div>
                  </div>

                  {/* Middle: Beautiful Equalizer Visualizer */}
                  <div className="flex-1 flex justify-center w-full max-w-[240px] h-8 px-4 border-y md:border-y-0 md:border-x border-white/5 shrink-0 select-none overflow-hidden items-end pb-0.5">
                    <div className="flex items-end gap-1 h-full">
                      {[...Array(24)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)] rounded-t-full rounded-b-sm shrink-0"
                          animate={isPlaying ? {
                            height: [4, 28, 4],
                          } : {
                            height: 4 + (i % 4) * 4,
                          }}
                          transition={isPlaying ? {
                            duration: 0.6 + (i % 6) * 0.1,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut",
                            delay: i * 0.02,
                          } : {
                            duration: 0.2
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right: Selected Line Highlighter Badge */}
                  <div className="text-right w-full md:w-auto shrink-0 flex items-center gap-2 justify-end">
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                      <Clock className="w-3 h-3 shrink-0" />
                      Voice Sync Active
                    </span>
                  </div>
                </div>

                {/* Progress bar and time labels */}
                <div className="flex items-center gap-3 w-full mt-1">
                  <span className="text-[10px] font-mono text-slate-400 w-10 shrink-0 text-left">
                    {formatAudioTime(audioCurrentTime)}
                  </span>
                  
                  <input
                    type="range"
                    min="0"
                    max={audioDuration || 100}
                    step="0.1"
                    value={audioCurrentTime}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                    title="Seek audio track position"
                  />

                  <span className="text-[10px] font-mono text-slate-400 w-10 shrink-0 text-right">
                    {formatAudioTime(audioDuration)}
                  </span>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="flex border-b border-white/10 mb-6 text-xs gap-6 font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`pb-2 transition-all border-b-2 -mb-[1px] cursor-pointer ${
                    activeTab === "summary" ? "border-indigo-400 text-indigo-300" : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                  id="tab-summary-btn"
                >
                  Intelligence Summary
                </button>
                <button
                  onClick={() => setActiveTab("transcript")}
                  className={`pb-2 transition-all border-b-2 -mb-[1px] cursor-pointer ${
                    activeTab === "transcript" ? "border-indigo-400 text-indigo-300" : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                  id="tab-transcript-btn"
                >
                  Transcript Signals
                </button>
                <button
                  onClick={() => setActiveTab("memory")}
                  className={`pb-2 transition-all border-b-2 -mb-[1px] cursor-pointer ${
                    activeTab === "memory" ? "border-indigo-400 text-indigo-300" : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                  id="tab-memory-btn"
                >
                  Long-Term Memory Updates
                </button>
              </div>

              {/* TAB CONTENT: SUMMARY */}
              {activeTab === "summary" && (
                <div className="space-y-6 flex-1">
                  {/* Download Summary Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101224]/60 border border-white/5 p-4 rounded-xl shadow-lg">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-0.5">Shareable Deliverables</h4>
                      <p className="text-xs text-slate-300 font-sans">Generate a polished executive PDF report of this sync for clients or partners.</p>
                    </div>
                    <button
                      onClick={handleDownloadPDF}
                      className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all self-start sm:self-center shrink-0 shadow-lg shadow-indigo-500/20 border border-indigo-400/20 cursor-pointer"
                      id="download-pdf-btn"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Meeting Summary
                    </button>
                  </div>

                  {/* CRM Synchronization Workspace */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-indigo-950/20 border border-indigo-500/20 p-4 rounded-xl shadow-lg" id="crm-sync-banner">
                    <div className="space-y-2">
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-0.5 flex items-center gap-1.5 font-mono">
                          <Database className="w-3.5 h-3.5 text-indigo-400" />
                          Enterprise CRM Sync
                        </h4>
                        <p className="text-xs text-indigo-200/85 font-sans">
                          Push {curatedHighlights[selectedMeeting.id]?.length || 0} manually curated highlights, {selectedMeeting.objections?.length || 0} objections, and {selectedMeeting.requirements?.length || 0} requirements to corporate systems.
                        </p>
                      </div>
                      
                      {/* Interactive Error Simulation Trigger */}
                      <div className="flex flex-wrap items-center gap-4">
                        <label className="inline-flex items-center gap-1.5 text-[10px] text-indigo-200/60 font-mono select-none cursor-pointer hover:text-indigo-300 transition-colors">
                          <input
                            type="checkbox"
                            checked={shouldSimulateCrmError}
                            onChange={(e) => setShouldSimulateCrmError(e.target.checked)}
                            className="rounded border-indigo-500/30 bg-black/40 text-indigo-500 focus:ring-indigo-500/40 w-3.5 h-3.5 cursor-pointer accent-indigo-500"
                          />
                          <span>Simulate Sync Gateway Failure</span>
                        </label>

                        {shouldSimulateCrmError && (
                          <div className="flex items-center gap-1 bg-[#0e1022] border border-white/10 rounded px-1.5 py-0.5" id="simulated-error-type-selector">
                            <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">Type:</span>
                            <select
                              value={simulatedCrmErrorType}
                              onChange={(e) => setSimulatedCrmErrorType(e.target.value as any)}
                              className="text-[9px] font-mono font-extrabold text-indigo-300 bg-transparent border-0 focus:ring-0 p-0 cursor-pointer uppercase"
                            >
                              <option value="timeout" className="bg-[#0e1022] text-slate-100">Timeout (504)</option>
                              <option value="auth" className="bg-[#0e1022] text-slate-100">Auth Failure (401)</option>
                              <option value="validation" className="bg-[#0e1022] text-slate-100">Validation Error (400)</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleSyncWithCrm()}
                      disabled={isCrmSyncing}
                      className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all self-start sm:self-center shrink-0 shadow-md shadow-indigo-600/10 cursor-pointer hover:scale-105 active:scale-95"
                      id="sync-crm-btn"
                    >
                      {isCrmSyncing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Syncing with CRM...
                        </>
                      ) : (
                        <>
                          <CloudUpload className="w-3.5 h-3.5" />
                          Sync with CRM
                        </>
                      )}
                    </button>
                  </div>

                  {/* Summary Card */}
                  <div className="p-5 bg-[#101224]/60 border border-white/5 rounded-xl shadow-lg">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Meeting Focus &amp; Summary</h4>
                    <p className="text-sm leading-relaxed text-slate-200">
                      "{selectedMeeting.summary}"
                    </p>
                    
                    {/* Vocal Cue Analysis */}
                    {selectedMeeting.vocalCuesSummary && (
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-start gap-2 text-xs">
                        <Volume2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold text-indigo-300">Vocal Tone Analysis: </span>
                          <span className="text-slate-300">{selectedMeeting.vocalCuesSummary}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Objections & Requirements Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* OBJECTIONS PORTION */}
                    <div className={`p-5 rounded-2xl glass-card-premium ${
                      isDarkMode ? "dark-glass text-slate-200" : "light-glass text-slate-800 shadow-md"
                    }`}>
                      <div className={`flex items-center justify-between mb-4 border-b pb-2 ${
                        isDarkMode ? "border-white/5" : "border-black/5"
                      }`}>
                        <h3 className={`text-[10px] font-bold uppercase tracking-widest ${
                          isDarkMode ? "text-slate-400" : "text-black/40"
                        }`}>Objections Tracked</h3>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded ${
                          isDarkMode ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-red-50 text-red-700"
                        }`}>
                          {selectedMeeting.objections.length} Raised
                        </span>
                      </div>
                      
                      {selectedMeeting.objections.length > 0 ? (
                        <div className="space-y-6">
                          {(Object.entries(
                            selectedMeeting.objections.reduce((acc, obj) => {
                              const cat = obj.category || "Other";
                              if (!acc[cat]) {
                                acc[cat] = [];
                              }
                              acc[cat].push(obj);
                              return acc;
                            }, {} as Record<string, Objection[]>)
                          ) as [string, Objection[]][]).map(([category, objs]) => (
                            <div key={category} className={`border-l-2 pl-3.5 space-y-3.5 ${isDarkMode ? "border-white/10" : "border-black/10"}`}>
                              {/* Category Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  {category === "Price" ? (
                                    <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                                  ) : category === "Security" || category === "Compliance" ? (
                                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                                  ) : (
                                    <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                                  )}
                                  <span className={`font-bold text-[10px] uppercase tracking-wider ${isDarkMode ? "text-slate-200" : "text-black/75"}`}>
                                    {category}
                                  </span>
                                </div>
                                <span className={`font-mono text-[9px] ${isDarkMode ? "text-slate-400" : "text-black/40"}`}>
                                  {objs.length} {objs.length === 1 ? "concern" : "concerns"}
                                </span>
                              </div>

                              {/* Objections list inside category */}
                              <ul className="space-y-3.5">
                                {objs.map((o) => (
                                  <li key={o.id} className={`text-xs pb-3.5 last:pb-0 last:border-b-0 border-b ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
                                    <div className="flex items-center justify-between gap-2">
                                      <span className={`font-semibold ${isDarkMode ? "text-slate-200" : "text-black/80"}`}>Issue #{o.id.split("-").pop() || o.id}</span>
                                      <div className="relative inline-block">
                                        <select
                                          value={o.status}
                                          onChange={(e) => handleUpdateObjectionStatus(selectedMeeting.id, o.id, e.target.value as ObjectionStatus)}
                                          className={`text-[8.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border-0 cursor-pointer focus:ring-1 focus:ring-white/20 appearance-none pr-5 ${
                                            o.status === "Resolved"
                                              ? (isDarkMode ? "bg-emerald-500/20 text-emerald-300" : "bg-[#E6F3EC] text-[#1D4A34]")
                                              : o.status === "Addressed"
                                              ? (isDarkMode ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-amber-50 text-amber-800 border border-amber-200/50")
                                              : (isDarkMode ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-red-50 text-red-800 border border-red-200/50")
                                          }`}
                                          style={{ backgroundImage: 'none' }}
                                        >
                                          <option value="Identified" className={isDarkMode ? "bg-[#0f111a] text-slate-300" : "bg-white text-slate-800"}>Identified ▾</option>
                                          <option value="Addressed" className={isDarkMode ? "bg-[#0f111a] text-slate-300" : "bg-white text-slate-800"}>Addressed ▾</option>
                                          <option value="Resolved" className={isDarkMode ? "bg-[#0f111a] text-slate-300" : "bg-white text-slate-800"}>Resolved ▾</option>
                                        </select>
                                      </div>
                                    </div>
                                    <p className={`mt-1 leading-relaxed font-serif italic ${isDarkMode ? "text-slate-300" : "text-black/70"}`}>"{o.description}"</p>
                                    {o.notes && (
                                      <p className={`text-[10px] mt-1 p-1.5 rounded border ${
                                        isDarkMode ? "bg-black/30 text-slate-300 border-white/5" : "bg-[#FBFBFA] text-black/45 border-black/5"
                                      }`}>
                                        <span className="font-mono uppercase text-[8px] block opacity-60">Resolution Action:</span>
                                        {o.notes}
                                      </p>
                                    )}

                                    {/* Tagged Collaborators under objection */}
                                    <div className={`mt-2.5 pt-2 border-t flex flex-wrap items-center justify-between gap-2 p-2 rounded ${
                                      isDarkMode ? "border-white/5 bg-black/20" : "border-black/5 bg-slate-50"
                                    }`}>
                                      <div className="flex flex-wrap items-center gap-1">
                                        <span className={`text-[9px] font-mono mr-1 ${isDarkMode ? "text-slate-400" : "text-black/40"}`}>Tagged:</span>
                                        {(o.taggedCollaboratorIds || []).length > 0 ? (
                                          (o.taggedCollaboratorIds || []).map(cid => {
                                            const collab = (selectedDeal?.collaborators || []).find(c => c.id === cid);
                                            if (!collab) return null;
                                            return (
                                              <span key={cid} className={`inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full border ${
                                                isDarkMode ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20" : "bg-[#EEF2F6] text-[#1E3A8A] border-black/5"
                                              }`}>
                                                <span>{collab.name}</span>
                                                <button
                                                  type="button"
                                                  onClick={() => handleToggleTagCollaborator(cid, "objection", o.id)}
                                                  className={`transition-colors cursor-pointer ${isDarkMode ? "text-slate-400 hover:text-red-400" : "text-black/40 hover:text-red-600"}`}
                                                  title="Untag member"
                                                >
                                                  <X className="w-2 h-2" />
                                                </button>
                                              </span>
                                            );
                                          })
                                        ) : (
                                          <span className={`text-[9px] font-mono italic ${isDarkMode ? "text-slate-500" : "text-black/35"}`}>None</span>
                                        )}
                                      </div>
                                      
                                      {/* Dropdown to tag collaborator */}
                                      {selectedDeal?.collaborators && selectedDeal.collaborators.length > 0 ? (
                                        <div className="relative">
                                          <select
                                            value=""
                                            onChange={(e) => {
                                              if (e.target.value) {
                                                handleToggleTagCollaborator(e.target.value, "objection", o.id);
                                              }
                                            }}
                                            className={`appearance-none bg-transparent hover:bg-white/5 border-0 text-[9px] font-mono font-bold cursor-pointer py-0.5 px-2 rounded transition-all ${
                                              isDarkMode ? "text-indigo-400 hover:text-indigo-300" : "text-[#2A5C43] hover:text-[#1E4330]"
                                            }`}
                                            style={{ outline: 'none' }}
                                          >
                                            <option value="" className={isDarkMode ? "bg-[#0f111a] text-slate-300" : "bg-white text-slate-700"}>+ Tag Member</option>
                                            {selectedDeal.collaborators
                                              .filter(c => !(o.taggedCollaboratorIds || []).includes(c.id))
                                              .map(c => (
                                                <option key={c.id} value={c.id} className={isDarkMode ? "bg-[#0f111a] text-slate-300" : "bg-white text-slate-750"}>
                                                  {c.name} ({c.role})
                                                </option>
                                              ))}
                                          </select>
                                        </div>
                                      ) : null}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={`text-xs font-serif italic py-2 ${isDarkMode ? "text-slate-500" : "text-black/40"}`}>No critical friction or objections flagged during this sync.</p>
                      )}
                    </div>
 
                    {/* REQUIREMENTS PORTION */}
                    <div className={`p-5 rounded-2xl glass-card-premium ${
                      isDarkMode ? "dark-glass text-slate-200" : "light-glass text-slate-800 shadow-md"
                    }`}>
                      <div className={`flex items-center justify-between mb-4 border-b pb-2 ${
                        isDarkMode ? "border-white/5" : "border-black/5"
                      }`}>
                        <h3 className={`text-[10px] font-bold uppercase tracking-widest ${
                          isDarkMode ? "text-slate-400" : "text-black/40"
                        }`}>Requirements Mapped</h3>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded ${
                          isDarkMode ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20" : "bg-indigo-50 text-indigo-700"
                        }`}>
                          {selectedMeeting.requirements.length} Items
                        </span>
                      </div>
 
                      {selectedMeeting.requirements.length > 0 ? (
                        <ul className="space-y-4">
                          {selectedMeeting.requirements.map((r) => (
                            <li key={r.id} className={`text-xs pb-3.5 last:pb-0 last:border-b-0 border-b ${
                              isDarkMode ? "border-white/5" : "border-black/5"
                            }`}>
                              <div className="flex items-center justify-between gap-2">
                                <span className={`font-semibold ${isDarkMode ? "text-slate-200" : "text-black"}`}>{r.name}</span>
                                <span className={`text-[8px] font-bold px-1.5 rounded uppercase tracking-wider ${
                                  r.priority === "High" 
                                    ? (isDarkMode ? "bg-red-500/15 text-red-300 border border-red-500/20" : "bg-red-50 text-red-700")
                                    : (isDarkMode ? "bg-slate-500/15 text-slate-300 border border-slate-500/20" : "bg-slate-100 text-slate-700")
                                }`}>
                                  {r.priority} Priority
                                </span>
                              </div>
                              <p className={`mt-1 leading-relaxed ${isDarkMode ? "text-slate-300" : "text-black/60"}`}>{r.description}</p>
                              <div className="mt-1.5 flex items-center gap-1.5">
                                <span className={`text-[9px] font-mono ${isDarkMode ? "text-slate-400" : "text-black/40"}`}>State:</span>
                                <div className="relative inline-block">
                                  <select
                                    value={r.status}
                                    onChange={(e) => handleUpdateRequirementStatus(selectedMeeting.id, r.id, e.target.value as any)}
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border cursor-pointer focus:ring-1 focus:ring-white/20 transition-all appearance-none pr-4 ${
                                      isDarkMode 
                                        ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/25" 
                                        : "bg-indigo-50 text-indigo-700 border-indigo-200/50 hover:bg-indigo-100"
                                    }`}
                                    style={{ backgroundImage: 'none' }}
                                  >
                                    <option value="Required" className={isDarkMode ? "bg-[#0f111a] text-slate-300" : "bg-white text-slate-800"}>Required ▾</option>
                                    <option value="In Discussion" className={isDarkMode ? "bg-[#0f111a] text-slate-300" : "bg-white text-slate-800"}>In Discussion ▾</option>
                                    <option value="Agreed" className={isDarkMode ? "bg-[#0f111a] text-slate-300" : "bg-white text-slate-800"}>Agreed ▾</option>
                                    <option value="Delivered" className={isDarkMode ? "bg-[#0f111a] text-slate-300" : "bg-white text-slate-800"}>Delivered ▾</option>
                                  </select>
                                </div>
                              </div>

                              {/* Tagged Collaborators under requirement */}
                              <div className={`mt-2.5 pt-2 border-t flex flex-wrap items-center justify-between gap-2 p-2 rounded ${
                                isDarkMode ? "border-white/5 bg-black/20" : "border-black/5 bg-slate-50"
                              }`}>
                                <div className="flex flex-wrap items-center gap-1">
                                  <span className={`text-[9px] font-mono mr-1 ${isDarkMode ? "text-slate-400" : "text-black/40"}`}>Tagged:</span>
                                  {(r.taggedCollaboratorIds || []).length > 0 ? (
                                    (r.taggedCollaboratorIds || []).map(cid => {
                                      const collab = (selectedDeal?.collaborators || []).find(c => c.id === cid);
                                      if (!collab) return null;
                                      return (
                                        <span key={cid} className={`inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full border ${
                                          isDarkMode ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20" : "bg-[#EEF2F6] text-[#1E3A8A] border-black/5"
                                        }`}>
                                          <span>{collab.name}</span>
                                          <button
                                            type="button"
                                            onClick={() => handleToggleTagCollaborator(cid, "requirement", r.id)}
                                            className={`transition-colors cursor-pointer ${isDarkMode ? "text-slate-400 hover:text-red-400" : "text-black/40 hover:text-red-600"}`}
                                            title="Untag member"
                                          >
                                            <X className="w-2 h-2" />
                                          </button>
                                        </span>
                                      );
                                    })
                                  ) : (
                                    <span className={`text-[9px] font-mono italic ${isDarkMode ? "text-slate-500" : "text-black/35"}`}>None</span>
                                  )}
                                </div>
                                
                                {/* Dropdown to tag collaborator */}
                                {selectedDeal?.collaborators && selectedDeal.collaborators.length > 0 ? (
                                  <div className="relative">
                                    <select
                                      value=""
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          handleToggleTagCollaborator(e.target.value, "requirement", r.id);
                                        }
                                      }}
                                      className={`appearance-none bg-transparent hover:bg-white/5 border-0 text-[9px] font-mono font-bold cursor-pointer py-0.5 px-2 rounded transition-all ${
                                        isDarkMode ? "text-indigo-400 hover:text-indigo-300" : "text-[#2A5C43] hover:text-[#1E4330]"
                                      }`}
                                      style={{ outline: 'none' }}
                                    >
                                      <option value="" className={isDarkMode ? "bg-[#0f111a] text-slate-300" : "bg-white text-slate-700"}>+ Tag Member</option>
                                      {selectedDeal.collaborators
                                        .filter(c => !(r.taggedCollaboratorIds || []).includes(c.id))
                                        .map(c => (
                                          <option key={c.id} value={c.id} className={isDarkMode ? "bg-[#0f111a] text-slate-300" : "bg-white text-slate-750"}>
                                            {c.name} ({c.role})
                                          </option>
                                        ))}
                                    </select>
                                  </div>
                                ) : null}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={`text-xs font-serif italic py-2 ${isDarkMode ? "text-slate-500" : "text-black/40"}`}>No structured technical requirements documented in this meeting.</p>
                      )}
                    </div>
 
                  </div>

                  {/* COLLABORATORS CARD */}
                  <div className={`p-5 rounded-2xl mb-6 glass-card-premium ${
                    isDarkMode ? "dark-glass text-slate-200" : "light-glass text-slate-800 shadow-md"
                  }`}>
                    <div className={`flex items-center justify-between border-b pb-3 mb-4 ${
                      isDarkMode ? "border-white/5" : "border-black/5"
                    }`}>
                      <div className="flex items-center gap-2">
                        <Users className={`w-4 h-4 ${isDarkMode ? "text-indigo-400" : "text-[#2A5C43]"}`} />
                        <h3 className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-300" : "text-black/70"}`}>Deal Collaborators & Team Alignment</h3>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${isDarkMode ? "text-slate-300 bg-white/5 border border-white/10" : "text-black/40 bg-black/5"}`}>
                        {(selectedDeal.collaborators || []).length} Active Team Members
                      </span>
                    </div>

                    <p className={`text-xs mb-4 leading-relaxed ${isDarkMode ? "text-slate-400" : "text-black/55"}`}>
                      Add cross-functional teammates to assign accountability and expedite objection or technical requirement resolution. Tagged teammates will be listed directly alongside active trackers.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left: Teammates List */}
                      <div className="lg:col-span-2 space-y-3">
                        <h4 className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-black/40"}`}>Active Contributors</h4>
                        
                        {(selectedDeal.collaborators || []).length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(selectedDeal.collaborators || []).map((c) => (
                              <div key={c.id} className={`flex items-start justify-between p-3 border rounded transition-colors ${
                                isDarkMode ? "border-white/5 bg-black/30 hover:border-white/10" : "border-black/5 bg-[#FBFBFA] hover:border-black/10"
                              }`}>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`font-semibold text-xs ${isDarkMode ? "text-slate-200" : "text-black/85"}`}>{c.name}</span>
                                    <span className={`text-[8px] font-mono font-medium px-1 rounded-sm ${isDarkMode ? "text-indigo-300 bg-indigo-500/10 border border-indigo-500/20" : "text-indigo-700 bg-indigo-50"}`}>{c.role}</span>
                                  </div>
                                  {c.email && (
                                    <span className={`text-[10px] font-mono block ${isDarkMode ? "text-slate-500" : "text-black/40"}`}>{c.email}</span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCollaborator(c.id)}
                                  className={`p-1 rounded transition-all cursor-pointer ${isDarkMode ? "text-slate-500 hover:text-red-400 hover:bg-white/5" : "text-black/30 hover:text-red-600 hover:bg-black/5"}`}
                                  title="Remove collaborator"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={`p-6 border border-dashed rounded text-center ${isDarkMode ? "border-white/10 bg-black/20" : "border-black/10 bg-[#FBFBFA]"}`}>
                            <Users className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? "text-slate-600" : "text-black/20"}`} />
                            <p className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-black/55"}`}>No team members collaborating on this deal yet.</p>
                            <p className={`text-[10px] mt-1 ${isDarkMode ? "text-slate-500" : "text-black/40"}`}>Add colleagues (e.g. Solutions Architect, Legal counsel) to coordinate next steps.</p>
                          </div>
                        )}
                      </div>

                      {/* Right: Add Team Member Form */}
                      <div className={`p-4 border rounded ${isDarkMode ? "border-white/5 bg-black/40" : "border-[#2A5C43]/10 bg-slate-50"}`}>
                        <h4 className={`text-[9px] font-bold uppercase tracking-wider mb-3 ${isDarkMode ? "text-indigo-400" : "text-[#2A5C43]"}`}>Add Collaborator</h4>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          if (!collabFormName.trim() || !collabFormRole.trim()) return;
                          handleAddCollaborator(collabFormName, collabFormRole, collabFormEmail);
                          setCollabFormName("");
                          setCollabFormRole("");
                          setCollabFormEmail("");
                        }} className="space-y-3 text-xs">
                          <div>
                            <label className={`text-[9px] font-mono uppercase block mb-1 ${isDarkMode ? "text-slate-400" : "text-black/50"}`}>Full Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Sarah Connor"
                              value={collabFormName}
                              onChange={(e) => setCollabFormName(e.target.value)}
                              className={`w-full px-2.5 py-1.5 border rounded text-xs focus:outline-none ${
                                isDarkMode ? "bg-black/30 border-white/10 text-slate-200 focus:border-indigo-500" : "bg-white border-black/10 text-black/85 focus:border-[#2A5C43]"
                              }`}
                            />
                          </div>

                          <div>
                            <label className={`text-[9px] font-mono uppercase block mb-1 ${isDarkMode ? "text-slate-400" : "text-black/50"}`}>Role / Specialization *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Solution Architect"
                              value={collabFormRole}
                              onChange={(e) => setCollabFormRole(e.target.value)}
                              className={`w-full px-2.5 py-1.5 border rounded text-xs focus:outline-none ${
                                isDarkMode ? "bg-black/30 border-white/10 text-slate-200 focus:border-indigo-500" : "bg-white border-black/10 text-black/85 focus:border-[#2A5C43]"
                              }`}
                            />
                          </div>

                          <div>
                            <label className={`text-[9px] font-mono uppercase block mb-1 ${isDarkMode ? "text-slate-400" : "text-black/50"}`}>Email (Optional)</label>
                            <input
                              type="email"
                              placeholder="e.g. sarah@company.com"
                              value={collabFormEmail}
                              onChange={(e) => setCollabFormEmail(e.target.value)}
                              className={`w-full px-2.5 py-1.5 border rounded text-xs focus:outline-none ${
                                isDarkMode ? "bg-black/30 border-white/10 text-slate-200 focus:border-indigo-500" : "bg-white border-black/10 text-black/85 focus:border-[#2A5C43]"
                              }`}
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={!collabFormName.trim() || !collabFormRole.trim()}
                            className={`w-full py-2 text-[10px] uppercase font-mono tracking-wider font-bold rounded transition-colors cursor-pointer ${
                              isDarkMode 
                                ? "bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-slate-500 text-white" 
                                : "bg-[#2A5C43] hover:bg-[#1E4330] disabled:bg-black/10 disabled:text-black/35 text-white"
                            }`}
                          >
                            + Add Team Member
                          </button>
                        </form>
                      </div>

                    </div>
                  </div>

                  {/* Buying Signals block */}
                  <div className={`p-5 rounded-2xl glass-card-premium ${
                    isDarkMode ? "dark-glass text-slate-200" : "light-glass text-slate-800 shadow-md"
                  }`}>
                    <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDarkMode ? "text-slate-400" : "text-black/40"}`}>Buying Intent Signals</h4>
                    {selectedMeeting.buyingSignals && selectedMeeting.buyingSignals.length > 0 ? (
                      <div className="space-y-3">
                        {selectedMeeting.buyingSignals.map((s) => (
                          <div key={s.id} className={`text-xs border-l-2 pl-3 py-1 ${isDarkMode ? "border-indigo-500" : "border-[#2A5C43]"}`}>
                            <span className={`font-serif italic font-bold ${isDarkMode ? "text-slate-100" : "text-black/85"}`}>"{s.signalText}"</span>
                            <div className={`flex items-center justify-between mt-1 text-[10px] ${isDarkMode ? "text-slate-400" : "text-black/60"}`}>
                              <span>Context: {s.context}</span>
                              <span className={`font-semibold px-1.5 rounded ${isDarkMode ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-[#E6F3EC] text-[#2A5C43]"}`}>
                                Conf: {s.confidence}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-xs font-serif italic ${isDarkMode ? "text-slate-500" : "text-black/40"}`}>No critical purchasing momentum markers extracted from this transcript.</p>
                    )}
                  </div>

                  {/* Long-Term Account Memory Profile Overview Card */}
                  <div className={`p-5 rounded-2xl glass-card-premium ${
                    isDarkMode ? "dark-glass text-slate-200" : "light-glass text-slate-800 shadow-md"
                  }`}>
                    <div className="flex items-center gap-1.5 mb-3">
                      <Layers className={`w-4 h-4 ${isDarkMode ? "text-indigo-400" : "text-black/60"}`} />
                      <h4 className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-black/40"}`}>Long-Term Account Memory Profile</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className={`text-[9px] font-mono uppercase block ${isDarkMode ? "text-slate-400" : "opacity-50"}`}>Current Budget Guidance</span>
                        <span className={`font-serif italic font-semibold mt-0.5 block ${isDarkMode ? "text-slate-100" : "text-black/85"}`}>{selectedDeal.memory.budget}</span>
                      </div>
                      <div>
                        <span className={`text-[9px] font-mono uppercase block ${isDarkMode ? "text-slate-400" : "opacity-50"}`}>Target Implementation Timeline</span>
                        <span className={`mt-0.5 block ${isDarkMode ? "text-slate-200" : "text-black/85"}`}>{selectedDeal.memory.timeline}</span>
                      </div>
                      {selectedDeal.memory.decisionMakers && selectedDeal.memory.decisionMakers.length > 0 && (
                        <div className={`col-span-1 sm:col-span-2 border-t pt-2 mt-1 ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
                          <span className={`text-[9px] font-mono uppercase block mb-1 ${isDarkMode ? "text-slate-400" : "opacity-50"}`}>Key Decision Makers Linked</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedDeal.memory.decisionMakers.map((dm, i) => (
                              <span key={i} className={`px-2 py-0.5 rounded text-[10px] border ${isDarkMode ? "bg-white/5 text-slate-300 border-white/10" : "bg-black/5 text-black/75 border-black/5"}`}>
                                {dm}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Deal Close Probability Trend Recharts Visualization */}
                  <div className="p-6 bg-gradient-to-br from-[#0c0f1d] to-[#04060f] border border-white/5 rounded-xl shadow-2xl relative overflow-hidden">
                    {/* Visual accent backdrop glow */}
                    <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-[150px] h-[150px] bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Deal Close Probability Trend</h4>
                            <p className="text-[11px] text-slate-400/80 font-serif italic mt-0.5">
                              Progressive probability trajectory computed across {probabilityTrendLimit === "all" ? "all" : `the last ${probabilityTrendLimit}`} chronological meetings.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
                        <div className="flex items-center gap-2">
                          <label htmlFor="prob-trend-limit-select" className="text-[10px] font-mono text-slate-400/60 uppercase tracking-wider">
                            Range:
                          </label>
                          <select
                            id="prob-trend-limit-select"
                            value={probabilityTrendLimit}
                            onChange={(e) => setProbabilityTrendLimit(e.target.value as "5" | "10" | "all")}
                            className="bg-[#12162b] border border-white/10 hover:border-white/20 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none cursor-pointer transition-colors"
                          >
                            <option value="5">Last 5 Meetings</option>
                            <option value="10">Last 10 Meetings</option>
                            <option value="all">All Meetings</option>
                          </select>
                        </div>
                        {selectedDeal.prediction && (() => {
                          const trendData = getProbabilityTrendData();
                          const currentProb = selectedDeal.prediction.probability;
                          const prevProb = trendData.length > 1 ? trendData[trendData.length - 2].probability : currentProb;
                          const probDiff = currentProb - prevProb;

                          return (
                            <div className="flex items-center gap-2">
                              <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-mono">
                                Current: {currentProb}%
                              </div>
                              {probDiff !== 0 && (
                                <div className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg flex items-center gap-0.5 ${
                                  probDiff > 0 
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                }`}>
                                  {probDiff > 0 ? "▲" : "▼"} {Math.abs(probDiff)}%
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="h-64 w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={getProbabilityTrendData()}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            {/* Premium Indigo to Emerald Stroke Gradient */}
                            <linearGradient id="indigoToEmeraldStroke" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#6366f1" />
                              <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                            {/* Premium Indigo to Emerald Area Fill Gradient */}
                            <linearGradient id="indigoToEmeraldFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                              <stop offset="50%" stopColor="#10b981" stopOpacity={0.08} />
                              <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="rgba(255,255,255,0.4)" 
                            fontSize={10}
                            fontFamily="monospace"
                            tickLine={false}
                          />
                          <YAxis 
                            domain={[0, 100]} 
                            stroke="rgba(255,255,255,0.4)" 
                            fontSize={10}
                            fontFamily="monospace"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `${v}%`}
                          />
                          <ChartTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-[#0b0d19]/95 text-slate-200 p-4 shadow-2xl rounded-xl border border-white/10 text-xs font-sans min-w-[200px] backdrop-blur-md">
                                    <div className="font-mono text-[9px] text-slate-400 mb-1">{data.date}</div>
                                    <div className="font-bold truncate max-w-[220px] text-white" title={data.fullTitle}>
                                      {data.fullTitle}
                                    </div>
                                    <div className="flex items-center justify-between gap-4 mt-3 pt-2 border-t border-white/5">
                                      <span className="text-slate-400">Close Probability:</span>
                                      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 font-mono text-sm">{data.probability}%</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 mt-1">
                                      <span className="text-slate-400">Meeting Sentiment:</span>
                                      <span className="font-bold text-amber-400 uppercase text-[9px] tracking-wide font-mono">{data.sentiment}</span>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="probability" 
                            stroke="url(#indigoToEmeraldStroke)" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#indigoToEmeraldFill)" 
                            activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
                            isAnimationActive={true}
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400/50 mt-4 font-mono pt-4 border-t border-white/5 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400/20 border border-emerald-400 animate-pulse"></span>
                        <span>Neural Trend Predictive Modeling</span>
                      </div>
                      <span>Sync Target: CRM Pipeline</span>
                    </div>
                  </div>
                </div>
              )}
                          {/* TAB CONTENT: TRANSCRIPT SIGNALS */}
              {activeTab === "transcript" && (() => {
                const { count: matchCount, matchingLineIndices, totalLinesCount } = getTranscriptMatches();
                return (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 items-start">
                    
                    {/* LEFT COLUMN: TRANSCRIPT VIEW */}
                    <div className="xl:col-span-2 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-black/60">Verbatim Speech Log &amp; AI Annotations</h4>
                          <p className="text-[10px] text-black/45 font-serif italic mt-0.5">
                            Detecting and categorizing vocal cues and emotional fluctuations in real-time. Click any statement to highlight it as a Key Insight.
                          </p>
                        </div>
                        
                        {/* Integrated search bar inside the transcript component */}
                        <div className="flex items-center gap-2 flex-1 sm:justify-end max-w-md w-full self-end sm:self-center">
                          <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-40 text-black pointer-events-none" />
                            <input
                              id="transcript-local-search"
                              type="text"
                              placeholder="Search transcript..."
                              value={transcriptSearchQuery}
                              onChange={(e) => setTranscriptSearchQuery(e.target.value)}
                              className="w-full bg-[#FBFBFA] border border-black/10 hover:border-black/25 rounded px-2.5 py-1.5 pl-8 text-xs font-mono text-black placeholder:text-black/35 focus:outline-none focus:border-black/50 focus:ring-1 focus:ring-black/20 transition-all"
                            />
                            {transcriptSearchQuery && (
                              <button
                                onClick={() => setTranscriptSearchQuery("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-black/40 hover:text-black p-0.5"
                                title="Clear transcript search"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Case Sensitive Toggle */}
                          <button
                            onClick={() => setTranscriptSearchCaseSensitive(!transcriptSearchCaseSensitive)}
                            className={`px-2.5 py-1.5 text-xs font-mono rounded border transition-all flex items-center gap-1.5 shrink-0 select-none ${
                              transcriptSearchCaseSensitive
                                ? "bg-amber-100 text-amber-950 border-amber-300 font-bold shadow-xs"
                                : "bg-[#FBFBFA] text-black/60 border-black/10 hover:border-black/25 hover:text-black/80"
                            }`}
                            title="Toggle case sensitivity for search matching"
                          >
                            <span className={transcriptSearchCaseSensitive ? "text-amber-800" : "text-black/40"}>Aa</span>
                            <span className="text-[10px] hidden sm:inline">Case Sensitive</span>
                          </button>

                          {/* Match count and Navigation Context */}
                          {(transcriptSearchQuery.trim() || searchQuery.trim()) && (
                            <div className="flex items-center gap-1.5 shrink-0 select-none">
                              {matchingLineIndices.length > 0 ? (
                                <>
                                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-1 rounded bg-amber-100 text-amber-800 border border-amber-200/50 transition-all animate-pulse-once" title="Navigation Context: Showing X of Y matched lines">
                                    Showing {currentMatchIndex + 1} of {matchingLineIndices.length} matches
                                  </span>
                                  
                                  {/* Navigation Prev/Next controls */}
                                  <div className="flex items-center border border-black/10 rounded overflow-hidden bg-[#FBFBFA]">
                                    <button
                                      onClick={() => {
                                        setCurrentMatchIndex((prev) => 
                                          prev === 0 ? matchingLineIndices.length - 1 : prev - 1
                                        );
                                      }}
                                      className="px-2 py-1 hover:bg-black/5 transition-colors border-r border-black/5 flex items-center justify-center text-black/60 hover:text-black"
                                      title="Previous match"
                                    >
                                      <ChevronUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setCurrentMatchIndex((prev) => 
                                          prev === matchingLineIndices.length - 1 ? 0 : prev + 1
                                        );
                                      }}
                                      className="px-2 py-1 hover:bg-black/5 transition-colors flex items-center justify-center text-black/60 hover:text-black"
                                      title="Next match"
                                    >
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-1 rounded bg-black/5 text-black/45 transition-all">
                                  No matches found
                                </span>
                              )}
                            </div>
                          )}
                          
                          <span className="text-[9px] font-mono opacity-50 shrink-0 bg-black/5 px-2 py-1 rounded hidden md:inline">Whisper API</span>
                        </div>
                      </div>
                      
                      {/* Sentiment Intensity & Vocal Cues Legend */}
                      <div className="bg-[#FBFBFA] border border-black/5 p-4 rounded-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-black/50" />
                            <span className="font-bold uppercase tracking-wider text-black/60 text-[10px]">Sentiment Intensity &amp; Vocal Cues Legend</span>
                          </div>
                          <span className="text-[9px] font-mono text-black/40 bg-black/5 px-2 py-0.5 rounded">Sales Context &amp; Significance</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Hesitation */}
                          <div className="bg-white border border-black/5 p-2.5 rounded-sm flex flex-col justify-between hover:border-amber-200/50 hover:bg-amber-50/5 transition-all">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/50 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                                  <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                                  hesitation
                                </span>
                                <span className="text-[9px] font-mono text-black/35 font-semibold">Low/Medium</span>
                              </div>
                              <p className="text-[11px] text-black/65 leading-relaxed">
                                <strong className="text-black/80 font-medium">Sales Impact:</strong> Signifies uncertainty, pricing friction, or competing tools. Highlights areas requiring prompt reassurance, competitor differentiation, or custom SLA packages.
                              </p>
                            </div>
                          </div>

                          {/* Emphasis */}
                          <div className="bg-white border border-black/5 p-2.5 rounded-sm flex flex-col justify-between hover:border-indigo-200/50 hover:bg-indigo-50/5 transition-all">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200/50 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                                  <TrendingUp className="w-3 h-3 text-indigo-600 shrink-0" />
                                  emphasis
                                </span>
                                <span className="text-[9px] font-mono text-black/35 font-semibold font-mono text-indigo-600/70">Analytical Key</span>
                              </div>
                              <p className="text-[11px] text-black/65 leading-relaxed">
                                <strong className="text-black/80 font-medium">Sales Impact:</strong> pinpoints non-negotiable compliance mandates, critical integrations (such as SAP mapping), and specific budget boundaries. Essential for contract alignment.
                              </p>
                            </div>
                          </div>

                          {/* Excitement */}
                          <div className="bg-white border border-black/5 p-2.5 rounded-sm flex flex-col justify-between hover:border-emerald-200/50 hover:bg-emerald-50/5 transition-all">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                                  <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                                  excitement
                                </span>
                                <span className="text-[9px] font-mono text-black/35 font-semibold text-emerald-600/70">Buying Intent</span>
                              </div>
                              <p className="text-[11px] text-black/65 leading-relaxed">
                                <strong className="text-black/80 font-medium">Sales Impact:</strong> Signals high buying readiness, dynamic stakeholder alignment, and strong appreciation for current features. Indicates strong opportunity velocity and readiness to close.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="bg-[#FBFBFA] border border-black/5 p-5 pr-8 font-mono text-xs leading-relaxed max-h-[400px] overflow-y-auto rounded-sm space-y-4 whitespace-pre-line relative">
                          {/* Display annotated dialog */}
                          {selectedMeeting.transcript ? (
                            selectedMeeting.transcript.split("\n").map((line, idx) => {
                              const isCustomer = line.startsWith("Customer") || line.toLowerCase().includes("customer") || line.includes("Vikram") || line.includes("Pooja");
                              const isActive = matchingLineIndices.length > 0 && idx === matchingLineIndices[currentMatchIndex];
                              const isSpokenNow = isPlaying && getActiveLineIndex(selectedMeeting.id, audioCurrentTime, selectedMeeting.transcript.split("\n").length) === idx;
                              const isHighlighted = (curatedHighlights[selectedMeeting.id] || []).some(h => h.lineIndex === idx);
                              const lineSeconds = getLineTimestamp(selectedMeeting.id, idx);
                              const lineTimeFormatted = formatAudioTime(lineSeconds);

                              return (
                                <div 
                                  key={idx} 
                                  id={`transcript-line-${idx}`}
                                  className={`p-2.5 rounded transition-all duration-300 relative group/line cursor-pointer ${
                                    isSpokenNow
                                      ? "bg-indigo-50/60 border-l-4 border-indigo-600 ring-1 ring-indigo-300/40 shadow-xs font-medium"
                                      : isHighlighted
                                        ? "bg-amber-50/70 border-l-4 border-amber-500 ring-1 ring-amber-300/60 shadow-xs"
                                        : isActive
                                          ? "bg-[#FCF6E5] border-l-4 border-amber-500 ring-1 ring-amber-300/40 shadow-xs"
                                          : isCustomer 
                                            ? "bg-slate-50 border-l-2 border-slate-300 hover:bg-slate-100/50" 
                                            : "bg-white border-l-2 border-transparent hover:bg-[#FAF9F5]/45"
                                  }`}
                                  onClick={(e) => {
                                    // Only toggle highlight if we didn't click an interactive button
                                    const target = e.target as HTMLElement;
                                    if (!target.closest("button") && !target.closest("select") && !target.closest("input")) {
                                      handleToggleHighlight(
                                        selectedMeeting.id,
                                        idx,
                                        line,
                                        isCustomer ? "Client Stakeholder" : "Sales Rep",
                                        lineSeconds
                                      );
                                    }
                                  }}
                                >
                                  <div className="flex items-center justify-between mb-1.5 select-none">
                                    <span className="font-bold text-black/70 text-[10px] flex items-center gap-1.5">
                                      {isCustomer ? "✦ Client Stakeholder" : "▲ Sales Rep"}
                                      {isSpokenNow && (
                                        <span className="inline-flex items-center gap-0.5 animate-pulse" title="Currently speaking voice snippet">
                                          <span className="w-0.5 h-2 bg-indigo-600 rounded-full"></span>
                                          <span className="w-0.5 h-3 bg-indigo-600 rounded-full"></span>
                                          <span className="w-0.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                        </span>
                                      )}
                                      {isHighlighted && (
                                        <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500 text-white shadow-3xs animate-fade-in">
                                          <Lightbulb className="w-2 h-2 fill-current" />
                                          <span>Key Insight</span>
                                        </span>
                                      )}
                                    </span>
                                    
                                    <div className="flex items-center gap-2">
                                      {/* Manual curation action toggle */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleHighlight(
                                            selectedMeeting.id,
                                            idx,
                                            line,
                                            isCustomer ? "Client Stakeholder" : "Sales Rep",
                                            lineSeconds
                                          );
                                        }}
                                        className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded border transition-all cursor-pointer opacity-80 group-hover/line:opacity-100 ${
                                          isHighlighted
                                            ? "bg-amber-500 text-white border-amber-600 shadow-3xs"
                                            : "bg-white text-black/40 border-black/10 hover:border-black/20 hover:text-black hover:bg-[#FAF9F5]"
                                        }`}
                                        title={isHighlighted ? "Remove Manual Key Insight Highlight" : "Manually Highlight as Key Insight"}
                                      >
                                        <Lightbulb className={`w-2.5 h-2.5 ${isHighlighted ? "fill-white" : ""}`} />
                                        <span className="hidden sm:inline">{isHighlighted ? "Curated" : "Highlight"}</span>
                                      </button>

                                      {/* Audio seek button */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handlePlayFromTimestamp(lineSeconds);
                                        }}
                                        className={`inline-flex items-center gap-1.5 text-[9px] font-mono font-semibold px-2 py-0.5 rounded border transition-all cursor-pointer ${
                                          isSpokenNow 
                                            ? "bg-indigo-600 text-white border-indigo-700 font-bold shadow-3xs" 
                                            : "bg-white text-black/60 border-black/10 hover:border-black/25 hover:text-black hover:bg-[#FAF9F5]"
                                        }`}
                                        title={`Seek recording playback to ${lineTimeFormatted}`}
                                      >
                                        <Play className="w-2 h-2 fill-current" />
                                        <span>{lineTimeFormatted}</span>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="font-sans text-sm text-black/85 leading-relaxed">
                                    {renderTextWithVocalCues(line, isActive)}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <span className="text-black/40 italic">No raw transcription records available.</span>
                          )}
                        </div>

                        {/* Subtle Match Indicators in scrollbar track */}
                        {matchingLineIndices.length > 0 && (
                          <div 
                            className="absolute right-0.5 top-2 bottom-2 w-1.5 pointer-events-none"
                            style={{ height: "calc(100% - 16px)" }}
                          >
                            {matchingLineIndices.map((lineIdx, i) => {
                              const percent = totalLinesCount > 1 
                                ? (lineIdx / (totalLinesCount - 1)) * 95 + 2.5 
                                : 50;
                              return (
                                <div 
                                  key={i}
                                  className="absolute right-0 w-1.5 h-1 bg-amber-500 rounded-xs ring-1 ring-amber-300 shadow-xs opacity-90"
                                  style={{ top: `${percent}%` }}
                                  title={`Search match at line ${lineIdx + 1}`}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT COLUMN: CURATED KEY INSIGHTS SIDE PANEL */}
                    <div className="xl:col-span-1 space-y-4 bg-[#FAF9F5] border border-black/10 rounded-sm p-4 shadow-3xs flex flex-col min-h-[300px]">
                      <div className="flex items-center justify-between border-b border-black/10 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Bookmark className="w-4 h-4 text-[#2A5C43] fill-[#2A5C43]" />
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-black/85">Manually Curated</h4>
                            <p className="text-[9px] font-mono text-black/50 uppercase mt-0.5">Key Insights &amp; Markers</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-[#EBF3EF] text-[#2A5C43] border border-[#2A5C43]/15 px-2 py-0.5 rounded-full">
                          {(curatedHighlights[selectedMeeting.id] || []).length} Pinned
                        </span>
                      </div>

                      <p className="text-[11px] text-black/60 leading-relaxed font-sans">
                        Pin key segments from the transcript as curated client demands or buying signals. They will automatically be compiled and mapped here for rapid executive review.
                      </p>

                      {/* Curated list or empty state */}
                      {(curatedHighlights[selectedMeeting.id] || []).length > 0 ? (
                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-1">
                          {(curatedHighlights[selectedMeeting.id] || []).map((h) => {
                            const lineSeconds = getLineTimestamp(selectedMeeting.id, h.lineIndex);
                            const isSpokenNow = isPlaying && getActiveLineIndex(selectedMeeting.id, audioCurrentTime, selectedMeeting.transcript.split("\n").length) === h.lineIndex;
                            return (
                              <div
                                key={h.id}
                                className={`p-3 rounded border transition-all duration-200 group/curated cursor-pointer ${
                                  isSpokenNow
                                    ? "bg-indigo-50 border-indigo-400 shadow-3xs ring-1 ring-indigo-200"
                                    : "bg-white border-black/5 hover:border-black/15 shadow-4xs"
                                }`}
                                onClick={() => handlePlayFromTimestamp(lineSeconds)}
                                title="Click to seek recording playback to this moment"
                              >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[8px] font-mono font-bold uppercase text-black/45">
                                      {h.speaker === "Client Stakeholder" ? "✦ Stakeholder" : "▲ Sales Rep"}
                                    </span>
                                  </div>

                                  {/* Action controls inside item */}
                                  <div className="flex items-center gap-1">
                                    {/* Play / Seek control */}
                                    <span className="text-[9px] font-mono text-[#2A5C43] bg-[#EBF3EF] font-bold px-1.5 py-0.2 rounded border border-[#2A5C43]/10">
                                      {formatAudioTime(lineSeconds)}
                                    </span>

                                    {/* Delete curation */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleHighlight(
                                          selectedMeeting.id,
                                          h.lineIndex,
                                          h.text,
                                          h.speaker,
                                          lineSeconds
                                        );
                                      }}
                                      className="p-1 hover:bg-red-50 text-black/40 hover:text-red-600 rounded transition-colors cursor-pointer"
                                      title="Remove from Curated Insights"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                <blockquote className="text-xs font-serif leading-relaxed text-black/85 border-l-2 border-amber-400 pl-2 py-0.5 italic mb-2">
                                  "{h.text.replace(/^[^:]+:\s*/, "")}"
                                </blockquote>

                                {/* Insight Category Tag Dropdown */}
                                <div className="flex items-center justify-between pt-1 border-t border-black/5 mt-1.5">
                                  <span className="text-[8.5px] font-mono text-black/40">Category:</span>
                                  <select
                                    value={h.category || "General Insight"}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleUpdateHighlightCategory(selectedMeeting.id, h.id, e.target.value)}
                                    className="text-[9px] font-bold py-0.5 pl-1.5 pr-5 border border-black/10 rounded bg-[#FAF9F5] text-black/70 hover:text-black hover:border-black/20 focus:ring-1 focus:ring-black/10 cursor-pointer appearance-none"
                                    style={{ outline: "none", backgroundImage: "none" }}
                                  >
                                    <option value="General Insight">General Insight</option>
                                    <option value="Pricing / Budget">Pricing / Budget</option>
                                    <option value="Action Item">Action Item</option>
                                    <option value="Competitor Info">Competitor Info</option>
                                    <option value="Product Feedback">Product Feedback</option>
                                    <option value="Decision Maker">Decision Maker</option>
                                  </select>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-black/10 rounded p-6 text-center text-black/40 bg-white">
                          <Lightbulb className="w-8 h-8 mb-2 text-amber-500 stroke-1 fill-amber-50" />
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-black/60 font-sans">No Curated Insights Yet</h5>
                          <p className="text-[10px] font-serif italic text-black/50 max-w-[180px] mt-1 leading-relaxed">
                            Click any dialogue row in the transcript viewer to highlight and pin manual insights!
                          </p>
                        </div>
                      )}

                      {/* Export curated highlights to Markdown clipboard */}
                      {(curatedHighlights[selectedMeeting.id] || []).length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const highlightsList = (curatedHighlights[selectedMeeting.id] || [])
                              .map((h, i) => {
                                const seconds = getLineTimestamp(selectedMeeting.id, h.lineIndex);
                                const time = formatAudioTime(seconds);
                                const cleanText = h.text.replace(/^[^:]+:\s*/, "");
                                return `${i + 1}. [${time}] **${h.speaker}** (${h.category || "General"}):\n   *"${cleanText}"*`;
                              })
                              .join("\n\n");
                            navigator.clipboard.writeText(highlightsList);
                            const btn = document.getElementById("copy-curated-btn");
                            if (btn) {
                              const originalText = btn.innerHTML;
                              btn.innerHTML = "✓ Copied to Clipboard!";
                              setTimeout(() => {
                                btn.innerHTML = originalText;
                              }, 2000);
                            }
                          }}
                          id="copy-curated-btn"
                          className="w-full mt-3 py-1.5 bg-black hover:bg-black/85 text-white text-[9px] font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Copy className="w-3 h-3 text-white" />
                          Export Curated List
                        </button>
                      )}
                    </div>

                  </div>
                );
              })()}

              {/* TAB CONTENT: LONG-TERM MEMORY */}
              {activeTab === "memory" && selectedDeal && (
                <div className="space-y-6 flex-1">
                  <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                      Persistent Evolving Memory
                    </h4>
                    <p className="text-[11px] text-indigo-950/70">
                      This information was synthesized across this and all previous customer encounters. It models how our CRM evolves with the customer's state.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    
                    <div className="p-4 border border-black/5 rounded-sm">
                      <span className="text-[9px] font-bold uppercase opacity-40 block mb-2">Budget Profile</span>
                      <p className="font-serif italic text-sm text-black/80 font-semibold">
                        {selectedDeal.memory.budget}
                      </p>
                    </div>

                    <div className="p-4 border border-black/5 rounded-sm">
                      <span className="text-[9px] font-bold uppercase opacity-40 block mb-2">Implementation Timeline</span>
                      <p className="text-sm text-black/80 leading-relaxed">
                        {selectedDeal.memory.timeline}
                      </p>
                    </div>

                    <div className="p-4 border border-black/5 rounded-sm col-span-1 md:col-span-2">
                      <span className="text-[9px] font-bold uppercase opacity-40 block mb-2">Required Integrations &amp; Connectors</span>
                      {selectedDeal.memory.integrationsRequired && selectedDeal.memory.integrationsRequired.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedDeal.memory.integrationsRequired.map((int, i) => (
                            <span key={i} className="px-2.5 py-1 bg-slate-100 font-mono text-[10px] uppercase rounded">
                              {int}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-black/40 italic">None logged.</p>
                      )}
                    </div>

                    <div className="p-4 border border-black/5 rounded-sm">
                      <span className="text-[9px] font-bold uppercase opacity-40 block mb-2">Security Constraints Mapped</span>
                      {selectedDeal.memory.securityConcerns && selectedDeal.memory.securityConcerns.length > 0 ? (
                        <ul className="space-y-1 mt-1">
                          {selectedDeal.memory.securityConcerns.map((sec, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Shield className="w-3 h-3 text-emerald-700 shrink-0" />
                              <span>{sec}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-black/40 italic">None logged.</p>
                      )}
                    </div>

                    <div className="p-4 border border-black/5 rounded-sm">
                      <span className="text-[9px] font-bold uppercase opacity-40 block mb-2">Identified Decision Makers</span>
                      {selectedDeal.memory.decisionMakers && selectedDeal.memory.decisionMakers.length > 0 ? (
                        <ul className="space-y-1 mt-1">
                          {selectedDeal.memory.decisionMakers.map((dm, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Users className="w-3 h-3 text-slate-500 shrink-0" />
                              <span>{dm}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-black/40 italic">None logged.</p>
                      )}
                    </div>

                    <div className="p-4 border border-black/5 rounded-sm col-span-1 md:col-span-2">
                      <span className="text-[9px] font-bold uppercase opacity-40 block mb-2">Competitors List</span>
                      {selectedDeal.memory.competitors && selectedDeal.memory.competitors.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedDeal.memory.competitors.map((comp, i) => (
                            <span key={i} className="px-2 py-0.5 border border-red-200 text-red-800 text-[10px] rounded uppercase font-bold">
                              {comp}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-black/40 italic">No external competitors identified in conversations.</p>
                      )}
                    </div>

                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-black/35">
              <Info className="w-10 h-10 mb-3 stroke-1" />
              <h3 className="text-lg font-serif italic mb-1">No Active Meeting View</h3>
              <p className="text-xs max-w-md leading-relaxed">
                Log a transcription or select a previous timeline session on the left to review automated summaries, extracted requirements, objections, and buying signals.
              </p>
            </div>
          )}

          {/* DEAL CLOSE PREDICTION EXPLANATION BOX */}
          {selectedDeal && selectedDeal.prediction && (
            <div className="mt-8 pt-6 border-t border-black/10 bg-[#2A5C43]/5 p-5 rounded">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[9px] font-mono tracking-widest uppercase text-[#2A5C43] font-bold">
                    Probability Analysis Node
                  </span>
                  <h4 className="text-sm font-bold uppercase tracking-tight">Deal Success Outlook</h4>
                </div>
                <div className="font-serif italic text-3xl text-[#2A5C43]">
                  {selectedDeal.prediction.probability}%
                </div>
              </div>
              <ul className="space-y-1.5 text-xs">
                {selectedDeal.prediction.reasons && selectedDeal.prediction.reasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-black/75">
                    <Check className="w-3.5 h-3.5 text-[#2A5C43] shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
              <div className="text-[9px] font-mono opacity-40 mt-3 text-right">
                Last Evaluated: {new Date(selectedDeal.prediction.lastUpdated).toLocaleString()}
              </div>
            </div>
          )}

        </section>

        {/* ==================== RIGHT COLUMN: CO-PILOT CHAT & EMAIL GENERATOR ==================== */}
        <section className="col-span-1 lg:col-span-3 bg-[#080a12]/90 p-6 md:p-8 flex flex-col overflow-y-auto border-t lg:border-t-0 lg:border-l border-white/5 gap-8 backdrop-blur-md">
          
          {/* NEXT BEST ACTIONS CHECKLIST */}
          {selectedDeal && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">Next Best Actions</h2>
                  {selectedDeal.nextActions && selectedDeal.nextActions.length > 0 && (
                    <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400 cursor-pointer hover:text-slate-200 select-none">
                      <input
                        type="checkbox"
                        checked={selectedDeal.nextActions.length > 0 && selectedDeal.nextActions.every(a => bulkSelectedIds.includes(a.id))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkSelectedIds(selectedDeal.nextActions.map(a => a.id));
                          } else {
                            setBulkSelectedIds([]);
                          }
                        }}
                        className="accent-indigo-500 h-3.5 w-3.5 border-white/10 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>Select All</span>
                    </label>
                  )}
                </div>
                {bulkSelectedIds.length > 0 && (
                  <button
                    onClick={handleBulkCompleteActions}
                    className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg"
                  >
                    Bulk Mark Complete ({bulkSelectedIds.length})
                  </button>
                )}
              </div>

              {selectedDeal.nextActions && selectedDeal.nextActions.length > 0 ? (
                <div className="space-y-3">
                  {selectedDeal.nextActions.map((action) => {
                    const currentStatus = action.status || (action.completed ? 'Completed' : 'Pending');
                    const countdown = getDueDateCountdown(action.dueDate, action.completed);
                    return (
                      <div
                        key={action.id}
                        className="p-3 bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 rounded-xl transition-all duration-300 text-xs"
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={bulkSelectedIds.includes(action.id)}
                            onChange={() => handleToggleBulkSelect(action.id)}
                            className="mt-1 accent-indigo-500 h-3.5 w-3.5 border-white/10 rounded focus:ring-indigo-500 cursor-pointer shrink-0"
                            title="Select for bulk action"
                          />
                          <button
                            onClick={() => handleUpdateActionStatus(action.id, action.completed ? 'Pending' : 'Completed')}
                            className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center transition-colors shrink-0 ${
                              action.completed
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "bg-white/[0.05] border-white/20 hover:border-white"
                            }`}
                            title={action.completed ? "Mark Incomplete" : "Mark Complete"}
                          >
                            {action.completed && <Check className="w-3 h-3" />}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 leading-tight">
                              {/* Colored Dot Status Indicator */}
                              <span 
                                className={`w-2 h-2 rounded-full inline-block shrink-0 ${
                                  currentStatus === 'Completed'
                                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                    : currentStatus === 'In Progress'
                                    ? 'bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                                    : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                  }`}
                                title={`Status: ${currentStatus}`}
                              />
                              <span className={`font-semibold block text-slate-100 ${action.completed ? "line-through opacity-45" : ""}`}>
                                {action.action}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-1 pl-3.5">{action.description}</span>
                            <div className="flex items-center justify-between mt-2.5 text-[9px] font-mono pl-3.5 flex-wrap gap-2">
                              {/* Dynamic Date Picker Calendar */}
                              <div className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg border border-white/5 cursor-pointer text-[9px] transition-colors">
                                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="text-slate-400 font-bold uppercase mr-1">Due:</span>
                                <input
                                  type="date"
                                  value={action.dueDate || ""}
                                  onChange={(e) => handleUpdateActionDueDate(action.id, e.target.value)}
                                  className="bg-transparent border-0 p-0 text-[9px] font-mono focus:ring-0 cursor-pointer w-24 text-slate-200 font-semibold uppercase focus:outline-none"
                                />
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {/* Countdown indicator */}
                                {countdown && (
                                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase border font-mono ${
                                    countdown.severity === 'overdue'
                                      ? 'bg-rose-950/40 text-rose-300 border-rose-500/20'
                                      : countdown.severity === 'high'
                                      ? 'bg-orange-950/40 text-orange-300 border-orange-500/20'
                                      : countdown.severity === 'medium'
                                      ? 'bg-amber-950/40 text-amber-300 border-amber-500/20'
                                      : 'bg-white/5 text-slate-400 border-white/10'
                                  }`}>
                                    {countdown.text}
                                  </span>
                                )}
                                <select
                                  value={currentStatus}
                                  onChange={(e) => handleUpdateActionStatus(action.id, e.target.value as 'Pending' | 'In Progress' | 'Completed')}
                                  className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-lg uppercase tracking-wider border-0 cursor-pointer focus:ring-1 focus:ring-indigo-500/20 appearance-none pr-3 font-mono ${
                                    currentStatus === 'Completed'
                                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/20'
                                      : currentStatus === 'In Progress'
                                      ? 'bg-blue-950/40 text-blue-300 border border-blue-500/20'
                                      : 'bg-amber-950/40 text-amber-300 border border-amber-500/20'
                                  }`}
                                  style={{ backgroundImage: 'none' }}
                                >
                                  <option value="Pending" className="bg-[#0f111a]">Pending ▾</option>
                                  <option value="In Progress" className="bg-[#0f111a]">In Progress ▾</option>
                                  <option value="Completed" className="bg-[#0f111a]">Completed ▾</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs font-serif italic text-slate-500">No pending customer follow-ups mapped.</p>
              )}
            </div>
          )}

          {/* GENERATIVE FOLLOW-UP EMAIL DRAFTER */}
          {selectedMeeting && (
            <div className="border-t border-white/5 pt-6">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4 text-indigo-400 font-mono">Smart Email Drafter</h2>
              
              {!generatedEmail ? (
                <button
                  onClick={() => handleGenerateEmail(selectedMeeting.id)}
                  disabled={isGeneratingEmail}
                  className="w-full text-left p-4 bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group rounded-xl hover:shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                  id="draft-email-btn"
                >
                  <div className="text-[9px] font-bold uppercase mb-1 flex items-center gap-1 text-indigo-300">
                    <Sparkles className="w-3 h-3 fill-indigo-300" />
                    AI Copywriter
                  </div>
                  <div className="text-xs font-medium flex items-center justify-between text-slate-200">
                    <span>Draft personalized follow-up for today's session</span>
                    <Mail className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity ml-2 shrink-0 text-indigo-400" />
                  </div>
                </button>
              ) : (
                <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl text-xs">
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                    <span className="font-bold text-[9px] uppercase tracking-wider text-indigo-400">Generated Copy</span>
                    <button
                      onClick={copyEmailToClipboard}
                      className="text-[10px] underline hover:text-white font-semibold text-indigo-300"
                    >
                      Copy Draft
                    </button>
                  </div>
                  <div className="max-h-[160px] overflow-y-auto text-slate-300 font-sans leading-relaxed whitespace-pre-wrap text-[11px]">
                    {generatedEmail}
                  </div>
                  <button
                    onClick={() => handleGenerateEmail(selectedMeeting.id)}
                    className="w-full mt-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-colors border border-indigo-500/20"
                  >
                    Regenerate
                  </button>
                </div>
              )}

              {isGeneratingEmail && (
                <div className="p-4 bg-white/[0.01] border border-white/5 flex items-center gap-2.5 justify-center rounded-xl">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                  <span className="text-xs font-mono text-slate-400">Grounded email drafting in progress...</span>
                </div>
              )}
            </div>
          )}

          {/* INTERACTIVE SALES COPILOT CHAT (RAG) */}
          {selectedDeal && (
            <div className="border-t border-white/5 pt-6 flex flex-col flex-1 min-h-[300px]">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-indigo-400 font-mono">RAG Sales Assistant</h2>
              
              {/* Query suggestion chips */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <button
                  onClick={() => handlePresetQuery("What is the customer's budget?")}
                  className="text-[9px] bg-white/[0.04] border border-white/10 px-2 py-1 rounded-lg text-slate-300 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                >
                  Budget?
                </button>
                <button
                  onClick={() => handlePresetQuery("What security concerns have they raised?")}
                  className="text-[9px] bg-white/[0.04] border border-white/10 px-2 py-1 rounded-lg text-slate-300 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                >
                  Security?
                </button>
                <button
                  onClick={() => handlePresetQuery("Are there any competitors?")}
                  className="text-[9px] bg-white/[0.04] border border-white/10 px-2 py-1 rounded-lg text-slate-300 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                >
                  Competitors?
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 bg-slate-950/40 border border-white/5 rounded-xl p-3.5 mb-3 overflow-y-auto max-h-[220px] text-xs space-y-3">
                {chatHistory.length === 0 ? (
                  <div className="text-slate-400 italic font-sans text-center py-6 text-[11px]">
                    Ask me any question about previous conversations, budgets, or technical blockers. I will fetch answers from our meeting transcript history.
                  </div>
                ) : (
                  chatHistory.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      <span className="text-[8px] uppercase tracking-wider text-slate-500 mb-0.5">
                        {msg.role === "user" ? "You" : "Deal Agent"}
                      </span>
                      <div className={`p-2.5 rounded-xl max-w-[90%] leading-relaxed ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white font-sans text-[11px]"
                          : "bg-white/[0.04] text-slate-200 font-sans border border-white/5 text-xs"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                {isChatLoading && (
                  <div className="flex items-center gap-1.5 text-slate-400 italic py-1">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>Searching transcript embeddings...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="relative">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Who is the key stakeholder?"
                  className="w-full bg-slate-950/40 border border-white/10 focus:border-indigo-500/50 text-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-xs focus:outline-none transition-all"
                  id="chat-input"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 p-1 transition-colors"
                  title="Send query"
                  id="chat-send-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

        </section>

      </main>
      ) : (
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {mainView === "dashboard" && (
            <ExecutiveDashboard 
              deals={deals} 
              onSelectDeal={(deal) => {
                handleSelectDeal(deal.id);
              }}
              onSetMainView={setMainView}
              isDarkMode={isDarkMode}
            />
          )}
          {mainView === "multi-agent" && selectedDeal && (
            <MultiAgentHub
              deal={selectedDeal}
              onRefreshDeal={() => fetchDeals(selectedDealId, false)}
            />
          )}
          {mainView === "competitor-research" && selectedDeal && (
            <CompanyResearch
              deal={selectedDeal}
              onUpdateDealMemory={handleUpdateDealMemory}
            />
          )}
          {mainView === "contract-rag" && selectedDeal && (
            <RagDataRoom deal={selectedDeal} />
          )}
          {mainView === "sales-practice" && (
            <SalesPracticeSimulator />
          )}
          {mainView === "digital-twin" && (
            <CustomerDigitalTwin selectedDeal={selectedDeal} />
          )}
          {mainView === "meeting-copilot" && (
            <MeetingCopilot />
          )}
          {mainView === "proposal-generator" && (
            <ProposalGenerator selectedDeal={selectedDeal} />
          )}
          {mainView === "executive-briefing" && (
            <ExecutiveBriefing selectedDeal={selectedDeal} />
          )}
        </main>
      )}

      {/* ==================== CREATE NEW SALES ACCOUNT DRAWER / MODAL ==================== */}
      {isCreatingDeal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200/80 max-w-lg w-full p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 rounded">
            <button
              onClick={() => setIsCreatingDeal(false)}
              className="absolute right-4 top-4 text-black hover:opacity-50 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold uppercase tracking-wide mb-1">Create New Sales Deal</h3>
            <p className="text-xs text-black/40 mb-6 uppercase tracking-widest font-semibold">Account Registry System</p>

            <form onSubmit={handleCreateDealSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Deal Name *</label>
                  <input
                    type="text"
                    required
                    value={newDealForm.name}
                    onChange={(e) => setNewDealForm({ ...newDealForm, name: e.target.value })}
                    placeholder="e.g. Omnichannel Logistics"
                    className="w-full bg-white border border-black/15 px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Company / Org *</label>
                  <input
                    type="text"
                    required
                    value={newDealForm.company}
                    onChange={(e) => setNewDealForm({ ...newDealForm, company: e.target.value })}
                    placeholder="e.g. Delta Retail Inc"
                    className="w-full bg-white border border-black/15 px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Estimated Value (INR)</label>
                  <input
                    type="number"
                    value={newDealForm.value}
                    onChange={(e) => setNewDealForm({ ...newDealForm, value: e.target.value })}
                    placeholder="e.g. 1500000"
                    className="w-full bg-white border border-black/15 px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={newDealForm.contactName}
                    onChange={(e) => setNewDealForm({ ...newDealForm, contactName: e.target.value })}
                    placeholder="e.g. Pooja Reddy"
                    className="w-full bg-white border border-black/15 px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Contact Job Title / Role</label>
                <input
                  type="text"
                  value={newDealForm.contactRole}
                  onChange={(e) => setNewDealForm({ ...newDealForm, contactRole: e.target.value })}
                  placeholder="e.g. VP of Security / Supply Chain Director"
                  className="w-full bg-white border border-black/15 px-3 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Initial Summary / Scope</label>
                <textarea
                  value={newDealForm.summary}
                  onChange={(e) => setNewDealForm({ ...newDealForm, summary: e.target.value })}
                  placeholder="Summarize key needs, initial context, budget hurdles..."
                  rows={3}
                  className="w-full bg-white border border-black/15 px-3 py-2 text-xs focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingDeal(false)}
                  className="px-4 py-2 border border-black/20 text-xs font-bold uppercase rounded hover:border-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-black/85"
                >
                  Create Deal Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== LOG MEETING DIALOGUE (TRANSCRIPT UPLOAD) ==================== */}
      {isAddingMeeting && selectedDeal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200/80 max-w-xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto rounded">
            <button
              onClick={handleCloseAddMeeting}
              className="absolute right-4 top-4 text-black hover:opacity-50 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold uppercase tracking-wide mb-1">Log &amp; Analyze Meeting Call</h3>
            <span className="text-[10px] font-semibold tracking-widest uppercase opacity-40 block mb-4">
              AI Speech Analysis Engine // {selectedDeal.company}
            </span>

            {/* Quick Demo Fill Buttons */}
            <div className="mb-6 p-4 bg-slate-50 border border-black/5 rounded">
              <span className="text-[9px] font-bold uppercase tracking-widest block mb-2 text-slate-500">
                Spectacular Hackathon Presets (Interactive Fillers)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {TRANSCRIPT_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadTranscriptPreset(idx)}
                    className="text-left p-2 bg-white hover:bg-black hover:text-white transition-all text-[10px] border border-black/10 rounded flex flex-col justify-between"
                  >
                    <span className="font-bold block truncate">{p.title}</span>
                    <span className="text-[8px] opacity-75 line-clamp-1 mt-1">{p.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddMeetingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase block mb-1">Meeting Title</label>
                  <input
                    type="text"
                    required
                    value={newMeetingTitle}
                    onChange={(e) => setNewMeetingTitle(e.target.value)}
                    placeholder="e.g. Meeting 5: SLA and Data Residency Sync"
                    className="w-full bg-white border border-black/15 px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase block mb-1">Date Conducted</label>
                  <input
                    type="date"
                    required
                    value={newMeetingDate}
                    onChange={(e) => setNewMeetingDate(e.target.value)}
                    className="w-full bg-white border border-black/15 px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase block mb-1">Scheduled Time</label>
                  <input
                    type="time"
                    required
                    value={newMeetingTime}
                    onChange={(e) => setNewMeetingTime(e.target.value)}
                    className="w-full bg-white border border-black/15 px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase block mb-1">Priority / Urgency</label>
                  <div className="relative">
                    <select
                      value={newMeetingPriority}
                      onChange={(e) => setNewMeetingPriority(e.target.value as "Low" | "Medium" | "High")}
                      className="w-full appearance-none bg-white border border-black/15 hover:border-black rounded px-3 py-2 pr-8 text-xs font-semibold focus:outline-none transition-colors cursor-pointer"
                      id="meeting-priority-selector"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Remind me Toggle */}
              <div className="flex items-center justify-between p-3 bg-black/5 rounded border border-black/5">
                <div className="flex flex-col pr-4">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-black" />
                    <span className="text-xs font-bold uppercase tracking-wider">Enable Meeting Reminder</span>
                  </div>
                  <span className="text-[10px] text-black/60 italic font-serif mt-0.5">
                    Alert me 1 hour before the next scheduled meeting in the timeline using browser notifications.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                  <input
                    type="checkbox"
                    checked={enableReminder}
                    onChange={(e) => handleToggleReminder(e.target.checked)}
                    className="sr-only peer"
                    id="meeting-reminder-toggle"
                  />
                  <div className="w-9 h-5 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              {/* ==================== AUDIO FILE UPLOAD & LIVE RECORD WORKSPACE ==================== */}
              <div className="border border-black/10 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between border-b border-black/10 pb-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider block text-black/75">
                    Audio Sync &amp; Speech-to-Text
                  </label>
                  
                  {/* Mode Selector */}
                  <div className="flex items-center gap-1.5 bg-black/5 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setAudioMode("upload");
                        setUploadedAudioFile(null);
                      }}
                      className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                        audioMode === "upload"
                          ? "bg-white text-black shadow-3xs"
                          : "text-slate-500 hover:text-black"
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAudioMode("record");
                        setUploadedAudioFile(null);
                      }}
                      className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                        audioMode === "record"
                          ? "bg-white text-black shadow-3xs"
                          : "text-slate-500 hover:text-black"
                      }`}
                    >
                      Record Live
                    </button>
                  </div>
                </div>

                {audioMode === "upload" ? (
                  <>
                    {!uploadedAudioFile ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                          isDragActive
                            ? "border-black bg-black/5 text-black"
                            : "border-black/15 bg-white text-black/50 hover:border-black/30 hover:bg-slate-50"
                        }`}
                        onClick={() => document.getElementById("audio-file-input")?.click()}
                      >
                        <input
                          type="file"
                          id="audio-file-input"
                          accept="audio/*"
                          className="hidden"
                          onChange={handleFileSelectChange}
                        />
                        <Upload className="w-8 h-8 opacity-70 mb-1 text-black/70" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-black">
                          Drag &amp; Drop Audio File Here
                        </span>
                        <span className="text-[10px] text-black/40 italic font-serif">
                          or click to browse local storage (.mp3, .wav, .m4a)
                        </span>
                      </div>
                    ) : (
                      <div className="border border-black/15 bg-white rounded p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-black/5 rounded text-black shrink-0">
                            <FileAudio className="w-6 h-6" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate text-black">{uploadedAudioFile.name}</p>
                            <p className="text-[10px] text-black/40 font-mono">
                              {(uploadedAudioFile.size / (1024 * 1024)).toFixed(2)} MB • Audio Format
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                          {!isTranscribing && !newMeetingTranscript.trim() && (
                            <button
                              type="button"
                              onClick={() => handleTranscribeAudioFile(uploadedAudioFile)}
                              className="px-3 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded hover:bg-black/85 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3 fill-white" />
                              Transcribe
                            </button>
                          )}
                          
                          {newMeetingTranscript.trim() && (
                            <span className="px-2 py-1 bg-[#E6F4EA] text-[#137333] text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                              <Check className="w-3 h-3" /> Transcribed
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setUploadedAudioFile(null);
                              setErrorMessage("");
                            }}
                            disabled={isTranscribing}
                            className="p-1.5 border border-black/10 hover:border-black text-black/60 hover:text-black rounded transition-colors disabled:opacity-40 cursor-pointer"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {!uploadedAudioFile ? (
                      <AudioRecorder
                        onRecordingComplete={(file) => {
                          setUploadedAudioFile(file);
                          // Auto trigger transcription to make it a completely friction-free, magical recording experience!
                          handleTranscribeAudioFile(file);
                        }}
                        isTranscribing={isTranscribing}
                        transcribingStatus={transcribingStatus}
                      />
                    ) : (
                      <div className="border border-black/15 bg-white rounded p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded shrink-0 border border-indigo-100">
                            <Mic className="w-6 h-6" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate text-indigo-900">{uploadedAudioFile.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {(uploadedAudioFile.size / 1024).toFixed(1)} KB • Captured Live Mic
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                          {!isTranscribing && !newMeetingTranscript.trim() && (
                            <button
                              type="button"
                              onClick={() => handleTranscribeAudioFile(uploadedAudioFile)}
                              className="px-3 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded hover:bg-black/85 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3 fill-white" />
                              Transcribe
                            </button>
                          )}
                          
                          {newMeetingTranscript.trim() && (
                            <span className="px-2 py-1 bg-[#E6F4EA] text-[#137333] text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                              <Check className="w-3 h-3" /> Transcribed
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setUploadedAudioFile(null);
                              setErrorMessage("");
                            }}
                            disabled={isTranscribing}
                            className="p-1.5 border border-black/10 hover:border-black text-black/60 hover:text-black rounded transition-colors disabled:opacity-40 cursor-pointer"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Transcription Stepper Loader */}
                {isTranscribing && (
                  <div className="p-3 bg-black/5 border border-black/5 rounded space-y-2 animate-pulse">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Speech-to-Text Pipeline
                      </span>
                      <span className="text-[9px] font-mono font-bold text-black/60">
                        PROCESSING
                      </span>
                    </div>
                    <div className="h-1 bg-black/10 rounded-full overflow-hidden">
                      <div className="h-full bg-black w-2/3 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-[10px] italic font-serif text-black/70">
                      {transcribingStatus}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase block">Verbatim Transcript / Meeting Recording Text *</label>
                  {newMeetingTranscript.trim() && (
                    <span className="text-[9px] font-mono text-[#137333] flex items-center gap-1 bg-[#E6F4EA] px-2 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#137333] animate-pulse"></span>
                      Draft Auto-Saved
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-black/40 block mb-2">Paste meeting notes, customer transcripts, or draft conversation snippets.</span>
                <textarea
                  required
                  value={newMeetingTranscript}
                  onChange={(e) => setNewMeetingTranscript(e.target.value)}
                  placeholder="Paste meeting recording speech content. Be sure to include statements describing budgets, timeline constraints, objections, or integration requests..."
                  rows={8}
                  className="w-full bg-white border border-black/15 px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseAddMeeting}
                  className="px-4 py-2 border border-black/20 text-xs font-bold uppercase rounded hover:border-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-black/85 flex items-center gap-1.5"
                  id="process-transcript-btn"
                >
                  <Sparkles className="w-4.5 h-4.5 fill-white" />
                  Process with Gemini AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== SIMULATED EMAIL NOTIFICATION VIEWER MODAL ==================== */}
      {viewingEmailNotification && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-slate-300 max-w-xl w-full rounded shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header / Title bar */}
            <div className="bg-slate-100 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                  @
                </div>
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Simulated Corporate Email Inbox
                </span>
              </div>
              <button
                onClick={() => setViewingEmailNotification(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                title="Close Email Inbox"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Email Metadata */}
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200 space-y-2 text-xs">
              <div className="flex items-center">
                <span className="w-16 font-semibold text-slate-400 font-mono">From:</span>
                <span className="text-slate-800 font-medium">
                  Sales Enablement Bot <span className="text-slate-400">&lt;no-reply@dealintelligence-crm.com&gt;</span>
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-16 font-semibold text-slate-400 font-mono">To:</span>
                <span className="text-slate-800 font-medium">
                  {viewingEmailNotification.recipientName} <span className="text-slate-400">&lt;{viewingEmailNotification.recipientEmail}&gt;</span>
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-16 font-semibold text-slate-400 font-mono">Date:</span>
                <span className="text-slate-600 font-mono">
                  {new Date(viewingEmailNotification.timestamp).toUTCString()}
                </span>
              </div>
              <div className="flex items-start">
                <span className="w-16 font-semibold text-slate-400 font-mono pt-0.5">Subject:</span>
                <span className="text-slate-900 font-bold font-sans">
                  {viewingEmailNotification.subject}
                </span>
              </div>
            </div>

            {/* Email Body */}
            <div className="px-8 py-6 max-h-[350px] overflow-y-auto bg-white text-slate-700 text-xs leading-relaxed font-sans whitespace-pre-wrap selection:bg-blue-100 selection:text-slate-900">
              {viewingEmailNotification.body}
            </div>

            {/* Actions / Footer */}
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                [Status: Auto-Sent Triggered]
              </span>
              <button
                type="button"
                onClick={() => setViewingEmailNotification(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Close Mail Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CRM SYNC SUCCESS CONFIRMATION MODAL ==================== */}
      {showCrmSyncSuccess && crmSyncSuccessPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="bg-white border border-black/10 rounded-lg shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-[#EBF5EF] px-6 py-5 border-b border-[#D2E7DA] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2A5C43] flex items-center justify-center">
                  <Check className="w-5 h-5 text-white animate-bounce" />
                </div>
                <div>
                  <h3 className="font-serif italic text-lg text-[#13301F] font-semibold leading-tight">
                    Corporate CRM Synchronized
                  </h3>
                  <p className="text-[9px] font-bold text-[#2A5C43] uppercase tracking-widest mt-0.5 font-mono">
                    Channel: API Pipeline Node // master-active
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCrmSyncSuccess(false)}
                className="text-[#2A5C43]/60 hover:text-[#2A5C43] transition-colors rounded-full p-1 hover:bg-[#D2E7DA]/50 cursor-pointer"
                title="Close Sync Details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="p-4 bg-[#FAF9F5] border border-black/5 rounded-sm space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-black/40">
                  <span>Target pipeline</span>
                  <span>Sync status</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-sm">{selectedDeal?.company}</span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    ● ACTIVE SYNCED
                  </span>
                </div>
                <div className="pt-2 border-t border-black/5 flex justify-between items-center text-[11px]">
                  <span className="text-black/50">Meeting: <strong className="text-black/80">{selectedMeeting?.title}</strong></span>
                  <span className="text-black/40 font-mono text-[10px]">
                    {new Date(crmSyncSuccessPayload.syncLog.syncedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Pushed Insights Summary Grid */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 border-b border-black/5 pb-1">
                  Synchronized Intelligence Payload
                </h4>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 border border-black/5 rounded-sm bg-white">
                    <span className="text-[9px] font-bold text-black/40 uppercase block mb-1">Curated Highlights</span>
                    <span className="text-xl font-bold font-mono">{crmSyncSuccessPayload.syncLog.curatedInsightsCount || 0}</span>
                    <span className="text-[10px] text-black/50 block mt-0.5 font-sans">Transcribed signal clips</span>
                  </div>
                  <div className="p-3 border border-black/5 rounded-sm bg-white">
                    <span className="text-[9px] font-bold text-black/40 uppercase block mb-1">Tracked Objections</span>
                    <span className="text-xl font-bold font-mono">{crmSyncSuccessPayload.syncLog.objectionsCount || 0}</span>
                    <span className="text-[10px] text-black/50 block mt-0.5 font-sans">CRM Risk logs matched</span>
                  </div>
                  <div className="p-3 border border-black/5 rounded-sm bg-white">
                    <span className="text-[9px] font-bold text-black/40 uppercase block mb-1">Agreed Requirements</span>
                    <span className="text-xl font-bold font-mono">{crmSyncSuccessPayload.syncLog.requirementsCount || 0}</span>
                    <span className="text-[10px] text-black/50 block mt-0.5 font-sans">Scoping fields mapped</span>
                  </div>
                  <div className="p-3 border border-black/5 rounded-sm bg-white">
                    <span className="text-[9px] font-bold text-black/40 uppercase block mb-1">Next Actions Generated</span>
                    <span className="text-xl font-bold font-mono">{crmSyncSuccessPayload.syncLog.actionsCount || 0}</span>
                    <span className="text-[10px] text-black/50 block mt-0.5 font-sans">Due tasks propagated</span>
                  </div>
                </div>

                {crmSyncSuccessPayload.syncLog.curatedInsights && crmSyncSuccessPayload.syncLog.curatedInsights.length > 0 && (
                  <div className="mt-4 p-4 border border-indigo-50 bg-indigo-50/20 rounded-sm">
                    <span className="text-[9px] font-bold text-indigo-900/50 uppercase block mb-2 tracking-wider font-mono">Synced Curated Snippets</span>
                    <ul className="space-y-2 max-h-[120px] overflow-y-auto">
                      {crmSyncSuccessPayload.syncLog.curatedInsights.map((insight: string, idx: number) => (
                        <li key={idx} className="text-xs text-indigo-950/80 font-serif italic border-l-2 border-indigo-400 pl-2">
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Developer/Auditor Raw Log block */}
              <div className="space-y-2">
                <details className="group border border-black/5 rounded-sm">
                  <summary className="bg-[#FAF9F5] p-3 text-[10px] font-bold uppercase tracking-wider text-black/60 cursor-pointer list-none flex items-center justify-between select-none font-mono">
                    <span>Developer Audit Log // RAW API RESPONSE</span>
                    <span className="text-[11px] group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="p-3 bg-black text-green-400 font-mono text-[10px] overflow-x-auto max-h-[160px] whitespace-pre selection:bg-white/20 selection:text-white">
                    {JSON.stringify(crmSyncSuccessPayload, null, 2)}
                  </div>
                </details>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-[#FAF9F5] px-6 py-4 border-t border-black/10 flex items-center justify-between">
              <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest">
                [Payload Hash: CRM-{crmSyncSuccessPayload.syncLog.id.split('-').pop()}]
              </span>
              <button
                type="button"
                onClick={() => setShowCrmSyncSuccess(false)}
                className="px-5 py-2 bg-[#2A5C43] hover:bg-[#204733] text-white text-[10px] font-bold uppercase tracking-widest rounded transition-colors cursor-pointer font-sans"
              >
                Acknowledge Sync
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== CRM SYNC FAILURE CONFIRMATION MODAL ==================== */}
      {showCrmSyncError && crmSyncErrorPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="bg-white border border-rose-200 rounded-lg shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-[#FFF0F2] px-6 py-5 border-b border-[#FDD5D9] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif italic text-lg text-[#5C1D24] font-semibold leading-tight">
                    CRM Synchronization Failed
                  </h3>
                  <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest mt-0.5 font-mono">
                    Gateway Error Code: {crmSyncErrorPayload.error || "CONNECTION_FAILURE"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isCrmSyncing && setShowCrmSyncError(false)}
                disabled={isCrmSyncing}
                className="text-rose-900/60 hover:text-rose-900 transition-colors rounded-full p-1 hover:bg-[#FDD5D9]/50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                title="Close Error Details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 relative">
              
              {/* Primary Error Message */}
              <div className="p-4 bg-[#FFF5F6] border border-rose-100 rounded-sm space-y-2 text-xs relative overflow-hidden min-h-[100px]">
                {isCrmSyncing && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center gap-2" id="crm-syncing-overlay">
                    <RefreshCw className="w-6 h-6 text-rose-600 animate-spin" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-800 animate-pulse font-mono">Retransmitting Payload...</span>
                  </div>
                )}
                <p className="font-semibold text-rose-950 font-sans">
                  The corporate CRM integration platform rejected the manual data transmission pipeline:
                </p>
                <p className="text-rose-900/80 leading-relaxed font-serif italic">
                  "{crmSyncErrorPayload.message}"
                </p>
                {crmSyncErrorPayload.suggestedAction && (
                  <p className="text-[11px] text-[#5C1D24]/60 font-mono mt-2 pt-2 border-t border-rose-100">
                    <span className="font-bold uppercase">Recommendation:</span> {crmSyncErrorPayload.suggestedAction}
                  </p>
                )}
              </div>

              {/* Specific Failed Insights list */}
              {crmSyncErrorPayload.failedInsights && crmSyncErrorPayload.failedInsights.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-black/5 pb-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                      Insights Blocked From Pushing ({crmSyncErrorPayload.failedInsights.length})
                    </h4>
                    <span className="text-[9px] font-mono text-rose-600 font-bold uppercase tracking-wider bg-rose-50 px-1.5 py-0.5 rounded">
                      ● TRANSMISSION ROLLBACKED
                    </span>
                  </div>
                  
                  <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                    {crmSyncErrorPayload.failedInsights.map((insight: string, idx: number) => (
                      <div key={idx} className="p-3 border-l-2 border-rose-400 bg-[#FFFBFB] text-xs font-sans text-rose-950 italic">
                        {insight}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-black/40 font-serif italic">
                    All other database states, actions, and objections were rolled back to avoid inconsistent records in corporate systems.
                  </p>
                </div>
              )}

              {/* Developer/Auditor CRM Sync Debugger & Telemetry Panel */}
              <div className="space-y-2">
                <CrmSyncDebugger
                  trace={crmSyncDebugTrace}
                  isCrmSyncing={isCrmSyncing}
                  onRetryFailed={(insights) => handleSyncWithCrm(undefined, insights)}
                  onRetryFull={() => handleSyncWithCrm()}
                />
              </div>

            </div>

            {/* Modal Footer with Retry button */}
            <div className="bg-[#FAF9F5] px-6 py-4 border-t border-black/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowCrmSyncError(false)}
                disabled={isCrmSyncing}
                className="px-4 py-2 border border-black/15 hover:bg-black/5 text-black text-[10px] font-bold uppercase tracking-widest rounded transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Dismiss
              </button>
              
              <div className="flex items-center gap-2.5">
                {shouldSimulateCrmError && (
                  <span className="text-[9px] text-amber-600 font-mono text-right max-w-[130px] leading-tight">
                    * Simulation active. Uncheck to succeed.
                  </span>
                )}
                
                {crmSyncErrorPayload.failedInsights && crmSyncErrorPayload.failedInsights.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSyncWithCrm(undefined, crmSyncErrorPayload.failedInsights)}
                    disabled={isCrmSyncing}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-colors cursor-pointer disabled:bg-amber-300 disabled:cursor-not-allowed"
                    id="retry-failed-insights-btn"
                  >
                    {isCrmSyncing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Retrying Failed...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retry Failed ({crmSyncErrorPayload.failedInsights.length})
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSyncWithCrm()}
                  disabled={isCrmSyncing}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-colors cursor-pointer disabled:bg-rose-300 disabled:cursor-not-allowed"
                  id="retry-full-sync-btn"
                >
                  {isCrmSyncing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Retrying All...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      Retry All
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================== AI VOICE ASSISTANT ROOM MODAL ==================== */}
      <VoiceRoomModal
        isOpen={isVoiceRoomOpen}
        onClose={() => setIsVoiceRoomOpen(false)}
        deal={selectedDeal}
        deals={deals}
      />

      {/* ==================== CRM SYNC FLOATING TOAST NOTIFICATIONS ==================== */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full" id="crm-toast-container">
        {crmToasts.map((toast) => (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className="p-4 rounded-xl border shadow-xl flex gap-3 items-start animate-slide-in relative overflow-hidden transition-all bg-white border-slate-200"
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'error' ? (
                <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                  <AlertCircle className="w-4 h-4 animate-bounce" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  {toast.title}
                </h4>
                <button
                  onClick={() => setCrmToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full hover:bg-slate-100 cursor-pointer"
                  title="Close Notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] font-medium text-slate-600 leading-normal font-sans">
                {toast.message}
              </p>

              {toast.failedInsightsCount !== undefined && toast.failedInsightsCount > 0 && (
                <p className="text-[9px] font-bold text-rose-500/80 font-mono flex items-center gap-1 pt-0.5">
                  <span>🚨</span> {toast.failedInsightsCount} curated highlight(s) failed CRM schema validation
                </p>
              )}

              {toast.suggestedAction && (
                <div className="mt-1.5 p-2 bg-slate-50 border border-slate-100 rounded text-[9px] font-medium text-slate-600 font-sans">
                  <span className="font-extrabold uppercase text-slate-400 block text-[7px] tracking-wider mb-0.5">Action:</span>
                  {toast.suggestedAction}
                </div>
              )}
              
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                  Category: {toast.category}
                </span>
                {toast.category === 'authentication' && (
                  <span className="text-[8px] font-semibold text-rose-600 uppercase tracking-wider animate-pulse">
                    🔑 Token Renewal Required
                  </span>
                )}
                {toast.category === 'timeout' && (
                  <span className="text-[8px] font-semibold text-amber-600 uppercase tracking-wider animate-pulse">
                    ⏳ Network Latency Peak
                  </span>
                )}
                {toast.category === 'validation' && (
                  <span className="text-[8px] font-semibold text-blue-600 uppercase tracking-wider animate-pulse">
                    📋 Check Payload Schema
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FLOATING COGNITIVE ASSISTANT CORE */}
      <FloatingAssistant 
        deals={deals} 
        currentView={mainView} 
        onSetView={setMainView} 
        userEmail={userEmail}
      />

      {/* ==================== COMMAND PALETTE (CTRL+K) MODAL OVERLAY ==================== */}
      {isCommandPaletteOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-start justify-center pt-[10vh] px-4 animate-in fade-in duration-200"
          onClick={() => setIsCommandPaletteOpen(false)}
        >
          <div 
            className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300 ${
              isDarkMode 
                ? "bg-[#0b0d19]/95 border-white/10 text-white" 
                : "bg-white border-slate-200 text-slate-800"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <form onSubmit={handleCommandPaletteSubmit} className={`flex items-center px-4 py-3.5 border-b ${
              isDarkMode ? "border-white/10" : "border-slate-200"
            }`}>
              <Search className="w-5 h-5 opacity-50 mr-3 text-indigo-500 shrink-0" />
              <input 
                type="text"
                autoFocus
                placeholder="Search views, run actions, or type 'vikram', 'arr', 'risk', 'discount'..."
                value={commandPaletteSearch}
                onChange={(e) => setCommandPaletteSearch(e.target.value)}
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-semibold placeholder:opacity-50"
              />
              <button
                type="button"
                onClick={() => setIsCommandPaletteOpen(false)}
                className={`p-1.5 rounded-lg text-xs font-mono uppercase tracking-widest opacity-60 hover:opacity-100 ${
                  isDarkMode ? "hover:bg-white/5" : "hover:bg-slate-100"
                }`}
              >
                ESC
              </button>
            </form>

            <div className="max-h-[480px] overflow-y-auto p-4 space-y-4">
              {/* If search query has value, show matching actions or results */}
              {commandPaletteSearch.trim() ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Query & Command Execution</span>
                    <span className="text-[8px] font-mono opacity-50">Press ENTER to query AI</span>
                  </div>

                  {/* AI Response Block */}
                  {isCommandPaletteLoading ? (
                    <div className="flex items-center gap-2 py-4 justify-center">
                      <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                      <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Collaborating with Agents...</span>
                    </div>
                  ) : commandPaletteResponse ? (
                    <div className={`p-4 rounded-xl border font-mono text-xs leading-relaxed ${
                      isDarkMode ? "bg-slate-950/40 border-indigo-500/20 text-indigo-200" : "bg-indigo-50 border-indigo-100 text-indigo-850"
                    }`}>
                      {commandPaletteResponse}
                    </div>
                  ) : (
                    <div className="py-2 text-center text-xs text-slate-400 italic">
                      Type your question (e.g. "Who is Vikram?" or "Are we compliant?") and press Enter to query our AI agents.
                    </div>
                  )}

                  <div className="space-y-1 pt-1">
                    <button
                      type="submit"
                      onClick={handleCommandPaletteSubmit}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                        isDarkMode ? "hover:bg-white/5" : "hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-500" /> Query Cooperative Agent Hub</span>
                      <kbd className="px-1.5 py-0.5 rounded text-[9px] bg-slate-500/10 text-slate-400">ENTER</kbd>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Category: Navigation */}
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 pb-1 border-b border-white/5">Navigate Workspace</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Executive Dashboard", id: "dashboard", icon: <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> },
                        { label: "Deal Intelligence Hub", id: "deal-intelligence", icon: <Layers className="w-3.5 h-3.5 text-indigo-500" /> },
                        { label: "Multi-Agent Hub", id: "multi-agent", icon: <Users className="w-3.5 h-3.5 text-indigo-500" /> },
                        { label: "Contract RAG Room", id: "contract-rag", icon: <FileCheck className="w-3.5 h-3.5 text-indigo-500" /> },
                        { label: "AI Sales Coach", id: "sales-practice", icon: <Users className="w-3.5 h-3.5 text-indigo-500" /> },
                        { label: "Digital Twin", id: "digital-twin", icon: <Brain className="w-3.5 h-3.5 text-indigo-500" /> },
                        { label: "Meeting Copilot", id: "meeting-copilot", icon: <Video className="w-3.5 h-3.5 text-indigo-500" /> },
                        { label: "Proposal Compiler", id: "proposal-generator", icon: <FileText className="w-3.5 h-3.5 text-indigo-500" /> }
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setMainView(item.id as any);
                            setIsCommandPaletteOpen(false);
                          }}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-bold uppercase tracking-wider text-left transition-colors cursor-pointer ${
                            isDarkMode 
                              ? "bg-slate-950/40 border-white/5 hover:border-indigo-500/30 hover:bg-white/5" 
                              : "bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-slate-100"
                          }`}
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category: System Actions */}
                  <div className="space-y-1.5 pt-2">
                    <h4 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 pb-1 border-b border-white/5">Platform Actions</h4>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDarkMode(!isDarkMode);
                          setIsCommandPaletteOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                          isDarkMode ? "hover:bg-white/5" : "hover:bg-slate-100"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500 animate-spin" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                          Toggle Dark/Light Mode Theme
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">⌥ T T</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          fetchDeals(selectedDealId, true);
                          setIsCommandPaletteOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                          isDarkMode ? "hover:bg-white/5" : "hover:bg-slate-100"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-indigo-500" />
                          Force Trigger CRM Auto-Sync Refresh
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">⌥ R S</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsVoiceRoomOpen(true);
                          setIsCommandPaletteOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                          isDarkMode ? "hover:bg-white/5" : "hover:bg-slate-100"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Mic className="w-4 h-4 text-indigo-500" />
                          Launch AI Voice Assistant Room
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">⌥ O V</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className={`px-4 py-2.5 border-t text-[10px] font-mono text-slate-500 flex justify-between uppercase tracking-wider ${
              isDarkMode ? "border-white/5 bg-black/40" : "border-slate-100 bg-slate-50"
            }`}>
              <span>Use Enter to submit prompt</span>
              <span>ESC to Exit</span>
            </div>
          </div>
        </div>
      )}

      {/* EDITORIAL STATUS FOOTER BAR */}
      <footer className="px-6 md:px-12 py-4 bg-black text-white flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] uppercase font-bold gap-3 mt-auto">
        <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2A5C43] animate-pulse"></span>
            Memory Engine: Active
          </span>
          <span>PostgreSQL DB: Synced</span>
          <span>LLM Core: Gemini-3.5-flash</span>
          <span>RAG Nodes: Online</span>
        </div>
        <div className="opacity-50 text-center md:text-right">
          Session: #892-23 // Terminal Alpha
        </div>
      </footer>

    </div>
  );
}
