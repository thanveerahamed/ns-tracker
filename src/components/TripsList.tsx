import { useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import TripInfoCard from './TripInfoCard.tsx';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoadingButton from '@mui/lab/LoadingButton';
import { LinearProgress, Stack, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import dayjs from 'dayjs';

import { TripsInformationContextValue } from '../context/TripsInformationContext.tsx';
import { auth } from '../services/firebase.ts';
import { useFavouriteTrip } from '../services/trip.ts';
import { FavouriteTrip, Trip } from '../types/trip.ts';

type Props = Omit<
  TripsInformationContextValue,
  'reload' | 'updateRecentSearch'
>;

export default function TripsList({
  isInitialLoading,
  isLoadMoreLoading,
  loadLater,
  loadEarlier,
  trips,
  via,
  dateTime,
}: Props) {
  const navigate = useNavigate();

  const [user] = useAuthState(auth);
  const [favouriteTripsSnapshots] = useFavouriteTrip(user?.uid);

  const isFavouriteTrip = useCallback(
    (trip: Trip) => {
      return (
        favouriteTripsSnapshots?.docs
          .map((doc) => {
            const data = doc.data() as { trip: string };
            return (JSON.parse(data.trip) as FavouriteTrip).ctxRecon;
          })
          .includes(trip.ctxRecon) ?? false
      );
    },
    [favouriteTripsSnapshots],
  );

  return (
    <>
      {!isInitialLoading && (
        <Stack direction="row" justifyContent="space-between">
          <LoadingButton
            size="small"
            onClick={loadEarlier}
            startIcon={<ExpandLessIcon />}
            loading={isLoadMoreLoading}
            loadingPosition="start"
            color="secondary"
          >
            Earlier
          </LoadingButton>
          <Typography variant="subtitle1">
            {dateTime === 'now'
              ? dayjs().format('LL')
              : dayjs(dateTime).format('LL')}
          </Typography>
        </Stack>
      )}
      {isInitialLoading && <LinearProgress />}
      <List>
        {trips.map((trip, index) => (
          <TripInfoCard
            key={`trip_info_${index}`}
            trip={trip}
            via={via}
            onSelect={() => navigate(`/trip?ctxRecon=${trip.ctxRecon}`)}
            isFavourite={isFavouriteTrip(trip)}
          />
        ))}
      </List>
      {!isInitialLoading && trips.length === 0 && (
        <Alert color="info">No trips match current search criteria.</Alert>
      )}
      {!isInitialLoading && (
        <LoadingButton
          size="small"
          onClick={loadLater}
          startIcon={<ExpandMoreIcon />}
          loading={isLoadMoreLoading}
          loadingPosition="start"
          color="secondary"
        >
          Later
        </LoadingButton>
      )}
    </>
  );
}
