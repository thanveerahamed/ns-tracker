import * as React from 'react';

interface Props {
  originalTime: string;
  isDelayed: boolean;
  delayedTime?: string;
  direction?: 'column' | 'row';
  className?: string;
}

export default function Timing({
  isDelayed,
  delayedTime,
  originalTime,
  direction = 'column',
  className,
}: Props) {
  if (isDelayed) {
    return (
      <span
        className={`flex ${
          direction === 'row' ? 'flex-row gap-1.5 items-center' : 'flex-col'
        } ${className ?? ''}`}
      >
        <span className="text-error font-medium">{delayedTime}</span>
        <span className="text-xs line-through text-white/40">
          {originalTime}
        </span>
      </span>
    );
  }
  return <span className={className}>{originalTime}</span>;
}
