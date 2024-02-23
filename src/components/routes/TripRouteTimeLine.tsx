import React, { useMemo } from 'react';

import { Timeline } from '@mui/lab';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Stack, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import { Stop } from '../../types/trip.ts';
import StopTiming from '../StopTiming.tsx';
import Track from '../Track.tsx';

export default function TripRouteTimeLine({ stops }: { stops: Stop[] }) {
  const stopsWithoutDestinationAndOrigin = useMemo(() => {
    return stops.slice(1, -1).filter((stop) => !stop.passing);
  }, [stops]);

  if (stopsWithoutDestinationAndOrigin.length === 0) {
    return (
      <Alert variant="outlined" severity="info">
        Single stop journey
      </Alert>
    );
  }

  return (
    <Timeline
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: {
          flex: 0.4,
        },
        padding: 0,
      }}
    >
      {stopsWithoutDestinationAndOrigin.map((stop, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent
            color="textSecondary"
            sx={{ paddingLeft: '5px', paddingRight: '5px' }}
          >
            <StopTiming
              actualTime={stop.actualArrivalDateTime}
              plannedTime={stop.plannedArrivalDateTime}
              variant="caption"
            />
            <br />
            <StopTiming
              actualTime={stop.actualDepartureDateTime}
              plannedTime={stop.plannedDepartureDateTime}
              variant="caption"
            />
          </TimelineOppositeContent>
          <TimelineSeparator>
            {index === 0 && (
              <TimelineConnector
                sx={{
                  bgcolor: 'primary.main',
                }}
              />
            )}
            <TimelineDot color="primary" />
            <TimelineConnector
              sx={{
                bgcolor: 'primary.main',
              }}
            />
          </TimelineSeparator>
          <TimelineContent sx={{ alignItems: 'center' }}>
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <Typography sx={{ color: 'primary.main' }}>
                  {stop.name}
                </Typography>
                <Track
                  plannedTrack={stop.plannedArrivalTrack}
                  actualTrack={stop.actualArrivalTrack}
                />
              </Box>
            </Stack>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
