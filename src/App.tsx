/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { LetterComposer } from './components/LetterComposer';
import { LetterFolding } from './components/LetterFolding';
import { FlightSimulation } from './components/FlightSimulation';
import { LetterArrival } from './components/LetterArrival';
import { SystemArchitectureModal } from './components/SystemArchitectureModal';
import { LetterData, KioskStep } from './types';
import { KOREA_LOCATIONS } from './utils/geo';
import { setAudioEnabled, getAudioEnabled } from './utils/audio';

// Default initial starter letter
const DEFAULT_INITIAL_LETTER: LetterData = {
  senderName: '하늘지기',
  senderLocation: KOREA_LOCATIONS[0], // Seoul
  recipientName: '소중한 그대',
  recipientEmail: 'beloved@mail.net',
  recipientPhone: '010-3849-5920',
  deliveryChannel: 'both',
  destinationLocation: KOREA_LOCATIONS[1], // Busan
  paperTheme: 'parchment',
  stamp: 'pigeon_classic',
  waxColor: 'crimson',
  fontStyle: 'nanum-myeongjo',
  subject: '먼 하늘을 건너 그대에게 전하는 온기',
  content:
    '창가에 앉아 그대에게 띄울 편지를 씁니다.\n오늘 띄운 이 전령 비둘기가 구름과 소백산맥을 무사히 넘어\n그대의 따스한 두 손에 온전히 닿기를 진심으로 기도합니다.\n\n늘 건강하고 평온한 날들이 함께하기를.',
  dateStr: `${new Date().getFullYear()}년 ${new Date().getMonth() + 1}월 ${new Date().getDate()}일`,
  estimatedFlightHours: 5.0,
  distanceKm: 325.2,
};

export default function App() {
  const [step, setStep] = useState<KioskStep>('compose');
  const [currentLetter, setCurrentLetter] = useState<LetterData>(DEFAULT_INITIAL_LETTER);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [showArchitecture, setShowArchitecture] = useState<boolean>(false);

  // Audio Toggle
  const handleToggleAudio = () => {
    const nextState = !isAudioOn;
    setIsAudioOn(nextState);
    setAudioEnabled(nextState);
  };

  // Submit from compose form
  const handleSendLetter = (data: LetterData) => {
    setCurrentLetter(data);
    setStep('folding');
  };

  // Transition from folding sequence to flight simulation
  const handleFoldingComplete = () => {
    setStep('flight');
  };

  // Flight arrived at destination
  const handleDelivered = () => {
    setStep('delivered');
  };

  // Reply button in arrived view
  const handleWriteReply = (replyData: Partial<LetterData>) => {
    setCurrentLetter((prev) => ({
      ...prev,
      ...replyData,
    }));
    setStep('compose');
  };

  // Start completely fresh letter
  const handleNewLetter = () => {
    setCurrentLetter({
      ...DEFAULT_INITIAL_LETTER,
      dateStr: `${new Date().getFullYear()}년 ${new Date().getMonth() + 1}월 ${new Date().getDate()}일`,
    });
    setStep('compose');
  };

  return (
    <div className="min-h-screen bg-[#12100E] text-[#ECE7DF] flex flex-col font-sans selection:bg-[#B45309] selection:text-white relative">
      {/* Background ambient texture / subtle vintage warm light */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 bg-cover bg-center mix-blend-overlay"
        style={{
          backgroundImage: `url('/src/assets/images/vintage_post_desk_1791692011149.jpg')`,
        }}
      />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#141210]/90 via-[#12100E]/95 to-[#0E0C0A]" />

      {/* Top Navigation Bar */}
      <Header
        currentStep={step}
        onNavigate={(newStep) => setStep(newStep)}
        onOpenArchitecture={() => setShowArchitecture(true)}
        isAudioOn={isAudioOn}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Kiosk Dynamic Stage */}
      <main className="relative z-10 flex-1 flex flex-col justify-start">
        {step === 'compose' && (
          <LetterComposer
            initialData={currentLetter}
            onSend={handleSendLetter}
            onSelectOnMapPrompt={() => setStep('flight')}
          />
        )}

        {step === 'folding' && (
          <LetterFolding
            letterData={currentLetter}
            onComplete={handleFoldingComplete}
          />
        )}

        {step === 'flight' && (
          <FlightSimulation
            letterData={currentLetter}
            onDelivered={handleDelivered}
            onCancelToCompose={() => setStep('compose')}
          />
        )}

        {step === 'delivered' && (
          <LetterArrival
            letterData={currentLetter}
            onWriteReply={handleWriteReply}
            onNewLetter={handleNewLetter}
          />
        )}
      </main>

      {/* System Implementation Architecture Modal */}
      <SystemArchitectureModal
        isOpen={showArchitecture}
        onClose={() => setShowArchitecture(false)}
      />

      {/* Quiet Footer */}
      <footer className="relative z-10 border-t border-[#261E18] bg-[#0E0C0A] py-6 px-6 lg:px-12 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span>전령 비둘기 우편국 (Pigeon Post Kiosk)</span>
          <span aria-hidden="true">·</span>
          <span>우체국 아날로그 서신 시뮬레이터</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowArchitecture(true)}
            className="hover:text-amber-400 transition-colors underline underline-offset-4 cursor-pointer"
          >
            시스템 구현 원리 및 아키텍처 보기
          </button>
          <span>© 2026 Pigeon Post Services</span>
        </div>
      </footer>
    </div>
  );
}
