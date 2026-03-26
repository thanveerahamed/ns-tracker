import { ChevronLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { AnimatePresence, motion } from 'framer-motion';

import ForwardTripPlanner from '../components/ForwardTripPlanner.tsx';
import TripInformation from '../components/TripInformation.tsx';
import { Alert } from '../components/ui/alert.tsx';
import { LinearProgress } from '../components/ui/progress.tsx';

import { useTrip } from '../apis/trips.ts';
import { useShow } from '../hooks/useShow.ts';
import { useUrlQuery } from '../hooks/useUrlQuery.ts';
import { getCompleteTripEndLocations } from '../utils/trips.ts';

export default function Trip() {
  const query = useUrlQuery();
  const ctxRecon = query.get('ctxRecon');
  const navigate = useNavigate();
  const showInternalPlanner = useShow();
  const { isLoading, data: trip } = useTrip({
    ctxRecon: ctxRecon ?? undefined,
  });

  const handleFavouriteRemoved = () => navigate(-1);

  const { completeTripOrigin: origin, completeTripDestination: destination } =
    useMemo(() => {
      if (trip) return getCompleteTripEndLocations(trip);
      return {
        completeTripOrigin: undefined,
        completeTripDestination: undefined,
      };
    }, [trip]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="trip-page"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className="min-h-screen"
      >
        {/* App Bar */}
        <header className="sticky top-0 z-10 flex items-center gap-2 px-2 py-3 bg-[rgba(14,14,14,0.92)] backdrop-blur border-b border-border">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-2 text-white/70 hover:text-white transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={22} />
          </button>
          <span className="text-sm font-medium text-white/90 flex-1 truncate">
            {origin && destination
              ? `${origin.name} → ${destination.name}`
              : isLoading
                ? 'Fetching information…'
                : 'No information'}
          </span>
        </header>

        {isLoading && <LinearProgress />}

        {trip && (
          <div className="p-2">
            <TripInformation
              trip={trip}
              onFavouriteRemoved={handleFavouriteRemoved}
            />
          </div>
        )}

        {!isLoading && !trip && (
          <div className="p-4">
            <Alert severity="info">
              No information available for current route
            </Alert>
          </div>
        )}

        {trip && !isLoading && (
          <div className="mx-2 mb-4 p-4 bg-surface rounded-2xl border border-border">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showInternalPlanner.visible}
                onChange={showInternalPlanner.toggle}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-white/80">
                Plan another trip from destination
              </span>
            </label>
            <ForwardTripPlanner
              trip={trip}
              show={showInternalPlanner.visible}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
