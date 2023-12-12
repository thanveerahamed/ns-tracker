import { useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';

import { getStations } from '../services/station.ts';
import { getTripsInformation } from '../services/trip.ts';
import { GetTripsInformationProps } from '../types/trip.ts';

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

export const useTripsInformation = (
  props: Partial<GetTripsInformationProps>,
) => {
  return useQuery({
    enabled:
      props.originUicCode !== undefined &&
      props.destinationUicCode !== undefined &&
      props.dateTime !== undefined,
    queryKey: [
      'stations',
      ...Object.values(props).filter((x) => x !== undefined),
    ],
    queryFn: async () => {
      return await getTripsInformation({
        originUicCode: props.originUicCode ?? '',
        destinationUicCode: props.destinationUicCode ?? '',
        dateTime: props.dateTime ?? dayjs(),
        searchForArrival: props.searchForArrival,
        viaUicCode: props.viaUicCode,
      });
    },
  });
};
