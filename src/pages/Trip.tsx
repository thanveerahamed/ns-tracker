import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { IconButton, LinearProgress, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import TripInformation from '../components/TripInformation.tsx';

import { useTrip } from '../apis/trips.ts';
import { useUrlQuery } from '../hooks/useUrlQuery.ts';
import { getCompleteTripEndLocations } from '../utils/trips.ts';

export default function Trip() {
  const query = useUrlQuery();
  const ctxRecon = query.get('ctxRecon');
  const navigate = useNavigate();
  const { isLoading, data: trip } = useTrip({
    ctxRecon: ctxRecon ?? undefined,
  });

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

  return (
    <>
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
    </>
  );
}
