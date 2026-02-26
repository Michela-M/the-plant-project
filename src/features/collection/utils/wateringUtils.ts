/**
 * Calculates the number of whole days between two dates.
 *
 * Uses the absolute time difference, so argument order does not matter.
 * Any partial day is rounded up to the next whole day.
 *
 * @param params - Function parameters.
 * @param params.firstDate - One date in the comparison.
 * @param params.secondDate - The other date in the comparison.
 * @returns The day difference as a positive integer.
 */
export function calculateWateringFrequency({
  firstDate,
  secondDate,
}: {
  firstDate: Date;
  secondDate: Date;
}): number {
  const diffTime = Math.abs(secondDate.getTime() - firstDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Calculates the next watering date from a last-watered date and frequency.
 *
 * @param params - Function parameters.
 * @param params.lastWateredDate - The date the plant was last watered.
 * @param params.wateringFrequency - Number of days between waterings.
 * @returns A new `Date` representing the next watering day.
 */
export function calculateNextWateringDate({
  lastWateredDate,
  wateringFrequency,
}: {
  lastWateredDate: Date;
  wateringFrequency: number;
}): Date {
  const nextWatering = new Date(
    lastWateredDate.getTime() + wateringFrequency * 24 * 60 * 60 * 1000
  );
  return nextWatering;
}
