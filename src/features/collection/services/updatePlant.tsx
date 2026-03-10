import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@services/firebase';

export const updatePlant = async (
  plantId: string,
  plantData: {
    imageUrl?: string;
    name?: string;
    notes?: string;
    species?: string;
    trackWatering?: boolean;
    wateringFrequency?: number;
    nextWateringDate?: Date | null;
    inferredWateringFrequency?: number | null;
    lastWateredDate?: Date | null;
    secondLastWateredDate?: Date | null;
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
      trackWatering?: boolean;
      wateringFrequency?: number;
      nextWateringDate?: Date | null;
      inferredWateringFrequency?: number | null;
      lastWateredDate?: Date | null;
      secondLastWateredDate?: Date | null;
    } = plantData;

    await updateDoc(plantRef, updateData);
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
