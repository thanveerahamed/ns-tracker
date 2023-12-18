import { useEffect, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import { getTripsInformation } from '../services/trip.ts';
import { Trip, TripsInformation } from '../types/trip.ts';

interface Props {
  originUicCode?: string;
  destinationUicCode?: string;
  dateTime: Dayjs;
  viaUicCode?: string;
  searchForArrival?: boolean;
}

export const useTrips = ({
  originUicCode,
  destinationUicCode,
  viaUicCode,
  searchForArrival,
  dateTime,
}: Props) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [earlierJourneyContext, setEarlierJourneyContext] = useState<
    string | undefined
  >(undefined);
  const [laterJourneyContext, setLaterJourneyContext] = useState<
    string | undefined
  >(undefined);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(false);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState<boolean>(false);

  const makeFetch = async (
    context?: string,
    callback?: (tripsInformation: TripsInformation) => void,
  ) => {
    const response = await getTripsInformation({
      originUicCode: originUicCode ?? '',
      destinationUicCode: destinationUicCode ?? '',
      dateTime: dateTime ?? dayjs(),
      searchForArrival,
      viaUicCode: viaUicCode,
      context,
    });

    if (callback) {
      callback(response);
    }
  };

  const handleLoadEarlier = () => {
    setIsLoadMoreLoading(true);
    (async () => {
      try {
        await makeFetch(earlierJourneyContext, (response) => {
          setTrips((prevState) => {
            return [...response.trips, ...prevState];
          });
          setEarlierJourneyContext(response.scrollRequestBackwardContext);
        });
      } finally {
        setIsLoadMoreLoading(false);
      }
    })();
  };

  const handleLoadLater = () => {
    setIsLoadMoreLoading(true);
    (async () => {
      try {
        await makeFetch(laterJourneyContext, (response) => {
          setTrips((prevState) => {
            return [...prevState, ...response.trips];
          });
          setLaterJourneyContext(response.scrollRequestForwardContext);
        });
      } finally {
        setIsLoadMoreLoading(false);
      }
    })();
  };

  const fetchTrips = () => {
    setIsInitialLoading(true);
    (async () => {
      try {
        await makeFetch(undefined, (response) => {
          setTrips(response.trips);
          setEarlierJourneyContext(response.scrollRequestBackwardContext);
          setLaterJourneyContext(response.scrollRequestForwardContext);
        });
      } finally {
        setIsInitialLoading(false);
      }
    })();
  };

  const handleReload = () => {
    fetchTrips();
  };

  useEffect(() => {
    fetchTrips();
    //eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

  return {
    trips,
    isInitialLoading,
    isLoadMoreLoading,
    loadLater: handleLoadLater,
    loadEarlier: handleLoadEarlier,
    reload: handleReload,
  };
};
