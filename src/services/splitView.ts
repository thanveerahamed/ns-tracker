import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore';

import { db } from './firebase.ts';
import { Dayjs } from 'dayjs';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { ISplitView } from '../types/splitView.ts';

export const addSplitView = (userId: string, splitView: ISplitView) =>
  addDoc(collection(db, 'users', userId, 'splitViews'), splitView);

export const updateSplitView = (
  userId: string,
  id: string,
  splitView: ISplitView,
) => setDoc(doc(db, 'users', userId, 'splitViews', id), splitView);

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

export const updateSplitViewDate = (
  userId: string,
  id: string,
  view: 'view1' | 'view2',
  dateTime: Dayjs,
) => {
  const updateElement = `${view}.dateTime`;
  return updateDoc(doc(db, 'users', userId, 'splitViews', id), {
    [updateElement]: dateTime.toString(),
  });
};

export const toggleSplitViewOpened = (
  userId: string,
  id: string,
  opened: boolean,
) =>
  updateDoc(doc(db, 'users', userId, 'splitViews', id), {
    opened,
  });
