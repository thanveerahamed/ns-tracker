import { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import styled from '@emotion/styled';
import { Chip, CircularProgress } from '@mui/material';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import { auth } from '../../services/firebase.ts';
import { useFavouriteTrip } from '../../services/trip.ts';
import { FavouriteTrip, Trip } from '../../types/trip.ts';
import { extendedDayjs as dayjs } from '../../utils/date.ts';
import TripInfoCard from '../TripInfoCard.tsx';

interface MemoizedTrips {
  old: Trip[];
  upcoming: Trip[];
  current: Trip[];
}

const SectionTitle = styled(Chip)`
  width: 100%;
  border-radius: 0;
  justify-content: flex-start;
`;

const sortDesc = (doc1: Trip, doc2: Trip) =>
  dayjs(doc2.legs[0].origin.actualDateTime).diff(
    dayjs(doc1.legs[0].origin.actualDateTime),
  );

const sortAsc = (doc1: Trip, doc2: Trip) =>
  dayjs(doc1.legs[0].origin.actualDateTime).diff(
    dayjs(doc2.legs[0].origin.actualDateTime),
  );

function FavouriteTripItem(props: { trip: Trip }) {
  const navigate = useNavigate();
  return (
    <List
      subheader={
        <Typography variant="caption" sx={{ pl: 1 }}>
          {dayjs(props.trip.legs[0].origin.actualDateTime).format('LL')}
        </Typography>
      }
    >
      <TripInfoCard
        trip={props.trip}
        onSelect={() => navigate(`/trip?ctxRecon=${props.trip.ctxRecon}`)}
        isFavourite
      />
    </List>
  );
}

export default function FavouriteTrips() {
  const [user] = useAuthState(auth);
  const [favouriteTripsSnapshots, isFavouriteTripsSnapshotsLoading] =
    useFavouriteTrip(user?.uid);

  const trips = useMemo(() => {
    const memoizedTrips = favouriteTripsSnapshots?.docs.reduce(
      (result: MemoizedTrips, tripDoc): MemoizedTrips => {
        const currentTrip = tripDoc.data() as FavouriteTrip;
        const isCurrent = dayjs().isBetween(
          currentTrip.legs[0].origin.actualDateTime,
          currentTrip.legs[currentTrip.legs.length - 1].destination
            .actualDateTime,
          'seconds',
          '[)',
        );

        if (isCurrent) {
          return {
            ...result,
            current: [...result.current, currentTrip],
          };
        }

        const isOld = dayjs(currentTrip.legs[0].origin.actualDateTime).isBefore(
          dayjs(),
        );

        if (isOld) {
          return {
            ...result,
            old: [...result.old, currentTrip],
          };
        } else {
          return {
            ...result,
            upcoming: [...result.upcoming, currentTrip],
          };
        }
      },
      { old: [], upcoming: [], current: [] },
    ) ?? { old: [], upcoming: [], current: [] };

    return {
      old: memoizedTrips.old.sort(sortDesc),
      upcoming: memoizedTrips.upcoming.sort(sortAsc),
      current: memoizedTrips.current.sort(sortAsc),
    };
  }, [favouriteTripsSnapshots]);

  return (
    <>
      {isFavouriteTripsSnapshotsLoading && <CircularProgress />}
      {trips.current.length > 0 && (
        <>
          <SectionTitle label="Current" />
          {trips.current.map((trip, index) => (
            <FavouriteTripItem key={`trip_info_${index}`} trip={trip} />
          ))}
        </>
      )}
      {trips.upcoming.length > 0 && (
        <>
          <SectionTitle label="Upcoming" />
          {trips.upcoming.map((trip, index) => (
            <FavouriteTripItem key={`trip_info_${index}`} trip={trip} />
          ))}
        </>
      )}
      {trips.old.length > 0 && (
        <>
          <SectionTitle label="Old" />
          {trips.old.map((trip, index) => (
            <FavouriteTripItem key={`trip_info_${index}`} trip={trip} />
          ))}
        </>
      )}
    </>
  );
}
