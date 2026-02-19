import { doc, getDoc } from 'firebase/firestore';
import { db } from '@services/firebase';

export const getPlantDetails = async (plantId: string, userId: string) => {
  console.log(
    'Fetching details for plant ID:',
    plantId,
    'and user ID:',
    userId
  );
  const docRef = doc(db, `users/${userId}/plants`, plantId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name ?? '',
      species: data.species ?? '',
      wateringFrequency: data.wateringFrequency ?? 0,
      lastWatered: data.lastWatered?.toDate?.() ?? null,
      notes: data.notes ?? '',
      creationDate: data.creationDate?.toDate?.() ?? null,
      imageUrl: data.imageUrl ?? null,
    };
  } else {
    return null;
  }
};
