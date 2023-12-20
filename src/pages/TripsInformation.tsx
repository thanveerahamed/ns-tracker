import { useMemo, useState } from 'react';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoadingButton from '@mui/lab/LoadingButton';
import { LinearProgress, Paper, Stack, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import dayjs from 'dayjs';

import SearchFilter from '../components/SearchFilter.tsx';
import TripInfoCard from '../components/TripInfoCard.tsx';
import TripInformation from '../components/TripInformation.tsx';

import { useSearchFilterContext } from '../context';
import { useTrips } from '../hooks/useTrips.ts';
import { Trip } from '../types/trip.ts';

export default function TripsInformation() {
  const {
    via,
    isArrival,
    selectedDateTime,
    destination,
    origin,
    onlyShowTransferEqualVia,
  } = useSearchFilterContext();
  const {
    trips,
    isLoadMoreLoading,
    isInitialLoading,
    loadLater,
    loadEarlier,
    reload,
  } = useTrips({
    viaUicCode: via?.UICCode,
    searchForArrival: isArrival,
    dateTime: selectedDateTime === 'now' ? dayjs() : dayjs(selectedDateTime),
    destinationUicCode: destination?.UICCode,
    originUicCode: origin?.UICCode,
  });

  const [selectedTrip, setSelectedTrip] = useState<Trip | undefined>(undefined);

  const filteredTrips = useMemo(() => {
    if (onlyShowTransferEqualVia) {
      return trips.filter((trip) => {
        if (trip.legs.length > 1) {
          return Boolean(
            trip.legs.find((leg) => leg.destination.uicCode === via?.UICCode),
          );
        } else {
          return false;
        }
      });
    }

    return trips;
  }, [onlyShowTransferEqualVia, trips, via?.UICCode]);

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
        <SearchFilter onSearch={reload} />
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
            {selectedDateTime === 'now'
              ? dayjs().format('LL')
              : dayjs(selectedDateTime).format('LL')}
          </Typography>
        </Stack>
      )}
      {isInitialLoading && <LinearProgress />}
      <List>
        {filteredTrips.map((trip, index) => (
          <TripInfoCard
            key={`trip_info_${index}`}
            trip={trip}
            via={via}
            onSelect={(newTrip) => setSelectedTrip(newTrip)}
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
      <TripInformation
        trip={selectedTrip}
        onClose={() => setSelectedTrip(undefined)}
        origin={origin}
        destination={destination}
      />
    </>
  );
}
