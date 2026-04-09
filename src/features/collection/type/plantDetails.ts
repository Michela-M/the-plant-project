export interface PlantDetails {
  id: string;
  name: string;
  speciesId: string | null;
  speciesName: string;
  wateringFrequency: number;
  lastWateredDate: Date | null;
  notes: string;
  creationDate: Date | null;
  imageUrl: string | null;
  trackWatering: boolean;
}
