import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@services/firebase';

export const getAllSpecies = async () => {
  const q = query(collection(db, 'species'), orderBy('commonName', 'asc'));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      commonName: data.commonName ?? '',
      family: data.family ?? '',
      description: data.description ?? '',
      tags: data.tags ?? [],
      image: data.image ?? '',
    };
  });
};
