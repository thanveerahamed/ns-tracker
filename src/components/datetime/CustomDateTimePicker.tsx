import { useState } from 'react';

import DateTimePickerModal from './DateTimePickerModal.tsx';
import dayjs, { Dayjs } from 'dayjs';

interface CustomDateTimePickerProps {
  onChange: (currentTime: Dayjs | 'now', isArrival?: boolean) => void;
  value: Dayjs | 'now';
  isArrival?: boolean;
}

export default function CustomDateTimePicker({
  onChange,
  value,
  isArrival,
}: CustomDateTimePickerProps) {
  const [open, setOpen] = useState(false);

  const displayValue =
    value === 'now' ? 'Now' : dayjs(value).format('DD MMM HH:mm');

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col items-start px-2.5 py-1.5 rounded-xl bg-surface-2 border border-border text-xs hover:border-primary transition-colors"
        >
          <span className="text-white/40 text-[10px] uppercase tracking-wide">
            {isArrival ? 'Arrival' : 'Departure'}
          </span>
          <span className="text-white font-medium">{displayValue}</span>
        </button>
        <button
          onClick={() => onChange(dayjs(), false)}
          className="px-2 py-1 text-[10px] font-bold rounded-lg bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
        >
          NOW
        </button>
      </div>

      <DateTimePickerModal
        open={open}
        onChange={onChange}
        value={value === 'now' ? dayjs() : dayjs(value)}
        isArrival={isArrival}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
