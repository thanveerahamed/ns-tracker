import dayjs, { Dayjs } from 'dayjs';

import { LocationType, NSStation } from '../types/station.ts';

export const saveStationToCache = (type: LocationType, station?: NSStation) => {
  if (station) {
    localStorage.setItem(`search.station.${type}`, JSON.stringify(station));
  } else {
    localStorage.removeItem(`search.station.${type}`);
  }
};

export const getStationFromCache = (
  type: LocationType,
): NSStation | undefined => {
  const station = localStorage.getItem(`search.station.${type}`);
  return station === null ? undefined : JSON.parse(station);
};

export const saveSearchDateTimeToCache = (dateTime?: Dayjs | 'now') => {
  localStorage.setItem(
    `search.datetime`,
    dateTime?.toString() ?? dayjs().toString(),
  );
};

export const getSearchDateTimeFromCache = () => {
  const dateTime = localStorage.getItem(`search.datetime`);
  return dateTime === null || dateTime === 'now' ? 'now' : dayjs(dateTime);
};

export const saveArrivalToggleToCache = (toggle: boolean) => {
  localStorage.setItem(`search.arrival.toggle`, `${toggle}`);
};

export const saveHasIntermediateStopCache = (toggle: boolean) => {
  localStorage.setItem(`search.intermediate.enabled`, `${toggle}`);
};

export const getHasIntermediateStopCache = () => {
  return localStorage.getItem(`search.intermediate.enabled`) === 'true';
};

export const getArrivalToggleFromCache = () => {
  const toggle = localStorage.getItem(`search.arrival.toggle`);
  return toggle === 'true';
};

export const saveOnlyShowTransferEqualVia = (toggle: boolean) => {
  localStorage.setItem(`search.transfer_equal_via.enabled`, `${toggle}`);
};

export const getOnlyShowTransferEqualVia = () => {
  return localStorage.getItem(`search.transfer_equal_via.enabled`) === 'true';
};
