/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import StopTiming from './StopTiming.tsx';
import { SlideUpTransition } from './transitions/SlideUp.tsx';
import CloseIcon from '@mui/icons-material/Close';
import { Timeline, TimelineSeparator } from '@mui/lab';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import { Dialog, IconButton, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import { useJourney } from '../apis/trips.ts';

const JourneyTimeline = ({ journey }: { journey: any[] }) => {
  const filteredJourney = journey.filter((stop) => stop.status !== 'PASSING');

  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {filteredJourney.map((stop, index) => (
        <TimelineItem key={stop.id}>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            {index < filteredJourney.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Box>
              <Typography variant="body1">{stop.stop.name}</Typography>
              {stop.arrivals.length > 0 && (
                <StopTiming
                  actualTime={stop.arrivals[0]?.actualTime}
                  plannedTime={stop.arrivals[0]?.plannedTime}
                  variant="caption"
                />
              )}
              <br />
              {stop.departures.length > 0 && (
                <StopTiming
                  actualTime={stop.departures[0]?.actualTime}
                  plannedTime={stop.departures[0]?.plannedTime}
                  variant="caption"
                />
              )}
            </Box>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export const JourneyInformation = ({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) => {
  const journey = useJourney({ id });
  console.log(journey.data);

  return (
    <Dialog
      fullScreen
      open={true}
      onClose={onClose}
      TransitionComponent={SlideUpTransition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Journey information
          </Typography>
        </Toolbar>
      </AppBar>
      <Box>
        {journey.isLoading ? (
          <>Loading...</>
        ) : (
          <JourneyTimeline journey={journey.data.payload.stops} />
        )}
      </Box>
    </Dialog>
  );
};
