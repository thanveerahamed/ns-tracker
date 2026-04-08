import { db } from './firebase.ts'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'

import { apiGet } from '../clients/nsClient.ts'
import type { JourneyResponse } from '../types/journey.ts'
import type {
  GetTripsInformationProps,
  Trip,
  TripsInformation,
} from '../types/trip.ts'

export const getTripsInformation = async ({
  searchForArrival,
  dateTime,
  ...rest
}: GetTripsInformationProps): Promise<TripsInformation> => {
  const params = {
    ...rest,
    dateTime: dateTime.format('YYYY-MM-DDTHH:mm:ssZ'),
    ...(searchForArrival ? { searchForArrival: true } : {}),
    excludeTrainsWithReservationRequired: true,
  }

  return apiGet<TripsInformation>('/v3/trips', params)
}

export const getTrip = async ({
  ctxRecon,
}: {
  ctxRecon: string
}): Promise<Trip> => {
  return apiGet<Trip>('/v3/trips/trip', { ctxRecon })
}

export const getJourneyInformation = async ({
  id,
}: {
  id: string
}): Promise<JourneyResponse> => {
  return apiGet<JourneyResponse>('/v2/journey', { id })
}

export const addFavouriteTrip = (userId: string, trip: Trip) =>
  addDoc(collection(db, 'users', userId, 'favouriteTrips'), {
    trip: JSON.stringify(trip),
  })

export const getFavouriteTrips = async (userId: string) => {
  const snapshot = await getDocs(
    collection(db, 'users', userId, 'favouriteTrips'),
  )
  return snapshot.docs.map((d) => ({
    docId: d.id,
    ...JSON.parse(d.data().trip as string),
  })) as Array<Trip & { docId: string }>
}

export const updateFavouriteTrip = (
  userId: string,
  docId: string,
  trip: Trip,
) =>
  updateDoc(doc(db, 'users', userId, 'favouriteTrips', docId), {
    trip: JSON.stringify(trip),
  })

export const refreshFavouriteTrips = async (
  userId: string,
  favourites: Array<Trip & { docId: string }>,
): Promise<Array<Trip & { docId: string }>> => {
  const results = await Promise.allSettled(
    favourites.map(async (fav) => {
      const fresh = await getTrip({ ctxRecon: fav.ctxRecon })
      await updateFavouriteTrip(userId, fav.docId, fresh)
      return { ...fresh, docId: fav.docId }
    }),
  )

  return results.map((result, i) =>
    result.status === 'fulfilled' ? result.value : favourites[i],
  )
}

export const removeFavouriteTrip = (userId: string, id: string) =>
  deleteDoc(doc(db, 'users', userId, 'favouriteTrips', id))
