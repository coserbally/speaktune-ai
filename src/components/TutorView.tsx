import React from 'react';
import { Character } from '../types';
import { ShieldCheck, Sparkles, User, Briefcase, GraduationCap, Waves, Heart } from 'lucide-react';
import { getTranslation } from '../lib/translations';

interface TutorViewProps {
  character: Character;
  setCharacter: (char: Character) => void;
  nativeLanguage: string;
}

export default function TutorView({ character, setCharacter, nativeLanguage }: TutorViewProps) {
  const t = (key: any) => getTranslation(nativeLanguage, key);

  const templates: { id: string, icon: any, character: Character, label: any, desc: any }[] = [
    {
      id: 'british',
      icon: GraduationCap,
      label: 'templaetBritish',
      desc: 'templateBritishDesc',
      character: {
        name: 'James',
        background: 'A distinguished professor from Oxford with 20 years of experience in linguistic research.',
        personality: 'Formal, precise, encouraging but intellectually demanding.',
        speechStyle: 'Academic British English, high clarity, RP accent.'
      }
    },
    {
      id: 'american',
      icon: Waves,
      label: 'templateAmerican',
      desc: 'templateAmericanDesc',
      character: {
        name: 'Zack',
        background: 'A professional surfer from Malibu who teaches English on the side for fun.',
        personality: 'Chill, energetic, optimistic, and uses lots of modern slang.',
        speechStyle: 'West Coast American, fast-paced, very casual.'
      }
    },
    {
      id: 'business',
      icon: Briefcase,
      label: 'templateBusiness',
      desc: 'templateBusinessDesc',
      character: {
        name: 'Catherine',
        background: 'Former COO of a Fortune 500 company specializing in international relations.',
        personality: 'Professional, strategic, efficiency-oriented.',
        speechStyle: 'Corporate English, focuses on idioms for negotiations and presentations.'
      }
    },
    {
      id: 'casual',
      icon: Heart,
      label: 'templateCasual',
      desc: 'templateCasualDesc',
      character: {
        name: 'Sophie',
        background: 'A warm bakery owner from a small town in Canada who loves meeting new people.',
        personality: 'Patient, kind, warm, and highly relatable.',
        speechStyle: 'Clear standard Canadian English, focuses on daily conversational flow.'
      }
    }
  ];

  const handleSelectTemplate = (templateChar: Character) => {
    setCharacter(templateChar);
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-12 scrollbar-hide">
      <div className="max-w-2xl mx-auto space-y-12">
        <header className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--accent-color)] text-white rounded-3xl mb-6 shadow-xl shadow-[var(--accent-color)]/20 font-serif text-3xl font-bold italic">
            {character.name[0]}
          </div>
          <h2 className="text-3xl font-serif font-black tracking-tight">{character.name}</h2>
          <p className="text-[var(--text-color)]/50 italic px-4">{character.background}</p>
        </header>

        {/* Recommended Templates */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-[var(--accent-color)]">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-serif font-bold text-xl">{t('recommendedTutors')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((tpl) => {
              const Icon = tpl.icon;
              const isActive = character.name === tpl.character.name;
              return (
                <button
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl.character)}
                  className={`flex flex-col items-start p-6 rounded-[28px] border-2 transition-all text-left group ${
                    isActive 
                      ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-color)]/20' 
                      : 'bg-white/95 backdrop-blur-3xl border border-white/50 hover:border-[var(--accent-color)]/30 shadow-lg'
                  }`}
                >
                  <div className={`p-3 rounded-2xl mb-4 ${isActive ? 'bg-white/20' : 'bg-[var(--accent-color)]/5 text-[var(--accent-color)]'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg mb-1">{t(tpl.label)}</h4>
                  <p className={`text-sm ${isActive ? 'text-white/70' : 'text-[var(--text-color)]/50'}`}>
                    {t(tpl.desc)}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 pb-20">
          <section className="bg-white/95 backdrop-blur-3xl rounded-[32px] p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-8 text-[var(--accent-color)]">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-serif font-bold text-xl">{t('customTutor')}</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-[var(--accent-color)]/60 mb-2">{t('displayName')}</label>
                <input 
                  type="text" 
                  value={character.name}
                  onChange={e => setCharacter({...character, name: e.target.value})}
                  className="w-full bg-[var(--bg-color)] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all font-medium text-lg"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-[var(--accent-color)]/60 mb-2">{t('lore')}</label>
                <textarea 
                  value={character.background}
                  onChange={e => setCharacter({...character, background: e.target.value})}
                  rows={3}
                  className="w-full bg-[var(--bg-color)] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all font-medium resize-none text-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-[var(--accent-color)]/60 mb-2">{t('personalityTraits')}</label>
                  <input 
                    type="text" 
                    value={character.personality}
                    onChange={e => setCharacter({...character, personality: e.target.value})}
                    className="w-full bg-[var(--bg-color)] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-[var(--accent-color)]/60 mb-2">{t('speechStyleLabel')}</label>
                  <input 
                    type="text" 
                    value={character.speechStyle}
                    onChange={e => setCharacter({...character, speechStyle: e.target.value})}
                    className="w-full bg-[var(--bg-color)] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="bg-[var(--accent-color)]/5 rounded-[32px] p-8 flex items-center gap-6 border border-[var(--accent-color)]/10">
            <div className="p-4 bg-[var(--accent-color)]/10 rounded-2xl flex-shrink-0">
              <Sparkles className="w-8 h-8 text-[var(--accent-color)]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg leading-tight mb-1">{t('characterContinuity')}</h4>
              <p className="text-sm opacity-60">{t('characterContinuityDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

