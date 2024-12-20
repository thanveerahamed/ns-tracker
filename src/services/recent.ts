import { useCollection } from 'react-firebase-hooks/firestore';

import { db } from './firebase.ts';
import dayjs from 'dayjs';
import {
  collection,
  doc,
  limit,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';

import { NSStation } from '../types/station.ts';

export const createRecentSearch = async ({
  userId,
  origin,
  destination,
  via,
}: {
  userId: string;
  origin: NSStation;
  destination: NSStation;
  via?: NSStation;
}) => {
  const docId = `${origin.UICCode}${destination.UICCode}${via?.UICCode ?? ''}`;
  await setDoc(doc(db, 'users', userId, 'recentSearch', docId), {
    origin,
    destination,
    ...(via ? { via } : {}),
    lastUpdatedAt: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
  });
};

export const useRecentSearch = (userId?: string) =>
  useCollection(
    query(
      collection(db, 'users', userId ?? '', 'recentSearch'),
      orderBy('lastUpdatedAt', 'desc'),
      limit(5),
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );
