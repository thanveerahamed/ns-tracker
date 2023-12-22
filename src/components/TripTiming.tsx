import { useMemo } from 'react';
import * as React from 'react';

import { Typography, TypographyProps } from '@mui/material';

import { TripLocation } from '../types/trip.ts';
import { makeDateTimeWithDelay } from '../utils/trips.ts';

interface Props extends TypographyProps {
  location: TripLocation;
}

export default function TripTiming({ location, ...rest }: Props) {
  const dateTimeWithDelay = useMemo(() => {
    return makeDateTimeWithDelay(location);
  }, [location]);
  return (
    <>
      <Typography {...rest}>{dateTimeWithDelay.formattedTime}</Typography>
      {dateTimeWithDelay.delayTimeString && (
        <Typography {...rest} sx={{ color: 'error.main' }}>
          {dateTimeWithDelay.delayTimeString}
        </Typography>
      )}
    </>
  );
}
