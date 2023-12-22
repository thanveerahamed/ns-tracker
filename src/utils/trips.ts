import dayjs from 'dayjs';

import { Trip, TripLocation } from '../types/trip.ts';

export const makeDateTimeWithDelay = (location: TripLocation) => {
  let delayTimeString = undefined;
  if (location.actualDateTime) {
    const differenceInMinutes = dayjs(location.actualDateTime).diff(
      location.plannedDateTime,
      'minutes',
    );

    if (differenceInMinutes > 0) {
      delayTimeString = `+${differenceInMinutes}`;
    } else if (differenceInMinutes < 0) {
      delayTimeString = `${differenceInMinutes}`;
    }
  }

  return {
    formattedTime: dayjs(location.plannedDateTime).format('LT'),
    delayTimeString,
  };
};

export const getCompleteTripEndLocations = (trip: Trip) => {
  const legsOriginDestination = trip.legs.map(({ origin, destination }) => ({
    origin,
    destination,
  }));
  const completeTripOrigin = legsOriginDestination[0].origin;
  const completeTripDestination =
    legsOriginDestination[legsOriginDestination.length - 1].destination;

  return {
    completeTripOrigin,
    completeTripDestination,
  };
};

export const getColorFromNesProperties = ({ type }: { type: string }) => {
  switch (type) {
    case 'error':
      return 'error.main';

    case 'warning':
      return 'warning.main';

    case 'primary':
      return 'primary.main';

    default:
      return 'inherit';
  }
};
