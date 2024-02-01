import { useQuery } from '@tanstack/react-query';

import { getArrivalOrDepartures, getStations } from '../services/station.ts';
import {
  ArrivalsJourneyPayload,
  DeparturesJourneyPayload,
} from '../types/station.ts';

export const useStationsQuery = ({
  query,
  enabled,
}: {
  query: string;
  enabled: boolean;
}) => {
  return useQuery({
    enabled: query !== '' && enabled,
    queryKey: ['stations', query],
    queryFn: async () => {
      const { payload: stations } = await getStations(query);
      return stations;
    },
  });
};

export const useStationDeparturesQuery = ({
  enabled,
  query,
}: {
  query: {
    uicCode: string;
    dateTime: string;
    maxJourneys?: number;
  };
  enabled: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: ['stations', 'departures', ...Object.values(query)],
    queryFn: async () => {
      const { payload: departures } =
        await getArrivalOrDepartures<DeparturesJourneyPayload>({
          ...query,
          type: 'departures',
        });
      return departures;
    },
  });
};

export const useStationArrivalsQuery = ({
  enabled,
  query,
}: {
  query: {
    uicCode: string;
    dateTime: string;
    maxJourneys?: number;
  };
  enabled: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: ['stations', 'arrivals', ...Object.values(query)],
    queryFn: async () => {
      const { payload: departures } =
        await getArrivalOrDepartures<ArrivalsJourneyPayload>({
          ...query,
          type: 'arrivals',
        });
      return departures;
    },
  });
};
