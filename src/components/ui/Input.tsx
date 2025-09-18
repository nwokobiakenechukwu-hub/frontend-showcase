import { InputHTMLAttributes, forwardRef } from 'react';
import { cx } from '@/design/utilities';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...rest }, ref) => (
    <input
      ref={ref}
      className={cx(
        'h-10 w-full rounded-xl bg-white/5 border border-white/10 px-3 text-sm placeholder:text-white/50',
        'focus:outline-none focus-visible:ring',
        className
      )}
      {...rest}
    />
  )
);
Input.displayName = 'Input';
