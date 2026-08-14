import { CaseData, AccusationSubmission, VerdictResult, ClueItem } from '../types';

export interface InterrogationRequest {
  caseData: CaseData;
  suspectId: string;
  playerMessage: string;
  conversationHistory: { sender: string; text: string }[];
  presentedEvidence?: ClueItem | null;
  currentMood?: { nervousness: number; openness: number };
}

export interface InterrogationResponse {
  response: string;
  emotion: 'neutral' | 'nervous' | 'angry' | 'relieved' | 'guilty' | 'defensive' | 'surprised';
  nervousnessDelta: number;
  opennessDelta: number;
  revealedClueHint?: string | null;
}

export async function interrogateSuspect(payload: InterrogationRequest): Promise<InterrogationResponse> {
  const response = await fetch('/api/interrogate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to interrogate suspect');
  }

  return response.json();
}

export async function generateAICase(theme: string, difficulty: string): Promise<CaseData> {
  const response = await fetch('/api/cases/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme, difficulty }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate AI case');
  }

  return response.json();
}

export async function evaluateAccusation(
  caseData: CaseData,
  accusation: AccusationSubmission
): Promise<VerdictResult> {
  const response = await fetch('/api/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caseData, accusation }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to evaluate case');
  }

  return response.json();
}

export async function getDetectiveHint(
  caseData: CaseData,
  discoveredClueIds: string[],
  chatCount: number
): Promise<string> {
  const response = await fetch('/api/hint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caseData, discoveredClueIds, chatCount }),
  });

  if (!response.ok) {
    return 'Check suspect access records and compare their timeline with physical evidence.';
  }

  const data = await response.json();
  return data.hint || 'Review the clues in your notebook.';
}
