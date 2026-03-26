import { useMemo } from 'react';

import Timing from './datetime/Timing.tsx';

import { TripLocation } from '../types/trip.ts';
import { makeDateTimeWithDelay } from '../utils/trips.ts';

interface Props {
  location: TripLocation;
  direction?: 'column' | 'row';
  className?: string;
}

export default function TripTiming({ location, direction, className }: Props) {
  const { formattedTime, delayedTime, isDelayed } = useMemo(() => {
    return makeDateTimeWithDelay(location);
  }, [location]);

  return (
    <Timing
      className={className}
      direction={direction}
      originalTime={formattedTime}
      isDelayed={isDelayed}
      delayedTime={delayedTime}
    />
  );
}
