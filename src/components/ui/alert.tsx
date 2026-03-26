import React from 'react';

import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '../../utils/cn.ts';

const alertVariants = cva(
  'flex items-start gap-2 p-3 rounded-xl text-sm font-medium',
  {
    variants: {
      severity: {
        error: 'bg-error/10 text-error border border-error/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        success: 'bg-success/10 text-success border border-success/20',
        info: 'bg-primary/10 text-primary border border-primary/20',
      },
    },
    defaultVariants: { severity: 'info' },
  },
);

interface AlertProps extends VariantProps<typeof alertVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Alert({ severity, children, className }: AlertProps) {
  return (
    <div className={cn(alertVariants({ severity }), className)}>{children}</div>
  );
}

export const Chip = ({
  label,
  color = 'primary',
  className,
}: {
  label: string;
  color?: 'primary' | 'secondary' | 'warning' | 'default';
  className?: string;
}) => {
  const colors = {
    primary: 'bg-primary/10 border-primary/30 text-primary/90',
    secondary: 'bg-secondary/10 border-secondary/30 text-secondary/90',
    warning: 'bg-warning/10 border-warning/30 text-warning/90',
    default: 'bg-white/5 border-white/10 text-white/50',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium border',
        colors[color],
        className,
      )}
    >
      {label}
    </span>
  );
};
