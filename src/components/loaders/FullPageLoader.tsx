import { Train } from 'lucide-react';

import { motion } from 'framer-motion';

export default function FullPageLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-[80vh]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        style={{ color: '#2b8257', display: 'flex' }}
      >
        <Train size={48} strokeWidth={1.5} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="text-xs text-muted tracking-widest"
      >
        Loading…
      </motion.div>
    </div>
  );
}
