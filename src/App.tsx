/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { CaseData, Suspect, ChatMessage, ClueItem, PinboardNode, PinboardLink } from './types';
import { Header } from './components/Header';
import { SuspectsGrid } from './components/SuspectsGrid';
import { InterrogationRoom } from './components/InterrogationRoom';
import { LocationsExplorer } from './components/LocationsExplorer';
import { CaseBoard } from './components/CaseBoard';
import { Notebook } from './components/Notebook';
import { AccusationModal } from './components/AccusationModal';
import { GenerateCaseModal } from './components/GenerateCaseModal';
import { HintModal } from './components/HintModal';
import { playPaperRustle } from './utils/audio';
import { fetchCases } from './services/api';
import { loadState, saveState } from './utils/storage';

type TabId = 'suspects' | 'locations' | 'pinboard' | 'notebook';

/** The slice of state that survives a page refresh. */
interface SaveData {
  currentCaseId: string;
  generatedCases: CaseData[];
  clues: Record<string, ClueItem[]>;
  chats: Record<string, Record<string, ChatMessage[]>>;
  notes: Record<string, string>;
  nodes: Record<string, PinboardNode[]>;
  links: Record<string, PinboardLink[]>;
  moods: Record<string, Record<string, { nervousness: number; openness: number }>>;
}

export default function App() {
  const saved = useRef<SaveData | null>(loadState<SaveData>()).current;

  const [allCases, setAllCases] = useState<CaseData[]>(saved?.generatedCases || []);
  const [currentCaseId, setCurrentCaseId] = useState<string>(saved?.currentCaseId || '');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Per-case state
  const [cluesState, setCluesState] = useState<Record<string, ClueItem[]>>(saved?.clues || {});
  const [chatHistoryState, setChatHistoryState] = useState<Record<string, Record<string, ChatMessage[]>>>(saved?.chats || {});
  const [playerNotesState, setPlayerNotesState] = useState<Record<string, string>>(saved?.notes || {});
  const [pinboardNodesState, setPinboardNodesState] = useState<Record<string, PinboardNode[]>>(saved?.nodes || {});
  const [pinboardLinksState, setPinboardLinksState] = useState<Record<string, PinboardLink[]>>(saved?.links || {});
  const [moodState, setMoodState] = useState<Record<string, Record<string, { nervousness: number; openness: number }>>>(saved?.moods || {});

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<TabId>('suspects');
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [isAccusationOpen, setIsAccusationOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);

  // Load the redacted cases from the server on mount.
  useEffect(() => {
    let cancelled = false;

    fetchCases()
      .then((serverCases) => {
        if (cancelled) return;
        setAllCases((prev) => {
          // Keep any restored AI-generated cases that the server no longer knows about;
          // they stay browsable and surface a clear error only if the player acts on them.
          const generated = prev.filter((c) => !serverCases.some((s) => s.id === c.id));
          return [...generated, ...serverCases];
        });
        setCurrentCaseId((prev) =>
          prev && [...serverCases].some((c) => c.id === prev) ? prev : prev || serverCases[0]?.id || ''
        );
      })
      .catch((err) => !cancelled && setLoadError(err.message || 'Could not reach the server.'))
      .finally(() => !cancelled && setIsLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  const currentCase = allCases.find((c) => c.id === currentCaseId) || allCases[0];

  // Persist progress whenever it changes.
  useEffect(() => {
    if (!currentCase) return;
    saveState<SaveData>({
      currentCaseId: currentCase.id,
      generatedCases: allCases.filter((c) => c.isAiGenerated),
      clues: cluesState,
      chats: chatHistoryState,
      notes: playerNotesState,
      nodes: pinboardNodesState,
      links: pinboardLinksState,
      moods: moodState,
    });
  }, [
    currentCase,
    allCases,
    cluesState,
    chatHistoryState,
    playerNotesState,
    pinboardNodesState,
    pinboardLinksState,
    moodState,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#c4a17a] border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-zinc-400 font-serif">Opening the case files...</p>
        </div>
      </div>
    );
  }

  if (!currentCase) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-xl font-bold font-serif">No cases available</h1>
          <p className="text-sm text-zinc-400">
            {loadError || 'The server returned no cases. Check the server logs and reload.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-[#c4a17a] hover:bg-[#d5b591] text-zinc-950 font-bold text-xs"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Apply persisted mood on top of the case's baseline values.
  const caseMoods = moodState[currentCase.id] || {};
  const suspectsWithMood: Suspect[] = currentCase.suspects.map((s) =>
    caseMoods[s.id] ? { ...s, ...caseMoods[s.id] } : s
  );
  const caseWithMood: CaseData = { ...currentCase, suspects: suspectsWithMood };

  const currentClues = cluesState[currentCase.id] || currentCase.clues;
  const currentCaseChats = chatHistoryState[currentCase.id] || {};
  const currentPlayerNotes = playerNotesState[currentCase.id] || '';
  const currentNodes = pinboardNodesState[currentCase.id] || [];
  const currentLinks = pinboardLinksState[currentCase.id] || [];
  const selectedSuspect = selectedSuspectId
    ? suspectsWithMood.find((s) => s.id === selectedSuspectId) || null
    : null;

  const discoveredCluesCount = currentClues.filter((c) => c.discovered).length;
  const totalCluesCount = currentClues.length;

  const handleSelectCase = (caseId: string) => {
    playPaperRustle();
    setCurrentCaseId(caseId);
    setSelectedSuspectId(null);
    setActiveTab('suspects');
  };

  const handleDiscoverClue = (clueId: string) => {
    setCluesState((prev) => {
      const caseClues = prev[currentCase.id] || currentCase.clues;
      const updated = caseClues.map((c) => (c.id === clueId ? { ...c, discovered: true } : c));
      return { ...prev, [currentCase.id]: updated };
    });
  };

  const handleSendMessage = (msg: ChatMessage) => {
    if (!selectedSuspectId) return;
    setChatHistoryState((prev) => {
      const caseChats = prev[currentCase.id] || {};
      const suspectMsgs = caseChats[selectedSuspectId] || [];
      return {
        ...prev,
        [currentCase.id]: { ...caseChats, [selectedSuspectId]: [...suspectMsgs, msg] },
      };
    });
  };

  const handleUpdateSuspectMood = (suspectId: string, nervousness: number, openness: number) => {
    setMoodState((prev) => ({
      ...prev,
      [currentCase.id]: { ...(prev[currentCase.id] || {}), [suspectId]: { nervousness, openness } },
    }));
  };

  const handlePinMessage = (msgId: string) => {
    if (!selectedSuspectId) return;
    setChatHistoryState((prev) => {
      const caseChats = prev[currentCase.id] || {};
      const suspectMsgs = caseChats[selectedSuspectId] || [];
      return {
        ...prev,
        [currentCase.id]: {
          ...caseChats,
          [selectedSuspectId]: suspectMsgs.map((m) =>
            m.id === msgId ? { ...m, isPinned: !m.isPinned } : m
          ),
        },
      };
    });
  };

  const handleAddNode = (node: PinboardNode) =>
    setPinboardNodesState((prev) => ({
      ...prev,
      [currentCase.id]: [...(prev[currentCase.id] || []), node],
    }));

  const handleRemoveNode = (nodeId: string) =>
    setPinboardNodesState((prev) => ({
      ...prev,
      [currentCase.id]: (prev[currentCase.id] || []).filter((n) => n.id !== nodeId),
    }));

  const handleAddLink = (link: PinboardLink) =>
    setPinboardLinksState((prev) => ({
      ...prev,
      [currentCase.id]: [...(prev[currentCase.id] || []), link],
    }));

  const handleRemoveLink = (linkId: string) =>
    setPinboardLinksState((prev) => ({
      ...prev,
      [currentCase.id]: (prev[currentCase.id] || []).filter((l) => l.id !== linkId),
    }));

  const handleCaseGenerated = (newCase: CaseData) => {
    setAllCases((prev) => [newCase, ...prev]);
    setCluesState((prev) => ({ ...prev, [newCase.id]: newCase.clues }));
    setCurrentCaseId(newCase.id);
    setSelectedSuspectId(null);
    setActiveTab('suspects');
  };

  /**
   * Full reset of a single case. Previously this cleared only clues and chats,
   * leaving suspects at their elevated nervousness and the corkboard/journal intact.
   */
  const handleRestartCase = () => {
    const id = currentCase.id;
    setCluesState((prev) => ({
      ...prev,
      [id]: currentCase.clues.map((c) => ({ ...c, discovered: false })),
    }));
    setChatHistoryState((prev) => ({ ...prev, [id]: {} }));
    setMoodState((prev) => ({ ...prev, [id]: {} }));
    setPinboardNodesState((prev) => ({ ...prev, [id]: [] }));
    setPinboardLinksState((prev) => ({ ...prev, [id]: [] }));
    setPlayerNotesState((prev) => ({ ...prev, [id]: '' }));
    setSelectedSuspectId(null);
    setActiveTab('suspects');
  };

  const totalChatInteractions = Object.values(currentCaseChats).reduce(
    (acc: number, curr: ChatMessage[]) => acc + (curr?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-[#c4a17a] selection:text-[#09090b]">
      <Header
        currentCase={caseWithMood}
        allCases={allCases}
        onSelectCase={handleSelectCase}
        onOpenGenerateModal={() => setIsGenerateOpen(true)}
        onOpenAccusationModal={() => setIsAccusationOpen(true)}
        onOpenHintModal={() => setIsHintOpen(true)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedSuspectId(null);
          setActiveTab(tab);
        }}
        discoveredCluesCount={discoveredCluesCount}
        totalCluesCount={totalCluesCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'suspects' &&
          (selectedSuspect ? (
            <InterrogationRoom
              suspect={selectedSuspect}
              caseData={caseWithMood}
              messages={currentCaseChats[selectedSuspect.id] || []}
              discoveredClues={currentClues.filter((c) => c.discovered)}
              onSendMessage={handleSendMessage}
              onUpdateSuspectMood={handleUpdateSuspectMood}
              onPinMessage={handlePinMessage}
              onBack={() => setSelectedSuspectId(null)}
            />
          ) : (
            <SuspectsGrid
              currentCase={caseWithMood}
              chatHistory={currentCaseChats}
              onSelectSuspect={(suspect) => {
                playPaperRustle();
                setSelectedSuspectId(suspect.id);
              }}
            />
          ))}

        {activeTab === 'locations' && (
          <LocationsExplorer
            caseData={caseWithMood}
            clues={currentClues}
            onDiscoverClue={handleDiscoverClue}
          />
        )}

        {activeTab === 'pinboard' && (
          <CaseBoard
            caseData={caseWithMood}
            clues={currentClues}
            suspects={suspectsWithMood}
            nodes={currentNodes}
            links={currentLinks}
            onAddNode={handleAddNode}
            onRemoveNode={handleRemoveNode}
            onAddLink={handleAddLink}
            onRemoveLink={handleRemoveLink}
          />
        )}

        {activeTab === 'notebook' && (
          <Notebook
            caseData={caseWithMood}
            clues={currentClues}
            chatHistory={currentCaseChats}
            playerNotes={currentPlayerNotes}
            onUpdatePlayerNotes={(notes) =>
              setPlayerNotesState((prev) => ({ ...prev, [currentCase.id]: notes }))
            }
          />
        )}
      </main>

      <AccusationModal
        caseData={caseWithMood}
        clues={currentClues}
        isOpen={isAccusationOpen}
        onClose={() => setIsAccusationOpen(false)}
        onRestartCase={handleRestartCase}
        onOpenGenerateNew={() => setIsGenerateOpen(true)}
      />

      <GenerateCaseModal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        onCaseGenerated={handleCaseGenerated}
      />

      <HintModal
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        caseData={caseWithMood}
        clues={currentClues}
        chatCount={totalChatInteractions}
      />
    </div>
  );
}
