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
  try {
    const {
      name,
      species = '',
      notes = '',
      wateringFrequency = 0,
      lastWateredDate = null,
      userId,
    } = plantData;

    const creationDate = new Date();
    const inferredWateringFrequency = wateringFrequency || 0;
    const secondLastWateredDate = null;

    let nextWateringDate: Date | null = null;
    let trackWatering = false;

    if (wateringFrequency && lastWateredDate) {
      nextWateringDate = calculateNextWateringDate({
        lastWateredDate,
        wateringFrequency,
      });
      trackWatering = true;
    }

    const plantDoc = {
      creationDate,
      name,
      species,
      notes,
      wateringFrequency,
      lastWateredDate,
      inferredWateringFrequency,
      secondLastWateredDate,
      nextWateringDate,
      trackWatering,
      userId,
    };

    const plantId = await addDoc(
      collection(db, `users/${plantData.userId}/plants`),
      plantDoc
    );

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

    return plantDoc;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
