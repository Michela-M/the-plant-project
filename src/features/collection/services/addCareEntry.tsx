import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@services/firebase';
import {
  calculateNextWateringDate,
  calculateWateringFrequency,
} from '../utils/wateringUtils';
import { firebaseTimestampToDate } from '../utils/firebaseDate';

export const addCareEntry = async (careData: {
  careType: string;
  date: Date;
  notes?: string;
  otherCareType?: string;
  plantId: string;
  userId: string;
}) => {
  try {
    await addDoc(
      collection(
        db,
        `users/${careData.userId}/plants/${careData.plantId}/careEntries`
      ),
      {
        careType: careData.careType,
        date: careData.date,
        notes: careData.notes || '',
        otherCareType: careData.otherCareType || '',
      }
    );

    if (careData.careType !== 'water') {
      return;
    }

    const plantRef = doc(
      db,
      `users/${careData.userId}/plants/${careData.plantId}`
    );
    const plantSnapshot = await getDoc(plantRef);

    if (!plantSnapshot.exists()) {
      return;
    }

    const plantData = plantSnapshot.data() as {
      inferredWateringFrequency?: number;
      lastWateredDate?: unknown;
      secondLastWateredDate?: unknown;
      wateringFrequency?: number;
    };

    let lastWateredDate = firebaseTimestampToDate(plantData.lastWateredDate);
    let secondLastWateredDate = firebaseTimestampToDate(
      plantData.secondLastWateredDate
    );

    if (lastWateredDate === null || careData.date > lastWateredDate) {
      secondLastWateredDate = lastWateredDate;
      lastWateredDate = careData.date;
    } else if (
      secondLastWateredDate === null ||
      careData.date > secondLastWateredDate
    ) {
      secondLastWateredDate = careData.date;
    }

    let inferredWateringFrequency = plantData.inferredWateringFrequency || 0;
    if (lastWateredDate && secondLastWateredDate) {
      inferredWateringFrequency = calculateWateringFrequency({
        firstDate: secondLastWateredDate,
        secondDate: lastWateredDate,
      });
    }

    const wateringFrequency = plantData.wateringFrequency || 0;

    let nextWateringDate: Date | null = null;
    if (wateringFrequency !== 0 && lastWateredDate) {
      nextWateringDate = calculateNextWateringDate({
        lastWateredDate,
        wateringFrequency,
      });
    } else if (inferredWateringFrequency !== 0 && lastWateredDate) {
      nextWateringDate = calculateNextWateringDate({
        lastWateredDate,
        wateringFrequency: inferredWateringFrequency,
      });
    }

    await updateDoc(plantRef, {
      inferredWateringFrequency,
      lastWateredDate,
      nextWateringDate,
      secondLastWateredDate,
    });
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
