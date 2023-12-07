import { apiGet } from '../clients/nsClient.ts';
import { NSStation } from '../types/station.ts';

export const getStations = async (
  query: string,
  countryCodes: string = 'nl',
  limit: number = 10,
): Promise<{ payload: NSStation[] }> => {
  return apiGet<{ payload: NSStation[] }>('/v2/stations', {
    q: query,
    countryCodes,
    limit,
  });
};
