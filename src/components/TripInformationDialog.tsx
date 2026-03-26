import { X } from 'lucide-react';
import * as React from 'react';

import TripInformation from './TripInformation.tsx';
import { AnimatePresence, motion } from 'framer-motion';

import { Trip } from '../types/trip.ts';

export default function TripInformationDialog(props: {
  journeyInfoDialog: { isOpen: boolean; close: () => void; open: () => void };
  onClose: () => void;
  trip: Trip;
}) {
  return (
    <AnimatePresence>
      {props.journeyInfoDialog.isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          className="fixed inset-0 z-[201] bg-bg flex flex-col overflow-y-auto"
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface sticky top-0 z-10">
            <span className="text-base font-semibold flex-1">Trip info</span>
            <button
              onClick={props.onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-2 text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-2">
            <TripInformation trip={props.trip} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
