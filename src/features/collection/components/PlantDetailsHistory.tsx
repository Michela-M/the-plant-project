import fertilizerIcon from '@assets/icons/fertilizer.svg?react';
import repotIcon from '@assets/icons/plant-pot.svg?react';
import seedlings from '@assets/icons/seedlings.svg?react';
import wateringCan from '@assets/icons/watering-can.svg?react';
import IconTile from '@components/IconTile';
import Spinner from '@components/Spinner';
import { H2, H3, Headline } from '@components/Typography';
import { useMemo } from 'react';
import useCareHistory from '../hooks/useCareHistory';

function getCareTypeIcon(careType: string) {
  switch (careType) {
    case 'water':
      return (
        <IconTile Icon={wateringCan} label="Watering can icon" color="blue" />
      );
    case 'fertilize':
      return (
        <IconTile
          Icon={fertilizerIcon}
          label="Fertilizer icon"
          color="yellow"
        />
      );
    case 'repot':
      return <IconTile Icon={repotIcon} label="Repot icon" color="orange" />;
    default:
      return <IconTile Icon={seedlings} label="Other care icon" color="pink" />;
  }
}

const careLabels: Record<string, string> = {
  water: 'Plant watered',
  fertilize: 'Plant fertilized',
  repot: 'Plant repotted',
  other: 'Other',
};

export default function PlantDetailsHistory({
  plantId,
}: Readonly<{ plantId: string }>) {
  const { careHistory, loading } = useCareHistory(plantId);

  const groupedCareHistory = useMemo(() => {
    return careHistory.reduce<
      Array<{ title: string; entries: typeof careHistory }>
    >((groups, entry) => {
      const title = entry.date.toLocaleDateString();
      const existingGroup = groups.find((group) => group.title === title);

      if (existingGroup) {
        existingGroup.entries.push(entry);
      } else {
        groups.push({ title, entries: [entry] });
      }

      return groups;
    }, []);
  }, [careHistory]);

  if (loading) {
    return <Spinner label="Loading care history..." />;
  }

  if (careHistory.length === 0) {
    return (
      <div className="flex flex-col">
        <H2>Care History</H2>
        <p className="text-stone-500">No care history available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <H2>Care History</H2>
      {groupedCareHistory.map((group) => (
        <div key={group.title} className="flex flex-col gap-3">
          <H3>{group.title}</H3>
          {group.entries.map((entry) => (
            <CareEntry key={entry.id} entry={entry} />
          ))}
        </div>
      ))}
    </div>
  );
}

function CareEntry({
  entry,
}: Readonly<{
  entry: {
    date: Date;
    careType: string;
    notes: string;
    otherCareType?: string;
  };
}>) {
  return (
    <div className="flex flex-row px-3 gap-3 items-center">
      {getCareTypeIcon(entry.careType)}
      <div className="flex flex-col">
        <Headline>
          {careLabels[entry.careType] || careLabels['other']}
          {entry.careType === 'other' && entry.otherCareType
            ? `: ${entry.otherCareType}`
            : ''}
        </Headline>
        {entry.notes && <p>{entry.notes}</p>}
      </div>
    </div>
  );
}
