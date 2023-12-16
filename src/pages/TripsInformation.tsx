import { LinearProgress, Paper } from '@mui/material';
import dayjs from 'dayjs';

import SearchFilter from '../components/SearchFilter.tsx';
import TripInfoCard from '../components/TripInfoCard.tsx';

import { useTripsInformation } from '../apis/stations';
import { useSearchFilterContext } from '../context';

export default function TripsInformation() {
  const { via, isArrival, selectedDateTime, destination, origin } =
    useSearchFilterContext();
  const { data, isLoading } = useTripsInformation({
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
        <SearchFilter />
      </Paper>
      {isLoading && <LinearProgress />}
      {data?.trips.map((trip) => (
        <TripInfoCard key={trip.idx} trip={trip} via={via} />
      )) ?? ''}
    </>
  );
}
