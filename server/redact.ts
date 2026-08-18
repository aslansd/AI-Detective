import type { CaseData } from '../src/types';

/**
 * Fields that must never reach the browser. These are the answers to the mystery.
 */
const SUSPECT_SECRET_FIELDS = [
  'isGuilty',
  'secret',
  'actualActivity',
  'motive',
  'privateKnowledge',
  'falseBeliefs',
] as const;

/**
 * Strip every spoiler from a case so it is safe to serialise to the client.
 * Returns a deep-ish copy — the caller's full case object is never mutated.
 */
export function toPublicCase(fullCase: CaseData): CaseData {
  const { solution, ...rest } = fullCase;

  return {
    ...rest,
    suspects: fullCase.suspects.map((suspect) => {
      const copy = { ...suspect };
      for (const field of SUSPECT_SECRET_FIELDS) delete copy[field];
      return copy;
    }),
    // Clues are meant to be found, but nothing should arrive pre-discovered.
    clues: fullCase.clues.map((clue) => ({ ...clue, discovered: false })),
  };
}

export interface CaseIssue {
  caseId: string;
  message: string;
}

/**
 * Repair the self-consistency problems that break gameplay, and report anything
 * that cannot be repaired automatically. Applied to handcrafted cases at boot and
 * to every AI-generated case before it is accepted.
 */
export function normalizeCase(input: CaseData): { normalized: CaseData; issues: CaseIssue[] } {
  const issues: CaseIssue[] = [];
  const caseId = input?.id || 'unknown-case';
  const problem = (message: string) => issues.push({ caseId, message });

  const normalized: CaseData = {
    ...input,
    suspects: [...(input.suspects || [])],
    locations: [...(input.locations || [])],
    clues: [...(input.clues || [])],
    timeline: [...(input.timeline || [])],
  };

  if (!normalized.suspects.length) problem('case has no suspects');
  if (!normalized.locations.length) problem('case has no locations');
  if (!normalized.clues.length) problem('case has no clues');

  // Drop clues that point at a location which does not exist — they would be
  // unreachable in the Locations tab and would silently inflate the clue counter.
  const locationsById = new Map(normalized.locations.map((l) => [l.id, l]));
  normalized.clues = normalized.clues.filter((clue) => {
    if (locationsById.has(clue.locationId)) return true;
    problem(`clue "${clue.name}" references unknown locationId "${clue.locationId}" — dropped`);
    return false;
  });

  // A clue's displayed location label is derived, never authored. This is what
  // drifted in the handcrafted cases ("Grand Dining Hall" vs "... (Crime Scene)").
  normalized.clues = normalized.clues.map((clue) => ({
    ...clue,
    locationName: locationsById.get(clue.locationId)!.name,
    discovered: false,
  }));

  // clueIds is derived from clue.locationId so the two can never disagree.
  normalized.locations = normalized.locations.map((location) => ({
    ...location,
    clueIds: normalized.clues.filter((c) => c.locationId === location.id).map((c) => c.id),
  }));

  for (const location of normalized.locations) {
    if (!location.clueIds?.length) problem(`location "${location.name}" contains no clues`);
  }

  // Exactly one killer, and the solution must point at them.
  const guilty = normalized.suspects.filter((s) => s.isGuilty);
  if (guilty.length !== 1) problem(`expected exactly 1 guilty suspect, found ${guilty.length}`);

  if (!normalized.solution) {
    problem('case has no solution block');
  } else if (guilty.length === 1) {
    const killer = guilty[0];
    if (normalized.solution.culpritId !== killer.id) {
      problem(`solution.culpritId corrected to the guilty suspect (${killer.name})`);
      normalized.solution = { ...normalized.solution, culpritId: killer.id };
    }
    if (normalized.solution.culpritName !== killer.name) {
      // This is the "Nurse Beatrice Vance-Morley" vs "Beatrice Vance-Morley" class of bug.
      normalized.solution = { ...normalized.solution, culpritName: killer.name };
    }
  }

  // Clamp the psychological meters the UI renders as percentages.
  normalized.suspects = normalized.suspects.map((s) => ({
    ...s,
    suspicionLevel: clamp(s.suspicionLevel),
    nervousness: clamp(s.nervousness),
    openness: clamp(s.openness),
  }));

  return { normalized, issues };
}

function clamp(value: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 50;
  return Math.min(100, Math.max(0, Math.round(value)));
}
