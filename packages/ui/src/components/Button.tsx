import { cn } from '@numugas/util';
import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, ReactNode } from 'react';

export const ButtonVariants: any = cva(`ui-btn`, {
  variants: {
    color: {
      accent: 'ui-btn-accent',
      error: 'ui-btn-error',
      info: 'ui-btn-info',
      neutral: 'ui-btn-neutral',
      primary: 'ui-btn-primary',
      secondary: 'ui-btn-secondary',
      success: 'ui-btn-success',
      warning: 'ui-btn-warning',
    },
    variant: {
      outlined: 'ui-btn-outline',
    },
  },
});

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

type Variant = 'filled' | 'outlined';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  children: ReactNode;
  className?: string;
  color?: keyof typeof ButtonColors;
  variant?: Variant;
}

export function Button({
  children,
  className,
  color = 'primary',
  variant = 'filled',
}: ButtonProps) {
  return (
    <button
      className={cn(ButtonVariants({ color, variant }), className)}
      type="button"
    >
      {children}
    </button>
  );
}
