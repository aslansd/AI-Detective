import React, { useState } from 'react';
import { LocationInfo, ClueItem, CaseData } from '../types';
import {
  MapPin,
  Search,
  CheckCircle,
  AlertTriangle,
  FileText,
  FlaskConical,
  Zap,
  Mic,
  Plane,
  FileCheck,
  FileWarning,
  Mail,
  DollarSign,
  Banknote,
  ShieldCheck,
  Wine,
  GlassWater,
  Scroll,
  Lock,
  Sparkles,
  Newspaper,
  BookOpen,
  MailWarning,
  Eye,
  Check,
  X
} from 'lucide-react';
import { playClueFound, playPaperRustle } from '../utils/audio';

interface LocationsExplorerProps {
  caseData: CaseData;
  clues: ClueItem[];
  onDiscoverClue: (clueId: string) => void;
}

export const LocationsExplorer: React.FC<LocationsExplorerProps> = ({
  caseData,
  clues,
  onDiscoverClue,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>(caseData.locations[0]?.id || '');
  const [inspectingClue, setInspectingClue] = useState<ClueItem | null>(null);
  const [searching, setSearching] = useState(false);

  const selectedLocation = caseData.locations.find((l) => l.id === selectedLocationId) || caseData.locations[0];
  const locationClues = clues.filter((c) => c.locationId === selectedLocation?.id);
  const discoveredLocationClues = locationClues.filter((c) => c.discovered);

  const handleSearchLocation = () => {
    setSearching(true);
    playPaperRustle();

    setTimeout(() => {
      // Find an undiscovered clue in this location if any exists
      const undiscovered = locationClues.find((c) => !c.discovered);
      if (undiscovered) {
        onDiscoverClue(undiscovered.id);
        setInspectingClue({ ...undiscovered, discovered: true });
        playClueFound();
      }
      setSearching(false);
    }, 800);
  };

  const getClueIcon = (iconName: string) => {
    switch (iconName) {
      case 'FlaskConical':
        return <FlaskConical className="w-5 h-5 text-emerald-400" />;
      case 'Mic':
        return <Mic className="w-5 h-5 text-indigo-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Plane':
        return <Plane className="w-5 h-5 text-blue-400" />;
      case 'FileCheck':
      case 'FileWarning':
      case 'FileText':
        return <FileText className="w-5 h-5 text-amber-400" />;
      case 'Mail':
      case 'MailWarning':
        return <Mail className="w-5 h-5 text-red-400" />;
      case 'Banknote':
      case 'DollarSign':
        return <Banknote className="w-5 h-5 text-emerald-400" />;
      case 'Wine':
      case 'GlassWater':
        return <Wine className="w-5 h-5 text-purple-400" />;
      case 'Lock':
        return <Lock className="w-5 h-5 text-slate-300" />;
      case 'Scroll':
        return <Scroll className="w-5 h-5 text-amber-300" />;
      case 'Newspaper':
        return <Newspaper className="w-5 h-5 text-cyan-400" />;
      default:
        return <Search className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Selector Horizontal Carousel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {caseData.locations.map((loc) => {
          const totalInLoc = clues.filter((c) => c.locationId === loc.id).length;
          const foundInLoc = clues.filter((c) => c.locationId === loc.id && c.discovered).length;
          const isSelected = loc.id === selectedLocation?.id;
          const isComplete = totalInLoc > 0 && foundInLoc === totalInLoc;

          return (
            <button
              key={loc.id}
              id={`btn-loc-${loc.id}`}
              onClick={() => {
                playPaperRustle();
                setSelectedLocationId(loc.id);
              }}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-[#18181b] border-[#c4a17a] shadow-xl ring-1 ring-[#c4a17a]/50'
                  : 'bg-[#121215] border-white/5 hover:border-white/15 hover:bg-zinc-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  {loc.isCrimeScene ? (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-800 flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      Crime Scene
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-white/5">
                      Location
                    </span>
                  )}

                  {isComplete && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-semibold">
                      <Check className="w-3 h-3" /> All Found
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-zinc-100 font-serif leading-tight">
                  {loc.name}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Clues:</span>
                <span className="font-bold text-[#c4a17a]">{foundInLoc}/{totalInLoc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Location Detail Stage */}
      {selectedLocation && (
        <div className="bg-[#18181b] border border-white/10 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6">
          {/* Top Bar: Title & Search Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-[#c4a17a]" />
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-zinc-100">
                  {selectedLocation.name}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed mt-1">
                {selectedLocation.description}
              </p>
            </div>

            {/* Sweep Search Button */}
            <button
              id="btn-search-location"
              onClick={handleSearchLocation}
              disabled={searching || discoveredLocationClues.length === locationClues.length}
              className="px-6 py-3 rounded-xl bg-[#c4a17a] hover:bg-[#d5b591] disabled:opacity-50 text-zinc-950 font-bold text-xs sm:text-sm tracking-wide uppercase transition shadow-xl flex items-center justify-center gap-2 shrink-0 border border-[#c4a17a]"
            >
              <Search className={`w-4 h-4 ${searching ? 'animate-spin' : ''}`} />
              <span>
                {searching
                  ? 'Analyzing Area...'
                  : discoveredLocationClues.length === locationClues.length
                  ? 'Area Fully Swept'
                  : 'Conduct Forensic Search'}
              </span>
            </button>
          </div>

          {/* Discovered & Hidden Clues Grid */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Physical Evidence & Forensic Hotspots ({discoveredLocationClues.length}/{locationClues.length} Discovered)
              </h4>
              <span className="text-xs text-[#c4a17a] font-mono">
                Click any discovered item to review forensic findings
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {locationClues.map((clue) => {
                return (
                  <div
                    key={clue.id}
                    id={`clue-card-${clue.id}`}
                    onClick={() => {
                      if (clue.discovered) {
                        playPaperRustle();
                        setInspectingClue(clue);
                      }
                    }}
                    className={`rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                      clue.discovered
                        ? 'bg-[#121215] hover:bg-zinc-800 border-[#c4a17a]/40 hover:border-[#c4a17a] cursor-pointer shadow-lg group'
                        : 'bg-[#121215]/50 border-dashed border-zinc-800 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2.5 rounded-xl bg-[#18181b] border border-white/5">
                          {clue.discovered ? getClueIcon(clue.icon) : <Search className="w-5 h-5 text-zinc-600" />}
                        </div>
                        {clue.discovered ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#c4a17a]/15 text-[#c4a17a] border border-[#c4a17a]/30">
                            {clue.category}
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-500">Unanalyzed</span>
                        )}
                      </div>

                      <h5 className={`font-bold text-sm font-serif ${clue.discovered ? 'text-zinc-100 group-hover:text-[#c4a17a]' : 'text-zinc-500'}`}>
                        {clue.discovered ? clue.name : 'Hidden Physical Evidence'}
                      </h5>

                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {clue.discovered ? clue.description : 'Conduct a forensic search of this room to uncover latent clues.'}
                      </p>
                    </div>

                    {clue.discovered && (
                      <div className="mt-3.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-[#c4a17a] font-medium font-serif">
                        <span>Inspect Forensic Report</span>
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Forensic Inspection Modal */}
      {inspectingClue && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#18181b] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 relative">
            <button
              id="btn-close-inspect-clue"
              onClick={() => setInspectingClue(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="p-3.5 rounded-2xl bg-[#121215] border border-[#c4a17a]/30 text-[#c4a17a]">
                {getClueIcon(inspectingClue.icon)}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#c4a17a]/15 text-[#c4a17a] border border-[#c4a17a]/30">
                  {inspectingClue.category} Clue
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-zinc-100 mt-1">
                  {inspectingClue.name}
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="bg-[#121215] rounded-xl p-3.5 border border-white/5 text-zinc-300">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Found Location</div>
                <div className="text-zinc-100 font-medium">{inspectingClue.locationName}</div>
              </div>

              <div className="bg-[#121215] rounded-xl p-4 border border-white/5 space-y-1.5">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Field Description</div>
                <p className="text-zinc-300 leading-relaxed">{inspectingClue.description}</p>
              </div>

              <div className="bg-[#121215] rounded-xl p-4 border border-[#c4a17a]/30 space-y-1.5">
                <div className="text-[11px] font-bold text-[#c4a17a] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lab & Forensic Analysis</span>
                </div>
                <p className="text-zinc-200 leading-relaxed italic text-xs sm:text-sm font-serif">
                  "{inspectingClue.detailedAnalysis}"
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectingClue(null)}
                className="px-5 py-2.5 rounded-xl bg-[#c4a17a] hover:bg-[#d5b591] text-zinc-950 font-bold text-xs uppercase tracking-wide transition shadow-lg"
              >
                Log to Evidence Binder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
