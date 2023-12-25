import { useQuery } from '@tanstack/react-query';

import { getStations } from '../services/station.ts';

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
