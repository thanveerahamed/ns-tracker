import CrowdForecast from './CrowdForecast.tsx';
import DurationDisplay from './DurationDisplay.tsx';
import NumberOfConnectionsDisplay from './NumberOfConnectionsDisplay.tsx';
import TripStartAndEndTime from './TripStartAndEndTime.tsx';
import StarIcon from '@mui/icons-material/Star';
import TrainIcon from '@mui/icons-material/Train';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import { Chip, Grid, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

import { Trip } from '../types/trip.ts';
import { getPaletteColorFromNesProperties } from '../utils/trips.ts';

export function TripInfoDetail({
  trip,
  isChangeInIntermediateStop,
  hideStartAndEndTime,
  isFavourite,
}: {
  trip: Trip;
  isChangeInIntermediateStop: boolean;
  isFavourite: boolean;
  hideStartAndEndTime?: boolean;
}) {
  return (
    <Grid container>
      <Grid item xs={9}>
        {!hideStartAndEndTime && <TripStartAndEndTime trip={trip} />}
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
              color: getPaletteColorFromNesProperties(
                trip.primaryMessage.nesProperties,
              ),
            }}
          >
            {trip.primaryMessage.title}
          </Typography>
        )}
      </Grid>
      <Grid item xs={3}>
        <Grid container>
          <Grid xs={12} item>
            <DurationDisplay trip={trip} />
          </Grid>
          <Grid xs={6} item>
            <NumberOfConnectionsDisplay connections={trip.legs.length - 1} />
          </Grid>
          <Grid xs={6} item>
            {trip.crowdForecast !== 'UNKNOWN' && (
              <Stack direction="row" alignItems="center" gap={1}>
                <CrowdForecast crowdForecast={trip.crowdForecast} />
              </Stack>
            )}
          </Grid>
          <Grid xs={6} item>
            {isChangeInIntermediateStop && <TransferWithinAStationIcon />}
          </Grid>
          <Grid xs={6} item>
            {isFavourite && <StarIcon color="primary" />}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
