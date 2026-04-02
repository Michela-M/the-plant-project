import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from '@services/firebase';

export const addPlant = async (plantData: {
  lastWateredDate: Date | null;
  name: string;
  nextWateringDate: Date | null;
  notes: string;
  speciesId: string | null;
  speciesName: string;
  trackWatering: boolean;
  wateringFrequency: number;
  userId: string;
}) => {
  try {
    const {
      name,
      speciesId,
      speciesName,
      notes,
      wateringFrequency,
      lastWateredDate,
      nextWateringDate,
      trackWatering,
    } = plantData;
    const creationDate = new Date();

    const plantDoc = {
      creationDate,
      name,
      speciesId,
      speciesName,
      notes,
      wateringFrequency,
      lastWateredDate,
      inferredWateringFrequency: wateringFrequency,
      nextWateringDate,
      trackWatering,
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
        date: plantData.lastWateredDate,
        careType: 'water',
      });
    }

    await batch.commit();
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
