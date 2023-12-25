import DurationDisplay from './DurationDisplay.tsx';
import NumberOfConnectionsDisplay from './NumberOfConnectionsDisplay.tsx';
import TripStartAndEndTime from './TripStartAndEndTime.tsx';
import { TripTimelineView } from './timelineView/TripTimelineView.tsx';
import {
  AlertColor,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import dayjs from 'dayjs';

import { Trip } from '../types/trip.ts';
import { getColorFromNesProperties } from '../utils/trips.ts';

interface Props {
  trip: Trip;
}

export default function TripInformation({ trip }: Props) {
  return (
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
              <NumberOfConnectionsDisplay connections={trip.legs.length - 1} />
              <DurationDisplay trip={trip} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card variant="elevation">
        {trip.primaryMessage && (
          <CardHeader
            title={
              <Alert
                severity={
                  getColorFromNesProperties(
                    trip.primaryMessage.nesProperties,
                  ) as AlertColor
                }
              >
                {trip.primaryMessage.title}
              </Alert>
            }
          />
        )}
        <CardContent sx={{ p: 0, pb: '0px !important' }}>
          <TripTimelineView trip={trip} />
        </CardContent>
      </Card>
    </>
  );
}
