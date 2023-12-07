import { useCollection } from 'react-firebase-hooks/firestore';

import { db } from './firebase.ts';
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore';

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

export const addFavouriteStation = (userId: string, station: NSStation) =>
  setDoc(
    doc(db, 'users', userId, 'favouriteStations', station.UICCode),
    station,
  );

export const useFavouriteStation = (userId?: string) =>
  useCollection(collection(db, 'users', userId ?? '', 'favouriteStations'), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

export const removeFavouriteStation = (userId: string, station: NSStation) =>
  deleteDoc(doc(db, 'users', userId, 'favouriteStations', station.UICCode));
