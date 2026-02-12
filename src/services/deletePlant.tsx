import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function deletePlant(plantId: string) {
  const plantDocRef = doc(db, 'test-plants', plantId);
  return deleteDoc(plantDocRef);
}
