import { db } from './firebase.ts'
import type { Dayjs } from 'dayjs'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import type { ISplitView, ISplitViewWithId } from '../types/splitView.ts'

export const addSplitView = (userId: string, splitView: ISplitView) =>
  addDoc(collection(db, 'users', userId, 'splitViews'), splitView)

export const updateSplitView = (
  userId: string,
  id: string,
  splitView: ISplitView,
) => setDoc(doc(db, 'users', userId, 'splitViews', id), splitView)

export const getSplitViews = async (
  userId: string,
): Promise<ISplitViewWithId[]> => {
  const snapshot = await getDocs(collection(db, 'users', userId, 'splitViews'))
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as ISplitViewWithId,
  )
}

export const getSplitViewDocument = async (
  userId: string,
  docId: string,
): Promise<ISplitViewWithId | undefined> => {
  const d = await getDoc(doc(db, 'users', userId, 'splitViews', docId))
  if (!d.exists()) return undefined
  return { id: d.id, ...d.data() } as ISplitViewWithId
}

export const removeSplitView = (userId: string, id: string) =>
  deleteDoc(doc(db, 'users', userId, 'splitViews', id))

export const updateSplitViewDate = (
  userId: string,
  id: string,
  viewIndex: number,
  dateTime: Dayjs,
) => {
  const updateElement = `views.${viewIndex}.dateTime`
  return updateDoc(doc(db, 'users', userId, 'splitViews', id), {
    [updateElement]: dateTime.toString(),
  })
}

export const toggleSplitViewOpened = (
  userId: string,
  id: string,
  opened: boolean,
) =>
  updateDoc(doc(db, 'users', userId, 'splitViews', id), {
    opened,
  })
