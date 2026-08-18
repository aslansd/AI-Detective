import React, { useState, useRef, useEffect } from 'react';
import { Suspect, CaseData, ChatMessage, ClueItem } from '../types';
import {
  ArrowLeft,
  Send,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
  Briefcase,
  HelpCircle,
  Eye,
  Shield,
  Activity,
  Mic,
  FileSearch,
  CheckCircle2,
  X
} from 'lucide-react';
import { interrogateSuspect } from '../services/api';
import { playTypewriter, playDramaticSting, playPaperRustle } from '../utils/audio';

interface InterrogationRoomProps {
  suspect: Suspect;
  caseData: CaseData;
  messages: ChatMessage[];
  discoveredClues: ClueItem[];
  onSendMessage: (msg: ChatMessage) => void;
  onUpdateSuspectMood: (suspectId: string, nervousness: number, openness: number) => void;
  onPinMessage: (msgId: string) => void;
  onBack: () => void;
}

export const InterrogationRoom: React.FC<InterrogationRoomProps> = ({
  suspect,
  caseData,
  messages,
  discoveredClues,
  onSendMessage,
  onUpdateSuspectMood,
  onPinMessage,
  onBack,
}) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<ClueItem | null>(null);
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);
  const [latestEmotion, setLatestEmotion] = useState<string>(suspect.nervousness > 60 ? 'nervous' : 'neutral');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Initial greeting if no messages yet
  useEffect(() => {
    if (messages.length === 0 && suspect.initialGreeting) {
      const initialMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random()}`,
        sender: 'suspect',
        suspectId: suspect.id,
        text: suspect.initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: 'neutral',
      };
      onSendMessage(initialMsg);
    }
  }, [suspect.id]);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend && !selectedEvidence) return;

    playTypewriter();
    const playerMsg: ChatMessage = {
      id: `msg-${Date.now()}-player`,
      sender: 'player',
      text: textToSend || `[Confronts with evidence: ${selectedEvidence?.name}]`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      presentedEvidenceId: selectedEvidence?.id,
    };

    onSendMessage(playerMsg);
    setInputText('');
    const evidenceToPresent = selectedEvidence;
    setSelectedEvidence(null);
    setEvidenceDrawerOpen(false);
    setLoading(true);

    try {
      const result = await interrogateSuspect({
        caseId: caseData.id,
        suspectId: suspect.id,
        playerMessage: textToSend || `I am presenting this evidence: ${evidenceToPresent?.name}. Explain yourself.`,
        conversationHistory: messages.map((m) => ({ sender: m.sender, text: m.text })),
        presentedEvidence: evidenceToPresent?.id ?? null,
      });

      const nextNervousness = Math.min(100, Math.max(0, suspect.nervousness + (result.nervousnessDelta || 0)));
      const nextOpenness = Math.min(100, Math.max(0, suspect.openness + (result.opennessDelta || 0)));

      onUpdateSuspectMood(suspect.id, nextNervousness, nextOpenness);
      setLatestEmotion(result.emotion || 'neutral');

      if ((result.nervousnessDelta || 0) > 10 || result.emotion === 'guilty' || result.emotion === 'surprised') {
        playDramaticSting();
      } else {
        playTypewriter();
      }

      const suspectReply: ChatMessage = {
        id: `msg-${Date.now()}-suspect`,
        sender: 'suspect',
        suspectId: suspect.id,
        text: result.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: result.emotion,
      };

      onSendMessage(suspectReply);
    } catch (err) {
      console.error('Interrogation failed:', err);
      const fallbackReply: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'suspect',
        suspectId: suspect.id,
        text: `"${suspect.name} glares at you silently, folding their arms." (I will only speak in the presence of my legal counsel.)`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: 'defensive',
      };
      onSendMessage(fallbackReply);
    } finally {
      setLoading(false);
    }
  };

  const getEmotionBadgeColor = (emotion?: string) => {
    switch (emotion) {
      case 'nervous':
        return 'bg-amber-950/90 text-amber-300 border-amber-500/50';
      case 'angry':
        return 'bg-red-950/90 text-red-300 border-red-500/50';
      case 'guilty':
        return 'bg-purple-950/90 text-purple-300 border-purple-500/50';
      case 'defensive':
        return 'bg-orange-950/90 text-orange-300 border-orange-500/50';
      case 'surprised':
        return 'bg-yellow-950/90 text-yellow-300 border-yellow-500/50';
      case 'relieved':
        return 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const quickQuestions = [
    `Where were you around ${caseData.victim.timeOfDeath}?`,
    `What was your exact relationship with ${caseData.victim.name}?`,
    `Did you hear or see anyone acting suspiciously tonight?`,
    `Do you recognize any physical evidence found at the crime scene?`,
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] bg-[#09090b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-[#18181b] border-b border-white/10 px-5 py-3.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button
            id="btn-back-to-suspects"
            onClick={() => {
              playPaperRustle();
              onBack();
            }}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold border border-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Suspects Roster</span>
          </button>

          <div className="flex items-center gap-3">
            <img
              src={suspect.avatar}
              alt={suspect.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#c4a17a] shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-zinc-100 font-serif">{suspect.name}</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-[#c4a17a] border border-white/10">
                  {suspect.role}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate max-w-xs sm:max-w-md">
                Stated Alibi: {suspect.statedAlibi}
              </p>
            </div>
          </div>
        </div>

        {/* Emotion / Psychological State indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize flex items-center gap-1.5 ${getEmotionBadgeColor(
              latestEmotion
            )}`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{latestEmotion}</span>
          </span>
        </div>
      </div>

      {/* Main Split Layout: Left Dossier | Right Live Chat */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Dossier Sidebar */}
        <div className="hidden lg:flex w-80 bg-[#121215] border-r border-white/10 p-4 flex-col justify-between overflow-y-auto scrollbar-thin">
          <div className="space-y-4">
            {/* Portrait Card */}
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#18181b]">
              <img
                src={suspect.avatar}
                alt={suspect.name}
                className="w-full h-44 object-cover object-top opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3">
                <div className="text-xs text-zinc-400 font-medium">Personality Profile</div>
                <div className="text-xs text-[#c4a17a] font-semibold italic font-serif">{suspect.personality}</div>
              </div>
            </div>

            {/* Psychological Gauges */}
            <div className="bg-[#18181b] rounded-xl p-3.5 border border-white/10 space-y-3 text-xs">
              <div className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider">
                Psychological State
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">Interrogation Pressure (Nervousness)</span>
                  <span className={`font-bold ${suspect.nervousness > 65 ? 'text-red-400' : 'text-zinc-300'}`}>
                    {suspect.nervousness}%
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      suspect.nervousness > 70 ? 'bg-red-500' : suspect.nervousness > 40 ? 'bg-[#c4a17a]' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${suspect.nervousness}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">Willingness to Disclose (Openness)</span>
                  <span className="text-blue-400 font-bold">{suspect.openness}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${suspect.openness}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Suspect Background & Notes */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider">
                Investigator Brief
              </div>
              <div className="bg-[#18181b] rounded-xl p-3.5 border border-white/10 text-zinc-300 text-xs space-y-2 leading-relaxed">
                <div>
                  <span className="text-zinc-400 font-medium">Relationship: </span>
                  {suspect.relationshipToVictim}
                </div>
                <div>
                  <span className="text-zinc-400 font-medium">Voice Demeanor: </span>
                  {suspect.voiceStyle}
                </div>
                <div className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
                  Tip: Confronting suspects with contradicting physical evidence triggers nervousness spikes and confessions.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Chat Column */}
        <div className="flex-1 flex flex-col justify-between bg-[#09090b] overflow-hidden relative">
          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isPlayer = msg.sender === 'player';
              const presentedClue = msg.presentedEvidenceId
                ? discoveredClues.find((c) => c.id === msg.presentedEvidenceId)
                : null;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isPlayer ? 'items-end' : 'items-start'} max-w-2xl ${
                    isPlayer ? 'ml-auto' : 'mr-auto'
                  }`}
                >
                  {/* Presented Evidence Tag Banner */}
                  {presentedClue && (
                    <div className="mb-1 text-[11px] font-medium px-3 py-1 rounded-full bg-[#18181b] text-[#c4a17a] border border-[#c4a17a]/40 flex items-center gap-1.5 shadow-sm">
                      <Briefcase className="w-3.5 h-3.5 text-[#c4a17a]" />
                      <span>Presented Evidence: <strong>{presentedClue.name}</strong></span>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5">
                    {!isPlayer && (
                      <img
                        src={suspect.avatar}
                        alt={suspect.name}
                        className="w-8 h-8 rounded-full object-cover border border-zinc-700 mt-1 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    <div
                      className={`relative group rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-lg ${
                        isPlayer
                          ? 'bg-[#c4a17a] text-zinc-950 font-medium rounded-tr-none'
                          : 'bg-[#18181b] border border-white/10 text-zinc-200 rounded-tl-none font-serif'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Message Footer: Timestamp & Actions */}
                      <div
                        className={`flex items-center gap-2 mt-2 pt-1 text-[10px] ${
                          isPlayer ? 'text-zinc-900/80 justify-end' : 'text-zinc-400 justify-between border-t border-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{msg.timestamp}</span>
                          {!isPlayer && msg.emotion && (
                            <span className="capitalize px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-white/5 font-sans">
                              {msg.emotion}
                            </span>
                          )}
                        </div>

                        {/* Pin quote to notebook button */}
                        {!isPlayer && (
                          <button
                            onClick={() => {
                              playPaperRustle();
                              onPinMessage(msg.id);
                            }}
                            title={msg.isPinned ? 'Pinned in Case Binder' : 'Pin Quote to Notebook'}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition font-sans ${
                              msg.isPinned
                                ? 'bg-[#c4a17a]/20 text-[#c4a17a] font-semibold'
                                : 'text-zinc-400 hover:text-[#c4a17a] hover:bg-zinc-800'
                            }`}
                          >
                            {msg.isPinned ? <BookmarkCheck className="w-3 h-3 text-[#c4a17a]" /> : <Bookmark className="w-3 h-3 text-zinc-400" />}
                            <span>{msg.isPinned ? 'Pinned' : 'Pin'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center gap-3 text-xs text-[#c4a17a] font-serif italic animate-pulse pl-10">
                <div className="w-2 h-2 rounded-full bg-[#c4a17a] animate-ping" />
                <span>{suspect.name} is formulating a response...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-4 py-2 bg-[#18181b]/90 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 shrink-0">
              Inquire:
            </span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="text-[11px] text-zinc-300 bg-[#121215] hover:bg-zinc-800 hover:text-[#c4a17a] px-3 py-1 rounded-full border border-white/10 transition shrink-0 whitespace-nowrap disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Evidence Drawer (When active) */}
          {evidenceDrawerOpen && (
            <div className="absolute bottom-20 left-4 right-4 bg-[#18181b] border-2 border-[#c4a17a]/70 rounded-2xl p-4 shadow-2xl z-20 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#c4a17a]" />
                  <span className="text-xs font-bold text-[#c4a17a] uppercase tracking-wider">
                    Confront with Physical Evidence
                  </span>
                </div>
                <button
                  onClick={() => setEvidenceDrawerOpen(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {discoveredClues.length === 0 ? (
                <div className="text-center py-4 text-xs text-zinc-400">
                  You have not discovered any physical clues yet. Explore the crime scenes to find evidence!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {discoveredClues.map((clue) => (
                    <button
                      key={clue.id}
                      onClick={() => {
                        playPaperRustle();
                        setSelectedEvidence(clue);
                        setEvidenceDrawerOpen(false);
                      }}
                      className="text-left p-3 rounded-xl bg-[#121215] hover:bg-zinc-800 border border-white/10 hover:border-[#c4a17a] transition group flex flex-col justify-between"
                    >
                      <div className="font-bold text-xs text-zinc-200 group-hover:text-[#c4a17a] font-serif">
                        {clue.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                        {clue.description}
                      </div>
                      <div className="text-[9px] uppercase font-semibold text-[#c4a17a] mt-2">
                        {clue.category} • {clue.locationName}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-[#18181b] border-t border-white/10 flex flex-col gap-2">
            {/* Selected Evidence Pill */}
            {selectedEvidence && (
              <div className="flex items-center justify-between bg-[#121215] border border-[#c4a17a]/50 rounded-xl px-3 py-1.5 text-xs text-[#c4a17a]">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-[#c4a17a]" />
                  <span>Confronting with: <strong>{selectedEvidence.name}</strong></span>
                </div>
                <button
                  onClick={() => setSelectedEvidence(null)}
                  className="text-[#c4a17a] hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* Present Evidence Button */}
              <button
                id="btn-open-evidence-drawer"
                onClick={() => {
                  playPaperRustle();
                  setEvidenceDrawerOpen(!evidenceDrawerOpen);
                }}
                className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold shrink-0 ${
                  selectedEvidence
                    ? 'bg-[#c4a17a] text-zinc-950 border-[#c4a17a]'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-white/10'
                }`}
                title="Present Discovered Evidence"
              >
                <Briefcase className="w-4 h-4 text-[#c4a17a]" />
                <span className="hidden sm:inline">Present Clue</span>
              </button>

              {/* Natural Text Input */}
              <div className="flex-1 relative">
                <input
                  id="input-interrogate"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={`Question ${suspect.name} naturally (e.g. "Where were you at 11:20 PM?")...`}
                  disabled={loading}
                  className="w-full bg-[#121215] text-zinc-100 placeholder-zinc-500 text-xs sm:text-sm rounded-xl px-4 py-2.5 border border-zinc-700 focus:outline-none focus:border-[#c4a17a] transition shadow-inner"
                />
              </div>

              {/* Send Button */}
              <button
                id="btn-send-interrogation"
                onClick={() => handleSend()}
                disabled={loading || (!inputText.trim() && !selectedEvidence)}
                className="px-5 py-2.5 rounded-xl bg-[#c4a17a] hover:bg-[#d5b591] disabled:opacity-40 text-zinc-950 font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-md shrink-0"
              >
                <span>Question</span>
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
