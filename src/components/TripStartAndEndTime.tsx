import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';

import TripTiming from './TripTiming.tsx';

import { Trip } from '../types/trip.ts';
import { getCompleteTripEndLocations } from '../utils/trips.ts';

export default function TripStartAndEndTime({
  trip,
  large,
}: {
  trip: Trip;
  large?: boolean;
}) {
  const { completeTripOrigin, completeTripDestination } = useMemo(() => {
    return getCompleteTripEndLocations(trip);
  }, [trip]);

  const cls = large ? 'text-[17px] font-bold' : 'text-sm font-semibold';

  return (
    <div className="flex items-center gap-1.5">
      <TripTiming
        location={completeTripOrigin}
        className={cls}
        direction="row"
      />
      <ArrowRight size={large ? 14 : 12} className="text-white/25 shrink-0" />
      <TripTiming
        location={completeTripDestination}
        className={cls}
        direction="row"
      />
    </div>
  );
}
