// return the inferred watering frequency, the last watered date, the second last watered date, and the next watering date.
import { getPlantDetails } from '../services/getPlantDetails';
import {
  calculateNextWateringDate,
  calculateWateringFrequency,
} from './wateringUtils';
import { firebaseTimestampToDate } from './firebaseDate';

type UpdateWateringDatesOptions =
  | { date: Date; wateringFreq?: never }
  | { date?: never; wateringFreq: number };

export default async function updateWateringDates(
  plantId: string,
  userId: string,
  options: UpdateWateringDatesOptions
) {
  const { date, wateringFreq } = options;
  const plantDetails = await getPlantDetails(plantId, userId);
  let lastWateredDate = firebaseTimestampToDate(plantDetails?.lastWateredDate);
  let secondLastWateredDate = firebaseTimestampToDate(
    plantDetails?.secondLastWateredDate
  );
  const wateringFrequency =
    wateringFreq || plantDetails?.wateringFrequency || 0;

  // Update lastWateredDate and secondLastWateredDate based on the new care entry date
  if (date) {
    if (!lastWateredDate || date > lastWateredDate) {
      secondLastWateredDate = lastWateredDate;
      lastWateredDate = date;
    } else if (!secondLastWateredDate || date > secondLastWateredDate) {
      secondLastWateredDate = date;
    }
  }

  // Calculate inferred watering frequency based on the two most recent watering dates
  let inferredWateringFrequency =
    plantDetails?.inferredWateringFrequency || wateringFrequency || 0;
  if (
    lastWateredDate &&
    secondLastWateredDate &&
    lastWateredDate > secondLastWateredDate
  ) {
    inferredWateringFrequency = calculateWateringFrequency({
      firstDate: lastWateredDate,
      secondDate: secondLastWateredDate,
    });
  }

  // Calculate next watering date based on the watering frequency or the inferred watering frequency
  let nextWateringDate = plantDetails?.nextWateringDate || null;
  if (wateringFrequency !== 0 && lastWateredDate) {
    nextWateringDate = calculateNextWateringDate({
      lastWateredDate,
      wateringFrequency,
    });
  } else if (inferredWateringFrequency !== 0 && lastWateredDate) {
    nextWateringDate = calculateNextWateringDate({
      lastWateredDate,
      wateringFrequency: inferredWateringFrequency,
    });
  }

  return {
    inferredWateringFrequency,
    lastWateredDate,
    secondLastWateredDate,
    nextWateringDate,
  };
}
