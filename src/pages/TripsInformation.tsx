import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Groups3Icon from '@mui/icons-material/Groups3';
import SyncIcon from '@mui/icons-material/Sync';
import TrainIcon from '@mui/icons-material/Train';
import { Chip, Grid, LinearProgress, Paper, Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import SearchFilter from '../components/SearchFilter.tsx';

import { useTripsInformation } from '../apis/stations';
import { useSearchFilterContext } from '../context';
import { Trip } from '../types/trip.ts';
import { extendedDayjs } from '../utils/date.ts';

const getCrowdStatusColor = (forecast: string) => {
  if (forecast === 'HIGH') {
    return 'error';
  }

  if (forecast === 'MEDIUM') {
    return 'warning';
  }

  if (forecast === 'LOW') {
    return 'success';
  }

  return 'inherit';
};

export default function TripsInformation() {
  const { via, isArrival, selectedDateTime, destination, origin } =
    useSearchFilterContext();
  const { data, isLoading } = useTripsInformation({
    viaUicCode: via?.UICCode,
    searchForArrival: isArrival,
    dateTime:
      selectedDateTime === undefined && selectedDateTime === 'now'
        ? dayjs()
        : dayjs(selectedDateTime),
    destinationUicCode: destination?.UICCode,
    originUicCode: origin?.UICCode,
  });

  const makeTripStartAndEndTime = (trip: Trip) => {
    const legsOriginDestination = trip.legs.map(({ origin, destination }) => ({
      origin,
      destination,
    }));
    const currentTripOrigin = legsOriginDestination[0].origin;
    const currentTripDestination =
      legsOriginDestination[legsOriginDestination.length - 1].destination;

    return `${dayjs(
      currentTripOrigin.actualDateTime ?? currentTripOrigin.plannedDateTime,
    ).format('LT')} - ${dayjs(
      currentTripDestination.actualDateTime ??
        currentTripDestination.plannedDateTime,
    ).format('LT')}`;
  };

  const getTrainNames = (trip: Trip) => {
    return trip.legs.map((leg) => leg.product.displayName);
  };

  return (
    <>
      <Paper
        variant="elevation"
        elevation={10}
        sx={{
          paddingBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <SearchFilter />
      </Paper>
      {isLoading && <LinearProgress />}
      {data?.trips.map((trip) => (
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
                {getTrainNames(trip).map((brief, index) => (
                  <Chip
                    key={index}
                    icon={<TrainIcon />}
                    label={brief}
                    variant="outlined"
                    sx={{ margin: '5px' }}
                  />
                ))}
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
                        <Groups3Icon
                          color={getCrowdStatusColor(trip.crowdForecast)}
                        />
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions></CardActions>
        </Card>
      )) ?? ''}
    </>
  );
}
