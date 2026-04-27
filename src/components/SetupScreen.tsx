import React, { useState } from 'react';
import { Character, UserContext, UserLevel, AppTheme } from '../types';
import { User, Settings, Sparkles, GraduationCap, Languages, Flame, MessageSquare, Palette, CheckCircle2, ShieldCheck, Book } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { getTranslation } from '../lib/translations';

interface SetupScreenProps {
  initialCharacter: Character;
  initialContext: UserContext;
  onComplete: (char: Character, context: UserContext) => void;
}

const THEMES: { id: AppTheme; name: string; colors: string }[] = [
  { id: 'classic', name: 'Classic', colors: 'bg-[#F5F2ED] border-[#5A5A40]' },
  { id: 'midnight', name: 'Midnight', colors: 'bg-[#0F172A] border-[#38BDF8]' },
  { id: 'paper', name: 'Paper', colors: 'bg-[#FCF9F2] border-[#8C442D]' },
  { id: 'nordic', name: 'Nordic', colors: 'bg-[#E5E9F0] border-[#5E81AC]' },
];

export default function SetupScreen({ initialCharacter, initialContext, onComplete }: SetupScreenProps) {
  const [character, setCharacter] = useState<Character>(initialCharacter);
  const [context, setContext] = useState<UserContext>(initialContext);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(context.nativeLanguage, key);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(character, context);
  };

  const toggleFocus = (area: keyof typeof context.focusAreas) => {
    setContext({
      ...context,
      focusAreas: {
        ...context.focusAreas,
        [area]: !context.focusAreas[area]
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      {/* Cover Image Section */}
      <div className="relative w-full h-64 rounded-[40px] overflow-hidden mb-12 shadow-2xl border-4 border-white">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop" 
          alt="Learning Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-white tracking-tight">SpeakTune AI</h1>
              <p className="text-white/70 italic text-lg">{t('journeyBegins')}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tutor Customization - Left */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-[var(--card-bg)] rounded-[32px] p-8 shadow-sm border border-[var(--border-color)]">
            <div className="flex items-center gap-3 mb-6 text-[var(--accent-color)]">
              <User className="w-5 h-5" />
              <h2 className="text-xl font-serif font-medium">{t('identityCustomization')}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-[var(--accent-color)] mb-1.5 opacity-60">{t('displayName')}</label>
                <input 
                  type="text" 
                  value={character.name}
                  onChange={e => setCharacter({...character, name: e.target.value})}
                  className="w-full bg-[var(--bg-color)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-[var(--accent-color)] mb-1.5 opacity-60">{t('lore')}</label>
                <textarea 
                  value={character.background}
                  onChange={e => setCharacter({...character, background: e.target.value})}
                  rows={2}
                  className="w-full bg-[var(--bg-color)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all resize-none font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-[var(--accent-color)] mb-1.5 opacity-60">{t('speechStyleLabel')}</label>
                <input 
                  type="text" 
                  value={character.speechStyle}
                  onChange={e => setCharacter({...character, speechStyle: e.target.value})}
                  className="w-full bg-[var(--bg-color)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all font-medium"
                />
              </div>
            </div>
          </section>

          <section className="bg-[var(--card-bg)] rounded-[32px] p-8 shadow-sm border border-[var(--border-color)]">
            <div className="flex items-center gap-3 mb-6 text-[var(--accent-color)]">
              <Palette className="w-5 h-5" />
              <h2 className="text-xl font-serif font-medium">{t('visualStyle')}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setContext({ ...context, theme: t.id })}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all group",
                    context.theme === t.id 
                      ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5" 
                      : "border-transparent bg-[var(--bg-color)] hover:border-[var(--accent-color)]/30"
                  )}
                >
                  <div className={cn("w-full h-8 rounded-lg border", t.colors)} />
                  <span className="text-[10px] uppercase font-bold tracking-tight text-[var(--text-color)]">{t.name}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Settings & Focus - Right */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Session Params */}
            <section className="bg-[var(--card-bg)] rounded-[32px] p-8 shadow-sm border border-[var(--border-color)]">
              <div className="flex items-center gap-3 mb-6 text-[var(--accent-color)]">
                <Settings className="w-5 h-5" />
                <h2 className="text-xl font-serif font-medium">{t('sessionSetup')}</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[var(--accent-color)] mb-1.5 opacity-60">
                    <MessageSquare className="w-3 h-3" /> {t('scenario')}
                  </label>
                  <input 
                    type="text" 
                    value={context.scenario}
                    onChange={e => setContext({...context, scenario: e.target.value})}
                    className="w-full bg-[var(--bg-color)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[var(--accent-color)] mb-1.5 opacity-60">
                      <GraduationCap className="w-3 h-3" /> {t('userLevel')}
                    </label>
                    <select 
                      value={context.userLevel}
                      onChange={e => setContext({...context, userLevel: e.target.value as UserLevel})}
                      className="w-full bg-[var(--bg-color)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all cursor-pointer font-medium"
                    >
                      {Object.values(UserLevel).map(level => {
                        const levelKey = `level${level.charAt(0) + level.slice(1).toLowerCase()}` as Parameters<typeof getTranslation>[1];
                        return (
                          <option key={level} value={level}>{t(levelKey)}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[var(--accent-color)] mb-1.5 opacity-60">
                      <Languages className="w-3 h-3" /> {t('nativeLanguage')}
                    </label>
                    <select 
                      value={context.nativeLanguage}
                      onChange={e => setContext({...context, nativeLanguage: e.target.value})}
                      className="w-full bg-[var(--bg-color)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all cursor-pointer font-medium"
                    >
                      <option value="Chinese">中文 (Chinese)</option>
                      <option value="English">English</option>
                      <option value="Japanese">日本語 (Japanese)</option>
                      <option value="Spanish">Español (Spanish)</option>
                      <option value="French">Français (French)</option>
                    </select>
                  </div>
                </div>

                {/* New Book & Quota Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[var(--accent-color)] mb-1.5 opacity-60">
                      <Book className="w-3 h-3" /> 选择词书
                    </label>
                    <select 
                      value={context.vocabBook || '雅思核心 5000词'}
                      onChange={e => setContext({...context, vocabBook: e.target.value})}
                      className="w-full bg-[var(--bg-color)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all cursor-pointer font-medium"
                    >
                      <option value="雅思核心 5000词">雅思核心 5000词</option>
                      <option value="托福 3000词">托福 3000词</option>
                      <option value="高中英语 3500词">高中英语 3500词</option>
                      <option value="GRE 绝密核心词">GRE 绝密核心词</option>
                      <option value="考研英语核心词">考研英语核心词</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[var(--accent-color)] mb-1.5 opacity-60">
                      <Flame className="w-3 h-3" /> 每日背诵量
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range"
                        min="5"
                        max="50"
                        step="5"
                        value={context.dailyQuota || 10}
                        onChange={e => setContext({...context, dailyQuota: parseInt(e.target.value)})}
                        className="flex-1 accent-[var(--accent-color)]"
                      />
                      <span className="text-sm font-bold w-12 text-center">{context.dailyQuota || 10} 词</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Achievement */}
            <section className="bg-[var(--card-bg)] rounded-[32px] p-8 shadow-sm border border-[var(--border-color)]">
                <div className="flex items-center gap-3 mb-6 text-[var(--accent-color)]">
                    <CheckCircle2 className="w-5 h-5" />
                    <h2 className="text-xl font-serif font-medium">{t('progress')}</h2>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-[var(--bg-color)] rounded-2xl border border-[var(--border-color)]">
                    <div className="relative mb-4">
                        <Flame className="w-12 h-12 text-orange-500" />
                        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg mt-1">{context.streakCount}</span>
                    </div>
                   <input 
                    type="range"
                    min="0"
                    max="100"
                    value={context.streakCount}
                    onChange={e => setContext({...context, streakCount: parseInt(e.target.value)})}
                    className="w-full accent-[var(--accent-color)] cursor-pointer"
                   />
                   <p className="mt-2 text-[10px] uppercase font-bold text-[var(--accent-color)]/60">{t('currentDailyStreak')}</p>
                </div>
            </section>
          </div>

          {/* Learning Focus - The "Wanted Features" */}
          <section className="bg-[var(--card-bg)] rounded-[32px] p-8 shadow-sm border border-[var(--border-color)]">
            <div className="flex items-center gap-3 mb-6 text-[var(--accent-color)]">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="text-xl font-serif font-medium">{t('learningFocus')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => toggleFocus('grammar')}
                className={cn(
                  "p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between",
                  context.focusAreas.grammar 
                    ? "border-green-500 bg-green-50/50" 
                    : "border-[var(--border-color)] bg-[var(--bg-color)] opacity-50"
                )}
              >
                <div>
                  <h4 className="font-bold text-sm">{t('grammar')}</h4>
                  <p className="text-[10px] opacity-60">{t('grammarSub')}</p>
                </div>
                {context.focusAreas.grammar && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              </button>

              <button
                type="button"
                onClick={() => toggleFocus('nativePolishing')}
                className={cn(
                  "p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between",
                  context.focusAreas.nativePolishing 
                    ? "border-blue-500 bg-blue-50/50" 
                    : "border-[var(--border-color)] bg-[var(--bg-color)] opacity-50"
                )}
              >
                <div>
                  <h4 className="font-bold text-sm">{t('nativePolishing')}</h4>
                  <p className="text-[10px] opacity-60">{t('polishingSub')}</p>
                </div>
                {context.focusAreas.nativePolishing && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
              </button>

              <button
                type="button"
                onClick={() => toggleFocus('translation')}
                className={cn(
                  "p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between",
                  context.focusAreas.translation 
                    ? "border-purple-500 bg-purple-50/50" 
                    : "border-[var(--border-color)] bg-[var(--bg-color)] opacity-50"
                )}
              >
                <div>
                  <h4 className="font-bold text-sm">{t('translation')}</h4>
                  <p className="text-[10px] opacity-60">{t('translationSub')}</p>
                </div>
                {context.focusAreas.translation && <CheckCircle2 className="w-5 h-5 text-purple-500" />}
              </button>
            </div>
          </section>

          <button 
            type="submit"
            className="w-full bg-[var(--accent-color)] text-white py-5 rounded-[24px] font-bold text-lg hover:brightness-110 transition-all shadow-xl shadow-[var(--accent-color)]/20 flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            {t('launchExperience')} <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
