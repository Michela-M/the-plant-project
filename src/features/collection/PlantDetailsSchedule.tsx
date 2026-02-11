import formatRelativeDate from '../../utils/formatRelativeDate';

export default function PlantDetailsSchedule({
  plant,
}: {
  plant: { wateringFrequency?: number; lastWatered?: Date | null };
}) {
  const hasLastWatered = !!plant.lastWatered;
  const hasFrequency = typeof plant.wateringFrequency === 'number';

  // 1. Empty state: no info at all
  if (!hasLastWatered && !hasFrequency) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl">Watering Schedule</h2>
        <p className="text-stone-500">No watering information available.</p>
      </div>
    );
  }

  // 2. Compute next watering if both values exist
  let nextWatering: string | null = null;
  if (hasLastWatered && hasFrequency) {
    const next = new Date(
      plant.lastWatered!.getTime() +
        plant.wateringFrequency! * 24 * 60 * 60 * 1000
    );
    nextWatering =
      next > new Date() ? formatRelativeDate({ date: next }) : 'Due now';
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl">Watering Schedule</h2>

      <div className="flex flex-col gap-1">
        {/* 3. Last watered (only if available) */}
        {hasLastWatered && (
          <div className="flex justify-between">
            <p>Last watered:</p>
            <p>{formatRelativeDate({ date: plant.lastWatered! })}</p>
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
        {hasFrequency && (
          <div className="flex justify-between">
            <p>Watering frequency:</p>
            <p>{plant.wateringFrequency} days</p>
          </div>
        )}
      </div>
    </div>
  );
}
