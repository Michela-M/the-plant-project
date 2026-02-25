export interface SpeciesImage {
  url: string;
  description: string;
}

export interface SpeciesCareSection {
  text: string;
  images: SpeciesImage[];
}

export interface SpeciesCharacteristics {
  difficulty: number;
  toxicity: number;
  maintenance: number;
  light: number;
  pruning: number;
  propagation: number;
}

export interface SpeciesDetailsData {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
  description: string;
  tags: string[];
  image: string;
  otherNames: string[];
  type: string[];
  similarSpecies: string[];
  characteristics: SpeciesCharacteristics;
  watering: SpeciesCareSection;
  light: SpeciesCareSection;
  humidity: SpeciesCareSection;
  temperature: SpeciesCareSection;
  soilAndRepotting: SpeciesCareSection;
  fertilizing: SpeciesCareSection;
  pestsAndProblems: SpeciesCareSection;
  propagation: SpeciesCareSection;
}
