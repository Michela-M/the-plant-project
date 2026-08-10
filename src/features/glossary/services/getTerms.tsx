import { db } from '@services/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export const getTerms = async () => {
  const q = query(collection(db, 'glossary'), orderBy('term', 'asc'));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      term: data.term ?? '',
      definition: data.definition ?? '',
      images: data.images ?? [],
    };
  });
};
