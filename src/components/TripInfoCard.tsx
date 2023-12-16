import { useCallback } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Groups3Icon from '@mui/icons-material/Groups3';
import SyncIcon from '@mui/icons-material/Sync';
import TrainIcon from '@mui/icons-material/Train';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import { Chip, Grid, Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { NSStation } from '../types/station.ts';
import { NSLocation, Trip } from '../types/trip.ts';
import { extendedDayjs } from '../utils/date.ts';

interface Props {
  trip: Trip;
  via?: NSStation;
}

export default function TripInfoCard({ trip, via }: Props) {
  const makeDateTimeWithDelay = (location: NSLocation) => {
    const delayTimeString =
      location.actualDateTime &&
      dayjs(location.plannedDateTime).diff(location.actualDateTime) !== 0
        ? dayjs(location.plannedDateTime).diff(location.actualDateTime)
        : '';
    return `${dayjs(location.plannedDateTime).format('LT')}${delayTimeString}`;
  };
  const makeTripStartAndEndTime = useCallback((trip: Trip) => {
    const legsOriginDestination = trip.legs.map(({ origin, destination }) => ({
      origin,
      destination,
    }));
    const currentTripOrigin = legsOriginDestination[0].origin;
    const currentTripDestination =
      legsOriginDestination[legsOriginDestination.length - 1].destination;

    return `${makeDateTimeWithDelay(
      currentTripOrigin,
    )} - ${makeDateTimeWithDelay(currentTripDestination)}`;
  }, []);

  const getCrowdStatusColor = useCallback((trip: Trip) => {
    const { crowdForecast } = trip;
    if (crowdForecast === 'HIGH') {
      return 'error';
    }

    if (crowdForecast === 'MEDIUM') {
      return 'warning';
    }

    if (crowdForecast === 'LOW') {
      return 'success';
    }

    return 'inherit';
  }, []);

  const isChangeInIntermediateStop = useCallback(
    (trip: Trip) => {
      if (trip.legs.length > 1) {
        return Boolean(
          trip.legs.find((leg) => leg.destination.uicCode === via?.UICCode),
        );
      } else {
        return false;
      }
    },
    [via],
  );

  return (
    <Card key={trip.idx} variant="outlined">
      {trip.status !== 'NORMAL' && (
        <Alert severity="error">{trip.status}</Alert>
      )}
      <CardContent>
        <Grid container>
          <Grid item xs={9}>
            <Typography variant="h6" component="div">
              {makeTripStartAndEndTime(trip)}
            </Typography>
            {trip.legs.map((leg, index) => (
              <Chip
                key={index}
                icon={<TrainIcon />}
                label={`${leg.product.displayName} (Track: ${
                  leg.origin.actualTrack ?? leg.origin.plannedTrack
                })`}
                variant="outlined"
                color="primary"
                sx={{ margin: '5px', borderRadius: '0' }}
              />
            ))}
            {trip.labelListItems && trip.labelListItems.length > 0 && (
              <Chip
                label={trip.labelListItems.map((item) => item.label).join(',')}
                variant="outlined"
                sx={{ margin: '5px' }}
              />
            )}
            {trip.primaryMessage && (
              <Typography variant="body2" sx={{ color: 'error.main' }}>
                {trip.primaryMessage.title}
              </Typography>
            )}
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'right' }}>
              <Stack direction="row" alignItems="center" gap={1}>
                <AccessTimeIcon />
                <Stack direction="column" alignItems="center">
                  {trip.actualDurationInMinutes &&
                    trip.actualDurationInMinutes !==
                      trip.plannedDurationInMinutes && (
                      <Typography
                        display="block"
                        sx={{ color: 'secondary.main' }}
                        gutterBottom
                      >
                        {extendedDayjs
                          .duration(trip.actualDurationInMinutes, 'minutes')
                          .format('H[h] m[m]')}
                      </Typography>
                    )}
                  {trip.plannedDurationInMinutes && (
                    <Typography
                      display="block"
                      sx={{
                        color: 'primary.main',
                        textDecoration:
                          trip.actualDurationInMinutes !==
                          trip.plannedDurationInMinutes
                            ? 'line-through'
                            : 'none',
                      }}
                      gutterBottom
                    >
                      {extendedDayjs
                        .duration(trip.plannedDurationInMinutes, 'minutes')
                        .format('H[h] m[m]')}
                    </Typography>
                  )}
                </Stack>
              </Stack>
              <Stack direction="row" alignItems="center" gap={1}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <SyncIcon />
                  <Typography display="block" gutterBottom>
                    {trip.legs.length - 1}
                  </Typography>
                </Stack>
                {trip.crowdForecast !== 'UNKNOWN' && (
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Groups3Icon color={getCrowdStatusColor(trip)} />
                  </Stack>
                )}
              </Stack>
              <Stack direction="row" alignItems="center" gap={1}>
                {isChangeInIntermediateStop(trip) && (
                  <TransferWithinAStationIcon />
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
}
