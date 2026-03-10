import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from '@services/firebase';

export const addCareEntry = async (careData: {
  careType: string;
  date: Date;
  notes?: string;
  otherCareType?: string;
  plantId: string;
  userId: string;
  secondLastWateredDate?: Date | null;
  lastWateredDate?: Date | null;
  inferredWateringFrequency?: number | null;
  nextWateringDate?: Date | null;
}) => {
  try {
    const batch = writeBatch(db);

    const careEntryRef = doc(
      collection(
        db,
        `users/${careData.userId}/plants/${careData.plantId}/careEntries`
      )
    );
    batch.set(careEntryRef, {
      careType: careData.careType,
      date: careData.date,
      notes: careData.notes || '',
      otherCareType: careData.otherCareType || '',
    });

    if (careData.careType === 'water') {
      const plantRef = doc(
        db,
        `users/${careData.userId}/plants/${careData.plantId}`
      );
      batch.update(plantRef, {
        inferredWateringFrequency: careData.inferredWateringFrequency,
        lastWateredDate: careData.lastWateredDate,
        secondLastWateredDate: careData.secondLastWateredDate,
        nextWateringDate: careData.nextWateringDate,
      });
    }

    await batch.commit();
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
