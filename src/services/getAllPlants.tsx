import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

export const getAllPlants = async () => {
  const q = query(
    collection(db, 'test-plants'),
    orderBy('creationDate', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name ?? 'Unnamed Plant',
      species: data.species ?? '',
      imageUrl: data.imageUrl ?? null,
    };
  });
};
