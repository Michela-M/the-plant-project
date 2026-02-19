import { addDoc, collection } from 'firebase/firestore';
import { db } from '@services/firebase';

export const addPlant = async (plantData: {
  name: string;
  species?: string;
  wateringFrequency?: number;
  lastWatered?: Date | null;
  notes?: string;
}) => {
  try {
    await addDoc(collection(db, 'test-plants'), {
      name: plantData.name,
      species: plantData.species || '',
      wateringFrequency: plantData.wateringFrequency || 0,
      lastWatered: plantData.lastWatered || null,
      notes: plantData.notes || '',
      creationDate: new Date(),
    });
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
