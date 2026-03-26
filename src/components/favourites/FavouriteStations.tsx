import { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import FavouriteStationCard from './FavouriteStationCard.tsx';

import { auth } from '../../services/firebase.ts';
import { useFavouriteStation } from '../../services/station.ts';
import { NSStation } from '../../types/station.ts';
import { LinearProgress } from '../ui/progress.tsx';

export default function FavouriteStations() {
  const [user] = useAuthState(auth);
  const [favouriteStationSnapshots, isFavouriteLoading] = useFavouriteStation(
    user?.uid,
  );

  const favouriteStations: NSStation[] = useMemo(
    () =>
      favouriteStationSnapshots?.docs.map((doc) => doc.data() as NSStation) ??
      [],
    [favouriteStationSnapshots],
  );

  return (
    <div className="p-3">
      {isFavouriteLoading && <LinearProgress />}
      <div className="grid grid-cols-3 gap-2">
        {favouriteStations.map((station) => (
          <FavouriteStationCard key={station.UICCode} station={station} />
        ))}
      </div>
    </div>
  );
}
