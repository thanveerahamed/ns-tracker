import React from 'react';

import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '../../utils/cn.ts';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none select-none cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-hover',
        secondary: 'bg-surface-2 text-white hover:bg-[#282828]',
        ghost: 'text-white hover:bg-surface-2',
        danger: 'bg-error text-white hover:opacity-90',
        outline: 'border border-border text-white hover:bg-surface-2',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        icon: 'w-9 h-9',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { loading?: boolean };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, children, disabled, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
          aria-hidden
        />
      ) : null}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { 'aria-label': string }
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'w-9 h-9 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-surface-2 transition-colors active:scale-90 disabled:opacity-40 cursor-pointer',
      className,
    )}
    {...props}
  >
    {children}
  </button>
));
IconButton.displayName = 'IconButton';
