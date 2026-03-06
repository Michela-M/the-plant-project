import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@services/firebase';

export const updateNextWatering = async (
  plantId: string,
  userId: string,
  nextWateringDate: Date | null
) => {
  try {
    const plantRef = doc(db, `users/${userId}/plants`, plantId);

    const updateData: Partial<{
      nextWateringDate: Date | null;
      trackWatering: boolean;
    }> = {
      nextWateringDate,
    };

    if (nextWateringDate === null) {
      updateData.trackWatering = false;
    }

    await updateDoc(plantRef, updateData);
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
