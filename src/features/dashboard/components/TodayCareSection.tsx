import ScheduleCard from './ScheduleCard';

export default function TodayCareSection({
  plants,
}: {
  plants: {
    id: string;
    name: string;
    species: string;
    wateringFrequency: number | null;
    inferredWateringFrequency?: number | null;
    lastWateredDate?: Date | null;
    imageUrl?: string | null;
  }[];
}) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {plants.length > 0 &&
        plants.map((plant) => (
          <ScheduleCard
            key={plant.id}
            id={plant.id}
            name={plant.name}
            species={plant.species}
            wateringFrequency={plant.wateringFrequency ?? null}
            inferredWateringFrequency={plant.inferredWateringFrequency ?? null}
            lastWateredDate={plant.lastWateredDate ?? null}
            imageUrl={plant.imageUrl}
          />
        ))}
    </div>
  );
}
