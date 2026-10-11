import React from 'react';
import { Volume2, VolumeX, BookOpen, Send } from 'lucide-react';
import { KioskStep } from '../types';

interface HeaderProps {
  currentStep: KioskStep;
  onNavigate: (step: KioskStep) => void;
  onOpenArchitecture: () => void;
  isAudioOn: boolean;
  onToggleAudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onNavigate,
  onOpenArchitecture,
  isAudioOn,
  onToggleAudio,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 lg:px-12 py-4 border-b border-[#2D241E] bg-[#141210]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark in display face */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('compose');
        }}
        className="text-lg lg:text-xl font-serif font-bold tracking-tight text-[#ECE7DF] hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
      >
        <span className="text-amber-500">🕊️</span>
        <span>전령 비둘기 우편국</span>
        <span className="text-xs font-sans text-stone-400 font-normal ml-1">Pigeon Post Kiosk</span>
      </a>

      {/* Zone 2: 4 single-line clean nav links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
        <button
          onClick={() => onNavigate('compose')}
          className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentStep === 'compose' ? 'text-amber-400 underline underline-offset-8' : ''
          }`}
        >
          편지 작성대
        </button>
        <button
          onClick={() => onNavigate('flight')}
          className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentStep === 'flight' ? 'text-amber-400 underline underline-offset-8' : ''
          }`}
        >
          비행 지도 추적
        </button>
        <button
          onClick={() => onNavigate('delivered')}
          className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentStep === 'delivered' ? 'text-amber-400 underline underline-offset-8' : ''
          }`}
        >
          도착한 서신
        </button>
        <button
          onClick={onOpenArchitecture}
          className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 text-stone-300"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          <span>시스템 구현 설명서</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action + audio control */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleAudio}
          title={isAudioOn ? '효과음 끄기' : '효과음 켜기'}
          className="p-2 rounded-lg border border-stone-800 bg-[#1E1B18] text-stone-300 hover:text-amber-400 hover:border-amber-600/40 transition-colors cursor-pointer"
        >
          {isAudioOn ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
        </button>

        <button
          onClick={() => onNavigate('compose')}
          className="px-4 py-2 text-xs lg:text-sm font-medium text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 font-semibold shadow-md cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>새 편지 보내기</span>
        </button>
      </div>
    </header>
  );
};
