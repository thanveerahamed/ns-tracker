import { useEffect, useState } from 'react';

import { Dayjs } from 'dayjs';

import {
  useTripsInformation,
  useTripsInformationWithContext,
} from '../apis/trips.ts';
import { LoadMoreAction, Trip } from '../types/trip.ts';

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

  const {
    isLoading,
    data: initialTripData,
    refetch,
    isRefetching,
  } = useTripsInformation({
    originUicCode,
    destinationUicCode,
    viaUicCode,
    searchForArrival,
    dateTime,
  });

  const {
    mutate: loadMore,
    data: loadMoreTripsData,
    isSuccess,
    reset,
    isPending,
  } = useTripsInformationWithContext();

  const handleLoadEarlier = () => {
    reset();
    loadMore({
      props: {
        originUicCode,
        destinationUicCode,
        viaUicCode,
        searchForArrival,
        dateTime,
        context: earlierJourneyContext,
      },
      action: LoadMoreAction.Earlier,
    });
  };

  const handleLoadLater = () => {
    reset();
    loadMore({
      props: {
        originUicCode,
        destinationUicCode,
        viaUicCode,
        searchForArrival,
        dateTime,
        context: laterJourneyContext,
      },
      action: LoadMoreAction.Later,
    });
  };

  useEffect(() => {
    if (!loadMoreTripsData) {
      return;
    }

    if (loadMoreTripsData.action === LoadMoreAction.Earlier) {
      setTrips((prevState) => {
        return [...loadMoreTripsData.response.trips, ...prevState];
      });
      setEarlierJourneyContext(
        loadMoreTripsData.response.scrollRequestBackwardContext,
      );
    } else {
      setTrips((prevState) => {
        return [...prevState, ...loadMoreTripsData.response.trips];
      });
      setLaterJourneyContext(
        loadMoreTripsData.response.scrollRequestForwardContext,
      );
    }

    reset();
  }, [loadMoreTripsData, reset]);

  useEffect(() => {
    if (initialTripData) {
      setTrips([]);
      setTrips(initialTripData.trips);
      setEarlierJourneyContext(initialTripData.scrollRequestBackwardContext);
      setLaterJourneyContext(initialTripData.scrollRequestForwardContext);
    }
  }, [initialTripData]);

  return {
    trips,
    isInitialLoading: isLoading || isRefetching,
    isLoadMoreLoading: isPending && !isSuccess,
    loadLater: handleLoadLater,
    loadEarlier: handleLoadEarlier,
    reload: refetch,
  };
};
