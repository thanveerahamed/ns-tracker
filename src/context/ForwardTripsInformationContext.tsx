import { ReactNode, createContext } from 'react';

import { Dayjs } from 'dayjs';

import { useTrips } from '../hooks/useTrips.ts';
import { Trip } from '../types/trip.ts';

export interface ForwardTripsInformationContextValue {
  trips: Trip[];
  isLoadMoreLoading: boolean;
  isInitialLoading: boolean;
  loadLater: () => void;
  loadEarlier: () => void;
  reload: () => void;
  dateTime: Dayjs | 'now';
}
export interface ForwardTripsInformationContextProps {
  children: ReactNode;
  departureDateTime: Dayjs;
  destinationUICCode: string;
  originUICCode: string;
}

export const ForwardTripsInformationContext =
  createContext<ForwardTripsInformationContextValue | null>(null);

export const ForwardTripsInformationProvider = ({
  children,
  departureDateTime,
  destinationUICCode,
  originUICCode,
}: ForwardTripsInformationContextProps) => {
  const {
    trips,
    isLoadMoreLoading,
    isInitialLoading,
    loadLater,
    loadEarlier,
    reload,
  } = useTrips({
    searchForArrival: false,
    dateTime: departureDateTime,
    destinationUicCode: destinationUICCode,
    originUicCode: originUICCode,
  });

  return (
    <ForwardTripsInformationContext.Provider
      value={{
        trips,
        isLoadMoreLoading,
        isInitialLoading,
        loadLater,
        loadEarlier,
        reload,
        dateTime: departureDateTime,
      }}
    >
      {children}
    </ForwardTripsInformationContext.Provider>
  );
};
