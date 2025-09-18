import { ButtonHTMLAttributes } from 'react';
import { cx } from '@/design/utilities';

export function ButtonBase({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring',
        'h-10 px-4 rounded-2xl',
        className
      )}
      {...rest}
    />
  );
}
