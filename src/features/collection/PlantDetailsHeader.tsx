import { IconButton } from '../../components/Button';
import { ChevronLeft } from 'lucide-react';
import Button from '../../components/Button';
import { ChevronDown } from 'lucide-react';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import Menu, { MenuItem } from '../../components/Menu';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import deletePlant from '../../services/deletePlant';
import { useToast } from '@context/toast/useToast';

export default function PlantDetailsHeader({
  plant,
}: {
  plant: { id: string; name: string; commonName?: string };
}) {
  const navigate = useNavigate();

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { showError, showSuccess } = useToast();

  const handleDelete = async () => {
    try {
      await deletePlant(plant.id);
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

  return (
    <div className="flex items-center gap-4">
      <IconButton
        icon={<ChevronLeft />}
        variant="ghost"
        onClick={() => navigate('/collection')}
      />
      <div className="w-full">
        {plant?.commonName && (
          <h3 className="text-xl text-gray-500">{plant.commonName}</h3>
        )}
        <h1 className="text-3xl">{plant?.name}</h1>
      </div>
      <div className="flex gap-2 h-fit">
        <div className="relative">
          <Button
            label="New"
            icon={<ChevronDown />}
            onClick={() => {
              setShowAddMenu(!showAddMenu);
              setShowOptionsMenu(false);
            }}
          />
          {showAddMenu && (
            <Menu>
              <MenuItem label="Care" onClick={() => {}} disabled />
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
                label="Remove from schedule"
                onClick={() => {}}
                disabled
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
    </div>
  );
}
