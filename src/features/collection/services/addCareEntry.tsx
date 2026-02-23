import { addDoc, collection } from 'firebase/firestore';
import { db } from '@services/firebase';

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
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
};
