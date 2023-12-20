import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoadingButton from '@mui/lab/LoadingButton';
import { LinearProgress, Paper, Stack, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import dayjs from 'dayjs';

import SearchFilter from '../components/SearchFilter.tsx';
import TripInfoCard from '../components/TripInfoCard.tsx';

import { useSearchFilterContext } from '../context';
import { useTrips } from '../hooks/useTrips.ts';

export default function TripsInformation() {
  const { via, isArrival, selectedDateTime, destination, origin } =
    useSearchFilterContext();
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
          <Typography variant="caption">
            {selectedDateTime === 'now'
              ? dayjs().format('LL')
              : dayjs(selectedDateTime).format('LL')}
          </Typography>
        </Stack>
      )}
      {isInitialLoading && <LinearProgress />}
      {trips.map((trip, index) => (
        <TripInfoCard key={`trip_info_${index}`} trip={trip} via={via} />
      ))}
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
