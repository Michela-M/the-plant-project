import { IconButton } from '@components/Button';
import { ChevronLeft } from 'lucide-react';
import Button from '@components/Button';
import { ChevronDown } from 'lucide-react';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import Menu, { MenuItem } from '@components/Menu';
import { useNavigate } from 'react-router-dom';
import Modal from '@components/Modal';
import deletePlant from '../services/deletePlant';
import { useToast } from '@context/toast/useToast';
import { useAuth } from '@context/auth/useAuth';
import { H1, H3 } from '@components/Typography';
import CareModal from './CareModal';
import { updatePlant } from '../services/updatePlant';

export default function PlantDetailsHeader({
  plant,
  onTrackWateringChange,
}: {
  plant: {
    id: string;
    name: string;
    commonName?: string;
    trackWatering: boolean;
  };
  onTrackWateringChange?: (trackWatering: boolean) => void;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCareModal, setShowCareModal] = useState(false);
  const { showError, showSuccess } = useToast();

  const handleDelete = async () => {
    try {
      await deletePlant(plant.id, user?.id || '');
      setShowDeleteConfirm(false);
      navigate('/collection');
      showSuccess('Plant deleted successfully');
    } catch (error) {
      showError(
        'Error deleting plant',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  const toggleTrackWatering = async () => {
    const nextTrackWatering = !plant.trackWatering;

    try {
      await updatePlant(
        plant.id,
        {
          trackWatering: nextTrackWatering,
        },
        user?.id || ''
      );
      onTrackWateringChange?.(nextTrackWatering);
      showSuccess(
        plant.trackWatering
          ? 'Plant removed from schedule successfully'
          : 'Plant added to schedule successfully'
      );
    } catch (error) {
      showError(
        'Error updating plant',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  return (
    <div className="flex items-center gap-4">
      <IconButton
        icon={<ChevronLeft />}
        variant="ghost"
        onClick={() => navigate('/collection')}
        label="Back to collection"
      />
      <div className="w-full">
        {plant?.commonName && (
          <H3 className="text-gray-500">{plant.commonName}</H3>
        )}
        <H1>{plant?.name}</H1>
      </div>
      <div className="flex gap-2 h-fit">
        <div className="relative">
          <Button
            label="New"
            ariaLabel="New"
            icon={<ChevronDown />}
            onClick={() => {
              setShowAddMenu(!showAddMenu);
              setShowOptionsMenu(false);
            }}
          />
          {showAddMenu && (
            <Menu>
              <MenuItem
                label="Care"
                onClick={() => {
                  setShowAddMenu(!showAddMenu);
                  setShowCareModal(true);
                }}
              />
              <MenuItem label="Reminder" onClick={() => {}} disabled />
            </Menu>
          )}
        </div>
        <div className="relative">
          <IconButton
            icon={<EllipsisVertical />}
            variant="outlined"
            onClick={() => {
              setShowOptionsMenu(!showOptionsMenu);
              setShowAddMenu(false);
            }}
            label="Open options menu"
          />
          {showOptionsMenu && (
            <Menu>
              <MenuItem
                label="Edit"
                onClick={() => {
                  navigate(`/plants/${plant.id}/edit`);
                }}
              />
              <MenuItem
                label="Delete"
                onClick={() => {
                  setShowOptionsMenu(false);
                  setShowDeleteConfirm(true);
                }}
                danger
              />
              <MenuItem
                label={
                  plant.trackWatering
                    ? 'Remove from schedule'
                    : 'Track watering'
                }
                onClick={() => {
                  toggleTrackWatering();
                  setShowOptionsMenu(false);
                }}
              />
            </Menu>
          )}
        </div>
      </div>
      {showDeleteConfirm && (
        <Modal
          title="Delete plant"
          onClose={() => setShowDeleteConfirm(false)}
          type="destructive"
          label="Delete"
          onConfirm={handleDelete}
        >
          <p>
            This will remove {plant?.name} from your collection. This action
            cannot be undone.
          </p>
        </Modal>
      )}
      {showCareModal && (
        <CareModal setShowCareModal={setShowCareModal} plantId={plant.id} />
      )}
    </div>
  );
}
