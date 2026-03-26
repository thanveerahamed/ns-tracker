import * as React from 'react';

export default function SplitViewTimeLineView({
  from,
  to,
}: {
  from: string;
  to: string;
}) {
  return (
    <div className="flex gap-2 p-3 min-w-[130px]">
      <div className="flex flex-col items-center gap-0">
        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
        <span className="w-px flex-1 bg-border" style={{ minHeight: 16 }} />
        <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0" />
      </div>
      <div className="flex flex-col justify-between gap-2">
        <span className="text-xs font-medium text-primary leading-tight">
          {from}
        </span>
        <span className="text-xs font-medium text-secondary leading-tight">
          {to}
        </span>
      </div>
    </div>
  );
}
