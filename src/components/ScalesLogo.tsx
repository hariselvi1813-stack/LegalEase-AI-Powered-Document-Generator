import React from 'react';

interface ScalesLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withWordmark?: boolean;
  wordmarkClassName?: string;
}

export const ScalesOfJusticeIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Scales of Justice"
    >
      {/* Central Pillar Finial */}
      <circle cx="24" cy="6" r="2.5" fill="currentColor" />
      <path
        d="M24 8.5V42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Cross Beam Pivot */}
      <circle cx="24" cy="14" r="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
      {/* Main Cross Beam */}
      <path
        d="M7 16C12 14.5 18 14 24 14C30 14 36 14.5 41 16"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Left Pan Chains */}
      <path d="M7 16L3 27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <path d="M7 16L11 27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      {/* Left Pan */}
      <path
        d="M2 27C2 31.5 12 31.5 12 27H2Z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right Pan Chains */}
      <path d="M41 16L37 27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <path d="M41 16L45 27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      {/* Right Pan */}
      <path
        d="M36 27C36 31.5 46 31.5 46 27H36Z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Pedestal Base */}
      <path
        d="M16 42H32M13 45H35"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const ScalesLogo: React.FC<ScalesLogoProps> = ({
  className = '',
  size = 'md',
  withWordmark = true,
  wordmarkClassName = '',
}) => {
  const iconSizes = {
    sm: 22,
    md: 28,
    lg: 38,
    xl: 48,
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center p-2 rounded-lg bg-gradient-to-br from-[#1E3048] to-[#0D1B2A] border border-[#C5A880]/30 text-[#D4AF37] shadow-sm">
        <ScalesOfJusticeIcon size={iconSizes[size]} />
      </div>
      {withWordmark && (
        <div className={`flex flex-col ${wordmarkClassName}`}>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-serif tracking-tight font-bold text-[#FAF6ED] ${textSizes[size]}`}
              style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
            >
              Legal<span className="text-[#D4AF37]">Ease</span>
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880]/80 font-medium">
            Contract Synthesis
          </span>
        </div>
      )}
    </div>
  );
};
