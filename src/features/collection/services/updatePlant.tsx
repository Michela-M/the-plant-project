import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@services/firebase';

export const updatePlant = async (
  plantId: string,
  plantData: {
    name: string;
    species?: string;
    wateringFrequency?: number;
    lastWatered?: Date | null;
    notes?: string;
    imageUrl?: string;
  },
  userId: string
) => {
  try {
    const plantRef = doc(db, `users/${userId}/plants`, plantId);
    await updateDoc(plantRef, {
      name: plantData.name,
      species: plantData.species || '',
      wateringFrequency: plantData.wateringFrequency || 0,
      lastWatered: plantData.lastWatered || null,
      notes: plantData.notes || '',
      imageUrl: plantData.imageUrl || '',
    });
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
