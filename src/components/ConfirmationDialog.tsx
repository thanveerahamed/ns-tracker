import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  text: string;
}

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  text,
}: Props) {
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed z-[201] left-4 right-4 top-1/2 -translate-y-1/2 bg-surface rounded-2xl border border-border p-5 shadow-xl"
          >
            <h3 className="font-semibold text-base mb-2">{title}</h3>
            <p className="text-sm text-white/60 mb-5">{text}</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm text-white/60 hover:bg-surface-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-xl text-sm bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
