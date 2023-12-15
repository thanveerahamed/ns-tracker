import TrainIcon from '@mui/icons-material/Train';
import { Chip, LinearProgress, Paper } from '@mui/material';
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
            <Typography variant="h6" component="div">
              {makeTripStartAndEndTime(trip)}
            </Typography>
            {getTrainNames(trip).map((brief) => (
              <Chip
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
          </CardContent>
          <CardActions></CardActions>
        </Card>
      )) ?? ''}
    </>
  );
}
