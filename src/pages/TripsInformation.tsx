import { useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoadingButton from '@mui/lab/LoadingButton';
import { LinearProgress, Paper, Stack, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import dayjs from 'dayjs';

import SearchFilter from '../components/SearchFilter.tsx';
import TripInfoCard from '../components/TripInfoCard.tsx';

import { useTripsInformationContext } from '../context';
import { auth } from '../services/firebase.ts';
import { useFavouriteTrip } from '../services/trip.ts';
import { Trip } from '../types/trip.ts';

export default function TripsInformation() {
  const navigate = useNavigate();
  const {
    isInitialLoading,
    isLoadMoreLoading,
    loadLater,
    loadEarlier,
    trips,
    reload,
    via,
    dateTime,
  } = useTripsInformationContext();

  const [user] = useAuthState(auth);
  const [favouriteTripsSnapshots] = useFavouriteTrip(user?.uid);

  const isFavouriteTrip = useCallback(
    (trip: Trip) => {
      return (
        favouriteTripsSnapshots?.docs
          .map((doc) => doc.data().ctxRecon)
          .includes(trip.ctxRecon) ?? false
      );
    },
    [favouriteTripsSnapshots],
  );

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
        <SearchFilter onSearch={reload} variant="refresh" />
      </Paper>
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
