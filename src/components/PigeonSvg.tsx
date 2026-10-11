import React from 'react';

interface PigeonSvgProps {
  className?: string;
  isFlapping?: boolean;
  tiltAngle?: number; // degrees
  scale?: number;
  showEnvelope?: boolean;
}

export const PigeonSvg: React.FC<PigeonSvgProps> = ({
  className = '',
  isFlapping = true,
  tiltAngle = 0,
  scale = 1,
  showEnvelope = true,
}) => {
  return (
    <div
      className={`relative inline-block transition-transform duration-150 ease-out select-none pointer-events-none ${className}`}
      style={{
        transform: `rotate(${tiltAngle}deg) scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      <svg
        viewBox="0 0 120 90"
        className="w-full h-full drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pigeonBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          <linearGradient id="pigeonWing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          <linearGradient id="beakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Wing flap CSS animation */}
          <style>
            {`
              @keyframes flapUp {
                0%, 100% {
                  transform: rotate(0deg) scaleY(1);
                }
                50% {
                  transform: rotate(-35deg) scaleY(0.7) translateY(-6px);
                }
              }
              @keyframes flapDown {
                0%, 100% {
                  transform: rotate(0deg) scaleY(1);
                }
                50% {
                  transform: rotate(25deg) scaleY(0.8) translateY(4px);
                }
              }
              @keyframes letterSway {
                0%, 100% {
                  transform: rotate(-4deg);
                }
                50% {
                  transform: rotate(6deg);
                }
              }
              .wing-top {
                transform-origin: 50px 42px;
                animation: flapUp 0.38s ease-in-out infinite;
              }
              .wing-bottom {
                transform-origin: 46px 48px;
                animation: flapDown 0.38s ease-in-out infinite;
              }
              .carried-letter {
                transform-origin: 82px 48px;
                animation: letterSway 0.76s ease-in-out infinite;
              }
            `}
          </style>
        </defs>

        {/* Far Wing (Behind body) */}
        <g className={isFlapping ? 'wing-top' : ''}>
          <path
            d="M48 42 C40 25 32 12 18 6 C28 14 34 24 36 38 C32 26 22 18 10 14 C20 22 26 34 30 46 Z"
            fill="url(#pigeonWing)"
            opacity="0.9"
          />
        </g>

        {/* Tail feathers */}
        <g>
          <path
            d="M38 52 C26 56 12 62 4 68 C14 62 26 58 35 55 Z"
            fill="#CBD5E1"
          />
          <path
            d="M36 50 C24 53 10 57 2 62 C13 58 25 54 34 52 Z"
            fill="#94A3B8"
          />
        </g>

        {/* Main Body */}
        <path
          d="M36 50 C42 58 54 62 66 56 C74 52 82 46 80 40 C78 35 70 34 62 36 C52 38 42 42 36 50 Z"
          fill="url(#pigeonBody)"
          stroke="#94A3B8"
          strokeWidth="0.5"
        />

        {/* Pigeon Head & Neck */}
        <path
          d="M72 40 C74 34 78 30 84 32 C88 34 89 38 88 42 C85 45 78 45 72 40 Z"
          fill="url(#pigeonBody)"
        />

        {/* Eye */}
        <circle cx="83" cy="34" r="1.8" fill="#1E293B" />
        <circle cx="83.5" cy="33.6" r="0.6" fill="#FFFFFF" />

        {/* Beak */}
        <polygon points="88,34 96,38 88,40" fill="url(#beakGrad)" />

        {/* Near Wing (In front of body) */}
        <g className={isFlapping ? 'wing-top' : ''}>
          {/* Main wing primary flight feathers */}
          <path
            d="M52 44 C45 22 36 8 20 2 C32 12 40 24 44 40 C38 26 28 16 14 10 C26 20 34 32 40 44 Z"
            fill="url(#pigeonWing)"
            stroke="#94A3B8"
            strokeWidth="0.5"
          />
          {/* Wing covert feather layer */}
          <path
            d="M50 44 C44 32 38 22 28 16 C36 24 42 34 46 44 Z"
            fill="#F8FAFC"
          />
        </g>

        {/* Carried Letter Envelope (in beak) */}
        {showEnvelope && (
          <g className="carried-letter">
            {/* Hanging thread/ribbon */}
            <path
              d="M93 39 Q96 44 94 48"
              fill="none"
              stroke="#DC2626"
              strokeWidth="1.5"
            />
            {/* Small letter envelope */}
            <g transform="translate(86, 47) rotate(12)">
              <rect
                x="0"
                y="0"
                width="22"
                height="14"
                rx="1.5"
                fill="#FEF3C7"
                stroke="#B45309"
                strokeWidth="0.8"
              />
              {/* Envelope flap lines */}
              <polyline
                points="0,0 11,8 22,0"
                fill="none"
                stroke="#D97706"
                strokeWidth="0.8"
              />
              {/* Wax seal dot */}
              <circle cx="11" cy="7.5" r="2.2" fill="#DC2626" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
