import React from 'react';
import { LocationPoint } from '../types';
import { KOREA_LOCATIONS, getFlightControlPoint, getBezierPoint } from '../utils/geo';
import { PigeonSvg } from './PigeonSvg';

interface KoreaMapProps {
  departure: LocationPoint;
  destination: LocationPoint;
  flightProgress?: number; // 0 to 1
  isFlying?: boolean;
  onSelectDestination?: (loc: LocationPoint) => void;
  onSelectDeparture?: (loc: LocationPoint) => void;
  selectionMode?: 'departure' | 'destination' | null;
}

export const KoreaMap: React.FC<KoreaMapProps> = ({
  departure,
  destination,
  flightProgress = 0,
  isFlying = false,
  onSelectDestination,
  onSelectDeparture,
  selectionMode = null,
}) => {
  // Flight path control point
  const ctrl = getFlightControlPoint(departure, destination);

  // Flight path SVG bezier string
  const pathD = `M ${departure.mapX} ${departure.mapY} Q ${ctrl.x} ${ctrl.y} ${destination.mapX} ${destination.mapY}`;

  // Current pigeon position along bezier curve
  const currentPos = getBezierPoint(
    { x: departure.mapX, y: departure.mapY },
    ctrl,
    { x: destination.mapX, y: destination.mapY },
    Math.min(1, Math.max(0, flightProgress))
  );

  // Calculate tangent vector for bird pitch/banking angle
  const delta = 0.02;
  const pNext = getBezierPoint(
    { x: departure.mapX, y: departure.mapY },
    ctrl,
    { x: destination.mapX, y: destination.mapY },
    Math.min(1, flightProgress + delta)
  );
  const dx = pNext.x - currentPos.x;
  const dy = pNext.y - currentPos.y;
  let flightAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

  // Offset bird angle so it faces forward along vector
  if (dx < 0) {
    // Flying leftwards - need flip or invert
    flightAngle = flightAngle + 180;
  }

  const isFlipped = dx < 0;

  return (
    <div className="relative w-full aspect-[4/3] max-h-[640px] bg-[#0E1525] rounded-2xl overflow-hidden border border-[#2D3748] shadow-2xl select-none">
      {/* Sky/Atmosphere dynamic gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1120] via-[#10192e] to-[#0c1322] opacity-95" />

      {/* Subtle topographic coordinate grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#60A5FA" strokeWidth="0.5" strokeDasharray="2,4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Main Map SVG */}
      <svg
        viewBox="0 0 100 100"
        className="relative w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Korean landmass gradient */}
          <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#1B2636" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Sea water pattern */}
          <linearGradient id="seaGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0E1726" />
            <stop offset="100%" stopColor="#070C15" />
          </linearGradient>

          {/* Golden flight trail glow */}
          <filter id="trailGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Sea waters background */}
        <rect x="0" y="0" width="100" height="100" fill="url(#seaGlow)" />

        {/* Sea labels */}
        <text x="12" y="55" fill="#475569" fontSize="2.2" fontFamily="sans-serif" letterSpacing="0.2">황해 (Yellow Sea)</text>
        <text x="80" y="45" fill="#475569" fontSize="2.2" fontFamily="sans-serif" letterSpacing="0.2">동해 (East Sea)</text>
        <text x="44" y="96" fill="#475569" fontSize="2.2" fontFamily="sans-serif" letterSpacing="0.2">남해 (South Sea)</text>

        {/* Korean Peninsula Landmass Silhouette */}
        <g id="korea-landmass">
          {/* Main Peninsula Body */}
          <path
            d="M 32,8 
               C 38,9 48,11 58,12 
               C 66,13 72,17 76,23 
               C 78,28 75,35 73,42 
               C 72,48 74,54 77,61 
               C 80,68 83,72 82,78 
               C 80,82 72,83 67,82 
               C 62,81 58,84 53,84 
               C 47,84 41,83 37,80 
               C 33,76 33,70 34,65 
               C 35,59 34,54 36,49 
               C 37,44 38,39 37,34 
               C 36,29 32,25 31,21 
               C 30,17 31,12 32,8 Z"
            fill="url(#landGradient)"
            stroke="#334155"
            strokeWidth="0.6"
          />

          {/* West Coast Riassic inlets / Ganghwa & Incheon Bays */}
          <path
            d="M 31,22 Q 28,26 31,30 Q 29,35 32,38 Q 30,42 34,46 Q 31,52 35,58 Q 30,65 34,72 Z"
            fill="none"
            stroke="#1E293B"
            strokeWidth="1.2"
          />

          {/* Jeju Island */}
          <ellipse
            cx="28.5"
            cy="93.8"
            rx="4.8"
            ry="2.4"
            fill="url(#landGradient)"
            stroke="#334155"
            strokeWidth="0.5"
          />

          {/* Ulleungdo & Dokdo */}
          <circle cx="89.5" cy="33.5" r="1.1" fill="url(#landGradient)" stroke="#334155" strokeWidth="0.4" />
          <circle cx="96.5" cy="33.0" r="0.6" fill="#F59E0B" stroke="#D97706" strokeWidth="0.3" />
          <text x="94" y="36.5" fill="#F59E0B" fontSize="1.4" fontWeight="bold">독도</text>

          {/* Major Mountain Ridges (Taebaek / Sobaek subtle relief curves) */}
          <path
            d="M 68,16 Q 72,28 71,40 Q 66,50 63,60 Q 56,70 48,76"
            fill="none"
            stroke="#334155"
            strokeWidth="0.8"
            strokeDasharray="1,1.5"
            opacity="0.6"
          />

          {/* Rivers (Han, Nakdong, Geum) */}
          <path
            d="M 52,22 Q 44,25 35,27"
            fill="none"
            stroke="#0284C7"
            strokeWidth="0.4"
            opacity="0.7"
          />
          <path
            d="M 66,54 Q 69,66 76,78"
            fill="none"
            stroke="#0284C7"
            strokeWidth="0.4"
            opacity="0.7"
          />
        </g>

        {/* Flight Trajectory Bezier Arc */}
        <g id="flight-trajectory">
          {/* Outer glow aura path */}
          <path
            d={pathD}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.3"
            filter="url(#trailGlow)"
          />

          {/* Base dashed journey line */}
          <path
            d={pathD}
            fill="none"
            stroke="#D97706"
            strokeWidth="0.7"
            strokeDasharray="2,2"
            opacity="0.85"
          />

          {/* Active flight completed segment */}
          {flightProgress > 0 && (
            <path
              d={pathD}
              fill="none"
              stroke="#FDE68A"
              strokeWidth="0.9"
              pathLength="100"
              strokeDasharray={`${flightProgress * 100} 100`}
              strokeLinecap="round"
            />
          )}
        </g>

        {/* Preset City Nodes / Landmarks */}
        <g id="city-nodes">
          {KOREA_LOCATIONS.map((loc) => {
            const isDep = loc.id === departure.id;
            const isDest = loc.id === destination.id;

            return (
              <g
                key={loc.id}
                className="cursor-pointer group"
                onClick={() => {
                  if (selectionMode === 'departure' && onSelectDeparture) {
                    onSelectDeparture(loc);
                  } else if (onSelectDestination) {
                    onSelectDestination(loc);
                  }
                }}
              >
                {/* Ping animation ring for active nodes */}
                {(isDep || isDest) && (
                  <circle
                    cx={loc.mapX}
                    cy={loc.mapY}
                    r={isDep ? '2.8' : '3.6'}
                    fill="none"
                    stroke={isDep ? '#38BDF8' : '#F59E0B'}
                    strokeWidth="0.4"
                    opacity="0.7"
                    className="animate-ping"
                  />
                )}

                {/* Node point */}
                <circle
                  cx={loc.mapX}
                  cy={loc.mapY}
                  r={isDep || isDest ? '1.8' : '1.0'}
                  fill={isDep ? '#38BDF8' : isDest ? '#EF4444' : '#64748B'}
                  stroke="#FFFFFF"
                  strokeWidth={isDep || isDest ? '0.6' : '0.3'}
                  className="transition-transform duration-200 group-hover:scale-125"
                />

                {/* City name label */}
                <text
                  x={loc.mapX}
                  y={loc.mapY - 2.4}
                  textAnchor="middle"
                  fill={isDep ? '#38BDF8' : isDest ? '#FDE047' : '#94A3B8'}
                  fontSize={isDep || isDest ? '2.2' : '1.7'}
                  fontWeight={isDep || isDest ? 'bold' : 'normal'}
                  className="pointer-events-none drop-shadow-sm"
                >
                  {loc.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </g>

        {/* Departure Origin Pin */}
        <g transform={`translate(${departure.mapX}, ${departure.mapY})`}>
          <circle cx="0" cy="0" r="1.6" fill="#0284C7" stroke="#BAE6FD" strokeWidth="0.5" />
          <rect x="-6" y="-6.2" width="12" height="3" rx="0.8" fill="#0284C7" />
          <text x="0" y="-4.2" textAnchor="middle" fill="#FFFFFF" fontSize="1.6" fontWeight="bold">
            발신지
          </text>
        </g>

        {/* Destination Arrival Pin */}
        <g transform={`translate(${destination.mapX}, ${destination.mapY})`}>
          <circle cx="0" cy="0" r="1.8" fill="#DC2626" stroke="#FECACA" strokeWidth="0.5" />
          <rect x="-6" y="-6.2" width="12" height="3" rx="0.8" fill="#DC2626" />
          <text x="0" y="-4.2" textAnchor="middle" fill="#FFFFFF" fontSize="1.6" fontWeight="bold">
            도착지
          </text>
        </g>
      </svg>

      {/* Floating Carrier Pigeon on Map (DOM Overlay with smooth positioning) */}
      <div
        className="absolute pointer-events-none transition-all duration-75 ease-linear"
        style={{
          left: `${currentPos.x}%`,
          top: `${currentPos.y}%`,
          transform: `translate(-50%, -60%) ${isFlipped ? 'scaleX(-1)' : ''}`,
          width: '68px',
          height: '52px',
        }}
      >
        <PigeonSvg
          className="w-full h-full"
          isFlapping={isFlying || flightProgress < 0.99}
          tiltAngle={isFlipped ? -flightAngle : flightAngle}
          showEnvelope={true}
        />
      </div>

      {/* Compass Rose in Corner */}
      <div className="absolute top-4 right-4 pointer-events-none opacity-70 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full border border-slate-600 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[10px] font-serif font-bold text-amber-400">N</div>
        </div>
        <div className="text-[9px] text-slate-400 tracking-widest mt-1">방위각 0°</div>
      </div>

      {/* Selection Mode Hint Banner */}
      {selectionMode && (
        <div className="absolute top-4 left-4 bg-amber-500/90 text-stone-950 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg backdrop-blur-sm flex items-center gap-2">
          <span>지도에서 {selectionMode === 'departure' ? '출발 도시' : '도착 도시'}를 클릭하세요</span>
        </div>
      )}
    </div>
  );
};
