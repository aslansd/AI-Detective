import React, { useState } from 'react';
import { Suspect, CaseData, ChatMessage } from '../types';
import { MessageSquare, ShieldAlert, Heart, User, Clock, AlertTriangle, Eye, Sparkles } from 'lucide-react';
import { playPaperRustle } from '../utils/audio';

interface SuspectsGridProps {
  currentCase: CaseData;
  chatHistory: Record<string, ChatMessage[]>;
  onSelectSuspect: (suspect: Suspect) => void;
}

export const SuspectsGrid: React.FC<SuspectsGridProps> = ({
  currentCase,
  chatHistory,
  onSelectSuspect,
}) => {
  const [filter, setFilter] = useState<'all' | 'questioned' | 'unquestioned' | 'high-suspicion'>('all');

  const filteredSuspects = currentCase.suspects.filter((s) => {
    const hasChats = (chatHistory[s.id] || []).length > 0;
    if (filter === 'questioned') return hasChats;
    if (filter === 'unquestioned') return !hasChats;
    if (filter === 'high-suspicion') return s.suspicionLevel >= 65;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Victim Case Summary Banner */}
      <div className="bg-[#18181b] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#c4a17a]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-red-950/80 text-red-400 border border-red-800/60 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Homicide Investigation
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {currentCase.timePeriod}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-zinc-100">
              {currentCase.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {currentCase.synopsis}
            </p>
          </div>

          {/* Victim Details Box */}
          <div className="bg-[#121215] border border-white/10 rounded-xl p-4 min-w-[280px] lg:max-w-xs space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400 uppercase font-semibold text-[10px] tracking-wider">Deceased Victim</span>
              <span className="text-red-400 font-medium font-mono">{currentCase.victim.timeOfDeath}</span>
            </div>
            <div className="font-bold text-sm text-zinc-100 font-serif">{currentCase.victim.name}</div>
            <div className="text-zinc-400 text-[11px]">{currentCase.victim.role} (Age {currentCase.victim.age})</div>
            <div className="text-zinc-300 pt-1.5 text-[11px] border-t border-zinc-800/60">
              <span className="text-zinc-400">Found At: </span>
              {currentCase.victim.foundLocation}
            </div>
            <div className="text-[#c4a17a] text-[11px] italic font-serif">
              Cause: {currentCase.victim.causeOfDeath}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              playPaperRustle();
              setFilter('all');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-[#c4a17a] text-zinc-950 shadow-md font-bold'
                : 'bg-[#18181b] text-zinc-300 border border-white/10 hover:bg-zinc-800'
            }`}
          >
            All Persons of Interest ({currentCase.suspects.length})
          </button>
          <button
            onClick={() => {
              playPaperRustle();
              setFilter('high-suspicion');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'high-suspicion'
                ? 'bg-[#c4a17a] text-zinc-950 shadow-md font-bold'
                : 'bg-[#18181b] text-zinc-300 border border-white/10 hover:bg-zinc-800'
            }`}
          >
            Prime Suspects
          </button>
          <button
            onClick={() => {
              playPaperRustle();
              setFilter('questioned');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'questioned'
                ? 'bg-[#c4a17a] text-zinc-950 shadow-md font-bold'
                : 'bg-[#18181b] text-zinc-300 border border-white/10 hover:bg-zinc-800'
            }`}
          >
            Interrogated
          </button>
          <button
            onClick={() => {
              playPaperRustle();
              setFilter('unquestioned');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'unquestioned'
                ? 'bg-[#c4a17a] text-zinc-950 shadow-md font-bold'
                : 'bg-[#18181b] text-zinc-300 border border-white/10 hover:bg-zinc-800'
            }`}
          >
            Unquestioned
          </button>
        </div>
        <span className="text-xs text-zinc-400 font-mono">
          Click any suspect to enter natural interrogation
        </span>
      </div>

      {/* Suspects Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSuspects.map((suspect) => {
          const chats = chatHistory[suspect.id] || [];
          const hasChats = chats.length > 0;
          const lastMsg = chats.slice(-1)[0];

          return (
            <div
              key={suspect.id}
              id={`suspect-card-${suspect.id}`}
              className="bg-[#18181b] border border-white/10 hover:border-[#c4a17a]/60 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl hover:shadow-black/60"
            >
              {/* Card Top: Portrait & Role */}
              <div>
                <div className="relative h-48 bg-[#121215] overflow-hidden">
                  <img
                    src={suspect.avatar}
                    alt={suspect.name}
                    className="w-full h-full object-cover object-top opacity-85 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-[#18181b]/40 to-transparent" />

                  {/* Badges on Portrait */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#09090b]/85 text-[#c4a17a] border border-[#c4a17a]/30 backdrop-blur-sm">
                      {suspect.role}
                    </span>
                    {hasChats && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm flex items-center gap-1">
                        <MessageSquare className="w-2.5 h-2.5" />
                        {chats.length} Exchange{chats.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Suspicion Pill */}
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm border ${
                        suspect.suspicionLevel >= 70
                          ? 'bg-red-950/85 text-red-300 border-red-600/40'
                          : suspect.suspicionLevel >= 40
                          ? 'bg-amber-950/85 text-[#c4a17a] border-[#c4a17a]/40'
                          : 'bg-zinc-900/85 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {suspect.suspicionLevel}% Suspicion
                    </span>
                  </div>

                  {/* Name on image base */}
                  <div className="absolute bottom-2.5 left-3.5 right-3.5">
                    <h3 className="text-lg font-bold text-zinc-100 font-serif leading-tight drop-shadow-md">
                      {suspect.name}
                    </h3>
                    <p className="text-xs text-zinc-300/90 font-medium mt-0.5">
                      Age {suspect.age} • {suspect.relationshipToVictim}
                    </p>
                  </div>
                </div>

                {/* Card Body: Summary, Stated Alibi, Psychological State */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {suspect.summary}
                  </p>

                  {/* Claimed Alibi */}
                  <div className="bg-[#121215] rounded-xl p-3 border border-white/5 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-[#c4a17a] font-semibold text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>Stated Alibi:</span>
                    </div>
                    <p className="text-zinc-300 italic text-[11px] leading-relaxed font-serif">
                      "{suspect.statedAlibi}"
                    </p>
                  </div>

                  {/* Psychological Gauges */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                        <span>Nervousness</span>
                        <span className={suspect.nervousness >= 70 ? 'text-red-400 font-bold' : 'text-zinc-300'}>
                          {suspect.nervousness}%
                        </span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            suspect.nervousness >= 70 ? 'bg-red-500' : suspect.nervousness >= 40 ? 'bg-[#c4a17a]' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${suspect.nervousness}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                        <span>Openness</span>
                        <span className="text-zinc-300">{suspect.openness}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${suspect.openness}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Last dialogue preview if questioned */}
                  {lastMsg && (
                    <div className="border-t border-zinc-800/80 pt-2 text-[11px] text-zinc-400 truncate font-serif italic">
                      <span className="text-[#c4a17a] font-sans font-medium not-italic">Latest: </span>
                      "{lastMsg.text}"
                    </div>
                  )}
                </div>
              </div>

              {/* Card Bottom CTA */}
              <div className="p-4 pt-0">
                <button
                  id={`btn-interrogate-${suspect.id}`}
                  onClick={() => onSelectSuspect(suspect)}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-800/80 hover:bg-[#c4a17a] text-zinc-200 hover:text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-white/10 hover:border-[#c4a17a] shadow-md group-hover:bg-[#c4a17a] group-hover:text-zinc-950"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{hasChats ? 'Resume Interrogation' : 'Begin Interrogation'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
