import { useMemo } from 'react';
import * as React from 'react';

import Timing from './datetime/Timing.tsx';
import { TypographyProps } from '@mui/material';
import dayjs from 'dayjs';

interface Props extends TypographyProps {
  plannedTime: string;
  actualTime: string;
}

export default function StopTiming({
  plannedTime,
  actualTime,
  ...rest
}: Props) {
  const { formattedTime, delayedTime, isDelayed } = useMemo(() => {
    let delayTimeString = undefined;
    if (actualTime) {
      const differenceInMinutes = dayjs(actualTime).diff(
        plannedTime,
        'minutes',
      );

      if (differenceInMinutes > 0) {
        delayTimeString = `+${differenceInMinutes}`;
      } else if (differenceInMinutes < 0) {
        delayTimeString = `${differenceInMinutes}`;
      }
    }

    return {
      formattedTime: dayjs(plannedTime).format('LT'),
      delayTimeString,
      isDelayed: Boolean(delayTimeString),
      delayedTime: dayjs(actualTime).format('LT'),
    };
  }, [plannedTime, actualTime]);

  return (
    <Timing
      {...rest}
      originalTime={formattedTime}
      isDelayed={isDelayed}
      delayedTime={delayedTime}
      direction={'row'}
      mb={0}
    />
  );
}
