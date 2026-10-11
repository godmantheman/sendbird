import React, { useEffect, useState } from 'react';
import { LetterData } from '../types';
import { playStampThump, playWingFlap, playPigeonCoo } from '../utils/audio';
import { PigeonSvg } from './PigeonSvg';
import { ArrowRight, Check } from 'lucide-react';

interface LetterFoldingProps {
  letterData: LetterData;
  onComplete: () => void;
}

export const LetterFolding: React.FC<LetterFoldingProps> = ({ letterData, onComplete }) => {
  const [stage, setStage] = useState<'folding' | 'sealing' | 'takeoff'>('folding');

  useEffect(() => {
    // Stage 1: Folding letter (0s - 1.2s)
    const t1 = setTimeout(() => {
      setStage('sealing');
      playStampThump();
    }, 1300);

    // Stage 2: Pigeon arrival and envelope pickup (1.2s - 2.6s)
    const t2 = setTimeout(() => {
      setStage('takeoff');
      playPigeonCoo();
      playWingFlap();
    }, 2800);

    // Stage 3: Complete transition to map (4.0s)
    const t3 = setTimeout(() => {
      onComplete();
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0E0C0A]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Stage indicators */}
      <div className="relative z-10 max-w-md w-full mb-10">
        <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-widest text-amber-400 mb-2">
          <span>{stage === 'folding' ? '1단계: 서신 3단 접기' : stage === 'sealing' ? '2단계: 붉은 왁스 인장 밀봉' : '3단계: 전령새 출항'}</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-100">
          {stage === 'folding' && '정성스러운 서신을 고이 접고 있습니다...'}
          {stage === 'sealing' && '우체국 전령 소인 인장을 찍고 있습니다...'}
          {stage === 'takeoff' && '전령 비둘기가 서신을 물고 날아오릅니다!'}
        </h2>
      </div>

      {/* 3D Folding Stage Area */}
      <div className="relative z-10 w-72 h-80 flex items-center justify-center perspective-[1000px]">
        {/* Envelope Base */}
        <div
          className={`relative w-64 h-44 rounded-lg bg-[#EAE0D0] border-2 border-[#C2B29A] shadow-2xl transition-all duration-700 flex items-center justify-center ${
            stage === 'takeoff' ? 'translate-y-12 opacity-80 scale-90' : 'scale-100'
          }`}
          style={{
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Inner folded paper peaking or tucked */}
          <div
            className={`absolute inset-x-3 top-2 bg-[#FAF7F0] border border-stone-300 rounded shadow transition-all duration-700 flex flex-col justify-center px-4 ${
              stage === 'folding'
                ? '-translate-y-16 scale-95 opacity-90 h-28'
                : 'translate-y-2 scale-90 opacity-40 h-20'
            }`}
          >
            <div className="w-12 h-1 bg-stone-300 rounded mb-1" />
            <div className="text-[11px] font-serif text-stone-600 line-clamp-1">{letterData.subject}</div>
            <div className="text-[9px] text-stone-400 mt-1">To. {letterData.recipientName}</div>
          </div>

          {/* Envelope flap */}
          <div
            className={`absolute inset-x-0 top-0 h-20 bg-[#DFD3BF] border-b-2 border-[#C0AF95] transition-transform duration-700 origin-top flex items-center justify-center ${
              stage === 'folding' ? '-rotate-x-180' : 'rotate-x-0 shadow-md'
            }`}
          >
            {/* Wax Seal Stamp on flap */}
            {stage !== 'folding' && (
              <div
                className="w-10 h-10 rounded-full shadow-lg border border-white/30 flex items-center justify-center animate-bounce text-white font-serif text-xs font-bold"
                style={{
                  backgroundColor:
                    letterData.waxColor === 'crimson'
                      ? '#991B1B'
                      : letterData.waxColor === 'gold'
                      ? '#D97706'
                      : letterData.waxColor === 'navy'
                      ? '#1E3A8A'
                      : '#166534',
                }}
              >
                POST
              </div>
            )}
          </div>

          {/* Destination label on envelope */}
          <div className="mt-8 text-center">
            <div className="text-[10px] text-stone-500 font-mono">AIR MAIL</div>
            <div className="text-xs font-bold font-serif text-stone-800">
              {letterData.destinationLocation.name}
            </div>
            <div className="text-[10px] text-amber-900 font-semibold">
              귀하: {letterData.recipientName}
            </div>
          </div>
        </div>

        {/* Pigeon swooping down in takeoff stage */}
        {stage === 'takeoff' && (
          <div className="absolute -top-12 animate-pulse w-48 h-36">
            <PigeonSvg
              className="w-full h-full"
              isFlapping={true}
              tiltAngle={-8}
              showEnvelope={true}
            />
          </div>
        )}
      </div>

      {/* Manual skip button if user is in a hurry */}
      <div className="relative z-10 mt-12">
        <button
          onClick={onComplete}
          className="text-xs text-stone-400 hover:text-amber-400 underline underline-offset-4 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>애니메이션 건너뛰고 비행 지도 바로보기</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
