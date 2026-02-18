import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@services/firebase';

export default function deletePlant(plantId: string) {
  const plantDocRef = doc(db, 'test-plants', plantId);
  return deleteDoc(plantDocRef);
}
