import React, { useState } from 'react';
import { UserContext, Message } from '../types';
import { BarChart3, Flame, MessageSquare, Clock, Trophy, Map, Calendar, CheckCircle2 } from 'lucide-react';
import { getTranslation } from '../lib/translations';

interface StatsViewProps {
  context: UserContext;
  messagesMap: Record<string, Message[]>;
  onUpdateContext?: (context: UserContext) => void;
}

export default function StatsView({ context, messagesMap, onUpdateContext }: StatsViewProps) {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(context.nativeLanguage, key);
  
  const allMessages = Object.values(messagesMap).flat();
  const userMessages = allMessages.filter(m => m.role === 'user');
  const totalWords = userMessages.reduce((acc, m) => acc + m.content.split(/\s+/).length, 0);
  
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  const handleCheckIn = () => {
    if (!hasCheckedIn && onUpdateContext) {
      onUpdateContext({
        ...context,
        streakCount: context.streakCount + 1
      });
      setHasCheckedIn(true);
    }
  };

  const milestones = [
    { title: 'milestone1', desc: 'milestone1Desc', condition: userMessages.length >= 10 },
    { title: 'milestone2', desc: 'milestone2Desc', condition: context.streakCount >= 3 },
    { title: 'milestone3', desc: 'milestone3Desc', condition: userMessages.length >= 50 },
    { title: 'milestone4', desc: 'milestone4Desc', condition: context.streakCount >= 7 },
  ];

  return (
    <div className="h-full overflow-y-auto px-6 py-12 scrollbar-hide">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="mb-10 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-black tracking-tight">{t('yourProgress')}</h2>
            <p className="text-sm opacity-50 tracking-wide uppercase font-bold">{t('statsInsights')}</p>
          </div>
        </header>

        {/* Check-in Card */}
        <section className="bg-white/95 backdrop-blur-3xl rounded-[32px] p-8 border border-white/50 text-center space-y-6 shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <div className={`p-5 rounded-full transition-all duration-500 ${hasCheckedIn ? 'bg-green-500 text-white rotate-[360deg]' : 'bg-[var(--accent-color)] text-white shadow-xl shadow-[var(--accent-color)]/20'}`}>
              {hasCheckedIn ? <CheckCircle2 className="w-8 h-8" /> : <Calendar className="w-8 h-8" />}
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold">{hasCheckedIn ? t('checkedIn') : t('checkIn')}</h3>
            </div>
            <button
              onClick={handleCheckIn}
              disabled={hasCheckedIn}
              className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-lg transition-all active:scale-95 ${
                hasCheckedIn 
                ? 'bg-green-500/10 text-green-600 cursor-default shadow-none border border-green-500/20' 
                : 'bg-[var(--accent-color)] text-white shadow-[var(--accent-color)]/20 hover:shadow-[var(--accent-color)]/30'
              }`}
            >
              {hasCheckedIn ? '签到成功' : t('checkIn')}
            </button>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-[32px] text-white shadow-xl shadow-orange-500/20">
            <Flame className="w-8 h-8 mb-4 opacity-50" />
            <p className="text-4xl font-serif font-black mb-1">{context.streakCount}</p>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80">{t('dayStreak')}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-3xl p-8 rounded-[32px] border border-white/50 shadow-lg">
            <MessageSquare className="w-8 h-8 mb-4 text-[var(--accent-color)] opacity-50" />
            <p className="text-4xl font-serif font-black mb-1 text-[var(--text-color)]">{userMessages.length}</p>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">{t('messagesSent')}</p>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-3xl rounded-[32px] p-8 border border-white/50 shadow-xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                <Clock className="w-4 h-4" />
              </div>
              <span className="font-serif font-black text-lg">{t('totalEngagement')}</span>
            </div>
            <span className="font-black text-2xl text-[var(--accent-color)]">{totalWords} <span className="text-[10px] uppercase tracking-widest opacity-40">{t('words')}</span></span>
          </div>

          <div className="pt-8 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-3 mb-6 font-serif font-black text-lg">
              <Trophy className="w-5 h-5 text-amber-500" />
              {t('milestones')}
            </div>
            <div className="space-y-6">
              {milestones.map((milestone, idx) => (
                <div key={idx} className={`flex items-start gap-4 transition-all duration-500 ${milestone.condition ? 'opacity-100 scale-100' : 'opacity-30 p-2 grayscale'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${milestone.condition ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]' : 'bg-neutral-100 text-neutral-400 border-2 border-dashed'}`}>
                    <Map className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center justify-between">
                       <p className="font-bold text-base">{t(milestone.title as any)}</p>
                       {milestone.condition && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                     </div>
                     <p className="text-xs opacity-60 uppercase tracking-tight font-medium">{t(milestone.desc as any)}</p>
                  </div>
                </div>
              ))}
              <p className="text-center text-[10px] font-bold opacity-20 uppercase tracking-[0.3em] pt-4">{t('moreAchievements')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
