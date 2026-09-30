import React, { useState } from 'react';

export interface PillProps {
  label: string;
  variant?: 'black' | 'pink' | 'white';
  copyValue?: string;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export const Pill: React.FC<PillProps> = ({
  label,
  variant = 'pink',
  copyValue,
  className = '',
  onClick,
  ariaLabel,
}) => {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (copyValue) {
      navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
    if (onClick) {
      onClick();
    }
  };

  const variantStyles = {
    black:
      'border-[#0B0B0B] text-[#0B0B0B] hover:bg-[#0B0B0B] hover:text-white focus-visible:ring-[#0B0B0B]',
    pink:
      'border-[#FD1843] text-[#FD1843] hover:bg-[#FD1843] hover:text-white focus-visible:ring-[#FD1843]',
    white:
      'border-white text-white hover:bg-white hover:text-[#FD1843] focus-visible:ring-white',
  };

  const displayText = copied ? 'COPIED!' : label;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel || (copyValue ? `Copy ${copyValue}` : label)}
      className={`group relative inline-flex items-center justify-center border-[2px] rounded-full px-3.5 sm:px-4 py-1.5 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-95 ${variantStyles[variant]} ${className}`}
      title={copyValue ? `Click to copy ${copyValue}` : label}
    >
      <span>{displayText}</span>
    </button>
  );
};
