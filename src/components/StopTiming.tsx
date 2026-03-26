import { useMemo } from 'react';

import Timing from './datetime/Timing.tsx';
import dayjs from 'dayjs';

interface Props {
  plannedTime: string;
  actualTime: string;
  className?: string;
}

export default function StopTiming({
  plannedTime,
  actualTime,
  className,
}: Props) {
  const { formattedTime, delayedTime, isDelayed } = useMemo(() => {
    let delayTimeString: string | undefined;
    if (actualTime) {
      const differenceInMinutes = dayjs(actualTime).diff(
        plannedTime,
        'minutes',
      );
      if (differenceInMinutes > 0) delayTimeString = `+${differenceInMinutes}`;
      else if (differenceInMinutes < 0)
        delayTimeString = `${differenceInMinutes}`;
    }
    return {
      formattedTime: dayjs(plannedTime).format('LT'),
      isDelayed: Boolean(delayTimeString),
      delayedTime: dayjs(actualTime).format('LT'),
    };
  }, [plannedTime, actualTime]);

  return (
    <Timing
      className={className}
      originalTime={formattedTime}
      isDelayed={isDelayed}
      delayedTime={delayedTime}
      direction="row"
    />
  );
}
