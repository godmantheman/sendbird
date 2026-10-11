import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  FastForward,
  CheckCircle2,
  Wind,
  Compass,
  Clock,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { LetterData } from '../types';
import { KoreaMap } from './KoreaMap';
import {
  calculateHaversineDistanceKm,
  getAtmosphericWaypointStatus,
} from '../utils/geo';
import { playWingFlap, playPigeonCoo } from '../utils/audio';

interface FlightSimulationProps {
  letterData: LetterData;
  onDelivered: () => void;
  onCancelToCompose: () => void;
}

export const FlightSimulation: React.FC<FlightSimulationProps> = ({
  letterData,
  onDelivered,
  onCancelToCompose,
}) => {
  // Flight progress from 0.0 to 1.0
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  // Speed multiplier: 1x (cinematic ~20s), 3x, 8x, 20x
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Audio wing flap interval
  const flapSoundIntervalRef = useRef<number | null>(null);

  // Total base cinematic simulation duration in seconds (e.g., 18 seconds for standard kiosk showcase)
  // Scaled gently with actual distance so longer distances take proportionally longer!
  const baseDurationSeconds = Math.max(
    14,
    Math.min(35, Math.round(letterData.distanceKm * 0.065))
  );

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTimeMs = 50;
    const progressPerTick = (intervalTimeMs / 1000 / baseDurationSeconds) * speedMultiplier;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + progressPerTick;
        if (next >= 1) {
          clearInterval(timer);
          // Play arrival coo
          playPigeonCoo();
          setTimeout(() => {
            onDelivered();
          }, 800);
          return 1;
        }
        return next;
      });

      setElapsedSeconds((prev) => prev + (intervalTimeMs / 1000) * speedMultiplier);
    }, intervalTimeMs);

    return () => clearInterval(timer);
  }, [isPlaying, speedMultiplier, baseDurationSeconds, onDelivered]);

  // Periodic wing sound
  useEffect(() => {
    if (isPlaying && progress < 1) {
      const interval = window.setInterval(() => {
        playWingFlap();
      }, 1600);
      flapSoundIntervalRef.current = interval;
      return () => clearInterval(interval);
    }
  }, [isPlaying, progress]);

  // Telemetry computation
  const remainingDistanceKm = Math.max(
    0,
    Math.round(letterData.distanceKm * (1 - progress) * 10) / 10
  );

  const atmospheric = getAtmosphericWaypointStatus(
    letterData.senderLocation,
    letterData.destinationLocation,
    progress
  );

  // Real-world simulated flight ETA based on 65km/h pigeon speed
  const simulatedRemainingHours = Math.max(
    0,
    Math.round(letterData.estimatedFlightHours * (1 - progress) * 10) / 10
  );

  const handleInstantDeliver = () => {
    setProgress(1);
    playPigeonCoo();
    setTimeout(() => {
      onDelivered();
    }, 400);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Journey Tracker Bar */}
      <div className="bg-[#181411] border border-[#2D231B] rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            🕊️
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>전령 비둘기 실시간 항로</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-semibold">
                {letterData.senderLocation.name.split(' ')[0]} ➔{' '}
                {letterData.destinationLocation.name.split(' ')[0]}
              </span>
            </div>
            <h2 className="text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
              <span>{atmospheric.landmark}</span>
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-lg border border-stone-800 bg-[#241F1A] hover:bg-[#322A23] text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>일시정지</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>비행 재개</span>
              </>
            )}
          </button>

          {/* Speed toggles */}
          <div className="flex items-center bg-[#12100E] border border-stone-800 rounded-lg p-1 text-xs">
            {[1, 3, 8].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeedMultiplier(s)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  speedMultiplier === s
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Instant Deliver */}
          <button
            type="button"
            onClick={handleInstantDeliver}
            className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow cursor-pointer"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>즉시 도착</span>
          </button>
        </div>
      </div>

      {/* Main Map Visual + Live Flight Deck Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Canvas (7 cols on large screens) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <KoreaMap
            departure={letterData.senderLocation}
            destination={letterData.destinationLocation}
            flightProgress={progress}
            isFlying={isPlaying}
          />

          {/* Progress Slider Strip */}
          <div className="bg-[#181411] border border-[#2D231B] rounded-xl p-3 flex items-center gap-4">
            <span className="text-xs text-stone-400 font-mono tabular-nums">
              {Math.round(progress * 100)}%
            </span>
            <div className="relative flex-1 h-2 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-75"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="text-xs text-stone-400">
              남은 거리: <span className="text-amber-400 font-bold tabular-nums">{remainingDistanceKm} km</span>
            </div>
          </div>
        </div>

        {/* Live Flight Telemetry & Postal Manifest Deck (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Telemetry Stats Card */}
          <div className="bg-[#1A1612] border border-[#2F251D] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-sm font-serif font-bold text-stone-200 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-500" />
                <span>비둘기 비행 항법 데이터</span>
              </h3>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                정상 순항 중
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#12100E] border border-stone-800/80 rounded-xl">
                <div className="text-[10px] text-stone-500 mb-0.5">순항 고도</div>
                <div className="text-base font-bold text-stone-100 tabular-nums">
                  {atmospheric.altitude} m
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">지상 300~500m 고도</div>
              </div>

              <div className="p-3 bg-[#12100E] border border-stone-800/80 rounded-xl">
                <div className="text-[10px] text-stone-500 mb-0.5">비행 평균 시속</div>
                <div className="text-base font-bold text-amber-400 tabular-nums">
                  65 km/h
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">비둘기 최대시속 90km/h</div>
              </div>

              <div className="p-3 bg-[#12100E] border border-stone-800/80 rounded-xl">
                <div className="text-[10px] text-stone-500 mb-0.5 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-sky-400" />
                  <span>상공 풍향/풍속</span>
                </div>
                <div className="text-sm font-bold text-stone-100">
                  {atmospheric.windSpeed} km/h
                </div>
                <div className="text-[10px] text-sky-400 mt-0.5">{atmospheric.windDir}</div>
              </div>

              <div className="p-3 bg-[#12100E] border border-stone-800/80 rounded-xl">
                <div className="text-[10px] text-stone-500 mb-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>현실 소요 시간</span>
                </div>
                <div className="text-sm font-bold text-amber-300 tabular-nums">
                  약 {simulatedRemainingHours} 시간
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">키오스크 시뮬레이션 중</div>
              </div>
            </div>

            {/* Weather & Pigeon status */}
            <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-stone-300 space-y-1">
              <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>전령 보호 모드 가동</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                전령 비둘기는 지구 자기장 감각(Magnetoreception)과 태양 궤도를 나침반 삼아 흔들림 없이 목적지({letterData.destinationLocation.name.split(' ')[0]})를 향해 항해하고 있습니다.
              </p>
            </div>
          </div>

          {/* Recipient Envelope Preview Mini-Card */}
          <div className="bg-[#1A1612] border border-[#2F251D] rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-stone-400 font-serif">
              배달 서신 목적지 정보
            </h3>
            <div className="p-3 bg-[#241F1A] border border-[#3A3026] rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">수신인:</span>
                <span className="font-bold text-stone-100">{letterData.recipientName} 귀하</span>
              </div>
              {(letterData.deliveryChannel === 'email' || letterData.deliveryChannel === 'both') && (
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">이메일 알림:</span>
                  <span className="text-amber-400 font-mono text-[11px] truncate max-w-[180px]">
                    {letterData.recipientEmail}
                  </span>
                </div>
              )}
              {(letterData.deliveryChannel === 'phone' || letterData.deliveryChannel === 'both') && (
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">전화번호 알림:</span>
                  <span className="text-sky-400 font-mono text-[11px]">
                    {letterData.recipientPhone}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px]">
                <span className="text-stone-400">서신 제목:</span>
                <span className="text-stone-300 font-serif italic truncate max-w-[180px]">
                  {letterData.subject}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onCancelToCompose}
                className="w-full py-2 px-3 border border-stone-800 hover:border-stone-700 bg-transparent text-stone-400 hover:text-stone-200 rounded-lg text-xs transition-colors cursor-pointer"
              >
                비행 취소하고 편지 수정하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
