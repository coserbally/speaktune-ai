import React from 'react';
import { Home, Book, PenTool, LayoutGrid, BarChart3, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { getTranslation } from '../lib/translations';

interface BottomNavProps {
  activeTab: 'practice' | 'tutor' | 'vocab' | 'lab' | 'stats';
  setActiveTab: (tab: 'practice' | 'tutor' | 'vocab' | 'lab' | 'stats') => void;
  nativeLanguage: string;
}

export default function Navigation({ activeTab, setActiveTab, nativeLanguage }: BottomNavProps) {
  const tabs = [
    { id: 'practice', label: getTranslation(nativeLanguage, 'practice'), icon: Home },
    { id: 'tutor', label: getTranslation(nativeLanguage, 'tutor'), icon: Book },
    { id: 'vocab', label: getTranslation(nativeLanguage, 'vocab'), icon: PenTool },
    { id: 'stats', label: getTranslation(nativeLanguage, 'stats'), icon: BarChart3 },
    { id: 'lab', label: getTranslation(nativeLanguage, 'lab'), icon: LayoutGrid },
  ] as const;

  return (
    <>
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-4">
        <nav className="max-w-[420px] mx-auto bg-white/90 backdrop-blur-xl rounded-[40px] px-4 py-3 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-neutral-100/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center transition-all duration-300 relative px-3 py-1",
                  isActive ? "text-[#3B82F6]" : "text-neutral-400 hover:text-neutral-600"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={cn(isActive && "fill-[#3B82F6]/10")} />
                <span className={cn(
                  "text-[10px] font-bold mt-1 transition-all",
                  isActive ? "opacity-100" : "opacity-0"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Desktop Sidebar Rail */}
      <aside className="hidden md:flex flex-col w-24 bg-white border-r border-neutral-100 py-10 z-50 h-screen sticky top-0">
        <div className="flex flex-col items-center gap-10 flex-1">
          <div className="w-12 h-12 bg-[#3B82F6] rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20">
            <Sparkles size={24} />
          </div>
          
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "group relative w-full flex flex-col items-center gap-2 px-2 transition-all duration-300",
                  isActive ? "text-[#3B82F6]" : "text-neutral-400 hover:text-neutral-600"
                )}
              >
                <div className={cn(
                  "p-3 rounded-2xl transition-all duration-300 relative overflow-hidden",
                  isActive ? "bg-blue-50 shadow-sm" : "group-hover:bg-neutral-50"
                )}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#3B82F6] rounded-r-full"
                    />
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
