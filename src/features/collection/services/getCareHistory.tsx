import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@services/firebase';

export const getCareHistory = async (plantId: string, userId: string) => {
  const q = query(
    collection(db, `users/${userId}/plants/${plantId}/careEntries`),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      date: data.date.toDate(),
      careType: data.careType,
      notes: data.notes || '',
      otherCareType: data.otherCareType || '',
    };
  });
};
