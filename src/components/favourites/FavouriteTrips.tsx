import { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import styled from '@emotion/styled';
import { Chip, CircularProgress } from '@mui/material';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import { useSnackbarContext } from '../../context';
import { auth } from '../../services/firebase.ts';
import { removeFavouriteTrip, useFavouriteTrip } from '../../services/trip.ts';
import { FavouriteTrip } from '../../types/trip.ts';
import { extendedDayjs as dayjs } from '../../utils/date.ts';
import TripInfoCard from '../TripInfoCard.tsx';

interface MemoizedTrips {
  old: FavouriteTrip[];
  upcoming: FavouriteTrip[];
  current: FavouriteTrip[];
}

const SectionTitle = styled(Chip)`
  width: 100%;
  border-radius: 0;
  justify-content: flex-start;
`;

const sortDesc = (doc1: FavouriteTrip, doc2: FavouriteTrip) =>
  dayjs(doc2.legs[0].origin.actualDateTime).diff(
    dayjs(doc1.legs[0].origin.actualDateTime),
  );

const sortAsc = (doc1: FavouriteTrip, doc2: FavouriteTrip) =>
  dayjs(doc1.legs[0].origin.actualDateTime).diff(
    dayjs(doc2.legs[0].origin.actualDateTime),
  );

function FavouriteTripItem(props: {
  trip: FavouriteTrip;
  onRemove: (tripToRemove: FavouriteTrip) => void;
}) {
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
        actions={[
          {
            color: 'secondary',
            onClick: (event) => {
              event.stopPropagation();
              props.onRemove(props.trip);
            },
            name: 'Remove',
          },
        ]}
      />
    </List>
  );
}

export default function FavouriteTrips() {
  const [user] = useAuthState(auth);
  const { showNotification } = useSnackbarContext();
  const [favouriteTripsSnapshots, isFavouriteTripsSnapshotsLoading] =
    useFavouriteTrip(user?.uid);

  const trips = useMemo(() => {
    const memoizedTrips = favouriteTripsSnapshots?.docs.reduce(
      (result: MemoizedTrips, tripDoc): MemoizedTrips => {
        const tripData = tripDoc.data() as { trip: string };
        const tripDocId = tripDoc.id;
        const currentTrip = {
          ...JSON.parse(tripData.trip),
          docId: tripDocId,
        } as FavouriteTrip;
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

  const handleRemoveFavourite = (tripToRemove: FavouriteTrip) => {
    if (user?.uid) {
      removeFavouriteTrip(user.uid, tripToRemove.docId)
        .then(() => showNotification('Removed from favourite!', 'success'))
        .catch(() => showNotification('Some error occurred!', 'error'));
    }
  };

  return (
    <>
      {isFavouriteTripsSnapshotsLoading && <CircularProgress />}
      {trips.current.length > 0 && (
        <>
          <SectionTitle label="Current" />
          {trips.current.map((trip, index) => (
            <FavouriteTripItem
              key={`trip_info_current_${index}`}
              trip={trip}
              onRemove={handleRemoveFavourite}
            />
          ))}
        </>
      )}
      {trips.upcoming.length > 0 && (
        <>
          <SectionTitle label="Upcoming" />
          {trips.upcoming.map((trip, index) => (
            <FavouriteTripItem
              key={`trip_info_upcoming_${index}`}
              trip={trip}
              onRemove={handleRemoveFavourite}
            />
          ))}
        </>
      )}
      {trips.old.length > 0 && (
        <>
          <SectionTitle label="Old" />
          {trips.old.map((trip, index) => (
            <FavouriteTripItem
              key={`trip_info_old_${index}`}
              trip={trip}
              onRemove={handleRemoveFavourite}
            />
          ))}
        </>
      )}
      {!isFavouriteTripsSnapshotsLoading &&
        favouriteTripsSnapshots?.size === 0 && (
          <Typography p={2}>No favourites.</Typography>
        )}
    </>
  );
}
