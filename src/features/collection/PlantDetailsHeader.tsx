import { IconButton } from '../../components/Button';
import { ChevronLeft } from 'lucide-react';
import Button from '../../components/Button';
import { ChevronDown } from 'lucide-react';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import Menu, { MenuItem } from '../../components/Menu';
import { useNavigate } from 'react-router-dom';

export default function PlantDetailsHeader({
  plant,
}: {
  plant: { id: string; name: string; commonName?: string };
}) {
  const navigate = useNavigate();

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <IconButton
        icon={<ChevronLeft />}
        variant="ghost"
        onClick={() => navigate(-1)}
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
              <MenuItem label="Delete" onClick={() => {}} danger disabled />
              <MenuItem
                label="Remove from schedule"
                onClick={() => {}}
                disabled
              />
            </Menu>
          )}
        </div>
      </div>
    </div>
  );
}
