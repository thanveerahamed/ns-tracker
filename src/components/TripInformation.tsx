import DurationDisplay from './DurationDisplay.tsx';
import NumberOfConnectionsDisplay from './NumberOfConnectionsDisplay.tsx';
import { SlideLeftTransition } from './transitions/SlideLeft.tsx';
import CloseIcon from '@mui/icons-material/Close';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import {
  Card,
  CardContent,
  Dialog,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import dayjs from 'dayjs';

import { NSStation } from '../types/station.ts';
import { Trip } from '../types/trip.ts';
import { makeTripStartAndEndTime } from '../utils/trips.ts';

interface Props {
  trip?: Trip;
  onClose: () => void;
  origin?: NSStation;
  destination?: NSStation;
}

export default function TripInformation({
  trip,
  onClose,
  origin,
  destination,
}: Props) {
  const open = Boolean(trip);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={SlideLeftTransition}
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
            {origin?.namen.kort} to {destination?.namen.kort}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: '5px 0' }}>
        {trip ? (
          <>
            <Card variant="elevation" sx={{ mb: 2 }}>
              <CardContent>
                <Grid container>
                  <Grid item xs={9}>
                    <Typography variant="h6" component="div">
                      {makeTripStartAndEndTime(trip)}
                    </Typography>
                    <Typography variant="body1" component="div">
                      {dayjs(trip.legs[0].origin.plannedDateTime).format('LL')}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <NumberOfConnectionsDisplay
                      connections={trip.legs.length - 1}
                    />
                    <DurationDisplay trip={trip} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card variant="elevation">
              <CardContent sx={{ p: 0, pb: '0px !important' }}>
                <Timeline
                  sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                      flex: 0.2,
                    },
                    padding: 0,
                  }}
                >
                  {trip.legs.map((leg) => (
                    <TimelineItem>
                      <TimelineOppositeContent color="textSecondary">
                        {dayjs(leg.origin.plannedDateTime).format('hh:mm a')}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>{leg.origin.name}</TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </CardContent>
            </Card>
          </>
        ) : (
          <Typography>Cannot display the information</Typography>
        )}
      </Box>
    </Dialog>
  );
}
