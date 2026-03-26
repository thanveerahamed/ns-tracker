import React, { useEffect } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '../../utils/cn.ts';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fullScreen?: boolean;
  className?: string;
}

export function Dialog({
  open,
  onClose,
  children,
  fullScreen,
  className,
}: DialogProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="content"
            initial={
              fullScreen ? { y: '100%' } : { opacity: 0, scale: 0.96, y: 20 }
            }
            animate={fullScreen ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={
              fullScreen ? { y: '100%' } : { opacity: 0, scale: 0.96, y: 20 }
            }
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className={cn(
              'fixed z-[201] bg-surface overflow-y-auto',
              fullScreen
                ? 'inset-0'
                : 'bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md sm:rounded-2xl',
              className,
            )}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
