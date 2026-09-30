import React from 'react';

export interface CenterBadgeProps {
  comboText?: string;
  subText?: string;
  onClick?: () => void;
  className?: string;
}

export const CenterBadge: React.FC<CenterBadgeProps> = ({
  comboText = 'LEGALEASE',
  subText = 'VIVID STUDIO',
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${comboText} badge`}
      title={onClick ? 'Click to inspect' : comboText}
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 
        w-[115px] h-[115px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] 
        rounded-full bg-[#0B0B0B] border-[2px] border-[#FD1843]/40
        flex flex-col items-center justify-center 
        select-none cursor-pointer group 
        transition-transform duration-200 ease-out 
        hover:scale-[1.04] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FD1843]
        ${className}`}
    >
      {/* Subtle dashed ring */}
      <div className="absolute inset-2 sm:inset-3 rounded-full border border-dashed border-[#FD1843]/30 animate-spin-slow pointer-events-none" />
      {/* Center typography */}
      <div className="relative flex flex-col items-center justify-center text-center px-2">
        <span className="font-editorial-heading tracking-widest text-[#FFFFFF] text-base sm:text-xl md:text-2xl leading-none transition-colors duration-200 group-hover:text-[#FD1843]">
          {comboText}
        </span>
        {subText && (
          <span className="text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.28em] font-sans font-semibold uppercase text-[#FD1843] mt-1 sm:mt-1.5 opacity-90">
            {subText}
          </span>
        )}
      </div>
    </div>
  );
};
