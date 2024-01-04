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
import { SearchFilter, UpdateRecentSearchProps } from '../types/search.ts';
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
  updateRecentSearch: (props: UpdateRecentSearchProps) => void;
}

export interface SearchFilterContextProps {
  children: ReactNode;
}
export const SearchFilterContext =
  createContext<SearchFilterContextValue | null>(null);

export const SearchFilterProvider = ({
  children,
}: SearchFilterContextProps) => {
  const cachedDateTime = getSearchDateTimeFromCache();
  const isArrival = getArrivalToggleFromCache();
  const [filters, setFilters] = useState<SearchFilter>({
    via: getStationFromCache(LocationType.Via),
    destination: getStationFromCache(LocationType.Destination),
    settingsEnabled: false,
    hasIntermediateStop: getHasIntermediateStopCache(),
    isArrival,
    onlyShowTransferEqualVia: getOnlyShowTransferEqualVia(),
    origin: getStationFromCache(LocationType.Origin),
    selectedDateTime:
      cachedDateTime === 'now'
        ? isArrival
          ? dayjs()
          : cachedDateTime
        : dayjs(cachedDateTime),
  });

  const swapLocations = () => {
    setFilters((prevState) => {
      return {
        ...prevState,
        origin: prevState.destination,
        destination: prevState.origin,
      };
    });
  };

  const handleDateTimeChange = (value?: Dayjs | 'now') => {
    if (value) {
      setFilters((prevState) => {
        return {
          ...prevState,
          selectedDateTime: value,
        };
      });
    }
    saveSearchDateTimeToCache(value ?? undefined);
  };

  const handleUpdateRecentSearch = (props: UpdateRecentSearchProps) => {
    setFilters((prevState) => {
      return {
        ...prevState,
        origin: props.origin,
        destination: props.destination,
        via: props.via,
        selectedDateTime: 'now',
        hasIntermediateStop: Boolean(props.via),
      };
    });
  };

  const setHasIntermediateStop = (newValue: boolean) => {
    setFilters((prevState) => {
      return {
        ...prevState,
        hasIntermediateStop: newValue,
      };
    });
  };

  const setOrigin = (newValue: NSStation) => {
    setFilters((prevState) => {
      return {
        ...prevState,
        origin: newValue,
      };
    });
  };

  const setDestination = (station: NSStation) => {
    setFilters((prevState) => {
      return {
        ...prevState,
        destination: station,
      };
    });
  };

  const setVia = (station?: NSStation) => {
    setFilters((prevState) => {
      return {
        ...prevState,
        via: station,
      };
    });
  };

  const setIsArrival = (newValue: boolean) => {
    setFilters((prevState) => {
      return {
        ...prevState,
        isArrival: newValue,
      };
    });
  };

  const setOnlyShowTransferEqualVia = (flag: boolean) => {
    setFilters((prevState) => {
      return {
        ...prevState,
        onlyShowTransferEqualVia: flag,
      };
    });
  };

  useEffect(() => {
    setFilters((prevState) => {
      return {
        ...prevState,
        onlyShowTransferEqualVia: filters.onlyShowTransferEqualVia,
      };
    });
  }, [filters.onlyShowTransferEqualVia]);

  useEffect(() => {
    if (filters.hasIntermediateStop) {
      saveStationToCache(LocationType.Via, filters.via);
    } else {
      saveStationToCache(LocationType.Via, undefined);
    }

    saveStationToCache(LocationType.Origin, filters.origin);
    saveStationToCache(LocationType.Destination, filters.destination);
    saveArrivalToggleToCache(filters.isArrival);
    saveHasIntermediateStopCache(filters.hasIntermediateStop);
    saveOnlyShowTransferEqualVia(filters.onlyShowTransferEqualVia);
  }, [filters]);

  return (
    <SearchFilterContext.Provider
      value={{
        ...filters,
        setHasIntermediateStop,
        setOrigin,
        setDestination,
        setVia,
        setSelectedDateTime: handleDateTimeChange,
        setIsArrival,
        swapLocations,
        setOnlyShowTransferEqualVia,
        updateRecentSearch: handleUpdateRecentSearch,
      }}
    >
      {children}
    </SearchFilterContext.Provider>
  );
};
