import { doc, getDoc } from 'firebase/firestore';
import { db } from '@services/firebase';
import type {
  SpeciesCharacteristics,
  SpeciesDetailsData,
} from '../types/speciesDetails';

export const getSpeciesDetails = async (
  speciesId: string
): Promise<SpeciesDetailsData | null> => {
  const docRef = doc(db, 'species', speciesId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  const characteristics: SpeciesCharacteristics = {
    difficulty: data.characteristics?.difficulty ?? 0,
    toxicity: data.characteristics?.toxicity ?? 0,
    maintenance: data.characteristics?.maintenance ?? 0,
    light: data.characteristics?.light ?? 0,
    pruning: data.characteristics?.pruning ?? 0,
    propagation: data.characteristics?.propagation ?? 0,
  };

  return {
    id: docSnap.id,
    commonName: data.commonName ?? '',
    scientificName: data.scientificName ?? '',
    family: data.family ?? '',
    description: data.description ?? '',
    otherNames: data.otherNames ?? [],
    type: data.type ?? [],
    characteristics,

    watering: data.watering ?? { text: '', images: [] },
    light: data.light ?? { text: '', images: [] },
    humidity: data.humidity ?? { text: '', images: [] },
    temperature: data.temperature ?? { text: '', images: [] },
    soilAndRepotting: data.soilAndRepotting ?? { text: '', images: [] },
    fertilizing: data.fertilizing ?? { text: '', images: [] },
    pestsAndProblems: data.pestsAndProblems ?? { text: '', images: [] },
    propagation: data.propagation ?? { text: '', images: [] },

    image: data.image ?? '',
    tags: data.tags ?? [],
    similarSpecies: data.similarSpecies ?? [],
  };
};
