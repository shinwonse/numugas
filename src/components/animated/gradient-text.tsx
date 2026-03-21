import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

export function GradientText({ children, className = '' }: GradientTextProps) {
  return (
    <span
      className={`bg-gradient-to-r from-red-500 via-white to-red-500 bg-[length:200%_auto] bg-clip-text text-transparent ${className}`}
      style={{
        display: 'inline-block',
        animation: 'gradient-shift 5s linear infinite',
      }}
    >
      {children}
    </span>
  );
}
