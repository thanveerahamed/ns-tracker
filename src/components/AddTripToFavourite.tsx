import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { CircularProgress, IconButton } from '@mui/material';

import { useSnackbarContext } from '../context';
import { auth } from '../services/firebase.ts';
import {
  addFavouriteTrip,
  removeFavouriteTrip,
  useFavouriteTrip,
} from '../services/trip.ts';
import { FavouriteTrip, Trip } from '../types/trip.ts';

interface Props {
  trip?: Trip;
  onFavouriteRemoved?: () => void;
}
export default function AddTripToFavourite({
  trip,
  onFavouriteRemoved,
}: Props) {
  const { showNotification } = useSnackbarContext();
  const [user] = useAuthState(auth);
  const [favouriteTripsSnapshots, isFavouriteTripsSnapshotsLoading] =
    useFavouriteTrip(user?.uid);
  const [favouriteTrip, setFavouriteTrip] = useState<
    FavouriteTrip | undefined
  >();

  const handleFavouriteClick = () => {
    if (favouriteTrip) {
      removeFavouriteTrip(user?.uid ?? '', favouriteTrip.docId ?? '')
        .then(() => {
          showNotification('Removed from favourite!', 'success');

          if (onFavouriteRemoved) {
            onFavouriteRemoved();
          }
        })
        .catch(() => showNotification('Some error occurred!', 'error'));
    } else {
      addFavouriteTrip(user?.uid ?? '', trip!)
        .then(() => showNotification('Added to favourite!', 'success'))
        .catch(() => showNotification('Some error occurred!', 'error'));
    }
  };

  useEffect(() => {
    if (trip?.ctxRecon) {
      const result = (
        favouriteTripsSnapshots?.docs.map((doc) => {
          const data = doc.data() as { trip: string };
          return {
            ...(JSON.parse(data.trip) as FavouriteTrip),
            docId: doc.id,
          };
        }) ?? []
      ).find((favTrip) => favTrip.ctxRecon === trip?.ctxRecon);

      setFavouriteTrip(result);
    }
  }, [favouriteTripsSnapshots, trip]);

  if (trip == undefined || trip.status === 'CANCELLED') {
    return <></>;
  }

  return (
    <IconButton
      edge="start"
      color="inherit"
      onClick={handleFavouriteClick}
      aria-label="close"
    >
      {isFavouriteTripsSnapshotsLoading ? (
        <CircularProgress size={24} />
      ) : favouriteTrip ? (
        <StarIcon />
      ) : (
        <StarBorderIcon />
      )}
    </IconButton>
  );
}
