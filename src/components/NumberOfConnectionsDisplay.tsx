import { Repeat2 } from 'lucide-react';

export default function ConnectionCounts({
  connections,
  hideIcon = false,
}: {
  connections: number;
  hideIcon?: boolean;
}) {
  if (connections === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {!hideIcon && <Repeat2 size={13} className="text-white/40" />}
      <span className="text-[12px] text-white/50">{connections}</span>
    </div>
  );
}
