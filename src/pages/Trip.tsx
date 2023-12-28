import { useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
  CircularProgress,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { AnimatePresence, motion } from 'framer-motion';

import TripInformation from '../components/TripInformation.tsx';

import { useTrip } from '../apis/trips.ts';
import { useSnackbarContext } from '../context';
import { useUrlQuery } from '../hooks/useUrlQuery.ts';
import { auth } from '../services/firebase.ts';
import {
  addFavouriteTrip,
  removeFavouriteTrip,
  useFavouriteTrip,
} from '../services/trip.ts';
import { FavouriteTrip } from '../types/trip.ts';
import { getCompleteTripEndLocations } from '../utils/trips.ts';

export default function Trip() {
  const query = useUrlQuery();
  const ctxRecon = query.get('ctxRecon');
  const navigate = useNavigate();
  const { showNotification } = useSnackbarContext();
  const { isLoading, data: trip } = useTrip({
    ctxRecon: ctxRecon ?? undefined,
  });
  const [user] = useAuthState(auth);
  const [favouriteTripsSnapshots, isFavouriteTripsSnapshotsLoading] =
    useFavouriteTrip(user?.uid);
  const [favouriteTrip, setFavouriteTrip] = useState<
    FavouriteTrip | undefined
  >();
  const { completeTripOrigin: origin, completeTripDestination: destination } =
    useMemo(() => {
      if (trip) {
        return getCompleteTripEndLocations(trip);
      }

      return {
        completeTripOrigin: undefined,
        completeTripDestination: undefined,
      };
    }, [trip]);

  const handleFavouriteClick = () => {
    if (favouriteTrip) {
      removeFavouriteTrip(user?.uid ?? '', favouriteTrip.docId ?? '')
        .then(() => showNotification('Removed from favourite!', 'success'))
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
          const data = doc.data() as FavouriteTrip;
          return {
            ...data,
            docId: doc.id,
          };
        }) ?? []
      ).find((favTrip) => favTrip.ctxRecon === trip?.ctxRecon);

      setFavouriteTrip(result);
    }
  }, [favouriteTripsSnapshots, trip]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ width: '0', x: '100vw' }}
        animate={{ width: '100%', x: 0 }}
        transition={{ duration: 0.5, origin: 0 }}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate('/tripsInformation')}
              aria-label="close"
            >
              <ChevronLeftIcon />
            </IconButton>
            {origin && destination ? (
              <Typography
                sx={{ ml: 2, flex: 1 }}
                variant="subtitle1"
                component="div"
              >
                {origin.name} to {destination.name}
              </Typography>
            ) : (
              <Typography
                sx={{ ml: 2, flex: 1 }}
                variant="subtitle1"
                component="div"
              >
                {isLoading ? 'Fetching information' : 'No information'}
              </Typography>
            )}
            {trip && (
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
            )}
          </Toolbar>
        </AppBar>
        {isLoading && <LinearProgress />}
        {trip && (
          <Box sx={{ padding: '5px 0' }}>
            <TripInformation trip={trip} />
          </Box>
        )}{' '}
        {!isLoading && !trip && (
          <Alert severity="info">
            No information available for current route
          </Alert>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
