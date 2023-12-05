import { apiGet } from '../clients/nsClient.ts';
import { Station } from '../types/station.ts';

export const getStations = async (
  query: string,
  countryCodes: string = 'nl',
  limit: number = 10,
): Promise<{ payload: Station[] }> => {
  return apiGet<{ payload: Station[] }>('/v2/stations', {
    q: query,
    countryCodes,
    limit,
  });
};
