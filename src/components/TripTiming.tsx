import { useMemo } from 'react';
import * as React from 'react';

import Timing from './datetime/Timing.tsx';
import { TypographyProps } from '@mui/material';

import { TripLocation } from '../types/trip.ts';
import { makeDateTimeWithDelay } from '../utils/trips.ts';

interface Props extends TypographyProps {
  location: TripLocation;
  direction?: 'column' | 'row';
}

export default function TripTiming({ location, ...rest }: Props) {
  const { formattedTime, delayedTime, isDelayed } = useMemo(() => {
    return makeDateTimeWithDelay(location);
  }, [location]);

  return (
    <Timing
      {...rest}
      originalTime={formattedTime}
      isDelayed={isDelayed}
      delayedTime={delayedTime}
    />
  );
}
