import { CaseData, AccusationSubmission, VerdictResult } from '../types';

/**
 * The client no longer holds case solutions. It refers to cases by id and the
 * server looks up the authoritative copy, so `isGuilty`, `secret` and the
 * `solution` block never reach the browser.
 */

async function postJson<T>(url: string, body: unknown, fallbackError: string): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || fallbackError);
  }

  return response.json();
}

export interface InterrogationRequest {
  caseId: string;
  suspectId: string;
  playerMessage: string;
  conversationHistory: { sender: string; text: string }[];
  /** Clue id only — the server resolves the actual evidence from its own copy. */
  presentedEvidence?: string | null;
}

export interface InterrogationResponse {
  response: string;
  emotion: 'neutral' | 'nervous' | 'angry' | 'relieved' | 'guilty' | 'defensive' | 'surprised';
  nervousnessDelta: number;
  opennessDelta: number;
  revealedClueHint?: string | null;
}

/** Fetch the redacted, playable case list. */
export async function fetchCases(): Promise<CaseData[]> {
  const response = await fetch('/api/cases');
  if (!response.ok) throw new Error('Could not load cases from the server.');
  const data = await response.json();
  return data.cases as CaseData[];
}

export async function interrogateSuspect(
  payload: InterrogationRequest
): Promise<InterrogationResponse> {
  return postJson('/api/interrogate', payload, 'Failed to interrogate suspect');
}

export async function generateAICase(theme: string, difficulty: string): Promise<CaseData> {
  return postJson('/api/cases/generate', { theme, difficulty }, 'Failed to generate AI case');
}

export async function evaluateAccusation(
  caseId: string,
  accusation: AccusationSubmission
): Promise<VerdictResult> {
  return postJson('/api/evaluate', { caseId, accusation }, 'Failed to evaluate case');
}

export async function getDetectiveHint(
  caseId: string,
  discoveredClueIds: string[],
  chatCount: number
): Promise<string> {
  const response = await fetch('/api/hint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caseId, discoveredClueIds, chatCount }),
  });

  if (!response.ok) {
    return 'Check suspect access records and compare their timeline with physical evidence.';
  }

  const data = await response.json();
  return data.hint || 'Review the clues in your notebook.';
}
