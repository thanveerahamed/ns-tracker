import { Loader2, Star, StarOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

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
  const [favouriteTripsSnapshots, isLoading] = useFavouriteTrip(user?.uid);
  const [favouriteTrip, setFavouriteTrip] = useState<
    FavouriteTrip | undefined
  >();

  const handleClick = () => {
    if (favouriteTrip) {
      removeFavouriteTrip(user?.uid ?? '', favouriteTrip.docId ?? '')
        .then(() => {
          showNotification('Removed from favourite!', 'success');
          onFavouriteRemoved?.();
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
          return { ...(JSON.parse(data.trip) as FavouriteTrip), docId: doc.id };
        }) ?? []
      ).find((f) => f.ctxRecon === trip.ctxRecon);
      setFavouriteTrip(result);
    }
  }, [favouriteTripsSnapshots, trip]);

  if (!trip || trip.status === 'CANCELLED') return null;

  return (
    <button
      onClick={handleClick}
      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-2 text-white/60 hover:text-white transition-colors"
      aria-label="Toggle favourite"
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin text-primary" />
      ) : favouriteTrip ? (
        <Star size={18} className="text-primary fill-primary" />
      ) : (
        <StarOff size={18} />
      )}
    </button>
  );
}
