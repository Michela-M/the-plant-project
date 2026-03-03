import { IconButton } from '@components/Button';
import { Callout, Headline } from '@components/Typography';
import { EllipsisVertical } from 'lucide-react';

export default function ScheduleListItem({
  name,
  species,
  wateringFrequency,
  inferredWateringFrequency,
  imageUrl,
}: {
  name: string;
  species: string;
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

  return (
    <div className="flex flex-row gap-4">
      <div className="aspect-square overflow-hidden object-cover">
        <img
          className="w-32"
          src={
            imageUrl ||
            'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
          }
          alt={name + ' image'}
        />
      </div>
      <div className="flex flex-col grow my-2">
        <Callout className="text-stone-600">{species}</Callout>
        <Headline>{name}</Headline>
        {hasWateringFrequency ? (
          <p data-testid="watering-frequency" className="mt-2">
            Watering frequency: {wateringFrequency} days
          </p>
        ) : (
          <p data-testid="estimated-watering-frequency" className="mt-2">
            Estimated watering frequency:{' '}
            {hasInferredWateringFrequency
              ? `${inferredWateringFrequency} days`
              : 'N/A'}
          </p>
        )}
      </div>
      <div>
        <IconButton
          icon={<EllipsisVertical />}
          label="Options"
          variant="ghost"
        />
      </div>
    </div>
  );
}
