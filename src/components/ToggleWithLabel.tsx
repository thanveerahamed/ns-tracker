import { cn } from '../utils/cn.ts';

interface Props {
  label: string;
  value?: string;
  options: { label: string; value: string }[];
  onChange: (newValue: string) => void;
}

export default function ToggleWithLabel({
  label,
  value,
  onChange,
  options,
}: Props) {
  return (
    <div className="flex items-center justify-between px-2 py-1.5">
      <span className="text-sm text-white/80">{label}</span>
      <div className="flex rounded-xl overflow-hidden border border-border">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium transition-colors',
              value === option.value
                ? 'bg-primary text-white'
                : 'bg-surface-2 text-white/50 hover:text-white',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
