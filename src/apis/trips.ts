import { useMutation, useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';

import {
  getJourneyInformation,
  getTrip,
  getTripsInformation,
} from '../services/trip.ts';
import { GetTripsInformationProps, LoadMoreAction } from '../types/trip.ts';

const createUseTripsInformationQuery = (
  props: Partial<GetTripsInformationProps>,
) => {
  const { dateTime, searchForArrival, ...rest } = props;
  const values = Object.values(rest);

  if (dateTime) {
    values.push(dateTime.toISOString());
  }

  if (searchForArrival) {
    values.push('arrival');
  } else {
    values.push('departure');
  }

  return values;
};

export const useTripsInformation = (
  props: Partial<GetTripsInformationProps>,
) => {
  return useQuery({
    enabled:
      props.originUicCode !== undefined &&
      props.destinationUicCode !== undefined &&
      props.dateTime !== undefined,
    queryKey: ['stations', ...createUseTripsInformationQuery(props)],
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

export const useTripsInformationWithContext = () => {
  return useMutation({
    mutationFn: async ({
      props,
      action,
    }: {
      props: Partial<GetTripsInformationProps>;
      action: LoadMoreAction;
    }) => {
      return {
        action,
        response: await getTripsInformation({
          originUicCode: props.originUicCode ?? '',
          destinationUicCode: props.destinationUicCode ?? '',
          dateTime: props.dateTime ?? dayjs(),
          searchForArrival: props.searchForArrival,
          viaUicCode: props.viaUicCode,
          context: props.context,
        }),
      };
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

export const useJourney = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ['trips', 'trip', 'journey', id],
    queryFn: async () => {
      return await getJourneyInformation({ id });
    },
  });
};
