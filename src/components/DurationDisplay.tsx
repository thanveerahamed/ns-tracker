import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

import { Trip } from '../types/trip.ts';
import { extendedDayjs } from '../utils/date.ts';

export default function DurationDisplay({ trip }: { trip: Trip }) {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <AccessTimeIcon />
      <Stack direction="column" alignItems="center">
        {trip.actualDurationInMinutes &&
          trip.actualDurationInMinutes !== trip.plannedDurationInMinutes && (
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
                trip.actualDurationInMinutes !== trip.plannedDurationInMinutes
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
  );
}
