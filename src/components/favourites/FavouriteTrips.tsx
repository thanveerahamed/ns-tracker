import { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import styled from '@emotion/styled';
import { Chip, CircularProgress } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { auth } from '../../services/firebase.ts';
import { useFavouriteTrip } from '../../services/trip.ts';
import { FavouriteTrip, Trip } from '../../types/trip.ts';
import TripInfoCard from '../TripInfoCard.tsx';

interface MemoizedTrips {
  old: Trip[];
  upcoming: Trip[];
}

const SectionTitle = styled(Chip)`
  width: 100%;
  border-radius: 0;
  justify-content: flex-start;
`;

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
      <ListItem sx={{ p: 0 }}>
        <TripInfoCard
          trip={props.trip}
          onSelect={() => navigate(`/trip?ctxRecon=${props.trip.ctxRecon}`)}
          isFavourite
        />
      </ListItem>
    </List>
  );
}

export default function FavouriteTrips() {
  const [user] = useAuthState(auth);
  const [favouriteTripsSnapshots, isFavouriteTripsSnapshotsLoading] =
    useFavouriteTrip(user?.uid);

  const trips = useMemo(() => {
    return (
      favouriteTripsSnapshots?.docs.reduce(
        (result: MemoizedTrips, tripDoc): MemoizedTrips => {
          const currentTrip = tripDoc.data() as FavouriteTrip;
          const isOld = dayjs(
            currentTrip.legs[0].origin.actualDateTime,
          ).isBefore(dayjs());

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
        { old: [], upcoming: [] },
      ) ?? { old: [], upcoming: [] }
    );
  }, [favouriteTripsSnapshots]);

  return (
    <>
      {isFavouriteTripsSnapshotsLoading && <CircularProgress />}
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
