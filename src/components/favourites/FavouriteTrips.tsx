import { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { CircularProgress } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import dayjs from 'dayjs';

import { auth } from '../../services/firebase.ts';
import { useFavouriteTrip } from '../../services/trip.ts';
import { FavouriteTrip } from '../../types/trip.ts';
import TripInfoCard from '../TripInfoCard.tsx';

export default function FavouriteTrips() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [favouriteTripsSnapshots, isFavouriteTripsSnapshotsLoading] =
    useFavouriteTrip(user?.uid);

  const trips = useMemo(() => {
    return (
      favouriteTripsSnapshots?.docs
        .map((doc) => {
          const data = doc.data() as FavouriteTrip;
          return {
            ...data,
            docId: doc.id,
          };
        })
        .sort((doc1, doc2) =>
          dayjs(doc2.legs[0].origin.actualDateTime).diff(
            dayjs(doc1.legs[0].origin.actualDateTime),
          ),
        ) ?? []
    );
  }, [favouriteTripsSnapshots]);

  return (
    <>
      {isFavouriteTripsSnapshotsLoading && <CircularProgress />}

      {trips.map((trip, index) => (
        <List
          subheader={dayjs(trip.legs[0].origin.actualDateTime).format('LL')}
        >
          <ListItem sx={{ p: 0 }}>
            <TripInfoCard
              key={`trip_info_${index}`}
              trip={trip}
              onSelect={() => navigate(`/trip?ctxRecon=${trip.ctxRecon}`)}
              isFavourite
            />
          </ListItem>
        </List>
      ))}
    </>
  );
}
