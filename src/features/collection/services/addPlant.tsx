import { collection, doc, writeBatch } from 'firebase/firestore';
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

    const batch = writeBatch(db);
    const plantsCollectionRef = collection(
      db,
      `users/${plantData.userId}/plants`
    );
    const plantRef = doc(plantsCollectionRef);

    batch.set(plantRef, plantDoc);

    if (plantData.lastWateredDate) {
      const careEntriesCollectionRef = collection(
        db,
        `users/${plantData.userId}/plants/${plantRef.id}/careEntries`
      );
      const careEntryRef = doc(careEntriesCollectionRef);

      batch.set(careEntryRef, {
        careType: 'water',
        date: plantData.lastWateredDate,
        notes: '',
      });
    }

    await batch.commit();

    return plantDoc;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
