export interface Suspect {
  id: string;
  name: string;
  role: string;
  age: number;
  avatar: string;
  gender: string;
  summary: string;
  personality: string;
  relationshipToVictim: string;
  statedAlibi: string;
  actualActivity: string;
  secret: string;
  isGuilty: boolean;
  motive: string;
  suspicionLevel: number; // 0 - 100
  nervousness: number; // 0 - 100
  openness: number; // 0 - 100
  privateKnowledge: string[];
  falseBeliefs: string[];
  initialGreeting: string;
  voiceStyle: string;
}

export interface ClueItem {
  id: string;
  name: string;
  locationId: string;
  locationName: string;
  category: 'physical' | 'document' | 'forensic' | 'digital' | 'testimony';
  description: string;
  detailedAnalysis: string;
  isCrucial: boolean;
  discovered: boolean;
  icon: string;
  timeFound?: string;
}

export interface LocationInfo {
  id: string;
  name: string;
  description: string;
  imageTheme: string;
  clueIds: string[];
  isCrimeScene: boolean;
  searchProgress: number; // 0 - 100
}

export interface TimelineEvent {
  time: string;
  description: string;
  source: string; // e.g. "Forensic Report", "Security Log", "Suspect Statement"
  verified: boolean;
}

export interface TrueCrimeSolution {
  culpritId: string;
  culpritName: string;
  murderWeapon: string;
  motive: string;
  timelineOfCrime: string;
  methodDescription: string;
  keyCluesNeeded: string[];
  confessionText: string;
}

export interface CaseData {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Novice' | 'Intermediate' | 'Master Sleuth';
  setting: string;
  timePeriod: string;
  victim: {
    name: string;
    role: string;
    age: number;
    timeOfDeath: string;
    causeOfDeath: string;
    briefBio: string;
    foundLocation: string;
  };
  synopsis: string;
  suspects: Suspect[];
  locations: LocationInfo[];
  clues: ClueItem[];
  timeline: TimelineEvent[];
  solution: TrueCrimeSolution;
  isAiGenerated?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'player' | 'suspect' | 'system';
  suspectId?: string;
  text: string;
  timestamp: string;
  presentedEvidenceId?: string;
  emotion?: 'neutral' | 'nervous' | 'angry' | 'relieved' | 'guilty' | 'defensive' | 'surprised';
  isPinned?: boolean;
}

export interface AccusationSubmission {
  accusedSuspectId: string;
  murderWeapon: string;
  motive: string;
  selectedEvidenceIds: string[];
  reasoning: string;
}

export interface VerdictResult {
  isCorrectCulprit: boolean;
  isCorrectWeapon: boolean;
  isCorrectMotive: boolean;
  deductionScore: number; // 0 - 100
  rankTitle: string; // e.g. "Grand Master Detective", "Senior Inspector", "Field Sleuth", "Wrongful Accuser"
  summaryFeedback: string;
  detailedCritique: {
    culpritDeduction: string;
    weaponMethodAnalysis: string;
    motiveAnalysis: string;
    evidenceEvaluation: string;
    reasoningPraise: string;
    overlookedClues: string[];
  };
  confessionNarrative: string;
  fullCaseResolution: string;
}

export interface PinboardNode {
  id: string;
  type: 'suspect' | 'clue' | 'note' | 'location';
  title: string;
  referenceId: string;
  x: number;
  y: number;
  noteText?: string;
  color?: string;
}

export interface PinboardLink {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
}
