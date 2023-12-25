import { ReactNode, createContext, useMemo } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import { useSearchFilterContext } from './index.ts';

import { useTrips } from '../hooks/useTrips.ts';
import { NSStation } from '../types/station.ts';
import { Trip } from '../types/trip.ts';

export interface TripsInformationContextValue {
  trips: Trip[];
  isLoadMoreLoading: boolean;
  isInitialLoading: boolean;
  loadLater: () => void;
  loadEarlier: () => void;
  reload: () => void;
  via?: NSStation;
  dateTime: Dayjs | 'now';
}
export interface TripsInformationContextProps {
  children: ReactNode;
}

export const TripsInformationContext =
  createContext<TripsInformationContextValue | null>(null);

export const TripsInformationProvider = ({
  children,
}: TripsInformationContextProps) => {
  const {
    via,
    isArrival,
    selectedDateTime,
    destination,
    origin,
    onlyShowTransferEqualVia,
  } = useSearchFilterContext();

  const {
    trips,
    isLoadMoreLoading,
    isInitialLoading,
    loadLater,
    loadEarlier,
    reload,
  } = useTrips({
    viaUicCode: via?.UICCode,
    searchForArrival: isArrival,
    dateTime: selectedDateTime === 'now' ? dayjs() : dayjs(selectedDateTime),
    destinationUicCode: destination?.UICCode,
    originUicCode: origin?.UICCode,
  });

  const filteredTrips = useMemo(() => {
    if (via && onlyShowTransferEqualVia) {
      return trips.filter((trip) => {
        if (trip.legs.length > 1) {
          return Boolean(
            trip.legs.find((leg) => leg.destination.uicCode === via?.UICCode),
          );
        } else {
          return false;
        }
      });
    }

    return trips;
  }, [onlyShowTransferEqualVia, trips, via]);

  return (
    <TripsInformationContext.Provider
      value={{
        trips: filteredTrips,
        isLoadMoreLoading,
        isInitialLoading,
        loadLater,
        loadEarlier,
        reload,
        via,
        dateTime: selectedDateTime,
      }}
    >
      {children}
    </TripsInformationContext.Provider>
  );
};
