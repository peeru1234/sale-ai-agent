export type ObjectionCategory = 'Price' | 'Security' | 'Integration' | 'Performance' | 'Legal' | 'Compliance' | 'Other';
export type ObjectionStatus = 'Identified' | 'Addressed' | 'Resolved';

export interface Objection {
  id: string;
  category: ObjectionCategory;
  description: string;
  status: ObjectionStatus;
  notes: string;
  date: string;
  taggedCollaboratorIds?: string[];
}

export interface Requirement {
  id: string;
  name: string;
  description: string;
  status: 'Required' | 'In Discussion' | 'Agreed' | 'Delivered';
  priority: 'High' | 'Medium' | 'Low';
  date: string;
  taggedCollaboratorIds?: string[];
}

export interface BuyingSignal {
  id: string;
  signalText: string;
  context: string;
  confidence: number; // 0 to 100
  date: string;
}

export interface NextBestAction {
  id: string;
  action: string;
  description: string;
  dueDate: string;
  completed: boolean;
  status?: 'Pending' | 'In Progress' | 'Completed';
}

export type SentimentType = 'Positive' | 'Interested' | 'Neutral' | 'Concerned' | 'Frustrated' | 'Ready to Buy';

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time?: string;
  transcript: string;
  summary: string;
  sentiment: SentimentType;
  priority?: 'Low' | 'Medium' | 'High';
  vocalCuesSummary?: string; // Analysis of vocal cues (pace, confidence, tone)
  objections: Objection[];
  requirements: Requirement[];
  buyingSignals: BuyingSignal[];
  nextBestActions: NextBestAction[];
}

export interface LongTermMemory {
  budget: string;
  timeline: string;
  securityConcerns: string[];
  integrationsRequired: string[];
  decisionMakers: string[];
  competitors: string[];
  lastUpdated: string;
}

export interface SuccessPrediction {
  probability: number; // 0 to 100
  reasons: string[];
  lastUpdated: string;
}

export interface Collaborator {
  id: string;
  name: string;
  role: string;
  email?: string;
}

export interface Deal {
  id: string;
  name: string; // e.g. "Enterprise ERP Deal"
  company: string; // e.g. "ABC Manufacturing"
  value: number; // Deal value in INR
  status: 'Prospect' | 'Discovery' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  contactName: string;
  contactRole: string;
  summary: string;
  meetings: Meeting[];
  memory: LongTermMemory;
  prediction: SuccessPrediction;
  nextActions: NextBestAction[];
  collaborators?: Collaborator[];
  crmSyncLogs?: CrmSyncLog[];
  createdAt: string;
}

export interface CrmSyncLog {
  id: string;
  meetingId: string;
  meetingTitle: string;
  syncedAt: string;
  objectionsCount: number;
  requirementsCount: number;
  actionsCount: number;
  sentiment: string;
  curatedInsightsCount?: number;
  curatedInsights?: string[];
  payloadSummary: string;
}

export interface AppNotification {
  id: string;
  type: 'alert' | 'email';
  recipientName: string;
  recipientEmail?: string;
  dealName: string;
  itemName: string;
  itemType: 'objection' | 'requirement';
  oldStatus: string;
  newStatus: string;
  timestamp: string;
  subject?: string;
  body?: string;
  read: boolean;
}

