import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const getPlantDetails = async (plantId: string) => {
  try {
    const docRef = doc(db, 'test-plants', plantId);
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
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
