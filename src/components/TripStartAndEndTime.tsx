import { useMemo } from 'react';

import TripTiming from './TripTiming.tsx';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Stack } from '@mui/material';

import { Trip } from '../types/trip.ts';
import { getCompleteTripEndLocations } from '../utils/trips.ts';

export default function TripStartAndEndTime({ trip }: { trip: Trip }) {
  const { completeTripOrigin, completeTripDestination } = useMemo(() => {
    return getCompleteTripEndLocations(trip);
  }, [trip]);

  return (
    <Stack direction="row" alignItems="center">
      <TripTiming
        location={completeTripOrigin}
        variant="h6"
        sx={{ marginRight: '2px' }}
      />
      <ArrowForwardIcon />
      <TripTiming
        location={completeTripDestination}
        variant="h6"
        sx={{ marginLeft: '2px' }}
      />
    </Stack>
  );
}
