import { useCallback } from 'react';

import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Stack, Typography } from '@mui/material';

import { Leg } from '../../types/trip.ts';
import { isInValidLeg } from '../../utils/trips.ts';
import TripTiming from '../TripTiming.tsx';

export default function DestinationLegTimeLineItem({
  destinationLeg,
}: {
  destinationLeg: Leg;
}) {
  const getTimeLineDotColor = useCallback(() => {
    if (isInValidLeg(destinationLeg)) {
      return 'error';
    }

    return 'primary';
  }, [destinationLeg]);

  const getCurrentLegColor = useCallback(() => {
    if (isInValidLeg(destinationLeg)) {
      return 'error.main';
    }

    return 'primary.main';
  }, [destinationLeg]);

  return (
    <TimelineItem>
      <TimelineOppositeContent color="textSecondary">
        <TripTiming location={destinationLeg.destination} />
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot color={getTimeLineDotColor()} />
      </TimelineSeparator>
      <TimelineContent>
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ color: getCurrentLegColor() }}>
            {destinationLeg.destination.name}
          </Typography>
          <Typography sx={{ color: 'primary.main' }}>
            Track:{' '}
            {destinationLeg.destination.actualTrack ??
              destinationLeg.destination.plannedTrack}
          </Typography>
        </Stack>
        {destinationLeg.destination.exitSide && (
          <Typography variant="caption">
            Exit side: {destinationLeg.destination.exitSide}
          </Typography>
        )}
      </TimelineContent>
    </TimelineItem>
  );
}
