import React, { useState } from 'react';
import { CaseData, ClueItem, Suspect, AccusationSubmission, VerdictResult } from '../types';
import {
  Gavel,
  CheckCircle2,
  XCircle,
  Award,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  X,
  FileCheck,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { evaluateAccusation } from '../services/api';
import { playGavel, playDramaticSting, playPaperRustle } from '../utils/audio';

interface AccusationModalProps {
  caseData: CaseData;
  clues: ClueItem[];
  isOpen: boolean;
  onClose: () => void;
  onRestartCase: () => void;
  onOpenGenerateNew: () => void;
}

export const AccusationModal: React.FC<AccusationModalProps> = ({
  caseData,
  clues,
  isOpen,
  onClose,
  onRestartCase,
  onOpenGenerateNew,
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('');
  const [murderWeapon, setMurderWeapon] = useState<string>('');
  const [motive, setMotive] = useState<string>('');
  const [selectedClueIds, setSelectedClueIds] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState<string>('');
  const [evaluating, setEvaluating] = useState(false);
  const [verdict, setVerdict] = useState<VerdictResult | null>(null);

  if (!isOpen) return null;

  const discoveredClues = clues.filter((c) => c.discovered);

  const toggleClueSelection = (clueId: string) => {
    playPaperRustle();
    setSelectedClueIds((prev) =>
      prev.includes(clueId) ? prev.filter((id) => id !== clueId) : [...prev, clueId]
    );
  };

  const handleSubmitAccusation = async () => {
    if (!selectedSuspectId) return;

    setEvaluating(true);
    playDramaticSting();

    const submission: AccusationSubmission = {
      accusedSuspectId: selectedSuspectId,
      murderWeapon: murderWeapon.trim() || 'Unspecified murder weapon / mechanism',
      motive: motive.trim() || 'Unspecified motive',
      selectedEvidenceIds: selectedClueIds,
      reasoning: reasoning.trim() || 'Based on the timeline and physical evidence analysis.',
    };

    try {
      const result = await evaluateAccusation(caseData, submission);
      setVerdict(result);
      playGavel();

      if (result.deductionScore >= 75) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Evaluation error:', err);
      // Fallback verdict
      const isCulprit = selectedSuspectId === caseData.solution.culpritId;
      setVerdict({
        isCorrectCulprit: isCulprit,
        isCorrectWeapon: true,
        isCorrectMotive: true,
        deductionScore: isCulprit ? 85 : 35,
        rankTitle: isCulprit ? 'Senior Detective' : 'Wrongful Accuser',
        summaryFeedback: isCulprit
          ? 'You correctly brought the true culprit to justice!'
          : 'Wrongful accusation! The real killer remains free.',
        detailedCritique: {
          culpritDeduction: isCulprit ? 'Correct perpetrator.' : 'Incorrect person accused.',
          weaponMethodAnalysis: 'Your method assessment was reviewed against the coroner logs.',
          motiveAnalysis: 'Motive evaluated against suspect background.',
          evidenceEvaluation: 'Evidence evaluated.',
          reasoningPraise: 'Solid deductive effort.',
          overlookedClues: caseData.solution.keyCluesNeeded,
        },
        confessionNarrative: caseData.solution.confessionText,
        fullCaseResolution: caseData.solution.timelineOfCrime,
      });
      playGavel();
    } finally {
      setEvaluating(false);
    }
  };

  const handleReset = () => {
    setVerdict(null);
    setSelectedSuspectId('');
    setMurderWeapon('');
    setMotive('');
    setSelectedClueIds([]);
    setReasoning('');
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#18181b] border border-white/10 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-750 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* State 1: Formal Accusation Submission Form */}
        {!verdict && !evaluating && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#121215] text-[#c4a17a] border border-[#c4a17a]/30">
                  <Gavel className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-zinc-100">
                    Grand Jury Indictment & Final Accusation
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Submit your formal deduction: Who committed the murder, how was it done, and why?
                  </p>
                </div>
              </div>
            </div>

            {/* Step 1: Select the Culprit */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#c4a17a] block">
                1. Who is the Murderer? (Select Accused Suspect) *
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {caseData.suspects.map((suspect) => {
                  const isSelected = selectedSuspectId === suspect.id;
                  return (
                    <button
                      key={suspect.id}
                      type="button"
                      onClick={() => {
                        playPaperRustle();
                        setSelectedSuspectId(suspect.id);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 relative ${
                        isSelected
                          ? 'bg-[#18181b] border-[#c4a17a] ring-2 ring-[#c4a17a]/50 shadow-xl'
                          : 'bg-[#121215] hover:bg-zinc-800/80 border-white/5'
                      }`}
                    >
                      <img
                        src={suspect.avatar}
                        alt={suspect.name}
                        className="w-10 h-10 rounded-xl object-cover border border-zinc-700 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-zinc-100 font-serif truncate">
                          {suspect.name}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate">{suspect.role}</div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#c4a17a] absolute top-2 right-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2 & 3: Murder Weapon (How) & Motive (Why) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#c4a17a] block">
                  2. How was it done? (Murder Weapon / Method) *
                </label>
                <input
                  type="text"
                  value={murderWeapon}
                  onChange={(e) => setMurderWeapon(e.target.value)}
                  placeholder="e.g. Aconitine poison in thermos + heavy brass lens weight"
                  className="w-full bg-[#121215] text-zinc-100 placeholder-zinc-500 text-xs rounded-xl p-3.5 border border-zinc-700 focus:outline-none focus:border-[#c4a17a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#c4a17a] block">
                  3. Why did they do it? (Motive) *
                </label>
                <input
                  type="text"
                  value={motive}
                  onChange={(e) => setMotive(e.target.value)}
                  placeholder="e.g. Prevent exposure of stolen research and flee to CERN"
                  className="w-full bg-[#121215] text-zinc-100 placeholder-zinc-500 text-xs rounded-xl p-3.5 border border-zinc-700 focus:outline-none focus:border-[#c4a17a]"
                />
              </div>
            </div>

            {/* Step 4: Attach Supporting Evidence */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#c4a17a] block">
                4. Select Key Supporting Evidence ({selectedClueIds.length} Attached)
              </label>

              {discoveredClues.length === 0 ? (
                <div className="text-xs text-zinc-400 italic">
                  No physical clues discovered yet. You can still submit your reasoning.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-2.5 bg-[#121215] rounded-xl border border-white/5">
                  {discoveredClues.map((clue) => {
                    const isChecked = selectedClueIds.includes(clue.id);
                    return (
                      <button
                        key={clue.id}
                        type="button"
                        onClick={() => toggleClueSelection(clue.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between gap-2 ${
                          isChecked
                            ? 'bg-[#18181b] border-[#c4a17a] text-[#c4a17a]'
                            : 'bg-[#121215] border-white/5 text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        <span className="truncate">{clue.name}</span>
                        {isChecked ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#c4a17a] shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-zinc-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 5: Detective's Written Closing Argument */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#c4a17a] block">
                5. Detective's Closing Statement & Deductive Reasoning *
              </label>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                placeholder="Detail your complete deductive logic: How did you connect the suspect's movements, access records, physical clues, and motive to prove guilt beyond reasonable doubt?"
                className="w-full h-28 bg-[#121215] text-zinc-100 placeholder-zinc-500 text-xs rounded-xl p-3.5 border border-zinc-700 focus:outline-none focus:border-[#c4a17a] font-sans leading-relaxed"
              />
            </div>

            {/* Submit CTA */}
            <div className="flex justify-end gap-3 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200"
              >
                Return to Investigation
              </button>

              <button
                type="button"
                id="btn-submit-final-accusation"
                onClick={handleSubmitAccusation}
                disabled={!selectedSuspectId}
                className="px-6 py-2.5 rounded-xl bg-[#c4a17a] hover:bg-[#d5b591] disabled:opacity-50 text-zinc-950 font-bold text-xs uppercase tracking-wide transition shadow-xl flex items-center gap-2 border border-[#c4a17a]"
              >
                <Gavel className="w-4 h-4" />
                <span>Deliver Formal Accusation</span>
              </button>
            </div>
          </div>
        )}

        {/* State 2: Evaluating Loader */}
        {evaluating && (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-[#c4a17a] border-t-transparent animate-spin mx-auto" />
            <h3 className="text-xl font-bold font-serif text-zinc-100">
              The Court of Justice is Evaluating Your Deduction...
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Analyzing suspect alibis, matching chemical chromatography records, cross-referencing timeline timestamps, and assessing detective reasoning.
            </p>
          </div>
        )}

        {/* State 3: Dramatic Verdict & Resolution Screen */}
        {verdict && (
          <div className="space-y-6">
            {/* Verdict Banner */}
            <div
              className={`p-6 rounded-2xl border text-center space-y-3 shadow-2xl relative overflow-hidden ${
                verdict.deductionScore >= 70
                  ? 'bg-gradient-to-b from-[#c4a17a]/20 to-[#18181b] border-[#c4a17a]'
                  : 'bg-gradient-to-b from-red-950/60 to-[#18181b] border-red-600'
              }`}
            >
              <div className="flex justify-center">
                {verdict.deductionScore >= 70 ? (
                  <div className="w-16 h-16 rounded-full bg-[#c4a17a]/20 text-[#c4a17a] border border-[#c4a17a] flex items-center justify-center shadow-lg">
                    <Award className="w-8 h-8 animate-bounce" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 border border-red-400 flex items-center justify-center shadow-lg">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c4a17a]">
                  Official Verdict
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-100 mt-1">
                  {verdict.rankTitle}
                </h2>
                <div className="text-lg font-bold text-[#c4a17a] mt-1 font-mono">
                  Overall Score: {verdict.deductionScore} / 100
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed italic font-serif">
                "{verdict.summaryFeedback}"
              </p>

              {/* Accuracy Check Indicators */}
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                    verdict.isCorrectCulprit
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                      : 'bg-red-950/80 text-red-300 border-red-600'
                  }`}
                >
                  {verdict.isCorrectCulprit ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  Culprit Identification: {verdict.isCorrectCulprit ? 'Correct' : 'Incorrect'}
                </span>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                    verdict.isCorrectWeapon
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                  }`}
                >
                  {verdict.isCorrectWeapon ? <CheckCircle2 className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
                  Method / Weapon Analysis
                </span>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                    verdict.isCorrectMotive
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                  }`}
                >
                  {verdict.isCorrectMotive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
                  Motive Deduction
                </span>
              </div>
            </div>

            {/* Killer's Confession Monologue */}
            <div className="bg-[#121215] border border-[#c4a17a]/30 rounded-2xl p-5 sm:p-6 space-y-2 shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-[#c4a17a] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Culprit's Confession ({caseData.solution.culpritName})</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-200 italic font-serif leading-relaxed">
                "{verdict.confessionNarrative || caseData.solution.confessionText}"
              </p>
            </div>

            {/* Complete Case Resolution & Timeline */}
            <div className="bg-[#121215] border border-white/5 rounded-2xl p-5 sm:p-6 space-y-2 text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                The True Sequence of Events (Case Solution)
              </div>
              <p className="text-zinc-300 leading-relaxed">
                {verdict.fullCaseResolution || caseData.solution.timelineOfCrime}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 border border-white/5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Review / Revise Accusation</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenGenerateNew();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#18181b] hover:bg-zinc-800 text-[#c4a17a] border border-[#c4a17a]/40 text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#c4a17a]" />
                  <span>Generate New AI Mystery</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRestartCase();
                  }}
                  className="px-5 py-2 rounded-xl bg-[#c4a17a] hover:bg-[#d5b591] text-zinc-950 font-bold text-xs uppercase tracking-wide"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
