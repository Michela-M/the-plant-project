import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

export const getAllPlants = async () => {
  try {
    const q = query(
      collection(db, 'test-plants'),
      orderBy('creationDate', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name ?? '',
        species: data.species ?? '',
        wateringFrequency: data.wateringFrequency ?? 0,
        lastWatered: data.lastWatered?.toDate?.() ?? null,
        notes: data.notes ?? '',
        creationDate: data.creationDate?.toDate?.() ?? null,
      };
    });
  } catch (error) {
    console.error('Error fetching plants:', error);
    return [];
  }
};
