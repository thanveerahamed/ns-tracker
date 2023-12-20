import { useCallback } from 'react';

import CrowdForecast from './CrowdForecast.tsx';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SyncIcon from '@mui/icons-material/Sync';
import TrainIcon from '@mui/icons-material/Train';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import { Chip, Grid, ListItemButton, Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { NSStation } from '../types/station.ts';
import { Trip } from '../types/trip.ts';
import { extendedDayjs } from '../utils/date.ts';
import { makeTripStartAndEndTime } from '../utils/trips.ts';

interface Props {
  trip: Trip;
  via?: NSStation;
  onSelect: (trip: Trip) => void;
}

export default function TripInfoCard({ trip, via, onSelect }: Props) {
  const isChangeInIntermediateStop = useCallback(
    (trip: Trip) => {
      if (trip.legs.length > 1) {
        return Boolean(
          trip.legs.find((leg) => leg.destination.uicCode === via?.UICCode),
        );
      } else {
        return false;
      }
    },
    [via],
  );

  return (
    <ListItem sx={{ padding: '0' }}>
      <ListItemButton
        sx={{ padding: '2px 5px' }}
        onClick={() => onSelect(trip)}
      >
        <Card
          key={trip.idx}
          variant={trip.status === 'CANCELLED' ? 'elevation' : 'outlined'}
          elevation={trip.status === 'CANCELLED' ? 5 : undefined}
          sx={
            trip.status === 'CANCELLED'
              ? { border: '1px solid rgb(118 66 66)', width: '100%' }
              : { width: '100%' }
          }
        >
          {trip.status !== 'NORMAL' && (
            <Alert
              severity="error"
              sx={
                trip.status === 'CANCELLED'
                  ? { backgroundColor: 'rgb(118 66 66)' }
                  : {}
              }
            >
              {trip.status}
            </Alert>
          )}
          <CardContent>
            <Grid container>
              <Grid item xs={9}>
                <Typography variant="h6" component="div">
                  {makeTripStartAndEndTime(trip)}
                </Typography>
                {trip.legs.map((leg, index) => (
                  <Chip
                    sx={{
                      'height': 'auto',
                      '& .MuiChip-label': {
                        display: 'block',
                        whiteSpace: 'normal',
                      },
                      'margin': '5px',
                      'borderRadius': '0',
                    }}
                    key={index}
                    icon={<TrainIcon />}
                    label={`${leg.product.displayName} (Track: ${
                      leg.origin.actualTrack ?? leg.origin.plannedTrack
                    })`}
                    variant="outlined"
                    color="primary"
                  />
                ))}
                {trip.labelListItems && trip.labelListItems.length > 0 && (
                  <Chip
                    label={trip.labelListItems
                      .map((item) => item.label)
                      .join(',')}
                    variant="outlined"
                    sx={{ margin: '5px' }}
                  />
                )}
                {trip.primaryMessage && (
                  <Typography variant="body2" sx={{ color: 'error.main' }}>
                    {trip.primaryMessage.title}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ textAlign: 'right' }}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <AccessTimeIcon />
                    <Stack direction="column" alignItems="center">
                      {trip.actualDurationInMinutes &&
                        trip.actualDurationInMinutes !==
                          trip.plannedDurationInMinutes && (
                          <Typography
                            display="block"
                            sx={{ color: 'secondary.main' }}
                            gutterBottom
                          >
                            {extendedDayjs
                              .duration(trip.actualDurationInMinutes, 'minutes')
                              .format('H[h] m[m]')}
                          </Typography>
                        )}
                      {trip.plannedDurationInMinutes && (
                        <Typography
                          display="block"
                          sx={{
                            color: 'primary.main',
                            textDecoration:
                              trip.actualDurationInMinutes !==
                              trip.plannedDurationInMinutes
                                ? 'line-through'
                                : 'none',
                          }}
                          gutterBottom
                        >
                          {extendedDayjs
                            .duration(trip.plannedDurationInMinutes, 'minutes')
                            .format('H[h] m[m]')}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <SyncIcon />
                      <Typography display="block" gutterBottom>
                        {trip.legs.length - 1}
                      </Typography>
                    </Stack>
                    {trip.crowdForecast !== 'UNKNOWN' && (
                      <Stack direction="row" alignItems="center" gap={1}>
                        <CrowdForecast trip={trip} />
                      </Stack>
                    )}
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1}>
                    {isChangeInIntermediateStop(trip) && (
                      <TransferWithinAStationIcon />
                    )}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions></CardActions>
        </Card>
      </ListItemButton>
    </ListItem>
  );
}
