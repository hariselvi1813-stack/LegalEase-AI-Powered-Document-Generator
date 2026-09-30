import React from 'react';

export interface NavArrowsProps {
  onPrev?: () => void;
  onNext?: () => void;
  onAction?: () => void;
  className?: string;
  actionAriaLabel?: string;
}

export const NavArrows: React.FC<NavArrowsProps> = ({
  onPrev,
  onNext,
  onAction,
  className = '',
  actionAriaLabel = 'Swap card positions or cycle palette',
}) => {
  return (
    <nav
      aria-label="Palette navigation and controls"
      className={`inline-flex items-center gap-2 sm:gap-2.5 ${className}`}
    >
      {/* 1. Left Arrow */}
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous combo"
        title="Previous combo (Arrow Left)"
        className="group relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full border-[1.5px] sm:border-[2px] border-[#FD1843] text-[#FD1843] bg-transparent hover:bg-[#FD1843] hover:text-white transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FD1843] active:scale-90 cursor-pointer"
      >
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* 2. Middle Action / Up Arrow */}
      <button
        type="button"
        onClick={onAction}
        aria-label={actionAriaLabel}
        title="Reset template"
        className="group relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full border-[1.5px] sm:border-[2px] border-[#FD1843] text-[#FD1843] bg-transparent hover:bg-[#FD1843] hover:text-white transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FD1843] active:scale-90 cursor-pointer"
      >
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:-translate-y-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>

      {/* 3. Right Arrow */}
      <button
        type="button"
        onClick={onNext}
        aria-label="Next combo"
        title="Next combo (Arrow Right)"
        className="group relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full border-[1.5px] sm:border-[2px] border-[#FD1843] text-[#FD1843] bg-transparent hover:bg-[#FD1843] hover:text-white transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FD1843] active:scale-90 cursor-pointer"
      >
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </nav>
  );
};
