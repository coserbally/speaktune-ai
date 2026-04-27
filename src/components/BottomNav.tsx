import React from 'react';
import { Home, Book, PenTool, LayoutGrid, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';
import { getTranslation } from '../lib/translations';

interface BottomNavProps {
  activeTab: 'practice' | 'tutor' | 'vocab' | 'lab' | 'stats';
  setActiveTab: (tab: 'practice' | 'tutor' | 'vocab' | 'lab' | 'stats') => void;
  nativeLanguage: string;
}

export default function BottomNav({ activeTab, setActiveTab, nativeLanguage }: BottomNavProps) {
  const tabs = [
    { id: 'practice', label: getTranslation(nativeLanguage, 'practice'), icon: Home },
    { id: 'tutor', label: getTranslation(nativeLanguage, 'tutor'), icon: Book },
    { id: 'vocab', label: getTranslation(nativeLanguage, 'vocab'), icon: PenTool },
    { id: 'stats', label: getTranslation(nativeLanguage, 'stats'), icon: BarChart3 },
    { id: 'lab', label: getTranslation(nativeLanguage, 'lab'), icon: LayoutGrid },
  ] as const;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-4">
      <nav className="max-w-[420px] mx-auto bg-white rounded-[40px] px-4 py-3 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-neutral-100/50 backdrop-blur-xl">
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
              <div className={cn(
                "transition-all duration-300 mb-1",
                isActive ? "scale-110 drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]" : "scale-100"
              )}>
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn(
                    "transition-colors",
                    isActive ? "fill-[#3B82F6]/10" : "fill-none"
                  )}
                />
              </div>
              <span className={cn(
                "text-[10px] font-bold tracking-tight transition-all duration-300",
                isActive ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2 pointer-events-none"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
