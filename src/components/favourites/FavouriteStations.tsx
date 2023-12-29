import { useMemo } from 'react';
import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import FavouriteStationCard from './FavouriteStationCard.tsx';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';

import { auth } from '../../services/firebase.ts';
import { useFavouriteStation } from '../../services/station.ts';
import { NSStation } from '../../types/station.ts';

export default function FavouriteStations() {
  const [user] = useAuthState(auth);
  const [favouriteStationSnapshots, isFavouriteLoading] = useFavouriteStation(
    user?.uid,
  );

  const favouriteStations: NSStation[] = useMemo(() => {
    return (
      favouriteStationSnapshots?.docs.map((doc) => doc.data() as NSStation) ??
      []
    );
  }, [favouriteStationSnapshots]);

  return (
    <>
      {isFavouriteLoading && <CircularProgress />}
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {favouriteStations.map((station) => {
          return (
            <FavouriteStationCard key={station.UICCode} station={station} />
          );
        })}
      </Box>
    </>
  );
}
