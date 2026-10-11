import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Send,
  Compass,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  Feather,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { LetterData } from '../types';
import { playStampThump, playLetterUnfoldChime, playPigeonCoo } from '../utils/audio';
import { ConfettiCanvas } from './ConfettiCanvas';
import { dispatchLetter, DispatchResult } from '../utils/deliveryService';

interface LetterArrivalProps {
  letterData: LetterData;
  onWriteReply: (replyData: Partial<LetterData>) => void;
  onNewLetter: () => void;
}

export const LetterArrival: React.FC<LetterArrivalProps> = ({
  letterData,
  onWriteReply,
  onNewLetter,
}) => {
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [dispatchResult, setDispatchResult] = useState<DispatchResult | null>(null);

  useEffect(() => {
    // Sequence arrival: pigeon coo -> seal crack -> unfold chime
    playPigeonCoo();

    // Trigger free provider dispatch (Resend free email / Twilio / SMS URI)
    dispatchLetter(letterData).then((res) => {
      setDispatchResult(res);
    });

    const t1 = setTimeout(() => {
      playStampThump();
    }, 600);

    const t2 = setTimeout(() => {
      setIsUnfolded(true);
      playLetterUnfoldChime();
    }, 1100);

    // Stop confetti after 5 seconds to preserve performance
    const t3 = setTimeout(() => {
      setShowConfetti(false);
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [letterData]);

  // Web Speech API TTS
  const handleToggleTTS = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('이 브라우저는 음성 낭독 기능을 지원하지 않습니다.');
      return;
    }

    if (isPlayingTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
      return;
    }

    const textToRead = `${letterData.recipientName}님에게 도착한 편지입니다. 제목: ${letterData.subject}. 내용: ${letterData.content}. 보낸 사람: ${letterData.senderName}.`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingTTS(false);
    utterance.onerror = () => setIsPlayingTTS(false);

    setIsPlayingTTS(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const handleWebShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: `🕊️ [${letterData.senderName}]님의 비둘기 편지`,
          text: `[비둘기 우체국] ${letterData.recipientName}님, 서신이 도착했습니다: ${letterData.subject}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handleReply = () => {
    onWriteReply({
      senderName: letterData.recipientName,
      senderLocation: letterData.destinationLocation,
      recipientName: letterData.senderName,
      recipientEmail: letterData.recipientEmail,
      recipientPhone: letterData.recipientPhone,
      destinationLocation: letterData.senderLocation,
      subject: `Re: ${letterData.subject}`,
      content: `답장을 보냅니다.\n\n보내주신 편지를 따뜻한 마음으로 잘 받았습니다.\n`,
    });
  };

  const defaultSmsText = `[비둘기 우체국] ${letterData.senderName}님이 보낸 서신이 도착했습니다.\n제목: ${letterData.subject}\n열람 링크: ${typeof window !== 'undefined' ? window.location.href : ''}`;
  const directSmsUri =
    dispatchResult?.smsUri ||
    `sms:${encodeURIComponent(letterData.recipientPhone)}?body=${encodeURIComponent(defaultSmsText)}`;

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Fluttering gold feather particles */}
      <ConfettiCanvas active={showConfetti} />

      {/* Recipient Device/Channel Arrival Banner (이메일 및 전화번호 도착 알림) */}
      <div className="bg-[#1C1814] border border-[#3A2E24] rounded-2xl p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>수신처 도착 완료 알림 통보 (Delivery Success)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <span>{new Date().toLocaleTimeString('ko-KR')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Email Notification View */}
          {(letterData.deliveryChannel === 'email' || letterData.deliveryChannel === 'both') && (
            <div className="p-3.5 bg-[#12100E] border border-amber-900/30 rounded-xl flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">이메일 수신함 배달</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-medium">
                    {dispatchResult?.emailIsLive ? 'Resend 무료 API 실제 발송됨' : '무료 시뮬레이션 수신함'}
                  </span>
                </div>
                <div className="font-bold text-stone-200 truncate font-mono mt-0.5">
                  {letterData.recipientEmail}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">
                  제목: <span className="text-amber-300">🕊️ [{letterData.senderName}]님의 비둘기 서신이 도착했습니다</span>
                </div>
                {dispatchResult?.emailMessage && (
                  <div className="text-[10px] text-emerald-400/90 mt-1.5">
                    ✓ {dispatchResult.emailMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SMS / Phone Notification View */}
          {(letterData.deliveryChannel === 'phone' || letterData.deliveryChannel === 'both') && (
            <div className="p-3.5 bg-[#12100E] border border-sky-900/30 rounded-xl flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">휴대폰 알림톡 / 문자 도착</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 font-medium">
                    {dispatchResult?.smsIsLive ? 'Twilio 실제 SMS 발송됨' : '무료 모바일 SMS 링크'}
                  </span>
                </div>
                <div className="font-bold text-stone-200 font-mono mt-0.5">
                  {letterData.recipientPhone}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">
                  알림: <span className="text-sky-300">"{letterData.recipientName}님, {letterData.senderName}님의 편지가 펼쳐졌습니다."</span>
                </div>

                {/* Free Direct SMS Button on Smartphone */}
                <div className="mt-2.5 flex items-center gap-2">
                  <a
                    href={directSmsUri}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[11px] font-medium transition-colors border border-sky-500/30"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>기본 문자앱으로 무료 발송 (0원)</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleWebShare}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] transition-colors"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>카카오/공유</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Main Unfolded Paper Experience */}
      <div className="flex flex-col items-center">
        {/* Paper Container with 3D Folding CSS Animation */}
        <div
          className={`relative w-full max-w-2xl rounded-2xl border p-8 sm:p-14 shadow-2xl transition-all duration-1000 ease-out transform ${
            isUnfolded
              ? 'scale-100 opacity-100 translate-y-0 rotate-0'
              : 'scale-90 opacity-60 translate-y-8 rotate-1'
          } ${
            letterData.paperTheme === 'parchment'
              ? 'bg-[#FAF6EE] border-[#DECDB4] text-[#29221B]'
              : letterData.paperTheme === 'kraft'
              ? 'bg-[#EFE3CF] border-[#D1BFA4] text-[#3B2E21]'
              : letterData.paperTheme === 'cherry'
              ? 'bg-[#FFF5F7] border-[#FBCFE8] text-[#4A2033]'
              : letterData.paperTheme === 'midnight'
              ? 'bg-[#181E2C] border-[#334155] text-[#F1F5F9]'
              : 'bg-[#F0FDF4] border-[#BBF7D0] text-[#14532D]'
          }`}
          style={{
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.55), 0 0 40px rgba(245, 158, 11, 0.1)',
          }}
        >
          {/* Subtle paper crease line across middle indicating 3D unfolding */}
          <div className="absolute inset-x-8 top-1/3 h-[1px] bg-black/5 pointer-events-none" />
          <div className="absolute inset-x-8 top-2/3 h-[1px] bg-black/5 pointer-events-none" />

          {/* Top Postmark Header */}
          <div className="flex items-start justify-between border-b border-black/10 pb-6 mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-serif tracking-wider uppercase opacity-75">
                <Feather className="w-3.5 h-3.5 text-amber-700" />
                <span>PIGEON POST · CONFIRMED DELIVERY</span>
              </div>
              <div className="text-xs text-stone-600 flex items-center gap-2">
                <span>
                  {letterData.senderLocation.name.split(' ')[0]} ➔{' '}
                  {letterData.destinationLocation.name.split(' ')[0]}
                </span>
                <span className="font-semibold text-amber-800">
                  ({letterData.distanceKm} km 비행 완주)
                </span>
              </div>
            </div>

            {/* Vintage Stamp & Rubber Ink Postmark */}
            <div className="relative flex items-center gap-2">
              {/* Postage Stamp */}
              {letterData.stamp === 'pigeon_classic' ? (
                <div className="w-16 h-20 sm:w-20 sm:h-24 rounded border-2 border-dashed border-amber-900/40 p-1 bg-white/95 shadow-md transform rotate-2 overflow-hidden">
                  <img
                    src="/src/assets/images/pigeon_postage_stamp_1791692024590.jpg"
                    alt="비둘기 전령 우표"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-16 h-20 sm:w-20 sm:h-24 rounded border-2 border-dashed border-stone-700/50 p-1 shadow-md bg-stone-800 text-amber-300 flex flex-col items-center justify-between p-2">
                  <span className="text-[8px]">OFFICIAL</span>
                  <Feather className="w-5 h-5 text-amber-400" />
                  <span className="text-[10px] font-serif font-bold">AIR POST</span>
                </div>
              )}

              {/* Red Circular Postmark Stamp Stamp-on effect */}
              <div className="absolute -bottom-4 -left-6 w-16 h-16 rounded-full border-2 border-red-800/70 flex flex-col items-center justify-center transform -rotate-12 pointer-events-none bg-red-900/5 backdrop-blur-[0.5px]">
                <div className="text-[7px] font-mono text-red-900 font-bold uppercase tracking-widest text-center leading-none">
                  ARRIVED<br />
                  <span className="text-[9px] font-black">{letterData.destinationLocation.name.split(' ')[0]}</span><br />
                  {new Date().toISOString().slice(0, 10)}
                </div>
              </div>
            </div>
          </div>

          {/* Letter Salutation */}
          <div className="mb-6">
            <div className="text-sm font-serif text-stone-500 mb-1">받는 이:</div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
              {letterData.recipientName} 귀하
            </h2>
          </div>

          {/* Letter Subject */}
          <div className="mb-8 pb-4 border-b border-black/10">
            <h3
              className={`text-lg sm:text-xl font-bold ${
                letterData.fontStyle === 'nanum-pen'
                  ? 'font-[Nanum_Pen_Script] text-3xl'
                  : letterData.fontStyle === 'nanum-myeongjo'
                  ? 'font-[Nanum_Myeongjo]'
                  : ''
              }`}
            >
              {letterData.subject}
            </h3>
          </div>

          {/* Letter Body Content */}
          <div className="mb-12">
            <p
              className={`whitespace-pre-line leading-relaxed sm:leading-loose ${
                letterData.fontStyle === 'nanum-pen'
                  ? 'font-[Nanum_Pen_Script] text-2xl sm:text-3xl leading-relaxed'
                  : letterData.fontStyle === 'nanum-myeongjo'
                  ? 'font-[Nanum_Myeongjo] text-base sm:text-lg'
                  : 'text-sm sm:text-base'
              }`}
            >
              {letterData.content}
            </p>
          </div>

          {/* Letter Sign-off Footer */}
          <div className="pt-6 border-t border-black/10 flex flex-wrap items-end justify-between gap-4 font-serif text-sm">
            <div className="text-xs text-stone-500 space-y-1">
              <div>발송일자: {letterData.dateStr}</div>
              <div>도착일자: {new Date().toLocaleDateString('ko-KR')}</div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-500">마음을 담아,</span>
              <span className="text-lg font-bold underline underline-offset-4 decoration-amber-700/60">
                {letterData.senderName} 拜上
              </span>
            </div>
          </div>

          {/* Broken Wax Seal Emblem at Bottom */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-[11px] font-serif text-stone-600">
              <span
                className="w-3 h-3 rounded-full inline-block"
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
              />
              <span>우체국 인장 개봉 확인필 (Seal Opened)</span>
            </div>
          </div>
        </div>

        {/* Action Toolbar on Unfolded Letter */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full max-w-2xl">
          {/* TTS Audio Reading */}
          <button
            type="button"
            onClick={handleToggleTTS}
            className="px-4 py-2.5 rounded-xl border border-stone-800 bg-[#241F1A] hover:bg-[#322A23] text-stone-200 text-xs font-medium flex items-center gap-2 transition-colors shadow cursor-pointer"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingTTS ? 'text-amber-400 animate-pulse' : 'text-stone-400'}`} />
            <span>{isPlayingTTS ? '낭독 정지' : '편지 음성 낭독 (TTS)'}</span>
          </button>

          {/* Print / Save PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-stone-800 bg-[#241F1A] hover:bg-[#322A23] text-stone-200 text-xs font-medium flex items-center gap-2 transition-colors shadow cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-400" />
            <span>편지 인쇄 / PDF 저장</span>
          </button>

          {/* Share Link Copy */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-xl border border-stone-800 bg-[#241F1A] hover:bg-[#322A23] text-stone-200 text-xs font-medium flex items-center gap-2 transition-colors shadow cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-stone-400" />}
            <span>{isCopied ? '링크 복사 완료!' : '수신 링크 복사'}</span>
          </button>

          {/* Reply back via Pigeon */}
          <button
            type="button"
            onClick={handleReply}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>답장 비둘기 띄우기</span>
          </button>

          {/* Write completely new letter */}
          <button
            type="button"
            onClick={onNewLetter}
            className="px-4 py-2.5 rounded-xl border border-stone-800 hover:border-stone-700 bg-transparent text-stone-400 hover:text-stone-200 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>새 편지 쓰기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
