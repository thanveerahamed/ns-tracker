import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import TripInfoCard from './TripInfoCard.tsx';
import { Alert } from './ui/alert.tsx';
import { LinearProgress } from './ui/progress.tsx';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

import { TripsInformationContextValue } from '../context/TripsInformationContext.tsx';
import { auth } from '../services/firebase.ts';
import { useFavouriteTrip } from '../services/trip.ts';
import { FavouriteTrip, Trip } from '../types/trip.ts';

type Props = Omit<
  TripsInformationContextValue,
  'reload' | 'updateRecentSearch'
> & {
  onTripSelected: (trip: Trip) => void;
};

const listVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.055 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 340, damping: 30 },
  },
};

export default function TripsList({
  isInitialLoading,
  isLoadMoreLoading,
  loadLater,
  loadEarlier,
  trips,
  via,
  dateTime,
  onTripSelected,
}: Props) {
  const [user] = useAuthState(auth);
  const [favouriteTripsSnapshots] = useFavouriteTrip(user?.uid);

  const isFavouriteTrip = useCallback(
    (trip: Trip) =>
      favouriteTripsSnapshots?.docs
        .map((doc) => {
          const data = doc.data() as { trip: string };
          return (JSON.parse(data.trip) as FavouriteTrip).ctxRecon;
        })
        .includes(trip.ctxRecon) ?? false,
    [favouriteTripsSnapshots],
  );

  return (
    <>
      {isInitialLoading && <LinearProgress />}

      {!isInitialLoading && (
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <button
            onClick={loadEarlier}
            disabled={isLoadMoreLoading}
            className="flex items-center gap-1 text-xs font-medium text-secondary disabled:opacity-30 transition-opacity"
          >
            <ChevronUp size={14} strokeWidth={2.5} /> Earlier
          </button>
          <span className="text-[11px] text-white/30 font-medium">
            {dateTime === 'now'
              ? dayjs().format('ddd D MMM')
              : dayjs(dateTime).format('ddd D MMM')}
          </span>
          <div className="w-16" />
        </div>
      )}

      <motion.div
        key={trips.map((t) => t.ctxRecon).join(',')}
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="pb-3 pt-1"
      >
        {trips.map((trip, index) => (
          <motion.div key={`trip_item_${index}`} variants={itemVariants}>
            <TripInfoCard
              trip={trip}
              via={via}
              onSelect={onTripSelected}
              isFavourite={isFavouriteTrip(trip)}
            />
          </motion.div>
        ))}
      </motion.div>

      {!isInitialLoading && trips.length === 0 && (
        <Alert severity="info" className="mx-3 mt-2">
          No trips match current search criteria.
        </Alert>
      )}

      {!isInitialLoading && (
        <div className="px-4 pb-4">
          <button
            onClick={loadLater}
            disabled={isLoadMoreLoading}
            className="flex items-center gap-1 text-xs font-medium text-secondary disabled:opacity-30 transition-opacity"
          >
            <ChevronDown size={14} strokeWidth={2.5} /> Later
          </button>
        </div>
      )}
    </>
  );
}
