/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_CASES } from './data/cases';
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
import { playClueFound, playPaperRustle } from './utils/audio';

export default function App() {
  const [allCases, setAllCases] = useState<CaseData[]>(INITIAL_CASES);
  const [currentCaseId, setCurrentCaseId] = useState<string>(INITIAL_CASES[0].id);

  // Active case data
  const currentCase = allCases.find((c) => c.id === currentCaseId) || allCases[0];

  // Per-case state
  const [cluesState, setCluesState] = useState<Record<string, ClueItem[]>>(() => {
    const initial: Record<string, ClueItem[]> = {};
    INITIAL_CASES.forEach((c) => {
      initial[c.id] = c.clues;
    });
    return initial;
  });

  const [chatHistoryState, setChatHistoryState] = useState<Record<string, Record<string, ChatMessage[]>>>({});
  const [playerNotesState, setPlayerNotesState] = useState<Record<string, string>>({});
  const [pinboardNodesState, setPinboardNodesState] = useState<Record<string, PinboardNode[]>>({});
  const [pinboardLinksState, setPinboardLinksState] = useState<Record<string, PinboardLink[]>>({});

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<'suspects' | 'locations' | 'pinboard' | 'notebook'>('suspects');
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(null);
  const [isAccusationOpen, setIsAccusationOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);

  // Current case specific variables
  const currentClues = cluesState[currentCase.id] || currentCase.clues;
  const currentCaseChats = chatHistoryState[currentCase.id] || {};
  const currentPlayerNotes = playerNotesState[currentCase.id] || '';
  const currentNodes = pinboardNodesState[currentCase.id] || [];
  const currentLinks = pinboardLinksState[currentCase.id] || [];

  const discoveredCluesCount = currentClues.filter((c) => c.discovered).length;
  const totalCluesCount = currentClues.length;

  // Handle case switching
  const handleSelectCase = (caseId: string) => {
    playPaperRustle();
    setCurrentCaseId(caseId);
    setSelectedSuspect(null);
    setActiveTab('suspects');
  };

  // Handle discovering a clue
  const handleDiscoverClue = (clueId: string) => {
    setCluesState((prev) => {
      const caseClues = prev[currentCase.id] || currentCase.clues;
      const updated = caseClues.map((c) => (c.id === clueId ? { ...c, discovered: true } : c));
      return { ...prev, [currentCase.id]: updated };
    });
  };

  // Handle sending a chat message during interrogation
  const handleSendMessage = (msg: ChatMessage) => {
    if (!selectedSuspect) return;
    setChatHistoryState((prev) => {
      const caseChats = prev[currentCase.id] || {};
      const suspectMsgs = caseChats[selectedSuspect.id] || [];
      return {
        ...prev,
        [currentCase.id]: {
          ...caseChats,
          [selectedSuspect.id]: [...suspectMsgs, msg],
        },
      };
    });
  };

  // Update suspect psychological state (nervousness / openness)
  const handleUpdateSuspectMood = (suspectId: string, nervousness: number, openness: number) => {
    setAllCases((prev) =>
      prev.map((c) => {
        if (c.id !== currentCase.id) return c;
        return {
          ...c,
          suspects: c.suspects.map((s) => (s.id === suspectId ? { ...s, nervousness, openness } : s)),
        };
      })
    );
  };

  // Pin / Unpin a message
  const handlePinMessage = (msgId: string) => {
    if (!selectedSuspect) return;
    setChatHistoryState((prev) => {
      const caseChats = prev[currentCase.id] || {};
      const suspectMsgs = caseChats[selectedSuspect.id] || [];
      return {
        ...prev,
        [currentCase.id]: {
          ...caseChats,
          [selectedSuspect.id]: suspectMsgs.map((m) => (m.id === msgId ? { ...m, isPinned: !m.isPinned } : m)),
        },
      };
    });
  };

  // Pinboard handlers
  const handleAddNode = (node: PinboardNode) => {
    setPinboardNodesState((prev) => ({
      ...prev,
      [currentCase.id]: [...(prev[currentCase.id] || []), node],
    }));
  };

  const handleRemoveNode = (nodeId: string) => {
    setPinboardNodesState((prev) => ({
      ...prev,
      [currentCase.id]: (prev[currentCase.id] || []).filter((n) => n.id !== nodeId),
    }));
  };

  const handleAddLink = (link: PinboardLink) => {
    setPinboardLinksState((prev) => ({
      ...prev,
      [currentCase.id]: [...(prev[currentCase.id] || []), link],
    }));
  };

  const handleRemoveLink = (linkId: string) => {
    setPinboardLinksState((prev) => ({
      ...prev,
      [currentCase.id]: (prev[currentCase.id] || []).filter((l) => l.id !== linkId),
    }));
  };

  // Handling generated AI mystery case
  const handleCaseGenerated = (newCase: CaseData) => {
    setAllCases((prev) => [newCase, ...prev]);
    setCluesState((prev) => ({ ...prev, [newCase.id]: newCase.clues }));
    setCurrentCaseId(newCase.id);
    setSelectedSuspect(null);
    setActiveTab('suspects');
  };

  // Calculate total chat interactions in current case
  const totalChatInteractions = Object.values(currentCaseChats).reduce((acc: number, curr: ChatMessage[]) => acc + (curr?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-[#c4a17a] selection:text-[#09090b]">
      {/* Top Header & Tab Navigation */}
      <Header
        currentCase={currentCase}
        allCases={allCases}
        onSelectCase={handleSelectCase}
        onOpenGenerateModal={() => setIsGenerateOpen(true)}
        onOpenAccusationModal={() => setIsAccusationOpen(true)}
        onOpenHintModal={() => setIsHintOpen(true)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedSuspect(null);
          setActiveTab(tab);
        }}
        discoveredCluesCount={discoveredCluesCount}
        totalCluesCount={totalCluesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Suspects View or Active Interrogation Chamber */}
        {activeTab === 'suspects' && (
          <>
            {selectedSuspect ? (
              <InterrogationRoom
                suspect={selectedSuspect}
                caseData={currentCase}
                messages={currentCaseChats[selectedSuspect.id] || []}
                discoveredClues={currentClues.filter((c) => c.discovered)}
                onSendMessage={handleSendMessage}
                onUpdateSuspectMood={handleUpdateSuspectMood}
                onPinMessage={handlePinMessage}
                onBack={() => setSelectedSuspect(null)}
              />
            ) : (
              <SuspectsGrid
                currentCase={currentCase}
                chatHistory={currentCaseChats}
                onSelectSuspect={(suspect) => {
                  playPaperRustle();
                  setSelectedSuspect(suspect);
                }}
              />
            )}
          </>
        )}

        {/* Locations & Crime Scene Explorer */}
        {activeTab === 'locations' && (
          <LocationsExplorer
            caseData={currentCase}
            clues={currentClues}
            onDiscoverClue={handleDiscoverClue}
          />
        )}

        {/* Detective Pinboard / Mind Map */}
        {activeTab === 'pinboard' && (
          <CaseBoard
            caseData={currentCase}
            clues={currentClues}
            suspects={currentCase.suspects}
            nodes={currentNodes}
            links={currentLinks}
            onAddNode={handleAddNode}
            onRemoveNode={handleRemoveNode}
            onAddLink={handleAddLink}
            onRemoveLink={handleRemoveLink}
          />
        )}

        {/* Detective Field Binder & Evidence Locker */}
        {activeTab === 'notebook' && (
          <Notebook
            caseData={currentCase}
            clues={currentClues}
            chatHistory={currentCaseChats}
            playerNotes={currentPlayerNotes}
            onUpdatePlayerNotes={(notes) =>
              setPlayerNotesState((prev) => ({ ...prev, [currentCase.id]: notes }))
            }
          />
        )}
      </main>

      {/* Modals */}
      <AccusationModal
        caseData={currentCase}
        clues={currentClues}
        isOpen={isAccusationOpen}
        onClose={() => setIsAccusationOpen(false)}
        onRestartCase={() => {
          setCluesState((prev) => ({ ...prev, [currentCase.id]: currentCase.clues }));
          setChatHistoryState((prev) => ({ ...prev, [currentCase.id]: {} }));
          setSelectedSuspect(null);
        }}
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
        caseData={currentCase}
        clues={currentClues}
        chatCount={totalChatInteractions}
      />
    </div>
  );
}
