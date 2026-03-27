import { db } from './firebase.ts'
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore'

import { apiGet } from '../clients/nsClient.ts'
import type { NSStation } from '../types/station.ts'

export const getStations = async (
  query: string,
  countryCodes: string = 'nl',
  limit: number = 10,
): Promise<{ payload: NSStation[] }> => {
  return apiGet<{ payload: NSStation[] }>('/v2/stations', {
    q: query,
    countryCodes,
    limit,
  })
}

export const getArrivalOrDepartures = async <T>({
  uicCode,
  dateTime,
  maxJourneys,
  type,
}: {
  uicCode: string
  dateTime: string
  type: 'arrivals' | 'departures'
  maxJourneys?: number
}): Promise<{ payload: T }> => {
  return apiGet<{ payload: T }>(`/v2/${type}`, {
    uicCode,
    dateTime,
    maxJourneys,
  })
}

export const addFavouriteStation = (userId: string, station: NSStation) =>
  setDoc(
    doc(db, 'users', userId, 'favouriteStations', station.UICCode),
    station,
  )

export const getFavouriteStations = async (userId: string) => {
  const snapshot = await getDocs(
    collection(db, 'users', userId, 'favouriteStations'),
  )
  return snapshot.docs.map((d) => d.data() as NSStation)
}

export const removeFavouriteStation = (userId: string, station: NSStation) =>
  deleteDoc(doc(db, 'users', userId, 'favouriteStations', station.UICCode))
