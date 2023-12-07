import dayjs, { Dayjs } from 'dayjs';

import { LocationType, NSStation } from '../types/station.ts';

export const saveStationToCache = (type: LocationType, station?: NSStation) => {
  if (station) {
    localStorage.setItem(`search.station.${type}`, JSON.stringify(station));
  }
};

export const getStationFromCache = (
  type: LocationType,
): NSStation | undefined => {
  const station = localStorage.getItem(`search.station.${type}`);
  return station === null ? undefined : JSON.parse(station);
};

export const saveSearchDateTimeToCache = (dateTime?: Dayjs) => {
  localStorage.setItem(
    `search.datetime`,
    dateTime?.toString() ?? dayjs().toString(),
  );
};

export const getSearchDateTimeFromCache = () => {
  const dateTime = localStorage.getItem(`search.datetime`);
  return dateTime === null ? dayjs() : dayjs(dateTime);
};

export const saveArrivalToggleToCache = (toggle: boolean) => {
  localStorage.setItem(`search.arrival.toggle`, `${toggle}`);
};

export const getArrivalToggleFromCache = () => {
  const toggle = localStorage.getItem(`search.arrival.toggle`);
  return toggle === 'true';
};
