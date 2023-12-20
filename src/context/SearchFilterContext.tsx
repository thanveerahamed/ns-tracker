import { ReactNode, createContext, useEffect, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import {
  getArrivalToggleFromCache,
  getHasIntermediateStopCache,
  getOnlyShowTransferEqualVia,
  getSearchDateTimeFromCache,
  getStationFromCache,
  saveArrivalToggleToCache,
  saveHasIntermediateStopCache,
  saveOnlyShowTransferEqualVia,
  saveSearchDateTimeToCache,
  saveStationToCache,
} from '../services/cache.ts';
import { LocationType, NSStation } from '../types/station.ts';

export interface SearchFilterContextValue {
  isArrival: boolean;
  origin?: NSStation;
  destination?: NSStation;
  via?: NSStation;
  selectedDateTime: Dayjs | 'now';
  hasIntermediateStop: boolean;
  setOrigin: (station: NSStation) => void;
  setDestination: (station: NSStation) => void;
  setVia: (station?: NSStation) => void;
  setIsArrival: (isArrival: boolean) => void;
  setSelectedDateTime: (dateTime: Dayjs | 'now') => void;
  setHasIntermediateStop: (flag: boolean) => void;
  swapLocations: () => void;
  onlyShowTransferEqualVia: boolean;
  setOnlyShowTransferEqualVia: (flag: boolean) => void;
  settingsEnabled: boolean;
}

export interface SearchFilterContextProps {
  children: ReactNode;
}
export const SearchFilterContext =
  createContext<SearchFilterContextValue | null>(null);

export const SearchFilterProvider = ({
  children,
}: SearchFilterContextProps) => {
  const [origin, setOrigin] = useState<NSStation | undefined>(
    getStationFromCache(LocationType.Origin),
  );
  const [destination, setDestination] = useState<NSStation | undefined>(
    getStationFromCache(LocationType.Destination),
  );
  const [via, setVia] = useState<NSStation | undefined>(
    getStationFromCache(LocationType.Via),
  );
  const [isArrival, setIsArrival] = useState<boolean>(
    getArrivalToggleFromCache(),
  );
  const cachedDateTime = getSearchDateTimeFromCache();
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | 'now'>(
    cachedDateTime === 'now'
      ? isArrival
        ? dayjs()
        : cachedDateTime
      : dayjs(cachedDateTime),
  );
  const [hasIntermediateStop, setHasIntermediateStop] = useState<boolean>(
    getHasIntermediateStopCache(),
  );
  const [onlyShowTransferEqualVia, setOnlyShowTransferEqualVia] =
    useState<boolean>(getOnlyShowTransferEqualVia());
  const [settingsEnabled, setSettingsEnabled] = useState<boolean>(false);

  const swapLocations = () => {
    setDestination((previousDestination) => {
      setOrigin(previousDestination);
      return origin;
    });
  };

  const handleDateTimeChange = (value?: Dayjs | 'now') => {
    if (value) {
      setSelectedDateTime(value);
    }
    saveSearchDateTimeToCache(value ?? undefined);
  };

  useEffect(() => {
    setSettingsEnabled(onlyShowTransferEqualVia);
  }, [onlyShowTransferEqualVia]);

  useEffect(() => {
    if (hasIntermediateStop) {
      saveStationToCache(LocationType.Via, via);
    } else {
      saveStationToCache(LocationType.Via, undefined);
    }

    saveStationToCache(LocationType.Origin, origin);
    saveStationToCache(LocationType.Destination, destination);
    saveArrivalToggleToCache(isArrival);
    saveHasIntermediateStopCache(hasIntermediateStop);
    saveOnlyShowTransferEqualVia(onlyShowTransferEqualVia);
  }, [
    via,
    origin,
    destination,
    isArrival,
    hasIntermediateStop,
    onlyShowTransferEqualVia,
  ]);

  return (
    <SearchFilterContext.Provider
      value={{
        isArrival,
        destination,
        setDestination,
        origin,
        hasIntermediateStop,
        setHasIntermediateStop,
        setOrigin,
        via,
        setVia,
        selectedDateTime,
        setSelectedDateTime: handleDateTimeChange,
        setIsArrival,
        swapLocations,
        onlyShowTransferEqualVia,
        setOnlyShowTransferEqualVia,
        settingsEnabled,
      }}
    >
      {children}
    </SearchFilterContext.Provider>
  );
};
