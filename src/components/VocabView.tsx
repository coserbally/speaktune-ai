import React, { useState } from 'react';
import { VocabWord } from '../types';
import { Book, ChevronRight, Eye, EyeOff, CheckCircle2, RotateCcw, Star, Trash2, ArrowLeft, Volume2, Sparkles, Target, Trophy } from 'lucide-react';
import { getTranslation } from '../lib/translations';

interface VocabViewProps {
  nativeLanguage: string;
  savedVocab: VocabWord[];
  setSavedVocab: (v: VocabWord[]) => void;
  dailyVocab: VocabWord[];
  masteredWords: string[];
  setMasteredWords: (ids: string[]) => void;
  vocabBook: string;
  setVocabBook: (book: string) => void;
  dailyQuota: number;
  setDailyQuota: (quota: number) => void;
  dashboardData?: {
    book_target: string;
    daily_goal: string;
    daily_motivation: string;
  };
  onBack?: () => void;
}

export default function VocabView({ 
  nativeLanguage, 
  savedVocab, 
  setSavedVocab, 
  dailyVocab,
  masteredWords,
  setMasteredWords,
  vocabBook,
  setVocabBook,
  dailyQuota,
  setDailyQuota,
  dashboardData,
  onBack 
}: VocabViewProps) {
  const t = (key: any) => getTranslation(nativeLanguage, key);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);
  const [filter, setFilter] = useState<'all' | 'mastered' | 'learning'>('all');

  const combinedVocab = [...dailyVocab, ...savedVocab];
  
  const filteredVocab = combinedVocab.filter(word => {
    if (filter === 'mastered') return masteredWords.includes(word.id);
    if (filter === 'learning') return !masteredWords.includes(word.id);
    return true;
  });

  const currentWord = filteredVocab[currentIndex];

  const allDailyMastered = dailyVocab.length > 0 && dailyVocab.every(word => masteredWords.includes(word.id));

  const speak = (text: string, variant: 'en-US' | 'en-GB' = 'en-US') => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = variant;
    utterance.rate = 0.9;
    utterance.volume = 1.0; // Set to max volume
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    setShowMeaning(false);
    if (filteredVocab.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredVocab.length);
    }
  };

  const handleToggleMastered = () => {
    if (!currentWord) return;
    if (masteredWords.includes(currentWord.id)) {
      setMasteredWords(masteredWords.filter(id => id !== currentWord.id));
    } else {
      setMasteredWords([...masteredWords, currentWord.id]);
    }
  };

  const removeSavedWord = (id: string) => {
    setSavedVocab(savedVocab.filter(w => w.id !== id));
  };

  if (allDailyMastered && filter !== 'mastered' && !showSavedList && filter !== 'all') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-8 text-center">
        <div className="space-y-8 max-w-md bg-white/80 backdrop-blur-3xl p-12 rounded-[48px] shadow-2xl border border-white/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-32 h-32 rotate-12" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl rotate-3">
              <Trophy className="w-12 h-12" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-serif font-black tracking-tight">任务圆满完成！</h2>
              <p className="text-lg opacity-60 font-medium leading-relaxed">
                恭喜！你已经攻克了今日所有的 {dailyVocab.length} 个核心词汇。
                你的词汇量正在以肉眼可见的速度增长。
              </p>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 italic text-emerald-700 text-sm">
              "Every word you master today is a bridge to a wider world tomorrow."
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setFilter('all')}
                className="w-full p-6 bg-[var(--accent-color)] text-white rounded-3xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                回顾今日单词
              </button>
              <button 
                onClick={onBack}
                className="w-full p-4 bg-white/50 text-[var(--accent-color)] border border-[var(--accent-color)]/20 rounded-3xl font-black uppercase tracking-widest hover:bg-white transition-all text-sm"
              >
                返回主页
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentWord && !showSavedList) {
    return (
      <div className="h-full flex items-center justify-center p-12 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-[var(--accent-color)]/5 text-[var(--accent-color)] rounded-2xl flex items-center justify-center mx-auto mb-4">
             <RotateCcw className="w-8 h-8 opacity-40" />
          </div>
          <p className="opacity-40 italic">暂无符合当前筛选条件的单词</p>
          <button onClick={() => setFilter('all')} className="text-[var(--accent-color)] font-bold uppercase text-xs tracking-widest underline">显示全部</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-12 scrollbar-hide">
      <div className="max-w-2xl mx-auto space-y-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--accent-color)] rounded-2xl text-white shadow-lg shadow-[var(--accent-color)]/20">
                <Book className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-black tracking-tight">{t('vocabulary')}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 w-32 bg-[var(--border-color)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--accent-color)] transition-all duration-1000" 
                      style={{ width: `${combinedVocab.length > 0 ? (masteredWords.filter(id => combinedVocab.some(w => w.id === id)).length / combinedVocab.length) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">
                    {masteredWords.filter(id => combinedVocab.some(w => w.id === id)).length}/{combinedVocab.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowSavedList(!showSavedList)}
            className={`p-3 rounded-2xl transition-all ${showSavedList ? 'bg-[var(--accent-color)] text-white' : 'bg-white/95 text-[var(--accent-color)] border border-white/50 shadow-sm'}`}
          >
            <Star className="w-6 h-6" />
          </button>
        </header>

        {/* Learning Dashboard Section */}
        {!showSavedList && dashboardData && (
          <section className="bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-color)]/90 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Sparkles className="w-24 h-24 rotate-12" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 opacity-80">
                    <Book className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-black tracking-widest">当前计划 (Current Plan)</span>
                  </div>
                  <h3 className="text-2xl font-serif font-black">{dashboardData.book_target}</h3>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-2 opacity-80 justify-center mb-1">
                      <Target className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-black tracking-widest">今日目标</span>
                    </div>
                    <p className="text-xl font-black">{dashboardData.daily_goal}</p>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div className="text-center">
                    <div className="flex items-center gap-2 opacity-80 justify-center mb-1">
                      <Trophy className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-black tracking-widest">已掌握</span>
                    </div>
                    <p className="text-xl font-black">{masteredWords.filter(id => dailyVocab.some(w => w.id === id)).length}</p>
                  </div>
                </div>
              </div>
              <div className="h-px bg-white/20 w-full" />
              <div className="flex items-start gap-4 bg-white/10 p-5 rounded-2xl backdrop-blur-md">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-sm font-medium leading-relaxed italic opacity-95">"{dashboardData.daily_motivation}"</p>
              </div>
            </div>
          </section>
        )}

        {showSavedList ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold px-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                练习中收藏的单词
              </h3>
              <button 
                onClick={() => setShowSavedList(false)}
                className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-xl border border-[var(--border-color)] rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                返回复习
              </button>
            </div>
            {savedVocab.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-3xl p-12 rounded-[32px] text-center border-2 border-dashed border-white/50">
                <p className="opacity-40 font-medium italic">暂无保存的单词。在练习过程中点击单词即可保存！</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {savedVocab.map(word => (
                  <div key={word.id} className="bg-white/95 backdrop-blur-3xl p-6 rounded-[32px] border border-white/50 shadow-lg flex items-center justify-between group">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-bold">{word.word}</h4>
                        {word.phonetic && <span className="text-xs opacity-40 font-mono">{word.phonetic}</span>}
                      </div>
                      <p className="text-sm opacity-60">{word.meaning}</p>
                      {word.mnemonic && (
                        <p className="text-xs text-[var(--accent-color)] font-medium mt-1">💡 {word.mnemonic}</p>
                      )}
                      {word.example && <p className="text-xs opacity-40 italic mt-2">"{word.example}"</p>}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button 
                        onClick={() => speak(word.word, 'en-US')}
                        className="flex items-center gap-2 px-3 py-1 bg-[var(--accent-color)]/5 hover:bg-[var(--accent-color)]/20 rounded-full transition-all text-[8px] font-black uppercase tracking-widest text-[var(--accent-color)]"
                      >
                        <Volume2 className="w-3 h-3" />
                        美
                      </button>
                      <button 
                        onClick={() => speak(word.word, 'en-GB')}
                        className="flex items-center gap-2 px-3 py-1 bg-[var(--accent-color)]/5 hover:bg-[var(--accent-color)]/20 rounded-full transition-all text-[8px] font-black uppercase tracking-widest text-[var(--accent-color)]"
                      >
                        <Volume2 className="w-3 h-3" />
                        英
                      </button>
                    </div>
                    <button 
                      onClick={() => removeSavedWord(word.id)}
                      className="p-3 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Filter Tabs */}
            <div className="flex gap-2 p-1 bg-white/95 backdrop-blur-3xl rounded-2xl border border-white/50 shadow-sm">
              {(['all', 'learning', 'mastered'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setCurrentIndex(0); }}
                  className={`flex-1 px-4 py-2 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${
                    filter === f ? 'bg-[var(--accent-color)] text-white shadow-md' : 'text-[var(--text-color)]/60 hover:bg-white/50'
                  }`}
                >
                  {f === 'all' ? '全部' : f === 'learning' ? '学习中' : '已掌握'}
                </button>
              ))}
            </div>

            {/* Word Card */}
            {currentWord ? (
              <div className="min-h-[400px] bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-color)]/80 rounded-[40px] p-8 md:p-10 flex flex-col items-center justify-center text-center text-white relative shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Book className="w-32 h-32 rotate-12" />
                </div>

                <div className="relative z-10 space-y-6 w-full">
                  <div className="flex flex-col items-center gap-6">
                    <h3 className="text-6xl md:text-7xl font-serif font-black tracking-tight">{currentWord.word}</h3>
                    
                    {currentWord.phonetic && (
                      <p className="text-2xl opacity-90 font-mono tracking-widest bg-white/10 px-4 py-1 rounded-lg">
                        {currentWord.phonetic}
                      </p>
                    )}

                    <div className="flex gap-4">
                      <button 
                        onClick={() => speak(currentWord.word, 'en-US')}
                        className="flex flex-col items-center gap-2 group/btn"
                        title="American Pronunciation"
                      >
                        <div className="p-4 bg-white/20 group-hover/btn:bg-white/40 rounded-full transition-all shadow-lg">
                          <Volume2 className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Master (US)</span>
                      </button>
                      
                      <button 
                        onClick={() => speak(currentWord.word, 'en-GB')}
                        className="flex flex-col items-center gap-2 group/btn"
                        title="British Pronunciation"
                      >
                        <div className="p-4 bg-white/20 group-hover/btn:bg-white/40 rounded-full transition-all shadow-lg">
                          <Volume2 className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Royal (UK)</span>
                      </button>
                    </div>
                  </div>

                  <div className={`transition-all duration-500 overflow-hidden ${showMeaning ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-4 pt-4 text-left">
                      <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md text-center">
                        <p className="text-xl font-bold">{currentWord.meaning}</p>
                      </div>
                      
                      {currentWord.logical_analysis && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-black tracking-widest opacity-60">逻辑推导 (Logical Analysis)</span>
                          <p className="text-sm font-medium leading-relaxed">{currentWord.logical_analysis}</p>
                        </div>
                      )}

                      {currentWord.academic_context && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-black tracking-widest opacity-60">学术语境 (Academic Context)</span>
                          <p className="text-sm opacity-80 italic leading-relaxed">"{currentWord.academic_context}"</p>
                          {currentWord.translation && (
                            <p className="text-xs opacity-50 font-medium">译: {currentWord.translation}</p>
                          )}
                        </div>
                      )}

                      {!currentWord.logical_analysis && currentWord.mnemonic && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-black tracking-widest opacity-60">记忆技巧</span>
                          <p className="text-sm font-medium leading-relaxed">{currentWord.mnemonic}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 justify-center">
                    <button 
                      onClick={() => setShowMeaning(!showMeaning)}
                      className="p-4 bg-white/20 hover:bg-white/30 rounded-2xl transition-all backdrop-blur-md"
                    >
                      {showMeaning ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                    <button 
                      onClick={handleToggleMastered}
                      className={`p-4 rounded-2xl transition-all backdrop-blur-md ${masteredWords.includes(currentWord.id) ? 'bg-green-500 text-white' : 'bg-white/20 hover:bg-white/30'}`}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={handleNext}
                      className="p-4 bg-white text-[var(--accent-color)] rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] bg-white/95 backdrop-blur-3xl rounded-[40px] p-12 text-center border-2 border-dashed border-white/50 flex flex-col items-center justify-center">
                 <p className="opacity-40 font-serif italic text-lg">当前列表为空</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/95 backdrop-blur-3xl p-6 rounded-[32px] border border-white/50 shadow-lg flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-40">{t('mastered')}</p>
                  <p className="text-xl font-serif font-bold">{masteredWords.filter(id => combinedVocab.some(w => w.id === id)).length}</p>
                </div>
              </div>
              <div className="bg-white/95 backdrop-blur-3xl p-6 rounded-[32px] border border-white/50 shadow-lg flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-40">{t('learning')}</p>
                  <p className="text-xl font-serif font-bold">{combinedVocab.length - masteredWords.filter(id => combinedVocab.some(w => w.id === id)).length}</p>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-[var(--border-color)] space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[var(--accent-color)] px-2">
                  <Target className="w-5 h-5" />
                  <h3 className="font-serif font-bold text-xl">学习计划设置</h3>
                </div>
                
                <div className="grid gap-6">
                  <div className="bg-white/95 backdrop-blur-3xl p-6 rounded-[32px] border border-white/50 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-black tracking-widest opacity-40">选定词书 (Target Book)</label>
                      <Book className="w-4 h-4 opacity-20" />
                    </div>
                    <select 
                      value={vocabBook}
                      onChange={e => setVocabBook(e.target.value)}
                      className="w-full bg-[var(--bg-color)] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all cursor-pointer font-bold uppercase tracking-widest text-sm"
                    >
                      <option value="雅思核心 5000词">雅思核心 5000词</option>
                      <option value="托福 3000词">托福 3000词</option>
                      <option value="高中英语 3500词">高中英语 3500词</option>
                      <option value="GRE 绝密核心词">GRE 绝密核心词</option>
                      <option value="考研英语核心词">考研英语核心词</option>
                    </select>
                  </div>

                  <div className="bg-white/95 backdrop-blur-3xl p-6 rounded-[32px] border border-white/50 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-black tracking-widest opacity-40">每日计划量 (Daily Quota)</label>
                      <span className="text-sm font-black text-[var(--accent-color)]">{dailyQuota} WORDS</span>
                    </div>
                    <input 
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={dailyQuota}
                      onChange={e => setDailyQuota(parseInt(e.target.value))}
                      className="w-full accent-[var(--accent-color)] cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] font-black opacity-20 uppercase tracking-widest px-1">
                      <span>Light</span>
                      <span>Intense</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
