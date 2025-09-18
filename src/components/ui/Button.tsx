'use client';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/design/utilities';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', asChild, className, ...rest }, ref) => {
    const Comp: any = asChild ? Slot : 'button';

    const base =
      'inline-flex items-center justify-center font-medium transition-[transform,opacity,background] duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring';

    const variants = {
      primary: 'text-white bg-[--color-primary] hover:opacity-95 shadow-md shadow-black/30',
      secondary:
        'text-white bg-gradient-to-br from-[#47C5FB]/90 to-[#8B5CF6]/90 hover:opacity-95 shadow-md shadow-black/30',
      outline: 'text-white/90 border border-white/15 bg-white/5 hover:bg-white/10',
      ghost: 'text-white/80 hover:bg-white/5',
    } as const;

    const sizes = {
      sm: 'h-9 px-3 rounded-lg text-sm',
      md: 'h-10 px-4 rounded-xl',
      lg: 'h-12 px-6 rounded-2xl text-lg',
    } as const;

    return (
      <Comp ref={ref} className={cx(base, variants[variant], sizes[size], className)} {...rest} />
    );
  }
);
Button.displayName = 'Button';
