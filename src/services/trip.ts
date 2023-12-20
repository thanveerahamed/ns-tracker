import { apiGet } from '../clients/nsClient.ts';
import { GetTripsInformationProps, TripsInformation } from '../types/trip.ts';

export const getTripsInformation = async ({
  searchForArrival,
  dateTime,
  ...rest
}: GetTripsInformationProps): Promise<TripsInformation> => {
  const params = {
    ...rest,
    dateTime: dateTime.format('YYYY-MM-DDTHH:mm:ssZ'), //2023-11-20T14:58:31+01:00
    ...(searchForArrival ? { searchForArrival: true } : {}),
    excludeTrainsWithReservationRequired: true,
  };

  return apiGet<TripsInformation>('/v3/trips', params);
};
