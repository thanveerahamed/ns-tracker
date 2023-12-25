import DurationDisplay from './DurationDisplay.tsx';
import NumberOfConnectionsDisplay from './NumberOfConnectionsDisplay.tsx';
import TripStartAndEndTime from './TripStartAndEndTime.tsx';
import { TripTimelineView } from './TripTimelineView.tsx';
import { SlideLeftTransition } from './transitions/SlideLeft.tsx';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
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
            <ChevronLeftIcon />
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
                    <TripStartAndEndTime trip={trip} />
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
                <TripTimelineView trip={trip} />
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
