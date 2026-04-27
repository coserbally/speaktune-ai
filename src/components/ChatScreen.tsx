import React, { useState, useRef, useEffect } from 'react';
import { Character, UserContext, Message, AIResponse } from '../types';
import { getTutorResponse } from '../services/geminiService';
import { Send, ArrowLeft, RefreshCw, AlertCircle, Quote, Sparkles, Languages, CheckCircle2, Trophy, Loader2, Star, Plus } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { getTranslation } from '../lib/translations';

interface ChatScreenProps {
  character: Character;
  context: UserContext;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  savedVocab: any[];
  setSavedVocab: (vocab: any[]) => void;
  onBack: () => void;
  onReset: () => void;
}

export default function ChatScreen({ 
  character, 
  context, 
  messages, 
  setMessages, 
  savedVocab,
  setSavedVocab,
  onBack, 
  onReset 
}: ChatScreenProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveWordModal, setSaveWordModal] = useState<{word: string, meaning: string, phonetic?: string, mnemonic?: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(context.nativeLanguage, key);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const history = messages.map(m => ({
        role: m.role,
        content: m.role === 'user' ? m.content : m.roleplayReply?.reply_text || ''
      }));

      const aiData: AIResponse = await getTutorResponse(input, character, context, history);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiData.roleplay_reply.reply_text,
        feedback: aiData.feedback,
        roleplayReply: aiData.roleplay_reply,
        vocabulary: aiData.vocabulary,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setError('Communication with the tutor failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-color)]">
      {/* Header */}
      <header className="bg-[var(--card-bg)] border-b border-[var(--border-color)] py-4 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-[var(--bg-color)] rounded-xl transition-colors text-[var(--accent-color)]"
            title={t('editSettings')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--accent-color)] text-white rounded-xl flex items-center justify-center font-serif font-bold italic shadow-lg shadow-[var(--accent-color)]/20">
              {character.name[0]}
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-none mb-1">{character.name}</h3>
              <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--accent-color)] font-black opacity-60">正在进行：{context.scenario}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-[var(--accent-color)]/10 px-4 py-2 rounded-xl">
            <Trophy className="w-4 h-4 text-[var(--accent-color)]" />
            <span className="text-xs font-bold text-[var(--accent-color)] uppercase tracking-wider">{context.streakCount} Day Streak</span>
          </div>
          <button 
            onClick={onReset}
            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors text-[var(--text-color)]/40"
            title="Reset Session"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-8 space-y-12 scrollbar-hide relative">
        <AnimatePresence>
          {saveWordModal && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-32 left-8 right-8 z-50 bg-[var(--card-bg)] border-2 border-[var(--accent-color)] rounded-[32px] p-8 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  <h4 className="text-xl font-serif font-black tracking-tight text-[var(--accent-color)]">Save Word</h4>
                </div>
                <button onClick={() => setSaveWordModal(null)} className="opacity-30 hover:opacity-100 transition-opacity">
                  <RefreshCw className="w-5 h-5 rotate-45" />
                </button>
              </div>
              
              <div className="space-y-4 max-h-[40vh] overflow-y-auto px-1 pr-3 scrollbar-hide">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black opacity-40 ml-1">单词</label>
                  <input 
                    type="text" 
                    value={saveWordModal.word} 
                    onChange={e => setSaveWordModal({...saveWordModal, word: e.target.value})}
                    className="w-full bg-[var(--bg-color)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all font-bold text-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black opacity-40 ml-1">音标</label>
                  <input 
                    type="text" 
                    value={saveWordModal.phonetic || ''} 
                    onChange={e => setSaveWordModal({...saveWordModal, phonetic: e.target.value})}
                    placeholder="/.../"
                    className="w-full bg-[var(--bg-color)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black opacity-40 ml-1">含义</label>
                  <input 
                    type="text" 
                    value={saveWordModal.meaning} 
                    onChange={e => setSaveWordModal({...saveWordModal, meaning: e.target.value})}
                    placeholder="输入翻译..."
                    className="w-full bg-[var(--bg-color)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black opacity-40 ml-1">记忆点 (助记符)</label>
                  <textarea 
                    value={saveWordModal.mnemonic || ''} 
                    onChange={e => setSaveWordModal({...saveWordModal, mnemonic: e.target.value})}
                    placeholder="例如：词根、联想或故事..."
                    className="w-full bg-[var(--bg-color)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all font-medium resize-none h-20"
                  />
                </div>
              </div>

                <button 
                onClick={() => {
                  const newVocab = {
                    id: Date.now().toString(),
                    word: saveWordModal.word,
                    meaning: saveWordModal.meaning,
                    phonetic: saveWordModal.phonetic,
                    mnemonic: saveWordModal.mnemonic,
                    example: `练习时从 ${character.name} 处学到`,
                    source: 'practice'
                  };
                  setSavedVocab([...savedVocab, newVocab]);
                  setSaveWordModal(null);
                }}
                className="w-full py-4 bg-[var(--accent-color)] text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-[var(--accent-color)]/20 hover:scale-105 active:scale-95 transition-all"
              >
                加入收藏
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-4xl mx-auto w-full space-y-12 pb-12">
          {messages.length === 0 && (
            <div className="text-center py-24 opacity-30 flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-[var(--accent-color)] flex items-center justify-center">
                <Quote className="w-8 h-8 text-[var(--accent-color)]" />
              </div>
              <p className="font-serif italic text-2xl max-w-sm">"学习最美妙的地方在于，没有人能把它从你身边夺走。"</p>
              <p className="text-[10px] uppercase font-bold tracking-[0.3em]">随时准备开始</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "flex flex-col group",
                  message.role === 'user' ? "items-end" : "items-start"
                )}
              >
                {/* User Message Bubble */}
                {message.role === 'user' && (
                  <div className="max-w-[85%] bg-[var(--accent-color)] text-white rounded-[32px] rounded-tr-none px-8 py-5 shadow-xl shadow-[var(--accent-color)]/20">
                    <p className="text-xl font-medium leading-relaxed">{message.content}</p>
                  </div>
                )}

                {/* AI Message + Feedback */}
                {message.role === 'assistant' && (
                  <div className="w-full space-y-6">
                    {/* Character Reply */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)] text-white flex-shrink-0 flex items-center justify-center font-serif text-sm font-bold italic mt-1 shadow-lg shadow-[var(--accent-color)]/20">
                        {character.name[0]}
                      </div>
                      <div className="max-w-[85%] bg-white/95 rounded-[32px] rounded-tl-none px-8 py-7 shadow-sm border border-[var(--border-color)]">
                        <div className="text-xl leading-relaxed text-[var(--text-color)] font-medium space-y-4">
                          <Markdown>{message.roleplayReply?.reply_text}</Markdown>
                        </div>
                        
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-[var(--border-color)]">
                          {(context.focusAreas.translation || message.roleplayReply?.motivation_msg) && (
                            <div className="space-y-4 flex-1">
                              {context.focusAreas.translation && (
                                <div className="flex items-start gap-3">
                                  <Languages className="w-5 h-5 text-[var(--accent-color)]/40 mt-0.5" />
                                  <p className="text-base italic text-[var(--accent-color)]/60 font-medium">{message.roleplayReply?.native_translation}</p>
                                </div>
                              )}
                              <div className="flex items-center gap-2.5 text-[var(--accent-color)] font-black bg-[var(--accent-color)]/5 py-2 px-4 rounded-xl w-fit">
                                <Sparkles className="w-4 h-4 animate-pulse" />
                                <span className="text-[11px] uppercase tracking-[0.2em]">{message.roleplayReply?.motivation_msg}</span>
                              </div>
                            </div>
                          )}
                          <button 
                            onClick={() => setSaveWordModal({ word: '', meaning: '', phonetic: '', mnemonic: '' })}
                            className="p-3 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-xl hover:bg-[var(--accent-color)] hover:text-white transition-all shadow-sm"
                            title="保存单词到词库"
                          >
                            <Star className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Vocabulary Suggestions */}
                        {message.vocabulary && message.vocabulary.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-[var(--border-color)] space-y-4">
                            <p className="text-[10px] uppercase font-black text-[var(--accent-color)]/40 tracking-[0.2em]">推荐词汇</p>
                            <div className="flex flex-wrap gap-2">
                              {message.vocabulary.map((v, i) => (
                                <button
                                  key={i}
                                  onClick={() => setSaveWordModal({ 
                                    word: v.word, 
                                    meaning: v.meaning, 
                                    phonetic: v.phonetic, 
                                    mnemonic: v.context_usage 
                                  })}
                                  className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--border-color)] rounded-xl hover:border-[var(--accent-color)] transition-all shadow-sm group"
                                >
                                  <span className="font-bold text-sm">{v.word}</span>
                                  <span className="text-xs opacity-40 font-medium">{v.meaning}</span>
                                  <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent-color)]" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Feedback Block (conditional) */}
                    {(context.focusAreas.grammar || context.focusAreas.nativePolishing) && (
                      <div className="ml-14 max-w-[80%] rounded-[32px] overflow-hidden border border-[var(--border-color)] bg-white/95 backdrop-blur-xl shadow-2xl">
                        <div className="flex items-center justify-between px-8 py-4 border-b border-[var(--border-color)] bg-[var(--accent-color)]/5">
                          <div className="flex items-center gap-4">
                            <h4 className="text-[11px] uppercase font-black tracking-[0.3em] text-[var(--accent-color)]">学习见解</h4>
                            <button 
                              onClick={() => setSaveWordModal({ word: '', meaning: '', phonetic: '', mnemonic: '' })}
                              className="p-1.5 hover:bg-[var(--accent-color)]/10 rounded-lg text-[var(--accent-color)] transition-colors"
                              title="保存纠正"
                            >
                              <Star className="w-3 h-3" />
                            </button>
                          </div>
                          {message.feedback?.has_error ? (
                            <div className="flex items-center gap-1.5 text-[11px] font-black text-orange-500 uppercase">
                              <AlertCircle className="w-4 h-4" /> {t('feedbackNeeded')}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-500 uppercase">
                              <CheckCircle2 className="w-4 h-4" /> {t('excellent')}
                            </div>
                          )}
                        </div>
                        <div className="p-8 space-y-8">
                          {context.focusAreas.grammar && (
                            <div>
                              <p className="text-[10px] uppercase font-black text-[var(--accent-color)]/40 mb-3 tracking-[0.2em]">{t('grammarAnalysis')}</p>
                              <div className={cn(
                                "text-base font-serif px-5 py-4 rounded-2xl border border-dashed",
                                message.feedback?.has_error 
                                  ? "bg-orange-50/10 border-orange-200 text-[var(--text-color)]" 
                                  : "bg-emerald-50/10 border-emerald-200 text-emerald-700 italic"
                              )}>
                                {message.feedback?.grammar_correction}
                              </div>
                            </div>
                          )}
                          {context.focusAreas.nativePolishing && (
                            <div>
                              <p className="text-[10px] uppercase font-black text-[var(--accent-color)]/40 mb-3 tracking-[0.2em]">{t('authenticPhrasing')}</p>
                              <div className="text-base prose prose-lg max-w-none text-[var(--text-color)] opacity-80 leading-relaxed font-medium">
                                <Markdown>{message.feedback?.native_polishing}</Markdown>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center gap-4 ml-4"
            >
              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -6, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    className="w-2 h-2 bg-[var(--accent-color)]/40 rounded-full"
                  />
                ))}
              </div>
              <span className="text-[11px] uppercase font-black tracking-[0.3em] text-[var(--accent-color)]/50">
                {character.name} {t('typing')}
              </span>
            </motion.div>
          )}

          {error && (
            <div className="flex items-center justify-center gap-3 py-6 px-8 bg-red-50 text-red-600 rounded-3xl border border-red-100 shadow-lg italic font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="p-8 bg-[var(--card-bg)] border-t border-[var(--border-color)]">
        <form 
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto relative flex items-center gap-4"
        >
          <div className="flex-1 relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder={`${t('messagePlaceholder')} ${character.name}`}
              className="w-full bg-[var(--bg-color)] border-2 border-transparent rounded-[24px] px-8 py-5 pr-16 text-xl font-medium focus:ring-0 focus:border-[var(--accent-color)]/30 transition-all disabled:opacity-50 placeholder-[var(--text-color)]/20"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center">
               {isLoading ? (
                  <Loader2 className="w-6 h-6 text-[var(--accent-color)]/40 animate-spin" />
               ) : (
                  <div className="flex items-center gap-1 opacity-0 group-focus-within:opacity-30 transition-opacity">
                    <span className="text-[10px] font-black text-[var(--accent-color)] tracking-tighter">{t('enter')}</span>
                  </div>
               )}
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-16 h-16 bg-[var(--accent-color)] text-white rounded-[24px] flex items-center justify-center disabled:opacity-20 disabled:grayscale transition-all shadow-2xl shadow-[var(--accent-color)]/30 hover:scale-105 active:scale-95"
          >
            <Send className="w-7 h-7" />
          </button>
        </form>
      </div>
    </div>
  );
}
