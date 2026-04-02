import { H2, H3 } from '@components/Typography';
import formatRelativeDate from '@utils/formatRelativeDate';
import ScheduleListItem from './ScheduleListItem';

type UpcomingPlant = {
  id: string;
  name: string;
  speciesName: string;
  nextWateringDate: Date | null;
  wateringFrequency: number | null;
  inferredWateringFrequency?: number | null;
  lastWateredDate?: Date | null;
  imageUrl?: string | null;
};

const formatGroupLabel = (date: Date) => {
  const absolute = date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  const relative = formatRelativeDate({ date });

  return `${absolute} (${relative})`;
};

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export default function UpcomingCareSection({
  plants,
}: {
  plants: UpcomingPlant[];
}) {
  const groupedByDate = plants.reduce(
    (acc, plant) => {
      if (!plant.nextWateringDate) {
        return acc;
      }

      const dateKey = getDateKey(plant.nextWateringDate);

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: plant.nextWateringDate,
          plants: [],
        };
      }

      acc[dateKey].plants.push(plant);
      return acc;
    },
    {} as Record<string, { date: Date; plants: UpcomingPlant[] }>
  );

  const groupedEntries = Object.entries(groupedByDate);

  return (
    <div className="flex flex-col gap-3">
      <H2>Upcoming Care</H2>
      {groupedEntries.length > 0 ? (
        groupedEntries.map(([dateKey, group]) => {
          const headingDate = group.date;

          return (
            <section key={dateKey} className="flex flex-col gap-2">
              <H3>{formatGroupLabel(headingDate)}</H3>
              {group.plants.map((plant) => (
                <ScheduleListItem
                  key={plant.id}
                  id={plant.id}
                  name={plant.name}
                  species={plant.speciesName}
                  wateringFrequency={plant.wateringFrequency ?? 0}
                  inferredWateringFrequency={
                    plant.inferredWateringFrequency ?? null
                  }
                  imageUrl={plant.imageUrl}
                />
              ))}
            </section>
          );
        })
      ) : (
        <p>No upcoming care.</p>
      )}
    </div>
  );
}
