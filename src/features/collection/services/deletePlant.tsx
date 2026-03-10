import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@services/firebase';

export default async function deletePlant(plantId: string, userId: string) {
  const BATCH_LIMIT = 500;
  const careEntriesCollectionRef = collection(
    db,
    `users/${userId}/plants/${plantId}/careEntries`
  );
  const careEntriesSnapshot = await getDocs(careEntriesCollectionRef);

  if (!careEntriesSnapshot.empty && careEntriesSnapshot.docs.length > 0) {
    const docs = careEntriesSnapshot.docs;

    for (let i = 0; i < docs.length; i += BATCH_LIMIT) {
      const batch = writeBatch(db);
      const chunk = docs.slice(i, i + BATCH_LIMIT);

      chunk.forEach((careEntryDoc) => {
        batch.delete(careEntryDoc.ref);
      });

      await batch.commit();
    }
  }

  const plantDocRef = doc(db, `users/${userId}/plants`, plantId);
  await deleteDoc(plantDocRef);
}
