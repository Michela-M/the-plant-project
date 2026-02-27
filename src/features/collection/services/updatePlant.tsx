import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@services/firebase';
import {
  calculateNextWateringDate,
  calculateWateringFrequency,
} from '../utils/wateringUtils';

export const updatePlant = async (
  plantId: string,
  plantData: {
    name: string;
    species?: string;
    wateringFrequency?: number;
    lastWateredDate?: Date | null;
    secondLastWateredDate?: Date | null;
    notes?: string;
    imageUrl?: string;
  },
  userId: string
) => {
  let nextWateringDate = null;
  let trackWatering = false;
  if (
    plantData.lastWateredDate &&
    plantData.wateringFrequency &&
    plantData.wateringFrequency > 0
  ) {
    nextWateringDate = calculateNextWateringDate({
      lastWateredDate: plantData.lastWateredDate,
      wateringFrequency: plantData.wateringFrequency,
    });
    trackWatering = true;
  }

  try {
    const plantRef = doc(db, `users/${userId}/plants`, plantId);
    await updateDoc(plantRef, {
      name: plantData.name,
      species: plantData.species || '',
      wateringFrequency: plantData.wateringFrequency || 0,
      lastWateredDate: plantData.lastWateredDate || null,
      secondLastWateredDate: plantData.secondLastWateredDate || null,
      notes: plantData.notes || '',
      imageUrl: plantData.imageUrl || '',
      nextWateringDate: nextWateringDate,
      trackWatering,
    });
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
