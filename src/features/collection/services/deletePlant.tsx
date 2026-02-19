import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@services/firebase';

export default function deletePlant(plantId: string, userId: string) {
  const plantDocRef = doc(db, `users/${userId}/plants`, plantId);
  return deleteDoc(plantDocRef);
}
