import React, { useState } from 'react';
import { CaseData, ClueItem } from '../types';
import { HelpCircle, Sparkles, X, Shield, PhoneCall } from 'lucide-react';
import { getDetectiveHint } from '../services/api';
import { playPaperRustle } from '../utils/audio';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: CaseData;
  clues: ClueItem[];
  chatCount: number;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  caseData,
  clues,
  chatCount,
}) => {
  const [hintText, setHintText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    // Without this the previous memo is still on screen next time the modal opens,
    // with no way to request a fresh one.
    setHintText(null);
    onClose();
  };

  if (!isOpen) return null;

  const discoveredClueIds = clues.filter((c) => c.discovered).map((c) => c.id);

  const handleRequestHint = async () => {
    setLoading(true);
    playPaperRustle();
    try {
      const hint = await getDetectiveHint(caseData.id, discoveredClueIds, chatCount);
      setHintText(hint);
    } catch (err) {
      setHintText('Cross-reference the suspects’ claimed alibis with the physical evidence logs in your binder.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[#18181b] border border-white/10 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#121215] border border-[#c4a17a]/30 text-[#c4a17a]">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-zinc-100">
              Police Dispatch & Forensics Line
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Request an investigative direction without spoiling the solution.
            </p>
          </div>
        </div>

        {hintText ? (
          <div className="bg-[#121215] rounded-2xl p-4 sm:p-5 border border-[#c4a17a]/30 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#c4a17a] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dispatch Memo</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed italic font-serif">
              "{hintText}"
            </p>
          </div>
        ) : (
          <div className="text-xs text-zinc-300 bg-[#121215] rounded-2xl p-4 sm:p-5 border border-white/5 space-y-2 leading-relaxed">
            <p>
              Stuck on a lead? The Chief of Police and forensics desk can evaluate your current progress ({discoveredClueIds.length} clues discovered, {chatCount} interrogations) and highlight an overlooked trail.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
          {!hintText && (
            <button
              onClick={handleRequestHint}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#c4a17a] hover:bg-[#d5b591] text-zinc-950 font-bold text-xs transition shadow-lg flex items-center gap-2 border border-[#c4a17a] disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'Consulting Forensics...' : 'Request Dispatch Memo'}</span>
            </button>
          )}
          {hintText && (
            <>
              <button
                onClick={() => setHintText(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs border border-white/5"
              >
                Request Another
              </button>
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-[#c4a17a] hover:bg-[#d5b591] text-zinc-950 font-bold text-xs"
              >
                Understood
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
