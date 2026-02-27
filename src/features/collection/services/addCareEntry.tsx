import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@services/firebase';
import {
  calculateNextWateringDate,
  calculateWateringFrequency,
} from '../utils/wateringUtils';

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

    const isWaterCareType = careData.careType
      .trim()
      .toLowerCase()
      .startsWith('water');

    if (isWaterCareType) {
      const plantRef = doc(
        db,
        `users/${careData.userId}/plants`,
        careData.plantId
      );
      const plantSnapshot = await getDoc(plantRef);

      if (!plantSnapshot.exists()) {
        return;
      }

      const plantData = plantSnapshot.data();
      const currentLastWateredDate =
        plantData.lastWateredDate?.toDate?.() ?? null;
      const currentSecondLastWateredDate =
        plantData.secondLastWateredDate?.toDate?.() ?? null;

      const isNewerThanLastWateredDate =
        !currentLastWateredDate || careData.date > currentLastWateredDate;

      const isBetweenLastAndSecondWateredDates =
        !!currentLastWateredDate &&
        careData.date < currentLastWateredDate &&
        (!currentSecondLastWateredDate ||
          careData.date > currentSecondLastWateredDate);

      if (isNewerThanLastWateredDate) {
        const inferredWateringFrequency = currentLastWateredDate
          ? calculateWateringFrequency({
              firstDate: currentLastWateredDate,
              secondDate: careData.date,
            })
          : null;

        const nextWateringDate =
          inferredWateringFrequency && inferredWateringFrequency > 0
            ? calculateNextWateringDate({
                lastWateredDate: careData.date,
                wateringFrequency: inferredWateringFrequency,
              })
            : null;

        await updateDoc(plantRef, {
          lastWateredDate: careData.date,
          secondLastWateredDate: currentLastWateredDate,
          inferredWateringFrequency,
          nextWateringDate,
        });

        return;
      }

      if (!isBetweenLastAndSecondWateredDates) {
        return;
      }

      const inferredWateringFrequency = calculateWateringFrequency({
        firstDate: careData.date,
        secondDate: currentLastWateredDate,
      });

      const nextWateringDate =
        inferredWateringFrequency > 0
          ? calculateNextWateringDate({
              lastWateredDate: currentLastWateredDate,
              wateringFrequency: inferredWateringFrequency,
            })
          : null;

      await updateDoc(plantRef, {
        lastWateredDate: currentLastWateredDate,
        secondLastWateredDate: careData.date,
        inferredWateringFrequency,
        nextWateringDate,
      });
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
