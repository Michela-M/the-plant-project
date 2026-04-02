import { getDocs, collection, where, query } from 'firebase/firestore';
import { db } from '@services/firebase';

export const getUserPlants = async (userId: string, speciesId: string) => {
  const q = query(
    collection(db, `users/${userId}/plants`),
    where('speciesId', '==', speciesId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      imageUrl: data.imageUrl ?? null,
      name: data.name ?? 'Unnamed Plant',
      speciesName: data.speciesName ?? '',
    };
  });
};
