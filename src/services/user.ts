import { db } from './firebase.ts';
import { doc, setDoc } from 'firebase/firestore';

import { User } from '../types/user.ts';

export const createUserDocument = async (user: User) => {
  await setDoc(doc(db, 'users', user.id), {
    ...user,
  });
};
