import dayjs from 'dayjs';

import { NSLocation, Trip } from '../types/trip.ts';

const makeDateTimeWithDelay = (location: NSLocation) => {
  let delayTimeString = '';
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
  return `${dayjs(location.plannedDateTime).format('LT')}${delayTimeString}`;
};

export const makeTripStartAndEndTime = (trip: Trip) => {
  const legsOriginDestination = trip.legs.map(({ origin, destination }) => ({
    origin,
    destination,
  }));
  const currentTripOrigin = legsOriginDestination[0].origin;
  const currentTripDestination =
    legsOriginDestination[legsOriginDestination.length - 1].destination;

  return `${makeDateTimeWithDelay(currentTripOrigin)} - ${makeDateTimeWithDelay(
    currentTripDestination,
  )}`;
};
