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
  suspicionLevel: number; // 0 - 100
  nervousness: number; // 0 - 100
  openness: number; // 0 - 100
  initialGreeting: string;
  voiceStyle: string;

  /**
   * SERVER-ONLY FIELDS.
   * These are the answers. They are stripped by `toPublicCase()` in server/redact.ts
   * before any case is sent to the browser, so they are always `undefined` on the
   * client. Never render these in a component.
   */
  actualActivity?: string;
  secret?: string;
  isGuilty?: boolean;
  motive?: string;
  privateKnowledge?: string[];
  falseBeliefs?: string[];
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
  isCrimeScene: boolean;
  /** Kept in sync with `clue.locationId` by the server. Gameplay reads `clue.locationId`. */
  clueIds?: string[];
  /** @deprecated Not used by any component. */
  searchProgress?: number;
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
  isAiGenerated?: boolean;

  /** SERVER-ONLY. Stripped before the case is sent to the browser. */
  solution?: TrueCrimeSolution;
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
  /** Revealed only with the verdict, once the game is over. */
  culpritName: string;
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
