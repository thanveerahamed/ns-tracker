import { useMemo } from 'react';
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

import { useSearchFilterContext } from '../context';
import { useTrips } from '../hooks/useTrips.ts';

export default function TripsInformation() {
  const navigate = useNavigate();
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

  const filteredTrips = useMemo(() => {
    if (via && onlyShowTransferEqualVia) {
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
  }, [onlyShowTransferEqualVia, trips, via]);

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
            onSelect={() => navigate(`/trip?ctxRecon=${trip.ctxRecon}`)}
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
