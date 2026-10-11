import React, { useState } from 'react';
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Compass,
  Clock,
  Feather,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  LetterData,
  LocationPoint,
  PaperThemeId,
  StampId,
  WaxSealColor,
  FontStyle,
  DeliveryChannel,
} from '../types';
import {
  KOREA_LOCATIONS,
  calculateHaversineDistanceKm,
  estimatePigeonFlightHours,
} from '../utils/geo';
import { playPenScratch, playStampThump } from '../utils/audio';

interface LetterComposerProps {
  initialData?: LetterData;
  onSend: (data: LetterData) => void;
  onSelectOnMapPrompt: () => void;
}

const TEMPLATES = [
  {
    title: '그리운 벗에게',
    subject: '계절이 바뀌는 길목에서 전하는 안부',
    content:
      '바람결에 실려 온 풀꽃 향기에 문득 그대 생각이 났습니다.\n도심 속 바쁜 일상 속에서도 별을 바라보던 우리의 밤을 기억하는지요.\n먼 하늘을 가로질러 날아간 이 편지가 작은 온기로 닿기를 바랍니다.',
  },
  {
    title: '생일 축하',
    subject: '가장 찬란한 날, 세상에 온 너에게',
    content:
      '생일을 진심으로 축하해!\n언제나 다정하고 든든한 너의 계절이 늘 눈부신 햇살로 가득하길 바라.\n날아가는 비둘기 날갯짓만큼이나 자유롭고 행복한 한 해가 되기를 축복해.',
  },
  {
    title: '따뜻한 응원',
    subject: '오늘 하루도 정말 고생 많았어요',
    content:
      '때로는 세상의 속도가 버겁고 지칠 때가 있지요.\n잠시 걸음을 멈추고 하늘을 올려다보세요.\n보이지 않는 곳에서도 당신의 발걸음을 뜨겁게 응원하는 마음이 여기 있습니다.',
  },
  {
    title: '미래의 나에게',
    subject: '1년 뒤의 나에게 부치는 작은 다짐',
    content:
      '지금 이 순간 치열하게 고민하던 것들이 먼 훗날 미소 지을 수 있는 추억이 되어 있기를.\n스스로를 아끼고 소중한 사람들과의 약속을 잊지 않는 단단한 사람이 되어주렴.',
  },
];

const PAPER_THEMES: { id: PaperThemeId; name: string; bgClass: string; textClass: string; desc: string }[] = [
  {
    id: 'parchment',
    name: '고서 양피지',
    bgClass: 'bg-[#FBF6EE] border-[#E2D4BE]',
    textClass: 'text-[#29221B]',
    desc: '세월이 깃든 부드러운 상아빛 양피지',
  },
  {
    id: 'kraft',
    name: '클래식 크라프트',
    bgClass: 'bg-[#EFE3CF] border-[#D1BFA4]',
    textClass: 'text-[#3B2E21]',
    desc: '따뜻하고 소박한 우체국 고전 크라프트지',
  },
  {
    id: 'cherry',
    name: '봄날 벚꽃지',
    bgClass: 'bg-[#FFF5F7] border-[#FBCFE8]',
    textClass: 'text-[#4A2033]',
    desc: '설레는 봄바람이 머문 은은한 분홍 편지지',
  },
  {
    id: 'midnight',
    name: '달밤 은하수지',
    bgClass: 'bg-[#181E2C] border-[#334155]',
    textClass: 'text-[#F1F5F9]',
    desc: '별빛이 내려앉은 고요한 남색 밤하늘지',
  },
  {
    id: 'celadon',
    name: '청록 비단지',
    bgClass: 'bg-[#F0FDF4] border-[#BBF7D0]',
    textClass: 'text-[#14532D]',
    desc: '맑은 솔향이 감도는 고아한 청록빛 지전',
  },
];

const STAMPS: { id: StampId; name: string; imagePath?: string; color: string }[] = [
  {
    id: 'pigeon_classic',
    name: '비둘기 전령 우표',
    imagePath: '/src/assets/images/pigeon_postage_stamp_1791692024590.jpg',
    color: 'from-amber-600 to-indigo-900',
  },
  {
    id: 'royal_vintage',
    name: '왕실 문장 우표',
    color: 'from-amber-700 to-red-900',
  },
  {
    id: 'night_sky',
    name: '북두칠성 우표',
    color: 'from-indigo-950 to-blue-800',
  },
  {
    id: 'rose_garden',
    name: '백장미 소인 우표',
    color: 'from-rose-800 to-amber-900',
  },
];

const WAX_SEALS: { id: WaxSealColor; name: string; colorHex: string }[] = [
  { id: 'crimson', name: '크림슨 버건디', colorHex: '#991B1B' },
  { id: 'gold', name: '앤틱 골드', colorHex: '#D97706' },
  { id: 'navy', name: '로열 네이비', colorHex: '#1E3A8A' },
  { id: 'emerald', name: '포레스트 에메랄드', colorHex: '#166534' },
];

export const LetterComposer: React.FC<LetterComposerProps> = ({
  initialData,
  onSend,
}) => {
  // Form fields
  const [senderName, setSenderName] = useState(initialData?.senderName || '은빛 전령');
  const [senderLocation, setSenderLocation] = useState<LocationPoint>(
    initialData?.senderLocation || KOREA_LOCATIONS[0] // Seoul
  );
  const [recipientName, setRecipientName] = useState(initialData?.recipientName || '소중한 그대');
  const [recipientEmail, setRecipientEmail] = useState(initialData?.recipientEmail || 'friend@example.com');
  const [recipientPhone, setRecipientPhone] = useState(initialData?.recipientPhone || '010-8254-1920');
  const [deliveryChannel, setDeliveryChannel] = useState<DeliveryChannel>(
    initialData?.deliveryChannel || 'both'
  );
  const [destinationLocation, setDestinationLocation] = useState<LocationPoint>(
    initialData?.destinationLocation || KOREA_LOCATIONS[1] // Busan
  );

  const [paperTheme, setPaperTheme] = useState<PaperThemeId>(initialData?.paperTheme || 'parchment');
  const [stamp, setStamp] = useState<StampId>(initialData?.stamp || 'pigeon_classic');
  const [waxColor, setWaxColor] = useState<WaxSealColor>(initialData?.waxColor || 'crimson');
  const [fontStyle, setFontStyle] = useState<FontStyle>(initialData?.fontStyle || 'nanum-myeongjo');
  const [subject, setSubject] = useState(
    initialData?.subject || '먼 하늘을 건너 그대에게 전하는 마음'
  );
  const [content, setContent] = useState(
    initialData?.content ||
      '창가에 앉아 그대에게 띄울 편지를 씁니다.\n오늘 띄운 이 전령 비둘기가 구름과 산맥을 무사히 넘어\n그대의 따스한 두 손에 무사히 닿기를 진심으로 기도합니다.\n\n건강하고 평온한 날들이 함께하기를.'
  );

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Distance & estimated time
  const distanceKm = calculateHaversineDistanceKm(
    senderLocation.lat,
    senderLocation.lng,
    destinationLocation.lat,
    destinationLocation.lng
  );
  const estimatedHours = estimatePigeonFlightHours(distanceKm);

  // Validation
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!senderName.trim()) {
      errors.senderName = '보내는 분의 성함을 입력해주세요.';
    }
    if (!recipientName.trim()) {
      errors.recipientName = '받는 분의 성함을 입력해주세요.';
    }
    if (!subject.trim()) {
      errors.subject = '편지 제목을 입력해주세요.';
    }
    if (!content.trim()) {
      errors.content = '편지 내용을 작성해주세요.';
    }

    if (deliveryChannel === 'email' || deliveryChannel === 'both') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!recipientEmail || !emailRegex.test(recipientEmail.trim())) {
        errors.recipientEmail = '올바른 이메일 주소를 입력해주세요 (예: user@example.com).';
      }
    }

    if (deliveryChannel === 'phone' || deliveryChannel === 'both') {
      const phoneDigits = recipientPhone.replace(/[^0-9]/g, '');
      if (phoneDigits.length < 9) {
        errors.recipientPhone = '올바른 전화번호를 입력해주세요 (예: 010-1234-5678).';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setSubject(tpl.subject);
    setContent(tpl.content);
    playPenScratch();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    playStampThump();

    const now = new Date();
    const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;

    onSend({
      senderName: senderName.trim(),
      senderLocation,
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim(),
      recipientPhone: recipientPhone.trim(),
      deliveryChannel,
      destinationLocation,
      paperTheme,
      stamp,
      waxColor,
      fontStyle,
      subject: subject.trim(),
      content: content.trim(),
      dateStr,
      estimatedFlightHours: estimatedHours,
      distanceKm,
    });
  };

  const selectedThemeObj = PAPER_THEMES.find((p) => p.id === paperTheme) || PAPER_THEMES[0];
  const selectedWaxObj = WAX_SEALS.find((w) => w.id === waxColor) || WAX_SEALS[0];

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Kiosk Banner / Title */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-amber-500 mb-2">
          <span>고전 우편 키오스크</span>
          <span aria-hidden="true">·</span>
          <span>전령 비둘기 직배송</span>
          <span aria-hidden="true">·</span>
          <span>실시간 비행 시뮬레이션</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 tracking-tight">
          마음을 띄우는 전령 비둘기 편지대
        </h1>
        <p className="mt-2 text-sm text-stone-400">
          소중한 사람의 연락처와 마음을 적으면, 전령새가 하늘길을 건너 목적지까지 실제로 비행하여 전해드립니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Letter Stationery (Visual Canvas Desk) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Letter Sheet */}
          <div
            className={`relative rounded-2xl border p-6 sm:p-10 shadow-2xl transition-all duration-300 ${selectedThemeObj.bgClass}`}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
            }}
          >
            {/* Top Postage Header: Stamp & Postmark */}
            <div className="flex items-start justify-between border-b border-black/10 pb-6 mb-6">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider opacity-60 font-serif">
                  KOREA POSTAL FLIGHT AIR-MAIL
                </div>
                <div className="text-xs text-stone-600 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-700" />
                  <span>
                    {senderLocation.name.split(' ')[0]} ➔ {destinationLocation.name.split(' ')[0]}
                  </span>
                  <span className="font-semibold text-amber-800">({distanceKm} km)</span>
                </div>
              </div>

              {/* Postage Stamp on top right */}
              <div className="relative group cursor-pointer" title="클릭하여 우표 변경">
                {stamp === 'pigeon_classic' ? (
                  <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-sm border-2 border-dashed border-amber-900/40 p-1 bg-white/90 shadow-md transform rotate-2 hover:rotate-0 transition-transform overflow-hidden">
                    <img
                      src="/src/assets/images/pigeon_postage_stamp_1791692024590.jpg"
                      alt="비둘기 전령 우표"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-16 h-20 sm:w-20 sm:h-24 rounded-sm border-2 border-dashed border-stone-700/50 p-1 shadow-md bg-gradient-to-br ${
                      STAMPS.find((s) => s.id === stamp)?.color
                    } text-white flex flex-col items-center justify-between text-center p-2 transform rotate-2`}
                  >
                    <span className="text-[9px] uppercase tracking-wider">AIR POST</span>
                    <Feather className="w-6 h-6 text-amber-300" />
                    <span className="text-[10px] font-serif font-bold">2,500 ₩</span>
                  </div>
                )}
                {/* Round Postmark Stamp Overlay */}
                <div className="absolute -bottom-3 -left-4 w-12 h-12 rounded-full border border-red-800/60 flex items-center justify-center transform -rotate-12 pointer-events-none">
                  <div className="text-[8px] font-mono text-red-900 font-bold leading-tight text-center">
                    AIR MAIL<br />SEOUL
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Input */}
            <div className="mb-4">
              <label className="block text-xs font-serif font-semibold text-stone-700 mb-1">
                서신 제목
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  playPenScratch();
                }}
                placeholder="마음을 담을 편지의 제목을 적어주세요"
                className={`w-full px-3 py-2 bg-transparent border-b border-black/20 focus:border-amber-700 outline-none text-lg font-serif font-semibold transition-colors placeholder:text-stone-400 ${
                  fontStyle === 'nanum-pen'
                    ? 'font-[Nanum_Pen_Script] text-2xl'
                    : fontStyle === 'nanum-myeongjo'
                    ? 'font-[Nanum_Myeongjo]'
                    : ''
                } ${selectedThemeObj.textClass}`}
              />
              {validationErrors.subject && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.subject}
                </p>
              )}
            </div>

            {/* Letter Body Textarea */}
            <div className="mb-6">
              <label className="block text-xs font-serif font-semibold text-stone-700 mb-1">
                편지 본문
              </label>
              <textarea
                rows={9}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  playPenScratch();
                }}
                placeholder="전령새가 전할 편지 내용을 적어주세요..."
                className={`w-full px-3 py-2 bg-transparent border border-black/10 rounded-lg focus:border-amber-700 outline-none leading-relaxed transition-colors resize-none placeholder:text-stone-400 ${
                  fontStyle === 'nanum-pen'
                    ? 'font-[Nanum_Pen_Script] text-2xl leading-normal'
                    : fontStyle === 'nanum-myeongjo'
                    ? 'font-[Nanum_Myeongjo] text-base leading-relaxed'
                    : 'text-sm leading-relaxed'
                } ${selectedThemeObj.textClass}`}
              />
              {validationErrors.content && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.content}
                </p>
              )}
            </div>

            {/* Letter Footer: Date & Sign */}
            <div className="flex items-center justify-between pt-4 border-t border-black/10 text-stone-600 text-xs font-serif">
              <div>
                <span>작성일시: {new Date().toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>보내는 이:</span>
                <span className="font-bold text-stone-800 text-sm">{senderName || '익명'}</span>
              </div>
            </div>

            {/* Stationery Style Controls underneath */}
            <div className="mt-6 pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
              {/* Paper selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-stone-600 font-serif mr-1">지질 선택:</span>
                {PAPER_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setPaperTheme(theme.id)}
                    title={theme.desc}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
                      paperTheme === theme.id
                        ? 'border-amber-800 bg-amber-900/10 font-bold text-amber-950'
                        : 'border-stone-300 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>

              {/* Font Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-stone-600 font-serif mr-1">서체:</span>
                <button
                  type="button"
                  onClick={() => setFontStyle('nanum-pen')}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer font-[Nanum_Pen_Script] text-sm ${
                    fontStyle === 'nanum-pen'
                      ? 'border-amber-800 bg-amber-900/10 font-bold text-amber-950'
                      : 'border-stone-300 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  흘림 손글씨
                </button>
                <button
                  type="button"
                  onClick={() => setFontStyle('nanum-myeongjo')}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer font-[Nanum_Myeongjo] ${
                    fontStyle === 'nanum-myeongjo'
                      ? 'border-amber-800 bg-amber-900/10 font-bold text-amber-950'
                      : 'border-stone-300 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  정갈한 명조
                </button>
              </div>
            </div>
          </div>

          {/* Quick Writing Inspiration Templates */}
          <div className="bg-[#1C1814] border border-[#2E2620] rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>추천 편지 글귀 템플릿</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.title}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="px-3 py-2 bg-[#25201B] hover:bg-[#322A23] border border-[#3E342B] rounded-lg text-xs text-stone-300 hover:text-white transition-colors text-left flex flex-col justify-between cursor-pointer"
                >
                  <span className="font-semibold text-amber-300/90">{tpl.title}</span>
                  <span className="text-[10px] text-stone-400 mt-1 line-clamp-1">{tpl.subject}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Postal Dispatch & Recipient Details Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Recipient Information Panel */}
          <div className="bg-[#1A1613] border border-[#2F2620] rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h2 className="text-base font-serif font-bold text-stone-200 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>수신인 배달 정보</span>
              </h2>
              <span className="text-xs text-stone-400">도착 시 펼쳐질 연락처</span>
            </div>

            {/* Delivery Channel Selector */}
            <div>
              <label className="block text-xs text-stone-400 mb-2">도착 알림 채널</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-[#12100E] rounded-lg border border-stone-800">
                <button
                  type="button"
                  onClick={() => setDeliveryChannel('both')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    deliveryChannel === 'both'
                      ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  이메일 + 전화
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryChannel('email')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    deliveryChannel === 'email'
                      ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  이메일 전용
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryChannel('phone')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    deliveryChannel === 'phone'
                      ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  전화번호 전용
                </button>
              </div>
            </div>

            {/* Recipient Name */}
            <div>
              <label className="block text-xs text-stone-300 font-medium mb-1">
                받는 분 성함 또는 애칭 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="예: 지은이, 어머니, 오랜 친구 민수"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#241F1B] border border-[#3A3027] text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-none text-sm"
              />
              {validationErrors.recipientName && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.recipientName}</p>
              )}
            </div>

            {/* Recipient Email */}
            {(deliveryChannel === 'email' || deliveryChannel === 'both') && (
              <div>
                <label className="block text-xs text-stone-300 font-medium mb-1 flex items-center justify-between">
                  <span>받는 분 이메일 주소 <span className="text-red-400">*</span></span>
                  <span className="text-[11px] text-stone-500">배달 완료 시 서신 수신함 발송</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#241F1B] border border-[#3A3027] text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-none text-sm"
                  />
                </div>
                {validationErrors.recipientEmail && (
                  <p className="mt-1 text-xs text-red-400">{validationErrors.recipientEmail}</p>
                )}
              </div>
            )}

            {/* Recipient Phone */}
            {(deliveryChannel === 'phone' || deliveryChannel === 'both') && (
              <div>
                <label className="block text-xs text-stone-300 font-medium mb-1 flex items-center justify-between">
                  <span>받는 분 휴대폰 번호 <span className="text-red-400">*</span></span>
                  <span className="text-[11px] text-stone-500">모바일 알림톡 서신 연출</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#241F1B] border border-[#3A3027] text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-none text-sm"
                  />
                </div>
                {validationErrors.recipientPhone && (
                  <p className="mt-1 text-xs text-red-400">{validationErrors.recipientPhone}</p>
                )}
              </div>
            )}

            {/* Sender Name */}
            <div className="pt-2 border-t border-stone-800">
              <label className="block text-xs text-stone-300 font-medium mb-1">
                보내는 분 성함 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="보내는 분 이름을 적어주세요"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#241F1B] border border-[#3A3027] text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-none text-sm"
              />
              {validationErrors.senderName && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.senderName}</p>
              )}
            </div>
          </div>

          {/* Postal Route & Distance Telemetry Card */}
          <div className="bg-[#1A1613] border border-[#2F2620] rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-serif font-bold text-stone-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>전령새 비행 경로 설정</span>
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">출발지 (발신처)</label>
                <select
                  value={senderLocation.id}
                  onChange={(e) => {
                    const loc = KOREA_LOCATIONS.find((l) => l.id === e.target.value);
                    if (loc) setSenderLocation(loc);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[#241F1B] border border-[#3A3027] text-stone-200 text-xs focus:border-amber-500 outline-none cursor-pointer"
                >
                  {KOREA_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">도착지 (수신처)</label>
                <select
                  value={destinationLocation.id}
                  onChange={(e) => {
                    const loc = KOREA_LOCATIONS.find((l) => l.id === e.target.value);
                    if (loc) setDestinationLocation(loc);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[#241F1B] border border-[#3A3027] text-stone-200 text-xs focus:border-amber-500 outline-none cursor-pointer"
                >
                  {KOREA_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculated Distance and Estimated Flight Stats */}
            <div className="p-3.5 bg-[#12100E] rounded-xl border border-stone-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <Compass className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="text-[10px] text-stone-500">대원 비행 직선거리</div>
                  <div className="font-semibold text-amber-300 tabular-nums">{distanceKm} km</div>
                </div>
              </div>

              <div className="h-6 w-[1px] bg-stone-800" />

              <div className="flex items-center gap-2 text-stone-300">
                <Clock className="w-4 h-4 text-sky-400" />
                <div>
                  <div className="text-[10px] text-stone-500">실제 비둘기 소요 시간</div>
                  <div className="font-semibold text-sky-300 tabular-nums">약 {estimatedHours}시간</div>
                </div>
              </div>
            </div>

            {/* Stamp & Wax Seal Customization */}
            <div className="space-y-3 pt-2 border-t border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-300">소인 왁스 인장</span>
                <div className="flex items-center gap-2">
                  {WAX_SEALS.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWaxColor(w.id)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        waxColor === w.id ? 'scale-125 border-white shadow-lg' : 'border-transparent opacity-75'
                      }`}
                      style={{ backgroundColor: w.colorHex }}
                      title={w.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-300">기념 우표 도안</span>
                <div className="flex items-center gap-1.5">
                  {STAMPS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStamp(s.id)}
                      className={`px-2 py-1 text-[11px] rounded border transition-colors cursor-pointer ${
                        stamp === s.id
                          ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                          : 'border-stone-800 text-stone-500 hover:text-stone-300'
                      }`}
                    >
                      {s.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit CTA Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold rounded-xl shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 text-base cursor-pointer"
              >
                <Send className="w-5 h-5 text-stone-950" />
                <span>전령 비둘기 출항 및 배달 시작</span>
              </button>
              <p className="mt-2 text-center text-[11px] text-stone-500">
                편지가 정성스럽게 접혀 봉투에 밀봉된 후, 실시간 지도 비행이 시작됩니다.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
