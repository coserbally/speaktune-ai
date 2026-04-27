import React, { useState } from 'react';
import { Character, UserContext, Message, VocabWord } from '../types';
import ChatScreen from './ChatScreen';
import { MessageCircle, Plus, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PracticeViewProps {
  character: Character;
  allCharacters: Character[];
  setCharacter: (char: Character) => void;
  context: UserContext;
  messagesMap: Record<string, Message[]>;
  setMessages: (setter: any) => void;
  savedVocab: VocabWord[];
  setSavedVocab: (vocab: VocabWord[]) => void;
  onBack: () => void;
  onReset: () => void;
  setActiveTab: (tab: any) => void;
}

export default function PracticeView({ 
  character, 
  allCharacters,
  setCharacter, 
  context, 
  messagesMap, 
  setMessages, 
  savedVocab, 
  setSavedVocab, 
  onBack, 
  onReset,
  setActiveTab
}: PracticeViewProps) {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  // Get active tutors (those with message history or listed in allCharacters)
  const activeTutorNames = [...new Set([
    ...Object.keys(messagesMap).filter(name => messagesMap[name].length > 0),
    ...allCharacters.map(c => c.name)
  ])];
  
  // Handle opening a chat
  const handleOpenChat = (charName: string) => {
    // Find the full character profile
    const charProfile = allCharacters.find(c => c.name === charName) || character;
    setSelectedChar(charProfile);
    if (charProfile.name !== character.name) {
      setCharacter(charProfile);
    }
  };

  if (selectedChar) {
    return (
      <ChatScreen 
        character={selectedChar}
        context={context}
        messages={messagesMap[selectedChar.name] || []}
        setMessages={(setter) => setMessages(setter)}
        savedVocab={savedVocab}
        setSavedVocab={setSavedVocab}
        onBack={() => setSelectedChar(null)}
        onReset={onReset}
      />
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden px-6 py-8">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col gap-6">
        <header className="space-y-1 shrink-0">
          <div className="flex items-center gap-3 text-[var(--accent-color)]">
            <MessageCircle className="w-5 h-5" />
            <h2 className="text-xl font-serif font-black tracking-tight italic">练习会话</h2>
          </div>
          <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40">继续你的口语练习</p>
        </header>

        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {activeTutorNames.map((name) => {
              const lastMsg = messagesMap[name]?.[messagesMap[name].length - 1];
              const isActive = name === character.name;

              return (
                <motion.button
                  key={name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenChat(name)}
                  className="w-full bg-white/95 backdrop-blur-3xl border border-white/50 p-4 rounded-[24px] flex items-center gap-4 text-left group shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-color)]/80 flex items-center justify-center text-white relative shadow-md shrink-0">
                    <User className="w-6 h-6" />
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-serif font-black tracking-tight text-[var(--text-color)]">{name}</h3>
                    <p className="text-xs opacity-40 truncate leading-relaxed">
                      {lastMsg ? lastMsg.content : "开始新的对话..."}
                    </p>
                  </div>

                  <div className="p-2 rounded-full bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <ChevronRight className="w-4 h-4 text-[var(--accent-color)]" />
                  </div>
                </motion.button>
              );
            })}
          </div>

          <button
            onClick={() => setActiveTab('tutor')}
            className="w-full border-2 border-dashed border-[var(--accent-color)]/20 p-5 rounded-[24px] flex flex-col items-center gap-2 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/5 transition-all group shrink-0"
          >
            <div className="p-2 bg-[var(--accent-color)]/10 rounded-xl group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-black text-[9px] uppercase tracking-widest">寻找新导师</span>
          </button>
        </div>

        <div className="bg-amber-50/90 backdrop-blur-md rounded-2xl p-4 border border-amber-200/50 flex items-start gap-3 shadow-sm shrink-0">
          <div className="p-2 bg-amber-200/50 rounded-xl">
            <Plus className="w-4 h-4 text-amber-700" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-900/60">你知道吗？</h4>
            <p className="text-[10px] text-amber-900/70 font-medium leading-relaxed">每位导师都会根据你的进度提供不同的反馈，并专注于你的特定需求。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
