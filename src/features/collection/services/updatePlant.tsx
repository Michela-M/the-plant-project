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
    name?: string;
    notes?: string;
    species?: string;
    wateringFrequency?: number;
    trackWatering?: boolean;
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

    const hasWateringFrequency = plantData.wateringFrequency !== undefined;
    const wateringFrequency = plantData.wateringFrequency;
    const lastWateredDate = firebaseTimestampToDate(
      existingPlantData.lastWateredDate
    );
    const secondLastWateredDate = firebaseTimestampToDate(
      existingPlantData.secondLastWateredDate
    );

    let inferredWateringFrequency =
      existingPlantData.inferredWateringFrequency || 0;
    let nextWateringDate: Date | null = null;

    if (wateringFrequency !== undefined && wateringFrequency !== 0) {
      inferredWateringFrequency = wateringFrequency;
      if (lastWateredDate !== null) {
        nextWateringDate = calculateNextWateringDate({
          lastWateredDate,
          wateringFrequency: inferredWateringFrequency,
        });
      }
    } else if (
      wateringFrequency === 0 &&
      lastWateredDate !== null &&
      secondLastWateredDate !== null
    ) {
      inferredWateringFrequency = calculateWateringFrequency({
        firstDate: secondLastWateredDate,
        secondDate: lastWateredDate,
      });
      nextWateringDate = calculateNextWateringDate({
        lastWateredDate,
        wateringFrequency: inferredWateringFrequency,
      });
    }

    const updateData: {
      imageUrl?: string;
      name?: string;
      notes?: string;
      species?: string;
      wateringFrequency?: number;
      inferredWateringFrequency?: number;
      nextWateringDate?: Date | null;
      trackWatering?: boolean;
    } = {};

    if (plantData.imageUrl !== undefined) {
      updateData.imageUrl = plantData.imageUrl;
    }

    if (plantData.name !== undefined) {
      updateData.name = plantData.name;
    }

    if (plantData.notes !== undefined) {
      updateData.notes = plantData.notes;
    }

    if (plantData.species !== undefined) {
      updateData.species = plantData.species;
    }

    if (hasWateringFrequency && wateringFrequency !== undefined) {
      updateData.wateringFrequency = wateringFrequency;
      updateData.inferredWateringFrequency = inferredWateringFrequency;
      updateData.nextWateringDate = nextWateringDate;
    }

    if (plantData.trackWatering !== undefined) {
      updateData.trackWatering = plantData.trackWatering;
    }

    if (Object.keys(updateData).length === 0) {
      return;
    }

    await updateDoc(plantRef, updateData);
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
