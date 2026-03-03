import formatRelativeDate from '@utils/formatRelativeDate';
import { H2 } from '@components/Typography';

export default function PlantDetailsSchedule({
  plant,
}: {
  plant: { wateringFrequency?: number; lastWateredDate?: Date | null };
}) {
  // 1. Empty state: no info at all
  if (
    !plant.lastWateredDate &&
    (!plant.wateringFrequency || plant.wateringFrequency <= 0)
  ) {
    return (
      <div className="flex flex-col gap-3">
        <H2>Watering Schedule</H2>
        <p className="text-stone-500">No watering information available.</p>
      </div>
    );
  }

  // 2. Compute next watering if both values exist
  let nextWatering: string | null = null;
  if (
    plant.lastWateredDate &&
    plant.wateringFrequency &&
    plant.wateringFrequency > 0
  ) {
    const next = new Date(
      plant.lastWateredDate.getTime() +
        plant.wateringFrequency * 24 * 60 * 60 * 1000
    );
    nextWatering =
      next > new Date() ? formatRelativeDate({ date: next }) : 'Due now';
  }

  return (
    <div className="flex flex-col gap-2">
      <H2>Watering Schedule</H2>

      <div className="flex flex-col gap-1">
        {/* 3. Last watered (only if available) */}
        {plant.lastWateredDate && (
          <div className="flex justify-between">
            <p>Last watered:</p>
            <p>{formatRelativeDate({ date: plant.lastWateredDate })}</p>
          </div>
        )}

        {/* 4. Next watering (only if both exist) */}
        {nextWatering && (
          <div className="flex justify-between">
            <p>Next watering:</p>
            <p>{nextWatering}</p>
          </div>
        )}

        {/* 5. Average interval (only if frequency exists) */}
        {(plant.wateringFrequency ?? 0) > 0 && (
          <div className="flex justify-between">
            <p>Watering frequency:</p>
            <p>{plant.wateringFrequency} days</p>
          </div>
        )}
      </div>
    </div>
  );
}
