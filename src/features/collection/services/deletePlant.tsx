import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@services/firebase';

export default async function deletePlant(plantId: string, userId: string) {
  const careEntriesCollectionRef = collection(
    db,
    `users/${userId}/plants/${plantId}/careEntries`
  );
  const careEntriesSnapshot = await getDocs(careEntriesCollectionRef);

  if (!careEntriesSnapshot.empty) {
    const batch = writeBatch(db);
    careEntriesSnapshot.forEach((careEntryDoc) => {
      batch.delete(careEntryDoc.ref);
    });
    await batch.commit();
  }

  const plantDocRef = doc(db, `users/${userId}/plants`, plantId);
  await deleteDoc(plantDocRef);
}
