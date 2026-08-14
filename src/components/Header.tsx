import React from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  Users,
  MapPin,
  Share2,
  Volume2,
  VolumeX,
  Gavel,
  HelpCircle,
  FolderOpen,
  ChevronDown
} from 'lucide-react';
import { CaseData } from '../types';
import { toggleSound, isSoundEnabled, playPaperRustle } from '../utils/audio';

interface HeaderProps {
  currentCase: CaseData;
  allCases: CaseData[];
  onSelectCase: (caseId: string) => void;
  onOpenGenerateModal: () => void;
  onOpenAccusationModal: () => void;
  onOpenHintModal: () => void;
  activeTab: 'suspects' | 'locations' | 'pinboard' | 'notebook';
  setActiveTab: (tab: 'suspects' | 'locations' | 'pinboard' | 'notebook') => void;
  discoveredCluesCount: number;
  totalCluesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentCase,
  allCases,
  onSelectCase,
  onOpenGenerateModal,
  onOpenAccusationModal,
  onOpenHintModal,
  activeTab,
  setActiveTab,
  discoveredCluesCount,
  totalCluesCount,
}) => {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());
  const [caseDropdownOpen, setCaseDropdownOpen] = React.useState(false);

  const handleSoundToggle = () => {
    const next = toggleSound();
    setSoundOn(next);
  };

  const handleTabChange = (tab: 'suspects' | 'locations' | 'pinboard' | 'notebook') => {
    playPaperRustle();
    setActiveTab(tab);
  };

  const progressPercent = Math.round((discoveredCluesCount / Math.max(totalCluesCount, 1)) * 100);

  return (
    <header className="bg-[#09090b]/95 border-b border-white/10 text-zinc-100 sticky top-0 z-30 shadow-2xl backdrop-blur-md">
      {/* Top Banner with Title, Case Info, and Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-3">
          {/* Logo & Current Case Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c4a17a] to-[#715438] flex items-center justify-center shadow-lg border border-[#c4a17a]/40 text-zinc-950">
                <Search className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-[#c4a17a] flex items-center gap-1.5 font-serif">
                    AI Detective
                  </h1>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#c4a17a]/15 text-[#c4a17a] border border-[#c4a17a]/30 tracking-wider">
                    {currentCase.difficulty}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                  <span className="text-zinc-500">Case #{currentCase.id.slice(0, 8)}:</span>
                  <span className="text-zinc-200 font-medium truncate max-w-xs">{currentCase.title}</span>
                </p>
              </div>
            </div>

            {/* Case Selector Dropdown */}
            <div className="relative">
              <button
                id="btn-case-selector"
                onClick={() => setCaseDropdownOpen(!caseDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181b] hover:bg-zinc-800 text-xs font-medium text-zinc-200 border border-white/10 transition"
              >
                <FolderOpen className="w-3.5 h-3.5 text-[#c4a17a]" />
                <span>Switch Case</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {caseDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-[#18181b] rounded-xl shadow-2xl border border-white/10 py-2 z-50 divide-y divide-zinc-800 animate-in fade-in">
                  <div className="px-3.5 py-1.5 text-[11px] font-semibold text-[#c4a17a] uppercase tracking-wider">
                    Active Mysteries
                  </div>
                  {allCases.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCase(c.id);
                        setCaseDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 hover:bg-zinc-800/80 transition flex flex-col gap-0.5 ${
                        c.id === currentCase.id ? 'bg-[#c4a17a]/10 border-l-2 border-[#c4a17a]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-zinc-100 truncate">{c.title}</span>
                        {c.isAiGenerated && (
                          <span className="text-[9px] bg-purple-950/80 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30">
                            AI Generated
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 truncate">{c.victim.name} • {c.victim.foundLocation}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
            {/* Clue Discovery Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18181b] border border-white/10">
              <Search className="w-3.5 h-3.5 text-[#c4a17a]" />
              <div className="flex flex-col">
                <div className="flex items-center justify-between text-[11px] font-medium text-zinc-300 gap-2">
                  <span>Clues Found</span>
                  <span className="text-[#c4a17a] font-bold">{discoveredCluesCount}/{totalCluesCount}</span>
                </div>
                <div className="w-20 bg-zinc-800 rounded-full h-1 mt-0.5 overflow-hidden">
                  <div
                    className="bg-[#c4a17a] h-1 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Hint / Chief Dispatch Button */}
            <button
              id="btn-chief-hint"
              onClick={onOpenHintModal}
              title="Request Dispatch Forensic Hint"
              className="px-3 py-1.5 rounded-lg bg-[#18181b] hover:bg-zinc-800 text-zinc-300 hover:text-[#c4a17a] border border-white/10 transition flex items-center gap-1.5 text-xs font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#c4a17a]" />
              <span className="hidden md:inline">Police Dispatch</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              id="btn-sound-toggle"
              onClick={handleSoundToggle}
              title={soundOn ? 'Mute Audio FX' : 'Enable Audio FX'}
              className="p-2 rounded-lg bg-[#18181b] hover:bg-zinc-800 text-zinc-300 border border-white/10 transition"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-[#c4a17a]" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            </button>

            {/* Generate Custom AI Mystery Button */}
            <button
              id="btn-generate-ai-case"
              onClick={onOpenGenerateModal}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-950/90 to-indigo-950/90 hover:from-purple-900 hover:to-indigo-900 text-purple-200 border border-purple-500/40 transition flex items-center gap-1.5 text-xs font-semibold shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
              <span>New AI Case</span>
            </button>

            {/* Accusation / Grand Trial Button */}
            <button
              id="btn-open-accusation-modal"
              onClick={onOpenAccusationModal}
              className="px-4 py-1.5 rounded-lg bg-[#c4a17a] hover:bg-[#d5b591] text-zinc-950 font-bold text-xs tracking-wide uppercase transition flex items-center gap-1.5 shadow-lg shadow-[#c4a17a]/15 border border-[#c4a17a]"
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>File Accusation</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 pt-2 border-t border-zinc-800/80 overflow-x-auto scrollbar-none">
          <button
            id="nav-tab-suspects"
            onClick={() => handleTabChange('suspects')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'suspects'
                ? 'bg-[#18181b] text-[#c4a17a] border-[#c4a17a]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b]/50 border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Suspects & Interrogation ({currentCase.suspects.length})</span>
          </button>

          <button
            id="nav-tab-locations"
            onClick={() => handleTabChange('locations')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'locations'
                ? 'bg-[#18181b] text-[#c4a17a] border-[#c4a17a]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b]/50 border-transparent'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Crime Scene & Locations ({currentCase.locations.length})</span>
          </button>

          <button
            id="nav-tab-pinboard"
            onClick={() => handleTabChange('pinboard')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'pinboard'
                ? 'bg-[#18181b] text-[#c4a17a] border-[#c4a17a]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b]/50 border-transparent'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Detective Pinboard</span>
          </button>

          <button
            id="nav-tab-notebook"
            onClick={() => handleTabChange('notebook')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'notebook'
                ? 'bg-[#18181b] text-[#c4a17a] border-[#c4a17a]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b]/50 border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Case Binder & Evidence ({discoveredCluesCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
