import { IconButton } from '@components/Button';
import Menu, { MenuItem } from '@components/Menu';
import { Callout, Headline } from '@components/Typography';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import WaterModal from './WaterModal';
import { useAuth } from '@context/auth/useAuth';
import { useToast } from '@context/toast/useToast';
import { updatePlant } from '@features/collection/services/updatePlant';

export default function ScheduleListItem({
  id,
  name,
  species,
  wateringFrequency,
  inferredWateringFrequency,
  imageUrl,
}: {
  id: string;
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

  const [showMenu, setShowMenu] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const handleRemoveFromSchedule = async () => {
    if (!user?.id) {
      showError(
        'Error removing plant from schedule',
        'You must be signed in to modify your schedule.'
      );
      return;
    }

    try {
      await updatePlant(id, { trackWatering: false }, user.id);
      showSuccess('Plant removed from schedule successfully');
    } catch (error) {
      showError(
        'Error removing plant from schedule',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  return (
    <div className="flex flex-row gap-4">
      <div className="aspect-square overflow-hidden object-cover">
        <img
          className="w-32"
          src={imageUrl || '/public/images/placeholder.jpg'}
          alt={imageUrl ? `${name} image` : `No photo available for ${name}`}
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
      <div className="relative">
        <IconButton
          icon={<EllipsisVertical />}
          label="Options"
          variant="ghost"
          onClick={() => setShowMenu(!showMenu)}
        />
        {showMenu && (
          <Menu label="Plant Options">
            <MenuItem
              label="Plant watered"
              onClick={() => {
                setShowWaterModal(true);
                setShowMenu(false);
              }}
            />
            <MenuItem
              label="Remove from schedule"
              onClick={() => {
                handleRemoveFromSchedule();
                setShowMenu(false);
              }}
            />
          </Menu>
        )}
      </div>
      {showWaterModal && (
        <WaterModal plantId={id} setShowWaterModal={setShowWaterModal} />
      )}
    </div>
  );
}
