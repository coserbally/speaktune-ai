import React from 'react';
import { UserContext, UserLevel, AppTheme } from '../types';
import { Beaker, Palette, GraduationCap, Languages, MessageSquare, Trash2, CheckCircle2, Image as ImageIcon, Book } from 'lucide-react';
import { cn } from '../lib/utils';
import { getTranslation } from '../lib/translations';

interface LabViewProps {
  context: UserContext;
  setContext: (ctx: UserContext) => void;
  onReset: () => void;
}

const THEMES: { id: AppTheme; name: string; colors: string }[] = [
  { id: 'classic', name: 'Classic', colors: 'bg-[#F5F2ED] border-[#5A5A40]' },
  { id: 'midnight', name: 'Midnight', colors: 'bg-[#0F172A] border-[#38BDF8]' },
  { id: 'paper', name: 'Paper', colors: 'bg-[#FCF9F2] border-[#8C442D]' },
  { id: 'nordic', name: 'Nordic', colors: 'bg-[#E5E9F0] border-[#5E81AC]' },
];

const BACKGROUNDS = [
  { id: 'none', label: '纯色', preview: 'bg-white' },
  { id: 'study', label: '学习环境', preview: 'bg-blue-50', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop' },
  { id: 'forest', label: '森林秘境', preview: 'bg-green-100', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop' },
  { id: 'ocean', label: '宁静海洋', preview: 'bg-cyan-100', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2560&auto=format&fit=crop' },
  { id: 'mountain', label: '壮丽山峦', preview: 'bg-slate-300', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2560&auto=format&fit=crop' },
  { id: 'sunset', label: '金色落日', preview: 'bg-orange-100', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2560&auto=format&fit=crop' },
  { id: 'london', label: '城市景观', preview: 'bg-slate-200', url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2670&auto=format&fit=crop' },
  { id: 'minimal', label: '极简主义', preview: 'bg-gray-100', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2667&auto=format&fit=crop' },
  { id: 'space', label: '璀璨星空', preview: 'bg-indigo-900', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2560&auto=format&fit=crop' },
  { id: 'library', label: '深夜图书馆', preview: 'bg-sepia-200', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2560&auto=format&fit=crop' },
];

export default function LabView({ context, setContext, onReset }: LabViewProps) {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(context.nativeLanguage, key);

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
    <div className="h-full overflow-y-auto px-6 py-12 scrollbar-hide">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="mb-10 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
            <Beaker className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-black tracking-tight">{t('lab')}</h2>
            <p className="text-sm opacity-50 tracking-wide uppercase font-bold">{t('experimentWithEnv')}</p>
          </div>
        </header>

        <section className="bg-white/95 backdrop-blur-3xl rounded-[32px] p-8 border border-white/50 shadow-xl space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6 text-[var(--accent-color)]">
              <Palette className="w-5 h-5" />
              <h3 className="font-serif font-bold text-xl">{t('interfaceTheme')}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setContext({ ...context, theme: t.id })}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group",
                    context.theme === t.id 
                      ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5" 
                      : "border-transparent bg-[var(--bg-color)] hover:border-[var(--accent-color)]/30"
                  )}
                >
                  <div className={cn("w-full h-10 rounded-lg border", t.colors)} />
                  <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-color)]">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-3 mb-6 text-[var(--accent-color)]">
              <ImageIcon className="w-5 h-5" />
              <h3 className="font-serif font-bold text-xl">背景场景</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setContext({ ...context, backgroundImage: bg.url })}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group",
                    context.backgroundImage === bg.url || (!context.backgroundImage && bg.id === 'none')
                      ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5" 
                      : "border-transparent bg-[var(--bg-color)] hover:border-[var(--accent-color)]/30"
                  )}
                >
                  <div 
                    className={cn("w-full h-16 rounded-lg border bg-cover bg-center shadow-inner", bg.preview)} 
                    style={bg.url ? { backgroundImage: `url(${bg.url})` } : {}}
                  />
                  <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-color)]">{bg.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-3 mb-6 text-[var(--accent-color)]">
              <GraduationCap className="w-5 h-5" />
              <h3 className="font-serif font-bold text-xl">{t('userLevel')}</h3>
            </div>
            <select 
              value={context.userLevel}
              onChange={e => setContext({...context, userLevel: e.target.value as UserLevel})}
              className="w-full bg-[var(--bg-color)] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all cursor-pointer font-bold uppercase tracking-widest text-sm"
            >
              {Object.values(UserLevel).map(level => {
                const levelKey = `level${level.charAt(0) + level.slice(1).toLowerCase()}` as Parameters<typeof getTranslation>[1];
                return (
                  <option key={level} value={level}>{t(levelKey)}</option>
                );
              })}
            </select>
          </div>

          <div className="pt-8 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-3 mb-6 text-[var(--accent-color)]">
              <Languages className="w-5 h-5" />
              <h3 className="font-serif font-bold text-xl">{t('learningFocus')}</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {(['grammar', 'nativePolishing', 'translation'] as const).map((area) => (
                <button
                  key={area}
                  onClick={() => toggleFocus(area)}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between",
                    context.focusAreas[area] 
                      ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5" 
                      : "border-transparent bg-[var(--bg-color)] opacity-40 grayscale"
                  )}
                >
                  <span className="font-black uppercase tracking-widest text-[10px]">{t(area)}</span>
                  {context.focusAreas[area] && <CheckCircle2 className="w-4 h-4 text-[var(--accent-color)]" />}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="pt-8 w-full flex justify-center">
            <button 
                onClick={onReset}
                className="flex items-center gap-2 text-red-500/60 hover:text-red-500 transition-colors font-black uppercase tracking-widest text-[10px] py-4 px-8"
            >
                <Trash2 className="w-4 h-4" /> {t('resetAllData')}
            </button>
        </div>
      </div>
    </div>
  );
}
