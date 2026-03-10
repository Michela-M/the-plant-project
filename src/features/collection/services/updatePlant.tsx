import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@services/firebase';

export const updatePlant = async (
  plantId: string,
  plantData: {
    imageUrl?: string;
    name?: string;
    notes?: string;
    species?: string;
    wateringFrequency?: number;
    nextWateringDate?: Date | null;
    inferredWateringFrequency?: number | null;
  },
  userId: string
) => {
  try {
    const plantRef = doc(db, `users/${userId}/plants`, plantId);

    const updateData: {
      imageUrl?: string;
      name?: string;
      notes?: string;
      species?: string;
      wateringFrequency?: number;
      nextWateringDate?: Date | null;
      inferredWateringFrequency?: number | null;
    } = plantData;

    await updateDoc(plantRef, updateData);
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
