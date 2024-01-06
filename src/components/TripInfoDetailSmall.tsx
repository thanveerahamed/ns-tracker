import DurationDisplay from './DurationDisplay.tsx';
import TripStartAndEndTime from './TripStartAndEndTime.tsx';
import { Chip, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';

import { Trip } from '../types/trip.ts';
import { getPaletteColorFromNesProperties } from '../utils/trips.ts';

export function TripInfoDetailSmall({
  trip,
  hideStartAndEndTime,
}: {
  trip: Trip;
  hideStartAndEndTime?: boolean;
}) {
  return (
    <Grid container>
      <Grid item xs={12}>
        {!hideStartAndEndTime && (
          <TripStartAndEndTime trip={trip} variant="caption" />
        )}
        {trip.legs.map((leg, index) => (
          <Chip
            sx={{
              'height': 'auto',
              '& .MuiChip-label': {
                display: 'block',
                whiteSpace: 'normal',
              },
              'marginBottom': '5px',
              'borderRadius': '0',
            }}
            key={index}
            label={`${leg.product.displayName} (Track: ${
              leg.origin.actualTrack ?? leg.origin.plannedTrack
            })`}
            variant="outlined"
            color="primary"
          />
        ))}
        <DurationDisplay trip={trip} />
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
    </Grid>
  );
}
