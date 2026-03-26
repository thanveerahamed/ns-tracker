import { Train } from 'lucide-react';

import { motion } from 'framer-motion';

export default function ClockLoader() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
      style={{ color: '#f3b18d', display: 'flex' }}
    >
      <Train size={40} strokeWidth={1.5} />
    </motion.div>
  );
}
