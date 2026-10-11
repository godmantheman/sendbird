import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Cpu,
  Compass,
  Code2,
  Server,
  Volume2,
  Boxes,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    'flow' | 'math' | 'animation' | 'unfold' | 'backend' | 'audio'
  >('flow');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#181411] border border-[#3A2E24] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-[#141210]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-stone-100">
                편지 키오스크 시스템 구현 상세 가이드
              </h2>
              <p className="text-xs text-stone-400">
                하버사인 지리 거리 계산, 2D 베지에 비행 물리, 3D 종이 펼침 및 백엔드 연동 설계
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-stone-800 bg-[#16120F] overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'flow'
                ? 'bg-amber-500 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>1. 상태 머신 & 전체 흐름</span>
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'math'
                ? 'bg-amber-500 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>2. 지리 거리 & 비행 물리</span>
          </button>
          <button
            onClick={() => setActiveTab('animation')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'animation'
                ? 'bg-amber-500 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>3. 비둘기 날갯짓 애니메이션</span>
          </button>
          <button
            onClick={() => setActiveTab('unfold')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'unfold'
                ? 'bg-amber-500 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>4. 3D 편지 펼침 연출</span>
          </button>
          <button
            onClick={() => setActiveTab('backend')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'backend'
                ? 'bg-amber-500 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>5. 실제 상용 백엔드 연동</span>
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audio'
                ? 'bg-amber-500 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>6. 절차적 오디오 합성</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-300 text-sm leading-relaxed">
          {/* TAB 1: FLOW */}
          {activeTab === 'flow' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-amber-400 font-serif">
                1. 키오스크 전체 동작 흐름 및 상태 머신(Finite State Machine)
              </h3>
              <p>
                편지 키오스크는 4단계의 단방향 유한 상태 머신(FSM)으로 설계되어 사용자가 각 단계를 직관적으로 경험할 수 있도록 구성되어 있습니다:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#241F1A] border border-[#3A3026] rounded-xl space-y-1">
                  <div className="font-bold text-amber-400">Step 1: Compose</div>
                  <div className="text-stone-200 font-medium">편지 작성대</div>
                  <p className="text-stone-400 text-[11px]">
                    수신자 이메일/전화번호, 지질/우표/인장 선택, 본문 입력 및 유효성 검증.
                  </p>
                </div>
                <div className="p-3 bg-[#241F1A] border border-[#3A3026] rounded-xl space-y-1">
                  <div className="font-bold text-amber-400">Step 2: Folding</div>
                  <div className="text-stone-200 font-medium">접지 및 밀봉</div>
                  <p className="text-stone-400 text-[11px]">
                    편지지 3단 접기 연출, 봉투 삽입 및 왁스 인장 타격 사운드 시퀀스.
                  </p>
                </div>
                <div className="p-3 bg-[#241F1A] border border-[#3A3026] rounded-xl space-y-1">
                  <div className="font-bold text-amber-400">Step 3: Flight</div>
                  <div className="text-stone-200 font-medium">비행 시뮬레이션</div>
                  <p className="text-stone-400 text-[11px]">
                    하버사인 거리 기반 비행 소요 시간 산출 및 실시간 베지에 항로 이동.
                  </p>
                </div>
                <div className="p-3 bg-[#241F1A] border border-[#3A3026] rounded-xl space-y-1">
                  <div className="font-bold text-amber-400">Step 4: Delivered</div>
                  <div className="text-stone-200 font-medium">도착 및 펼침</div>
                  <p className="text-stone-400 text-[11px]">
                    수신자 기기 알림, 인장 파열, 3D 편지지 펼침, TTS 낭독, 인쇄/답장.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#12100E] border border-stone-800 rounded-xl space-y-2">
                <h4 className="font-semibold text-stone-200 text-xs">상태 전환 관리 구조</h4>
                <pre className="text-[11px] font-mono text-amber-300/90 overflow-x-auto">
{`type KioskStep = 'compose' | 'folding' | 'flight' | 'delivered';

// React 상위 App 컴포넌트에서 전체 세션 상태를 단일 소스(Single Source of Truth)로 관리
const [step, setStep] = useState<KioskStep>('compose');
const [letterData, setLetterData] = useState<LetterData | null>(null);`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: MATH */}
          {activeTab === 'math' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-amber-400 font-serif">
                2. 지리 거리 계산(Haversine Formula) 및 비행 물리 모델
              </h3>
              <p>
                지구 표면의 두 좌표(위도·경도) 간의 대원거리(Great-Circle Distance)는 구면삼각법의 하버사인 공식(Haversine Formula)으로 정확하게 계산됩니다.
              </p>

              <div className="p-4 bg-[#12100E] border border-stone-800 rounded-xl space-y-2">
                <div className="text-xs font-semibold text-amber-400">수학적 공식:</div>
                <div className="text-xs font-mono text-stone-300 leading-relaxed">
                  a = sin²(Δφ/2) + cos(φ₁) · cos(φ₂) · sin²(Δλ/2)<br />
                  c = 2 · atan2(√a, √(1−a))<br />
                  d = R · c  (지구 반지름 R ≈ 6,371 km)
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-stone-200 text-xs">실제 구현 코드 (`src/utils/geo.ts`):</h4>
                <pre className="p-3 bg-[#12100E] border border-stone-800 rounded-xl text-[11px] font-mono text-amber-300/90 overflow-x-auto">
{`export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}`}
                </pre>
              </div>

              <div className="p-3 bg-[#241F1A] border border-[#3A2E24] rounded-xl text-xs space-y-1">
                <div className="font-bold text-amber-300">비둘기 비행 속도와 시간 비례 모델:</div>
                <p className="text-stone-400 text-[11px]">
                  전령 비둘기의 평균 순항 속도는 시속 약 <strong>65 km/h</strong>입니다. (예: 서울-부산 약 325km 이동 시 실제로는 약 5.0시간 소요). 키오스크 환경에서는 이 실제 물리적 거리와 비행 시간을 바탕으로, 관람객이 시각적으로 즐길 수 있는 <strong>배속 시뮬레이션(1x ~ 20x, 즉시 배달)</strong>을 제공합니다.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: ANIMATION */}
          {activeTab === 'animation' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-amber-400 font-serif">
                3. 실시간 비둘기 2D 비행 궤적 및 날갯짓 애니메이션
              </h3>
              <p>
                단순한 직선 이동 대신 산맥과 상공 기류를 반영한 부드러운 <strong>2차 베지에 곡선(Quadratic Bezier Curve)</strong>을 따라 비행합니다.
              </p>

              <div className="p-4 bg-[#12100E] border border-stone-800 rounded-xl space-y-2">
                <h4 className="font-semibold text-stone-200 text-xs">베지에 곡선 상의 위치 보간:</h4>
                <div className="text-xs font-mono text-stone-300">
                  B(t) = (1−t)² · P₀ + 2(1−t)t · P₁ + t² · P₂  (0 ≤ t ≤ 1)
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-stone-200 text-xs">비행 방향 뱅킹(Banking) 각도 계산:</h4>
                <pre className="p-3 bg-[#12100E] border border-stone-800 rounded-xl text-[11px] font-mono text-amber-300/90 overflow-x-auto">
{`// 미소 진행도(delta)를 두어 접선 벡터(Tangent Vector) 추출
const pCurrent = getBezierPoint(p0, pCtrl, p2, progress);
const pNext = getBezierPoint(p0, pCtrl, p2, progress + 0.02);
const dx = pNext.x - pCurrent.x;
const dy = pNext.y - pCurrent.y;

// 접선 각도로 비둘기 몸체 자동 롤/피치 기울기(Tilt) 적용
const angle = (Math.atan2(dy, dx) * 180) / Math.PI;`}
                </pre>
              </div>

              <div className="p-3 bg-[#241F1A] border border-[#3A2E24] rounded-xl text-xs space-y-1">
                <div className="font-bold text-amber-300">날갯짓 펄럭임(Flap Oscillation) 구조:</div>
                <p className="text-stone-400 text-[11px]">
                  SVG 내부의 앞날개와 뒷날개 그룹에 서로 다른 위상(Phase)의 CSS Transform 애니메이션(`rotate(-35deg) scaleY(0.7)`)을 적용하여 자연스러운 공기역학적 날갯짓을 완성했습니다.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: UNFOLD */}
          {activeTab === 'unfold' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-amber-400 font-serif">
                4. 3D 편지 펼침(Origami Unfolding) 및 왁스 인장 연출
              </h3>
              <p>
                수신지에 도착했을 때 편지가 입체적으로 펼쳐지는 효과는 CSS 3D Transforms과 원근법(Perspective)을 결합하여 구현되었습니다:
              </p>

              <div className="p-4 bg-[#12100E] border border-stone-800 rounded-xl space-y-2">
                <h4 className="font-semibold text-stone-200 text-xs">CSS 3D 펼침 원리:</h4>
                <pre className="text-[11px] font-mono text-amber-300/90 overflow-x-auto">
{`/* 3차원 입체 원근 투영 설정 */
.perspective-container {
  perspective: 1200px;
}

/* 봉투 상단 플랩 회전 */
.envelope-flap {
  transform-origin: top;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transform: rotateX(180deg); /* 열릴 때 180도 뒤로 젖힘 */
}

/* 3단 접지 편지지 펼침 */
.unfolded-paper {
  transition: all 1s ease-out;
  transform: scale(1) translateY(0) rotate(0deg);
  opacity: 1;
}`}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#241F1A] border border-[#3A2E24] rounded-xl">
                  <div className="font-bold text-stone-200">소인 스탬프 타격 효과</div>
                  <p className="text-stone-400 text-[11px] mt-1">
                    도착 시 붉은 원형 우체국 소인 도장이 쿵 소리와 함께 비스듬히 찍히며 도착 날짜와 거리가 각인됩니다.
                  </p>
                </div>
                <div className="p-3 bg-[#241F1A] border border-[#3A2E24] rounded-xl">
                  <div className="font-bold text-stone-200">Web Speech API 음성 낭독</div>
                  <p className="text-stone-400 text-[11px] mt-1">
                    도착한 편지를 인쇄할 수 있을 뿐만 아니라 `window.speechSynthesis`를 통해 따뜻한 목소리로 자동 낭독됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BACKEND & FREE PROVIDERS */}
          {activeTab === 'backend' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-amber-400 font-serif">
                5. 깃허브 공개 및 100% 무료 버전 이메일·전화번호 연동 가이드
              </h3>
              <p>
                깃허브(GitHub)에 오픈소스로 공개할 때, 비용 부담 없이 누구나 바로 테스트할 수 있도록 <strong>완전 무료 티어(Free Tier)</strong>로 구성된 이메일 및 문자 발송 아키텍처입니다:
              </p>

              {/* Free Email: Resend */}
              <div className="p-4 bg-[#12100E] border border-stone-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-amber-400">
                    1) 무료 이메일 발송: Resend API (월 3,000건 / 일 100건 100% 무료)
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">신용카드 불필요</span>
                </div>
                <p className="text-stone-400 text-xs">
                  <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-amber-300 underline">resend.com</a>에서 30초 만에 가입 후 무료 API 키를 발급받아 `.env`에 <code className="text-amber-200">RESEND_API_KEY</code>로 입력하면 실제 이메일이 전송됩니다.
                </p>
                <pre className="text-[11px] font-mono text-stone-300 overflow-x-auto bg-[#1A1612] p-2.5 rounded-lg border border-stone-800">
{`// server.ts에 이미 구현된 무료 발송 코드:
const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${process.env.RESEND_API_KEY}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Pigeon Post <onboarding@resend.dev>', // 무료 기본 발송 주소
    to: [recipientEmail],
    subject: \`🕊️ [\${senderName}]님의 비둘기 편지가 도착했습니다: \${subject}\`,
    html: emailHtmlTemplate,
  }),
});`}
                </pre>
              </div>

              {/* Free Phone / SMS 1: Native SMS URI */}
              <div className="p-4 bg-[#12100E] border border-stone-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-sky-400">
                    2) 100% 평생 무료 휴대폰 문자 전송: 모바일 SMS 프로토콜 (0원)
                  </div>
                  <span className="text-[10px] text-sky-300 font-mono">API 키 불필요 · 비용 0원</span>
                </div>
                <p className="text-stone-400 text-xs leading-relaxed">
                  스마트폰의 기본 문자 규격인 <code className="text-sky-300 font-mono">sms:010xxxx?body=내용</code> URI를 연동하여, 키오스크에서 도착 시 사용자의 폰에서 <strong>기본 문자앱이 자동으로 실행</strong>되며 수신인 번호와 편지 링크가 즉시 채워져 <strong>완전 무료(0원)</strong>로 문자를 보낼 수 있습니다.
                </p>
              </div>

              {/* Free Phone / SMS 2: Twilio Free Trial */}
              <div className="p-4 bg-[#12100E] border border-stone-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-amber-400">
                    3) 무료 체험 SMS API: Twilio Free Trial ($15 무료 크레딧)
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono">가입 시 $15 무료 지급</span>
                </div>
                <p className="text-stone-400 text-xs">
                  <a href="https://twilio.com" target="_blank" rel="noreferrer" className="text-amber-300 underline">Twilio</a> 가입 시 제공되는 15달러의 무료 체험 크레딧으로 실제 번호로 SMS를 API를 통해 직접 전송할 수 있습니다.
                </p>
              </div>

              {/* Free Messenger: Web Share / Kakao */}
              <div className="p-4 bg-[#12100E] border border-stone-800 rounded-xl space-y-2">
                <div className="text-xs font-semibold text-emerald-400">
                  4) 카카오톡 및 모바일 메신저 무료 공유 (Web Share API)
                </div>
                <p className="text-stone-400 text-xs">
                  브라우저 내장 <code className="text-stone-200">navigator.share()</code>를 지원하여, 스마트폰의 카카오톡, 라인, 메시지 앱 등으로 편지 열람 링크를 무제한 무료로 공유할 수 있습니다.
                </p>
              </div>

              {/* Zero-Config Safety */}
              <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-stone-300 space-y-1">
                <div className="font-bold text-amber-400">✓ 제로 컨피그 시뮬레이션(Zero-Config) 보장:</div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  깃허브에서 클론한 사용자가 아무런 API 키를 입력하지 않아도, 프로젝트는 오류 없이 <strong>가상 수신함 시뮬레이션 모드</strong>로 즉시 완벽하게 작동하도록 안전장치가 적용되어 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: AUDIO */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-amber-400 font-serif">
                6. 절차적 Web Audio API 사운드 신디사이저 (Zero External File)
              </h3>
              <p>
                외부 mp3 파일의 네트워크 로딩 지연이나 누락 위험 없이, 브라우저 내장 <strong>Web Audio API Oscillator와 BiquadFilter</strong>를 실시간 합성하여 촉각적인 효과음을 생성합니다.
              </p>

              <div className="space-y-2">
                <h4 className="font-semibold text-stone-200 text-xs">깃털 날갯짓(Wing Flap) 화이트 노이즈 밴드패스 필터링:</h4>
                <pre className="p-3 bg-[#12100E] border border-stone-800 rounded-xl text-[11px] font-mono text-amber-300/90 overflow-x-auto">
{`// 랜덤 난수 버퍼로 화이트 노이즈 생성 후 380Hz Lowpass 필터 통과
const noise = ctx.createBufferSource();
const filter = ctx.createBiquadFilter();
filter.type = 'lowpass';
filter.frequency.setValueAtTime(380, ctx.currentTime);
filter.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.12);

// 짧은 볼륨 엔벨로프(Gain Envelope)로 깃털 스침 사운드 완성
gain.gain.setValueAtTime(0.18, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-800 bg-[#141210] flex items-center justify-between text-xs text-stone-400">
          <span>전령 비둘기 우편국 시스템 아키텍처 v2.4</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
