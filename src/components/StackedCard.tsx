import React from 'react';

export interface StackedCardProps {
  backgroundColor: string;
  textColor?: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}

export const StackedCard: React.FC<StackedCardProps> = ({
  backgroundColor,
  textColor,
  className = '',
  children,
  ariaLabel,
}) => {
  return (
    <article
      aria-label={ariaLabel}
      style={{ backgroundColor, color: textColor }}
      className={`relative w-full rounded-[20px] sm:rounded-[24px] 
        transition-transform duration-300 ease-out 
        hover:-translate-y-1 sm:hover:-translate-y-1.5 
        will-change-transform select-none 
        ${className}`}
    >
      {children}
    </article>
  );
};
