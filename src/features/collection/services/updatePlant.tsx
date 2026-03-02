import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@services/firebase';
import {
  calculateNextWateringDate,
  calculateWateringFrequency,
} from '../utils/wateringUtils';
import { firebaseTimestampToDate } from '../utils/firebaseDate';

export const updatePlant = async (
  plantId: string,
  plantData: {
    imageUrl?: string;
    name: string;
    notes?: string;
    species?: string;
    wateringFrequency?: number;
  },
  userId: string
) => {
  try {
    const plantRef = doc(db, `users/${userId}/plants`, plantId);

    const plantSnapshot = await getDoc(plantRef);
    const existingPlantData = plantSnapshot.exists()
      ? (plantSnapshot.data() as {
          inferredWateringFrequency?: number;
          lastWateredDate?: unknown;
          secondLastWateredDate?: unknown;
          wateringFrequency?: number;
        })
      : {};

    const wateringFrequency = plantData.wateringFrequency ?? 0;
    const lastWateredDate = firebaseTimestampToDate(
      existingPlantData.lastWateredDate
    );
    const secondLastWateredDate = firebaseTimestampToDate(
      existingPlantData.secondLastWateredDate
    );

    let inferredWateringFrequency =
      existingPlantData.inferredWateringFrequency || 0;
    let nextWateringDate: Date | null = null;

    if (wateringFrequency !== 0) {
      inferredWateringFrequency = wateringFrequency;
      if (lastWateredDate !== null) {
        nextWateringDate = calculateNextWateringDate({
          lastWateredDate,
          wateringFrequency,
        });
      }
    } else if (lastWateredDate !== null && secondLastWateredDate !== null) {
      inferredWateringFrequency = calculateWateringFrequency({
        firstDate: secondLastWateredDate,
        secondDate: lastWateredDate,
      });
      nextWateringDate = calculateNextWateringDate({
        lastWateredDate,
        wateringFrequency: inferredWateringFrequency,
      });
    }

    await updateDoc(plantRef, {
      name: plantData.name,
      species: plantData.species || '',
      wateringFrequency,
      inferredWateringFrequency,
      notes: plantData.notes || '',
      imageUrl: plantData.imageUrl || '',
      nextWateringDate,
    });
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
