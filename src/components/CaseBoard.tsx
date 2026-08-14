import React, { useState } from 'react';
import { CaseData, ClueItem, Suspect, PinboardNode, PinboardLink } from '../types';
import {
  Share2,
  Plus,
  Trash2,
  Link as LinkIcon,
  Unlink,
  StickyNote,
  Clock,
  Briefcase,
  Users,
  Check,
  X
} from 'lucide-react';
import { playPaperRustle, playTypewriter } from '../utils/audio';

interface CaseBoardProps {
  caseData: CaseData;
  clues: ClueItem[];
  suspects: Suspect[];
  nodes: PinboardNode[];
  links: PinboardLink[];
  onAddNode: (node: PinboardNode) => void;
  onRemoveNode: (nodeId: string) => void;
  onAddLink: (link: PinboardLink) => void;
  onRemoveLink: (linkId: string) => void;
}

export const CaseBoard: React.FC<CaseBoardProps> = ({
  caseData,
  clues,
  suspects,
  nodes,
  links,
  onAddNode,
  onRemoveNode,
  onAddLink,
  onRemoveLink,
}) => {
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);

  const discoveredClues = clues.filter((c) => c.discovered);

  const handleCreateStickyNote = () => {
    if (!newNoteText.trim()) return;
    playPaperRustle();
    const node: PinboardNode = {
      id: `note-${Date.now()}`,
      type: 'note',
      title: 'Detective Note',
      referenceId: '',
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 150,
      noteText: newNoteText.trim(),
      color: 'bg-amber-100 text-amber-950 border-amber-300',
    };
    onAddNode(node);
    setNewNoteText('');
    setShowAddNote(false);
  };

  const handleItemClick = (nodeId: string) => {
    if (!connectingFromId) {
      setConnectingFromId(nodeId);
      playTypewriter();
    } else if (connectingFromId === nodeId) {
      setConnectingFromId(null);
    } else {
      // Create link between connectingFromId and nodeId
      playPaperRustle();
      const newLink: PinboardLink = {
        id: `link-${Date.now()}`,
        fromId: connectingFromId,
        toId: nodeId,
        label: 'Connected Lead',
      };
      onAddLink(newLink);
      setConnectingFromId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Board Controls Toolbar */}
      <div className="bg-[#18181b] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#121215] text-[#c4a17a] border border-[#c4a17a]/30">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-100 font-serif">
              Detective Clue Pinboard & Lead Web
            </h3>
            <p className="text-xs text-zinc-400">
              Connect suspects, motives, and physical evidence with red investigative threads.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {connectingFromId && (
            <div className="text-xs font-semibold bg-red-950/80 text-red-300 border border-red-600/50 px-3.5 py-1.5 rounded-xl animate-pulse flex items-center gap-1.5 shadow-md">
              <span>Select 2nd item to string...</span>
              <button
                onClick={() => setConnectingFromId(null)}
                className="hover:text-white ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            id="btn-add-sticky-note"
            onClick={() => {
              playPaperRustle();
              setShowAddNote(!showAddNote);
            }}
            className="px-4 py-2 rounded-xl bg-[#c4a17a] hover:bg-[#d5b591] text-zinc-950 font-bold text-xs uppercase tracking-wide transition flex items-center gap-1.5 shadow-lg border border-[#c4a17a]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sticky Note</span>
          </button>
        </div>
      </div>

      {/* Sticky Note Creator Dropdown */}
      {showAddNote && (
        <div className="bg-[#18181b] border border-[#c4a17a]/40 rounded-2xl p-5 shadow-2xl max-w-md animate-in fade-in">
          <div className="text-xs font-bold text-[#c4a17a] uppercase tracking-wider mb-2">Write Detective Memo</div>
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="e.g., Marcus has no alibi between 11:15 and 11:25 PM. Stolen chemicals match lab batch code."
            className="w-full h-24 bg-[#121215] text-zinc-100 placeholder-zinc-500 text-xs rounded-xl p-3 border border-zinc-700 focus:outline-none focus:border-[#c4a17a] leading-relaxed"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setShowAddNote(false)}
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateStickyNote}
              className="px-4 py-1.5 bg-[#c4a17a] hover:bg-[#d5b591] text-zinc-950 font-bold text-xs rounded-xl shadow"
            >
              Pin to Board
            </button>
          </div>
        </div>
      )}

      {/* Interactive Board Surface */}
      <div className="bg-[#0d0d10] border border-white/10 rounded-2xl p-6 sm:p-8 min-h-[520px] relative overflow-hidden shadow-2xl bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Active Red String Connection Lines List */}
        {links.length > 0 && (
          <div className="mb-6 p-4 bg-[#121215]/90 border border-red-900/50 rounded-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Active Red Thread Connections ({links.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {links.map((link) => {
                return (
                  <div
                    key={link.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/70 border border-red-800/60 text-red-200 text-xs shadow-sm"
                  >
                    <span className="font-mono">Thread #{link.id.slice(-4)}</span>
                    <button
                      onClick={() => onRemoveLink(link.id)}
                      className="text-red-400 hover:text-white"
                      title="Cut Thread"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Board Elements Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Suspect Polaroids */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c4a17a] pb-1.5 border-b border-zinc-800">
              <Users className="w-3.5 h-3.5" />
              <span>Suspect Polaroids</span>
            </div>

            <div className="space-y-3">
              {suspects.map((suspect) => {
                const isSelectedForConnect = connectingFromId === `suspect-${suspect.id}`;
                return (
                  <div
                    key={suspect.id}
                    onClick={() => handleItemClick(`suspect-${suspect.id}`)}
                    className={`bg-[#18181b] border rounded-2xl p-3.5 shadow-xl cursor-pointer transition-all duration-200 relative group ${
                      isSelectedForConnect
                        ? 'border-red-500 ring-2 ring-red-500/50 bg-red-950/30'
                        : 'border-white/10 hover:border-[#c4a17a]/70 hover:shadow-2xl'
                    }`}
                  >
                    {/* Red Pushpin Icon */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 border border-red-400 shadow-md flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={suspect.avatar}
                        alt={suspect.name}
                        className="w-12 h-12 rounded-xl object-cover border border-zinc-700 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-zinc-100 font-serif truncate">
                          {suspect.name}
                        </div>
                        <div className="text-[10px] text-[#c4a17a] font-medium">
                          {suspect.role}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate mt-0.5 font-serif italic">
                          Alibi: {suspect.statedAlibi}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Discovered Physical & Forensic Evidence Pins */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c4a17a] pb-1.5 border-b border-zinc-800">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Evidence Pins ({discoveredClues.length})</span>
            </div>

            {discoveredClues.length === 0 ? (
              <div className="bg-[#121215]/60 border border-dashed border-zinc-800 rounded-2xl p-6 text-center text-xs text-zinc-400">
                No physical clues pinned yet. Search the crime scenes to log evidence.
              </div>
            ) : (
              <div className="space-y-3">
                {discoveredClues.map((clue) => {
                  const isSelectedForConnect = connectingFromId === `clue-${clue.id}`;
                  return (
                    <div
                      key={clue.id}
                      onClick={() => handleItemClick(`clue-${clue.id}`)}
                      className={`bg-[#18181b] border rounded-2xl p-3.5 shadow-xl cursor-pointer transition-all duration-200 relative group ${
                        isSelectedForConnect
                          ? 'border-red-500 ring-2 ring-red-500/50 bg-red-950/30'
                          : 'border-white/10 hover:border-[#c4a17a]/70 hover:shadow-2xl'
                      }`}
                    >
                      {/* Pushpin */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#c4a17a] border border-[#d5b591] shadow-md flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-950 opacity-80" />
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-xs sm:text-sm text-zinc-100 font-serif">
                          {clue.name}
                        </div>
                        <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#121215] text-[#c4a17a] border border-white/5">
                          {clue.category}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                        {clue.description}
                      </p>

                      <div className="text-[10px] text-[#c4a17a] font-medium mt-2">
                        📍 {clue.locationName}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Column 3: Custom Detective Sticky Notes & Hypotheses */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c4a17a] pb-1.5 border-b border-zinc-800">
              <StickyNote className="w-3.5 h-3.5" />
              <span>Detective Notes & Hypotheses</span>
            </div>

            {nodes.filter((n) => n.type === 'note').length === 0 ? (
              <div className="bg-[#121215]/60 border border-dashed border-zinc-800 rounded-2xl p-6 text-center text-xs text-zinc-400">
                Click "+ Add Sticky Note" to record private deductions or suspect contradictions.
              </div>
            ) : (
              <div className="space-y-3">
                {nodes
                  .filter((n) => n.type === 'note')
                  .map((node) => {
                    const isSelectedForConnect = connectingFromId === node.id;
                    return (
                      <div
                        key={node.id}
                        onClick={() => handleItemClick(node.id)}
                        className={`bg-[#221e1a] text-[#f4ecd8] border border-[#c4a17a]/40 rounded-xl p-3.5 shadow-xl cursor-pointer transition-all duration-200 relative group font-serif text-xs ${
                          isSelectedForConnect ? 'ring-2 ring-red-500' : 'hover:border-[#c4a17a]'
                        }`}
                      >
                        {/* Red Pin */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 border border-red-400 shadow-md" />

                        <div className="flex justify-between items-start mb-1.5 font-sans">
                          <span className="font-bold text-[10px] uppercase tracking-wider text-[#c4a17a]">
                            Detective Note
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveNode(node.id);
                            }}
                            className="text-[#c4a17a] hover:text-red-400 opacity-60 group-hover:opacity-100 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="leading-relaxed font-serif italic text-xs">
                          "{node.noteText}"
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Timeline Reconstructor Strip at Bottom */}
        <div className="mt-8 pt-6 border-t border-zinc-800 space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c4a17a]">
            <Clock className="w-3.5 h-3.5" />
            <span>Reconstructed Chronological Timeline</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {caseData.timeline.map((evt, idx) => (
              <div
                key={idx}
                className="bg-[#121215] border border-white/5 rounded-xl p-3.5 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-[#c4a17a] font-bold text-xs font-mono">
                  <span>{evt.time}</span>
                  <span className="text-[10px] font-normal text-zinc-500">#{idx + 1}</span>
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  {evt.description}
                </p>
                <div className="text-[10px] text-zinc-500 italic pt-1.5 border-t border-zinc-850">
                  Source: {evt.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
