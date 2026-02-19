import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@services/firebase';

export const getAllPlants = async (userId: string) => {
  const q = query(
    collection(db, `users/${userId}/plants`),
    orderBy('creationDate', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      imageUrl: data.imageUrl ?? null,
      name: data.name ?? 'Unnamed Plant',
      species: data.species ?? '',
    };
  });
};
