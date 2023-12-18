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

const createUseTripsInformationQuery = ({
  originUicCode,
  viaUicCode,
  destinationUicCode,
  context,
  dateTime,
  searchForArrival,
}: Partial<GetTripsInformationProps>) => [
  ...(originUicCode ? [originUicCode] : []),
  ...(viaUicCode ? [viaUicCode] : []),
  ...(destinationUicCode ? [destinationUicCode] : []),
  ...(context ? [context] : []),
  ...(searchForArrival ? [searchForArrival] : []),
  ...(dateTime ? [dateTime.toString()] : []),
];

export const useTripsInformation = (
  props: Partial<GetTripsInformationProps>,
) => {
  return useQuery({
    enabled:
      props.originUicCode !== undefined &&
      props.destinationUicCode !== undefined &&
      props.dateTime !== undefined,
    queryKey: ['stations', createUseTripsInformationQuery(props)],
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

export const useTripsInformationWithContext = (
  props: Partial<GetTripsInformationProps>,
  enabled: boolean,
) => {
  return useQuery({
    enabled:
      enabled &&
      props.originUicCode !== undefined &&
      props.destinationUicCode !== undefined &&
      props.dateTime !== undefined,
    queryKey: ['stations', 'context', createUseTripsInformationQuery(props)],
    queryFn: async () => {
      return await getTripsInformation({
        originUicCode: props.originUicCode ?? '',
        destinationUicCode: props.destinationUicCode ?? '',
        dateTime: props.dateTime ?? dayjs(),
        searchForArrival: props.searchForArrival,
        viaUicCode: props.viaUicCode,
        context: props.context,
      });
    },
  });
};
