import { doc, getDoc } from 'firebase/firestore';
import { db } from '@services/firebase';

export const getPlantDetails = async (plantId: string, userId: string) => {
  const docRef = doc(db, `users/${userId}/plants`, plantId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name ?? '',
      species: data.speciesName ?? '',
      wateringFrequency: data.wateringFrequency ?? 0,
      lastWateredDate: data.lastWateredDate?.toDate?.() ?? null,
      notes: data.notes ?? '',
      creationDate: data.creationDate?.toDate?.() ?? null,
      imageUrl: data.imageUrl ?? null,
      nextWateringDate: data.nextWateringDate?.toDate?.() ?? null,
      trackWatering: data.trackWatering ?? false,
      secondLastWateredDate: data.secondLastWateredDate?.toDate?.() ?? null,
      inferredWateringFrequency: data.inferredWateringFrequency ?? null,
    };
  } else {
    return null;
  }
};
