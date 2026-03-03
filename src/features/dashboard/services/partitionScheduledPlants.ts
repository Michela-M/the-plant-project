import type { ScheduledPlant } from './getScheduledPlants';

export const partitionScheduledPlants = (
  plants: ScheduledPlant[],
  now = new Date()
) => {
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  return plants.reduce(
    (acc, plant) => {
      if (!plant.nextWateringDate) {
        return acc;
      }

      if (plant.nextWateringDate <= endOfToday) {
        acc.todayOrOverdue.push(plant);
        return acc;
      }

      acc.afterToday.push(plant);
      return acc;
    },
    {
      todayOrOverdue: [] as ScheduledPlant[],
      afterToday: [] as ScheduledPlant[],
    }
  );
};
