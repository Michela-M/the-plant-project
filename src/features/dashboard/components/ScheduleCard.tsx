import Button from '@components/Button';
import { Headline, Callout } from '@components/Typography';
import formatRelativeDate from '@utils/formatRelativeDate';
import WaterModal from './WaterModal';
import { useState } from 'react';
import SnoozeModal from './SnoozeModal';

export default function ScheduleCard({
  id,
  name,
  species,
  lastWateredDate,
  wateringFrequency,
  inferredWateringFrequency,
  imageUrl,
}: {
  id: string;
  name: string;
  species: string;
  lastWateredDate: Date | null;
  wateringFrequency: number | null;
  inferredWateringFrequency: number | null;
  imageUrl?: string | null;
}) {
  const hasWateringFrequency =
    typeof wateringFrequency === 'number' &&
    Number.isFinite(wateringFrequency) &&
    wateringFrequency > 0;
  const hasInferredWateringFrequency =
    typeof inferredWateringFrequency === 'number' &&
    Number.isFinite(inferredWateringFrequency) &&
    inferredWateringFrequency > 0;

  const [showWaterModal, setShowWaterModal] = useState(false);
  const [showSnoozeModal, setShowSnoozeModal] = useState(false);

  return (
    <div
      className="bg-stone-50 shadow-md rounded-md px-2 py-2 flex gap-2 flex-col"
      data-testid="schedule-card"
    >
      <div>
        <Callout className="text-stone-600">{species}</Callout>
        <Headline>{name}</Headline>
      </div>

      <img
        className="aspect-square object-cover w-full"
        src={imageUrl || '/public/images/placeholder.jpg'}
        alt={imageUrl ? `${name} image` : `No photo available for ${name}`}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          label="Watered"
          ariaLabel="Watered"
          onClick={() => setShowWaterModal(true)}
          fullWidth
        />
        <Button
          size="sm"
          label="Snooze"
          ariaLabel="Snooze"
          onClick={() => setShowSnoozeModal(true)}
          variant="outlined"
        />
      </div>
      <div>
        <div className="flex justify-between gap-1">
          <Callout>Last watering: </Callout>
          <Callout
            className="whitespace-nowrap text-right"
            data-testid="last-watered-date"
          >
            {lastWateredDate
              ? formatRelativeDate({ date: lastWateredDate })
              : 'N/A'}
          </Callout>
        </div>
        {hasWateringFrequency ? (
          <div className="flex justify-between gap-1">
            <Callout>Watering frequency: </Callout>
            <Callout
              className="whitespace-nowrap text-right"
              data-testid="watering-frequency"
            >
              {wateringFrequency} days
            </Callout>
          </div>
        ) : (
          <div className="flex justify-between gap-1">
            <Callout>Estimated watering frequency: </Callout>
            <Callout
              className="whitespace-nowrap text-right"
              data-testid="estimated-watering-frequency"
            >
              {hasInferredWateringFrequency
                ? `${inferredWateringFrequency} days`
                : 'N/A'}
            </Callout>
          </div>
        )}
      </div>
      {showWaterModal && (
        <WaterModal plantId={id} setShowWaterModal={setShowWaterModal} />
      )}
      {showSnoozeModal && (
        <SnoozeModal plantId={id} setShowSnoozeModal={setShowSnoozeModal} />
      )}
    </div>
  );
}
