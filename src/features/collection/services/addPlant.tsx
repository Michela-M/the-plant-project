import { addDoc, collection } from 'firebase/firestore';
import { db } from '@services/firebase';
import { calculateNextWateringDate } from '../utils/wateringUtils';

export const addPlant = async (plantData: {
  lastWateredDate?: Date | null;
  name: string;
  notes?: string;
  species?: string;
  userId: string;
  wateringFrequency?: number;
}) => {
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
    const plantId = await addDoc(
      collection(db, `users/${plantData.userId}/plants`),
      {
        creationDate: new Date(),
        lastWateredDate: plantData.lastWateredDate || null,
        name: plantData.name,
        notes: plantData.notes || '',
        species: plantData.species || '',
        wateringFrequency: plantData.wateringFrequency || 0,
        nextWateringDate: nextWateringDate,
        secondLastWateredDate: null,
        inferredWateringFrequency: null,
        trackWatering,
      }
    );
    console.log('Added plant with ID:', plantId.id);

    if (plantData.lastWateredDate) {
      await addDoc(
        collection(
          db,
          `users/${plantData.userId}/plants/${plantId.id}/careEntries`
        ),
        {
          careType: 'water',
          date: plantData.lastWateredDate,
          notes: '',
        }
      );
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
