import { useCollection } from 'react-firebase-hooks/firestore';

import { db } from './firebase.ts';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';

import { apiGet } from '../clients/nsClient.ts';
import {
  GetTripsInformationProps,
  Trip,
  TripsInformation,
} from '../types/trip.ts';

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

export const getTrip = async ({
  ctxRecon,
}: {
  ctxRecon: string;
}): Promise<Trip> => {
  const params = {
    ctxRecon,
  };

  return apiGet<Trip>('/v3/trips/trip', params);
};

export const addFavouriteTrip = (userId: string, trip: Trip) =>
  addDoc(collection(db, 'users', userId, 'favouriteTrips'), trip);

export const useFavouriteTrip = (userId?: string) =>
  useCollection(collection(db, 'users', userId ?? '', 'favouriteTrips'), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

export const removeFavouriteTrip = (userId: string, id: string) =>
  deleteDoc(doc(db, 'users', userId, 'favouriteTrips', id));
