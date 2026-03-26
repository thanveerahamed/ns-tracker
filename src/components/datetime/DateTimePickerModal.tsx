import { Train } from 'lucide-react';
import { useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '../../utils/cn.ts';

interface DatePickerModalProps {
  open: boolean;
  onChange: (currentTime: Dayjs | 'now', isArrival?: boolean) => void;
  value: Dayjs;
  isArrival?: boolean;
  onClose: () => void;
}

export default function DateTimePickerModal({
  open,
  onChange,
  value,
  isArrival,
  onClose,
}: DatePickerModalProps) {
  const [currentDateTime, setCurrentDateTime] = useState<string>(
    dayjs(value).format('YYYY-MM-DDTHH:mm'),
  );
  const [internalIsArrival, setInternalIsArrival] = useState<boolean>(
    isArrival ?? false,
  );

  const handleSave = () => {
    onChange(dayjs(currentDateTime), internalIsArrival);
    onClose();
  };

  const handleNow = () => {
    onChange(dayjs(), false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-[201] bg-surface border-t border-border rounded-t-2xl p-4 pb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Train size={18} className="text-primary" />
              <span className="font-semibold text-sm">
                Select departure / arrival
              </span>
            </div>

            {/* Arrival / Departure toggle */}
            <div className="flex gap-2 mb-4">
              {(['departure', 'arrival'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setInternalIsArrival(type === 'arrival')}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-sm font-medium border transition-colors',
                    (type === 'arrival') === internalIsArrival
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-2 border-border text-white/60',
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Native datetime input */}
            <input
              type="datetime-local"
              value={currentDateTime}
              onChange={(e) => setCurrentDateTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-border text-white text-sm outline-none focus:border-primary transition-colors mb-4 [color-scheme:dark]"
            />

            <div className="flex gap-2">
              <button
                onClick={handleNow}
                className="flex-1 py-2.5 rounded-xl bg-secondary/20 border border-secondary/30 text-secondary text-sm font-semibold"
              >
                Now
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-surface-2 border border-border text-white/60 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold"
              >
                OK
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
