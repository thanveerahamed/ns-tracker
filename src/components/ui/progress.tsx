import { motion } from 'framer-motion';

export function LinearProgress() {
  return (
    <div className="h-0.5 w-full bg-surface-2 overflow-hidden">
      <motion.div
        className="h-full bg-primary origin-left"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
