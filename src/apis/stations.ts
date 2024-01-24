import { useQuery } from '@tanstack/react-query';

import { getDepartures, getStations } from '../services/station.ts';

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
      const { payload: departures } = await getDepartures(query);
      return departures;
    },
  });
};
