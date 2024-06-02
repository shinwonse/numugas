import { cn } from '@numugas/util';
import { ReactNode } from 'react';

/* eslint-disable sort-keys-fix/sort-keys-fix */
export const ButtonColors: Record<string, string> = {
  primary: 'primary',
  secondary: 'secondary',
  accent: 'accent',
  neutral: 'neutral',
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
} as const;

type ButtonProps = {
  children: ReactNode;
  color?: keyof typeof ButtonColors;
};

export function Button({ children, color = 'primary' }: ButtonProps) {
  return (
    <button className={cn('btn', `btn-${color}`)} type="button">
      {children}
    </button>
  );
}
