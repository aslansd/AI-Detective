import React, { useState } from 'react';
import { CaseData, ClueItem, ChatMessage, Suspect } from '../types';
import {
  BookOpen,
  FileText,
  Briefcase,
  Quote,
  Clock,
  Edit3,
  Search,
  AlertTriangle,
  Sparkles,
  BookmarkCheck,
  CheckCircle,
  Eye
} from 'lucide-react';
import { playPaperRustle, playTypewriter } from '../utils/audio';

interface NotebookProps {
  caseData: CaseData;
  clues: ClueItem[];
  chatHistory: Record<string, ChatMessage[]>;
  playerNotes: string;
  onUpdatePlayerNotes: (notes: string) => void;
}

export const Notebook: React.FC<NotebookProps> = ({
  caseData,
  clues,
  chatHistory,
  playerNotes,
  onUpdatePlayerNotes,
}) => {
  const [activeSection, setActiveSection] = useState<'evidence' | 'autopsy' | 'testimonies' | 'timeline' | 'journal'>('evidence');
  const [evidenceFilter, setEvidenceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const discoveredClues = clues.filter((c) => c.discovered);

  // Collect all pinned messages across all suspects
  const pinnedMessages: { suspect: Suspect; message: ChatMessage }[] = [];
  caseData.suspects.forEach((suspect) => {
    const msgs = chatHistory[suspect.id] || [];
    msgs.forEach((m) => {
      if (m.isPinned) {
        pinnedMessages.push({ suspect, message: m });
      }
    });
  });

  const filteredClues = discoveredClues.filter((c) => {
    const matchesCat = evidenceFilter === 'all' || c.category === evidenceFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-[#18181b] border border-white/10 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#121215] text-[#c4a17a] border border-[#c4a17a]/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-zinc-100 font-serif">
              Official Detective Case File & Evidence Locker
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Verified autopsy forensics, item catalog, pinned testimonies, and personal field notes.
            </p>
          </div>
        </div>

        {/* Section Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap bg-[#121215] p-1.5 rounded-xl border border-white/5">
          <button
            onClick={() => {
              playPaperRustle();
              setActiveSection('evidence');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'evidence'
                ? 'bg-[#c4a17a] text-zinc-950 font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Evidence Locker ({discoveredClues.length})
          </button>
          <button
            onClick={() => {
              playPaperRustle();
              setActiveSection('autopsy');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'autopsy'
                ? 'bg-[#c4a17a] text-zinc-950 font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Autopsy Report
          </button>
          <button
            onClick={() => {
              playPaperRustle();
              setActiveSection('testimonies');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'testimonies'
                ? 'bg-[#c4a17a] text-zinc-950 font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Pinned Quotes ({pinnedMessages.length})
          </button>
          <button
            onClick={() => {
              playPaperRustle();
              setActiveSection('timeline');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'timeline'
                ? 'bg-[#c4a17a] text-zinc-950 font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => {
              playPaperRustle();
              setActiveSection('journal');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'journal'
                ? 'bg-[#c4a17a] text-zinc-950 font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Field Journal
          </button>
        </div>
      </div>

      {/* 1. Evidence Locker Tab */}
      {activeSection === 'evidence' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search discovered evidence..."
                className="w-full bg-[#121215] text-zinc-100 placeholder-zinc-500 text-xs rounded-xl pl-9 pr-3.5 py-2.5 border border-zinc-700 focus:outline-none focus:border-[#c4a17a]"
              />
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['all', 'physical', 'forensic', 'document', 'digital'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setEvidenceFilter(cat)}
                  className={`text-[11px] font-semibold capitalize px-3 py-1.5 rounded-lg transition ${
                    evidenceFilter === cat
                      ? 'bg-[#18181b] text-[#c4a17a] border border-[#c4a17a]/40'
                      : 'text-zinc-400 hover:text-zinc-200 bg-[#121215] border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredClues.length === 0 ? (
            <div className="bg-[#121215]/60 border border-dashed border-zinc-800 rounded-2xl p-8 text-center text-xs text-zinc-400">
              No evidence matching criteria. Search the crime scenes to log more items.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClues.map((clue) => (
                <div
                  key={clue.id}
                  className="bg-[#121215] border border-white/10 hover:border-[#c4a17a]/40 rounded-2xl p-4 space-y-3 shadow-lg flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#c4a17a]/15 text-[#c4a17a] border border-[#c4a17a]/30">
                        {clue.category}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-serif">📍 {clue.locationName}</span>
                    </div>

                    <h4 className="font-bold text-sm text-zinc-100 font-serif">
                      {clue.name}
                    </h4>

                    <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                      {clue.description}
                    </p>
                  </div>

                  <div className="bg-[#18181b] rounded-xl p-3 border border-white/5 text-[11px] space-y-1">
                    <div className="text-[10px] font-bold uppercase text-[#c4a17a] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Forensic Findings
                    </div>
                    <p className="text-zinc-300 italic font-serif leading-relaxed">{clue.detailedAnalysis}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Autopsy Protocol Tab */}
      {activeSection === 'autopsy' && (
        <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-7 space-y-5 text-xs sm:text-sm">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Coroner’s Official Post-Mortem Examination Protocol</span>
            </div>
            <span className="text-zinc-500 font-mono">Case #{caseData.id.slice(0, 8)}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#18181b] rounded-2xl p-5 border border-white/5 space-y-2">
              <div className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider">Victim Demographics</div>
              <div className="text-zinc-100 font-bold text-base font-serif">{caseData.victim.name}</div>
              <div className="text-zinc-400 text-xs">
                Occupation: {caseData.victim.role} • Age {caseData.victim.age}
              </div>
              <p className="text-zinc-300 text-xs leading-relaxed pt-2 border-t border-zinc-800/80 font-serif italic">
                {caseData.victim.briefBio}
              </p>
            </div>

            <div className="bg-[#18181b] rounded-2xl p-5 border border-white/5 space-y-2">
              <div className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider">Forensic Pathology Findings</div>
              <div className="text-red-400 font-bold text-xs">Estimated Time of Death: {caseData.victim.timeOfDeath}</div>
              <div className="text-zinc-300 text-xs">
                <span className="text-zinc-400 font-medium">Found At: </span>
                {caseData.victim.foundLocation}
              </div>
              <div className="text-[#c4a17a] text-xs pt-2 border-t border-zinc-800/80 font-serif">
                Primary Cause of Death: {caseData.victim.causeOfDeath}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Pinned Testimonies Tab */}
      {activeSection === 'testimonies' && (
        <div className="space-y-4">
          <div className="text-xs text-zinc-400">
            Quotes and admissions pinned during live suspect interrogations.
          </div>

          {pinnedMessages.length === 0 ? (
            <div className="bg-[#121215]/60 border border-dashed border-zinc-800 rounded-2xl p-8 text-center text-xs text-zinc-400">
              No quotes pinned yet. While interrogating a suspect, click the "Pin" button on any message to save it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pinnedMessages.map(({ suspect, message }, idx) => (
                <div
                  key={idx}
                  className="bg-[#121215] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-lg"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={suspect.avatar}
                        alt={suspect.name}
                        className="w-7 h-7 rounded-xl object-cover border border-zinc-700"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-bold text-xs text-zinc-200 font-serif">{suspect.name}</span>
                      <span className="text-[10px] text-zinc-400">({suspect.role})</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">{message.timestamp}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 italic font-serif leading-relaxed">
                    "{message.text}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Timeline Tab */}
      {activeSection === 'timeline' && (
        <div className="space-y-4">
          <div className="text-xs text-zinc-400">
            Verified chronological reconstruction based on forensic timestamps and camera logs.
          </div>

          <div className="relative pl-6 border-l-2 border-[#c4a17a]/40 space-y-6">
            {caseData.timeline.map((evt, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#c4a17a] border-2 border-zinc-950 shadow" />
                <div className="bg-[#121215] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-1.5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-[#c4a17a] font-mono">
                      {evt.time}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                      Source: {evt.source}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Detective Field Journal / Scratchpad */}
      {activeSection === 'journal' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Detective’s Personal Scratchpad & Hypotheses</span>
            <span className="font-mono text-[10px] text-[#c4a17a]">Auto-saved</span>
          </div>

          <textarea
            value={playerNotes}
            onChange={(e) => {
              playTypewriter();
              onUpdatePlayerNotes(e.target.value);
            }}
            placeholder="Type your investigative notes, timeline contradictions, suspect motives, and working theories here..."
            className="w-full h-72 bg-[#121215] text-zinc-100 placeholder-zinc-600 text-xs sm:text-sm rounded-2xl p-4 border border-zinc-700 focus:outline-none focus:border-[#c4a17a] font-mono leading-relaxed"
          />
        </div>
      )}
    </div>
  );
};
