import { db } from './firebase.ts'
import dayjs from 'dayjs'
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'

import type { NSStation } from '../types/station.ts'
import type { RecentSearch } from '../types/recent.ts'

export const createRecentSearch = async ({
  userId,
  origin,
  destination,
  via,
}: {
  userId: string
  origin: NSStation
  destination: NSStation
  via?: NSStation
}) => {
  const docId = `${origin.UICCode}${destination.UICCode}${via?.UICCode ?? ''}`
  await setDoc(doc(db, 'users', userId, 'recentSearch', docId), {
    origin,
    destination,
    ...(via ? { via } : {}),
    lastUpdatedAt: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
  })
}

export const getRecentSearches = async (
  userId: string,
): Promise<RecentSearch[]> => {
  const q = query(
    collection(db, 'users', userId, 'recentSearch'),
    orderBy('lastUpdatedAt', 'desc'),
    limit(5),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => d.data() as RecentSearch)
}
