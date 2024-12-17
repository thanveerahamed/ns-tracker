import React, { useMemo } from 'react';

import { Timeline } from '@mui/lab';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Stack, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

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
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {stopsWithoutDestinationAndOrigin.map((stop, index) => (
        <TimelineItem key={index}>
          <TimelineSeparator>
            {index === 0 && (
              <TimelineConnector
                sx={{
                  bgcolor: 'primary.main',
                }}
              />
            )}
            <TimelineDot color="primary" variant={'outlined'} />
            <TimelineConnector
              sx={{
                bgcolor: 'primary.main',
              }}
            />
          </TimelineSeparator>
          <TimelineContent sx={{ alignItems: 'center' }}>
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <StopTiming
                  actualTime={stop.actualArrivalDateTime}
                  plannedTime={stop.plannedArrivalDateTime}
                  variant="caption"
                />
                <StopTiming
                  actualTime={stop.actualDepartureDateTime}
                  plannedTime={stop.plannedDepartureDateTime}
                  variant="caption"
                />
              </Box>
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
            <Divider />
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
