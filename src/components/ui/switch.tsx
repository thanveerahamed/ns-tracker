import React from 'react';

import { motion } from 'framer-motion';

import { cn } from '../../utils/cn.ts';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Switch({ checked, onChange, label, className }: SwitchProps) {
  return (
    <label
      className={cn(
        'flex items-center gap-3 cursor-pointer select-none',
        className,
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors duration-200',
          checked ? 'bg-primary' : 'bg-surface-2 border border-border',
        )}
      >
        <motion.span
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
        />
      </button>
      {label && <span className="text-sm text-white/80">{label}</span>}
    </label>
  );
}
