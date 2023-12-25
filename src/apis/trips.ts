import { useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';

import { getTrip, getTripsInformation } from '../services/trip.ts';
import { GetTripsInformationProps } from '../types/trip.ts';

const createUseTripsInformationQuery = ({
  originUicCode,
  viaUicCode,
  destinationUicCode,
  context,
  searchForArrival,
}: Partial<GetTripsInformationProps>) => [
  ...(originUicCode ? [originUicCode] : []),
  ...(viaUicCode ? [viaUicCode] : []),
  ...(destinationUicCode ? [destinationUicCode] : []),
  ...(context ? [context] : []),
  ...(searchForArrival ? [searchForArrival] : []),
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

export const useTrip = ({ ctxRecon }: { ctxRecon?: string }) => {
  return useQuery({
    enabled: Boolean(ctxRecon),
    queryKey: ['trips', 'trip', ctxRecon],
    queryFn: async () => {
      return await getTrip({ ctxRecon: ctxRecon ?? '' });
    },
  });
};
