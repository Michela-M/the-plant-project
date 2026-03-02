import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@services/firebase';

export type ScheduledPlant = {
  id: string;
  imageUrl?: string | null;
  name: string;
  species: string;
  wateringFrequency: number | null;
  nextWateringDate: Date | null;
  lastWateredDate?: Date | null;
  inferredWateringFrequency?: number | null;
};

export const getScheduledPlants = async (userId: string) => {
  const q = query(
    collection(db, 'users', userId, 'plants'),
    where('trackWatering', '==', true),
    orderBy('nextWateringDate', 'asc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc): ScheduledPlant => {
    const data = doc.data();

    return {
      id: doc.id,
      imageUrl: data.imageUrl ?? null,
      name: data.name ?? 'Unnamed Plant',
      species: data.species ?? '',
      wateringFrequency: data.wateringFrequency ?? null,
      nextWateringDate: data.nextWateringDate?.toDate?.() ?? null,
      lastWateredDate: data.lastWateredDate?.toDate?.() ?? null,
      inferredWateringFrequency: data.inferredWateringFrequency ?? null,
    };
  });
};
