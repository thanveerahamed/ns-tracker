import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore';

import { db } from './firebase.ts';
import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore';

import { ISplitView } from '../types/splitView.ts';

export const addSplitView = (userId: string, splitView: ISplitView) =>
  addDoc(collection(db, 'users', userId, 'splitViews'), splitView);

export const updateSplitView = (
  userId: string,
  id: string,
  splitView: ISplitView,
) => setDoc(doc(db, 'users', userId, 'favouriteStations', id), splitView);

export const useSplitView = (userId?: string) =>
  useCollection(collection(db, 'users', userId ?? '', 'splitViews'), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

export const removeSplitView = (userId: string, id: string) =>
  deleteDoc(doc(db, 'users', userId, 'splitViews', id));

export const useSplitViewDocument = (docId?: string, userId?: string) =>
  useDocumentData(
    docId && userId
      ? doc(db, 'users', userId ?? '', 'splitViews', docId)
      : undefined,
  );
