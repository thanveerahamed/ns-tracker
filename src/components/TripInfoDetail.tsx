import CrowdForecast from './CrowdForecast.tsx';
import DurationDisplay from './DurationDisplay.tsx';
import NumberOfConnectionsDisplay from './NumberOfConnectionsDisplay.tsx';
import TripStartAndEndTime from './TripStartAndEndTime.tsx';
import TrainIcon from '@mui/icons-material/Train';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import { Chip, Grid, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Trip } from '../types/trip.ts';
import { getColorFromNesProperties } from '../utils/trips.ts';

export function TripInfoDetail({
  trip,
  isChangeInIntermediateStop,
}: {
  trip: Trip;
  isChangeInIntermediateStop: boolean;
}) {
  return (
    <Grid container>
      <Grid item xs={9}>
        <TripStartAndEndTime trip={trip} />
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
            label={trip.labelListItems.map((item) => item.label).join(',')}
            variant="outlined"
            sx={{ margin: '5px' }}
          />
        )}
        {trip.primaryMessage && (
          <Typography
            variant="body2"
            sx={{
              color: getColorFromNesProperties(
                trip.primaryMessage.nesProperties,
              ),
            }}
          >
            {trip.primaryMessage.title}
          </Typography>
        )}
      </Grid>
      <Grid item xs={3}>
        <Box sx={{ textAlign: 'right' }}>
          <DurationDisplay trip={trip} />
          <Stack direction="row" alignItems="center" gap={1}>
            <NumberOfConnectionsDisplay connections={trip.legs.length - 1} />
            {trip.crowdForecast !== 'UNKNOWN' && (
              <Stack direction="row" alignItems="center" gap={1}>
                <CrowdForecast crowdForecast={trip.crowdForecast} />
              </Stack>
            )}
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            {isChangeInIntermediateStop && <TransferWithinAStationIcon />}
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}
