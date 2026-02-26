import { addDoc, collection } from 'firebase/firestore';
import { db } from '@services/firebase';

export const addPlant = async (plantData: {
  lastWateredDate?: Date | null;
  name: string;
  notes?: string;
  species?: string;
  userId: string;
  wateringFrequency?: number;
}) => {
  try {
    await addDoc(collection(db, `users/${plantData.userId}/plants`), {
      creationDate: new Date(),
      lastWateredDate: plantData.lastWateredDate || null,
      name: plantData.name,
      notes: plantData.notes || '',
      species: plantData.species || '',
      wateringFrequency: plantData.wateringFrequency || 0,
    });
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
