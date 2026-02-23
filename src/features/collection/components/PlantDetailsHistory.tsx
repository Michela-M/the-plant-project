import { useEffect, useMemo, useState, type JSX } from 'react';
import { getCareHistory } from '../services/getCareHistory';
import { useAuth } from '@context/auth/useAuth';
import { useToast } from '@context/toast/useToast';
import Spinner from '@components/Spinner';
import IconTile from '@components/IconTile';
import wateringCan from '@assets/icons/watering-can.svg?react';
import fertilizerIcon from '@assets/icons/fertilizer.svg?react';
import repotIcon from '@assets/icons/plant-pot.svg?react';
import seedlings from '@assets/icons/seedlings.svg?react';

const careTypeIcons: Record<string, JSX.Element> = {
  water: <IconTile Icon={wateringCan} label="Watering can icon" color="blue" />,
  fertilize: (
    <IconTile Icon={fertilizerIcon} label="Fertilizer icon" color="yellow" />
  ),
  repot: <IconTile Icon={repotIcon} label="Repot icon" color="orange" />,
  other: <IconTile Icon={seedlings} label="Other care icon" color="pink" />,
};

const careLabels: Record<string, string> = {
  water: 'Plant watered',
  fertilize: 'Plant fertilized',
  repot: 'Plant repotted',
  other: 'Other',
};

export default function PlantDetailsHistory({ plantId }: { plantId: string }) {
  const [careHistory, setCareHistory] = useState<
    {
      id: string;
      date: Date;
      careType: string;
      notes: string;
      otherCareType?: string;
    }[]
  >([]);
  const { user } = useAuth();
  const { showError } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareHistory = async () => {
      setLoading(true);
      try {
        const historyData = await getCareHistory(plantId, user?.id || '');
        setCareHistory(historyData);
      } catch (error) {
        showError(
          'Error loading care history',
          error instanceof Error ? error.message : 'Unknown error'
        );
      } finally {
        setLoading(false);
      }
    };

    if (plantId) {
      fetchCareHistory();
    }
  }, [plantId, user?.id]);

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
    return <Spinner />;
  }

  if (careHistory.length === 0) {
    return (
      <div className="flex flex-col">
        <h2 className="text-2xl">Care History</h2>
        <p className="text-stone-500">No care history available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl">Care History</h2>
      {groupedCareHistory.map((group) => (
        <div key={group.title} className="flex flex-col gap-3">
          <p className="text-xl">{group.title}</p>
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
}: {
  entry: {
    date: Date;
    careType: string;
    notes: string;
    otherCareType?: string;
  };
}) {
  return (
    <div className="flex flex-row px-3 gap-3 items-center">
      {careTypeIcons[entry.careType] || careTypeIcons['other']}
      <div className="flex flex-col">
        <p className="text-lg font-bold">
          {careLabels[entry.careType] || careLabels['other']}
          {entry.careType === 'other' && entry.otherCareType
            ? `: ${entry.otherCareType}`
            : ''}
        </p>
        {entry.notes && <p>{entry.notes}</p>}
      </div>
    </div>
  );
}
