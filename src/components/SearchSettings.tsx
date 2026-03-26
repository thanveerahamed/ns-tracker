import { X } from 'lucide-react';

import { Switch } from './ui/switch.tsx';
import { AnimatePresence, motion } from 'framer-motion';

import { useSearchFilterContext } from '../context';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchSettings({ open, onClose }: Props) {
  const { onlyShowTransferEqualVia, setOnlyShowTransferEqualVia } =
    useSearchFilterContext();

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
            className="fixed inset-0 z-[201] bg-bg flex flex-col"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface">
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-2 text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <span className="font-semibold text-sm">Search settings</span>
            </div>

            <div className="p-4">
              <Switch
                checked={onlyShowTransferEqualVia}
                onChange={setOnlyShowTransferEqualVia}
                label="Only show results with transfer as via"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
