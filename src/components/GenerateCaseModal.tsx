import React, { useState } from 'react';
import { CaseData } from '../types';
import { Sparkles, Wand2, Compass, AlertCircle, X, Check, Loader2 } from 'lucide-react';
import { generateAICase } from '../services/api';
import { playClueFound, playPaperRustle } from '../utils/audio';

interface GenerateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseGenerated: (newCase: CaseData) => void;
}

export const GenerateCaseModal: React.FC<GenerateCaseModalProps> = ({
  isOpen,
  onClose,
  onCaseGenerated,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('Victorian London Steamship: The High Seas Poisoning');
  const [customTheme, setCustomTheme] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'Novice' | 'Intermediate' | 'Master Sleuth'>('Intermediate');
  const [generating, setGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const presetThemes = [
    {
      title: 'Victorian London Steamship: The High Seas Poisoning',
      desc: 'First-class luxury ocean liner cutting through dense fog. A wealthy shipping tycoon collapses during the captain’s gala.',
    },
    {
      title: '1920s Chicago Speakeasy: Death of the Trumpeter',
      desc: 'Underground jazz club amidst Prohibition. A star horn player is found poisoned in the green room behind the velvet curtain.',
    },
    {
      title: 'Cyberpunk 2088: The Quantum Server Vault Murder',
      desc: 'High-security neuro-tech lab in Neo-Tokyo. A lead cyberneticist found fried in an air-gapped data chamber.',
    },
    {
      title: 'Alpine Ski Chalet: The Avalanche Blackout',
      desc: 'Isolated mountain lodge cut off by a blizzard. An Olympic skier found with a broken ski pole in the wine cellar.',
    },
    {
      title: 'Venetian Masquerade Ball: Murder on the Grand Canal',
      desc: 'Historic palazzo during Carnival. A masked art collector assassinated with an antique glass stiletto.',
    },
    {
      title: 'Hollywood 1954: Death on Soundstage 9',
      desc: 'Golden-era movie studio. A tyrannical director found crushed beneath a stage lighting rig during a midnight shoot.',
    },
  ];

  const handleGenerate = async () => {
    const finalTheme = customTheme.trim() || selectedTheme;
    setGenerating(true);
    setErrorMsg(null);
    playPaperRustle();

    try {
      const newCase = await generateAICase(finalTheme, difficulty);
      playClueFound();
      onCaseGenerated(newCase);
      onClose();
    } catch (err: any) {
      console.error('Case generation failed:', err);
      setErrorMsg(err.message || 'Failed to generate AI case. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#18181b] border border-white/10 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-8">
        <button
          onClick={onClose}
          disabled={generating}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-750 transition disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="p-3 rounded-xl bg-[#121215] text-[#c4a17a] border border-[#c4a17a]/30 shadow-lg">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-zinc-100">
              Procedural AI Mystery Generator
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Generate a completely new, coherent, solvable murder mystery powered by Gemini.
            </p>
          </div>
        </div>

        {generating ? (
          <div className="py-12 text-center space-y-5">
            <div className="w-16 h-16 rounded-full border-4 border-[#c4a17a] border-t-transparent animate-spin mx-auto shadow-lg" />
            <div className="space-y-2">
              <h3 className="text-lg font-bold font-serif text-zinc-100">
                Crafting Your Custom Murder Mystery...
              </h3>
              <div className="text-xs text-[#c4a17a] font-mono animate-pulse space-y-1">
                <div>• Generating suspect personalities, alibis, and private secrets...</div>
                <div>• Constructing crime scenes and planting forensic evidence...</div>
                <div>• Weaving non-contradictory timeline and airtight solution...</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Theme Presets */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#c4a17a] block">
                Select Mystery Setting / Atmosphere
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1">
                {presetThemes.map((preset, idx) => {
                  const isSelected = selectedTheme === preset.title && !customTheme.trim();
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        playPaperRustle();
                        setSelectedTheme(preset.title);
                        setCustomTheme('');
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#18181b] border-[#c4a17a] ring-2 ring-[#c4a17a]/50 shadow-xl'
                          : 'bg-[#121215] hover:bg-zinc-800/80 border-white/5'
                      }`}
                    >
                      <div className="font-bold text-xs text-zinc-100 font-serif">{preset.title}</div>
                      <div className="text-[10px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{preset.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Theme Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Or Write Your Own Custom Scenario Prompt
              </label>
              <input
                type="text"
                value={customTheme}
                onChange={(e) => setCustomTheme(e.target.value)}
                placeholder="e.g. Archeological Dig at Giza Pyramid, 1922: Pharaoh’s Curse Murder"
                className="w-full bg-[#121215] text-zinc-100 placeholder-zinc-500 text-xs rounded-xl p-3.5 border border-zinc-700 focus:outline-none focus:border-[#c4a17a]"
              />
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Novice', 'Intermediate', 'Master Sleuth'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => {
                      playPaperRustle();
                      setDifficulty(diff);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition ${
                      difficulty === diff
                        ? 'bg-[#c4a17a] text-zinc-950 font-bold border-[#c4a17a] shadow'
                        : 'bg-[#121215] text-zinc-400 border-white/5 hover:bg-zinc-800'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>

              <button
                type="button"
                id="btn-confirm-generate-case"
                onClick={handleGenerate}
                className="px-6 py-2.5 rounded-xl bg-[#c4a17a] hover:bg-[#d5b591] text-zinc-950 font-bold text-xs uppercase tracking-wide transition shadow-xl flex items-center gap-2 border border-[#c4a17a]"
              >
                <Wand2 className="w-4 h-4" />
                <span>Generate Mystery</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
