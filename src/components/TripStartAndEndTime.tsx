import { useMemo } from 'react';

import TripTiming from './TripTiming.tsx';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Stack, TypographyVariant } from '@mui/material';

import { Trip } from '../types/trip.ts';
import { getCompleteTripEndLocations } from '../utils/trips.ts';

export default function TripStartAndEndTime({
  trip,
  variant = 'h6',
}: {
  trip: Trip;
  variant?: TypographyVariant;
}) {
  const { completeTripOrigin, completeTripDestination } = useMemo(() => {
    return getCompleteTripEndLocations(trip);
  }, [trip]);

  return (
    <Stack direction="row" alignItems="center">
      <TripTiming
        location={completeTripOrigin}
        variant={variant}
        sx={{ marginRight: '2px' }}
      />
      <ArrowForwardIcon />
      <TripTiming
        location={completeTripDestination}
        variant={variant}
        sx={{ marginLeft: '2px' }}
      />
    </Stack>
  );
}
