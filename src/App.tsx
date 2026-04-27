/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Character, UserContext, UserLevel, Message } from './types';
import SetupScreen from './components/SetupScreen';
import ChatScreen from './components/ChatScreen';
import Navigation from './components/Navigation';
import TutorView from './components/TutorView';
import LabView from './components/LabView';
import StatsView from './components/StatsView';
import VocabView from './components/VocabView';
import PracticeView from './components/PracticeView';
import { getTranslation } from './lib/translations';
import { AnimatePresence, motion } from 'motion/react';

const STORAGE_KEYS = {
  CHARACTER: 'speak_tune_character',
  CHARACTERS: 'speak_tune_characters',
  CONTEXT: 'speak_tune_context',
  MESSAGES: 'speak_tune_messages',
  SAVED_VOCAB: 'speak_tune_saved_vocab',
  MASTERED_WORDS: 'speak_tune_mastered_words',
  DAILY_VOCAB: 'speak_tune_daily_vocab',
  LAST_REFRESH: 'speak_tune_last_refresh',
  HAS_SETUP: 'speak_tune_has_setup'
};

import { VOCAB_POOL } from './data/vocabulary';
import { generateDailyPlan, DailyLearningPlan } from './services/geminiService';

export default function App() {
  const [hasSetup, setHasSetup] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.HAS_SETUP) === 'true';
  });

  const [activeTab, setActiveTab] = useState<'practice' | 'tutor' | 'vocab' | 'lab' | 'stats'>('practice');

  const [savedVocab, setSavedVocab] = useState<any[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_VOCAB);
    return saved ? JSON.parse(saved) : [];
  });

  const [masteredWords, setMasteredWords] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MASTERED_WORDS);
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyVocab, setDailyVocab] = useState<any[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAILY_VOCAB);
    return saved ? JSON.parse(saved) : [];
  });

  const [dashboardData, setDashboardData] = useState<any>(() => {
    const saved = localStorage.getItem('speak_tune_dashboard_data');
    return saved ? JSON.parse(saved) : null;
  });

  const [character, setCharacter] = useState<Character>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHARACTER);
    return saved ? JSON.parse(saved) : {
      name: 'Emma',
      background: 'A friendly English teacher from London who loves afternoon tea.',
      personality: 'Encouraging, patient, and slightly witty.',
      speechStyle: 'British, polite but casual.'
    };
  });

  const [allCharacters, setAllCharacters] = useState<Character[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
    if (saved) return JSON.parse(saved);
    const initial = {
      name: 'Emma',
      background: 'A friendly English teacher from London who loves afternoon tea.',
      personality: 'Encouraging, patient, and slightly witty.',
      speechStyle: 'British, polite but casual.'
    };
    return [initial];
  });

  const updateCharacter = (newChar: Character) => {
    setCharacter(newChar);
    setAllCharacters(prev => {
      const exists = prev.findIndex(c => c.name === newChar.name);
      if (exists !== -1) {
        const next = [...prev];
        next[exists] = newChar;
        return next;
      }
      return [...prev, newChar];
    });
  };

  const [context, setContext] = useState<UserContext>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTEXT);
    const defaults: UserContext = {
      scenario: 'Casual coffee shop chat',
      userLevel: UserLevel.INTERMEDIATE,
      nativeLanguage: 'Chinese',
      streakCount: 3,
      theme: 'classic',
      backgroundImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop',
      focusAreas: {
        grammar: true,
        nativePolishing: true,
        translation: true
      },
      vocabBook: '雅思核心 5000词',
      dailyQuota: 10
    };

    if (saved) {
      const parsed = JSON.parse(saved);
      return { 
        ...defaults, 
        ...parsed, 
        focusAreas: parsed.focusAreas || defaults.focusAreas 
      };
    }
    return defaults;
  });

  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!saved) return {};
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return { [character.name]: parsed };
      }
      return parsed;
    } catch (e) {
      return {};
    }
  });

  const messages = messagesMap[character.name] || [];

  const setMessages = (setter: any) => {
    setMessagesMap(prev => {
      const currentMessages = prev[character.name] || [];
      const newMessages = typeof setter === 'function' ? setter(currentMessages) : setter;
      return {
        ...prev,
        [character.name]: newMessages
      };
    });
  };

  const [lastRefresh, setLastRefresh] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.LAST_REFRESH) || '';
  });

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const shouldRefresh = lastRefresh !== today || dailyVocab.length === 0;
    
    if (shouldRefresh && hasSetup) {
      const fetchPlan = async () => {
        const unlearned = VOCAB_POOL.filter(w => !masteredWords.includes(w.id));
        const shuffled = [...unlearned].sort(() => 0.5 - Math.random());
        const quota = context.dailyQuota || 10;
        const selected = shuffled.slice(0, quota);
        const wordNames = selected.map(w => w.word);

        if (wordNames.length > 0) {
          const plan = await generateDailyPlan(context.vocabBook || '雅思核心 5000词', quota, wordNames);
          if (plan) {
            setDashboardData(plan.learning_dashboard);
            localStorage.setItem('speak_tune_dashboard_data', JSON.stringify(plan.learning_dashboard));
            
            const enrichedDaily = plan.vocabulary_cards.map((card, idx) => ({
              id: selected[idx]?.id || `ai-${idx}`,
              word: card.word,
              phonetic: card.phonetic,
              meaning: card.core_meaning,
              logical_analysis: card.logical_analysis,
              academic_context: card.academic_context,
              translation: card.translation,
              example: card.academic_context,
              source: 'daily'
            }));
            setDailyVocab(enrichedDaily);
          } else {
            setDailyVocab(selected);
          }
        }
        setLastRefresh(today);
      };
      
      fetchPlan();
    }
  }, [lastRefresh, masteredWords, hasSetup, context.vocabBook, context.dailyQuota]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHARACTER, JSON.stringify(character));
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(allCharacters));
    localStorage.setItem(STORAGE_KEYS.CONTEXT, JSON.stringify(context));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messagesMap));
    localStorage.setItem(STORAGE_KEYS.SAVED_VOCAB, JSON.stringify(savedVocab));
    localStorage.setItem(STORAGE_KEYS.MASTERED_WORDS, JSON.stringify(masteredWords));
    localStorage.setItem(STORAGE_KEYS.DAILY_VOCAB, JSON.stringify(dailyVocab));
    localStorage.setItem(STORAGE_KEYS.LAST_REFRESH, lastRefresh);
    localStorage.setItem(STORAGE_KEYS.HAS_SETUP, hasSetup.toString());
  }, [character, allCharacters, context, messagesMap, savedVocab, masteredWords, dailyVocab, lastRefresh, hasSetup]);

  const handleSetupComplete = (newChar: Character, newContext: UserContext) => {
    updateCharacter(newChar);
    setContext(newContext);
    setHasSetup(true);
    setActiveTab('practice');
  };

  const handleReset = () => {
    if (confirm('您确定要重置所有数据吗？这将清除所有聊天记录且无法恢复。')) {
      setHasSetup(false);
      setMessages([]);
      localStorage.clear();
      window.location.reload();
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'practice':
        return (
          <PracticeView 
            character={character}
            allCharacters={allCharacters}
            setCharacter={updateCharacter}
            context={context}
            messagesMap={messagesMap}
            setMessages={setMessages}
            savedVocab={savedVocab}
            setSavedVocab={setSavedVocab}
            onBack={() => setHasSetup(false)}
            onReset={handleReset}
            setActiveTab={setActiveTab}
          />
        );
      case 'tutor':
        return <TutorView character={character} setCharacter={updateCharacter} nativeLanguage={context.nativeLanguage} />;
      case 'vocab':
        return (
          <VocabView 
            nativeLanguage={context.nativeLanguage} 
            savedVocab={savedVocab} 
            setSavedVocab={setSavedVocab} 
            dailyVocab={dailyVocab}
            masteredWords={masteredWords}
            setMasteredWords={setMasteredWords}
            vocabBook={context.vocabBook || '雅思核心 5000词'}
            setVocabBook={(book) => setContext({...context, vocabBook: book})}
            dailyQuota={context.dailyQuota || 10}
            setDailyQuota={(quota) => setContext({...context, dailyQuota: quota})}
            dashboardData={dashboardData}
            onBack={() => setActiveTab('practice')} 
          />
        );
      case 'lab':
        return <LabView context={context} setContext={setContext} onReset={handleReset} />;
      case 'stats':
        return <StatsView context={context} messagesMap={messagesMap} onUpdateContext={setContext} />;
      default:
        return null;
    }
  };

  return (
    <div 
      data-theme={context.theme}
      className="min-h-screen font-sans selection:bg-[var(--accent-color)] selection:text-white transition-colors duration-500 overflow-hidden bg-neutral-100 flex"
    >
      <AnimatePresence mode="wait">
        {!hasSetup ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="w-full"
          >
            <SetupScreen 
              initialCharacter={character}
              initialContext={context}
              onComplete={handleSetupComplete} 
            />
          </motion.div>
        ) : (
          <div className="flex w-full h-screen overflow-hidden">
            <Navigation 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              nativeLanguage={context.nativeLanguage} 
            />
            
            <main className="flex-1 overflow-hidden relative flex flex-col items-center justify-center bg-neutral-100">
              <div className="app-container overflow-hidden flex flex-col shadow-2xl relative z-10 md:ring-1 md:ring-neutral-200 h-full w-full">
                {/* Background Layer */}
                {context.backgroundImage && (
                  <div 
                    className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-20 transition-opacity duration-1000"
                    style={{ 
                      backgroundImage: `url(${context.backgroundImage})`
                    }}
                  />
                )}

                <motion.div
                  key="app-main"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col relative z-10"
                >
                  <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        {renderContent()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </main>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

