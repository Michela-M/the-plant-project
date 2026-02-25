import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Button, { IconButton } from '@components/Button';

export default function SpeciesDetailsHeader({
  commonName,
  family,
  scientificName,
}: {
  commonName: string;
  family: string;
  scientificName: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <IconButton
        icon={<ChevronLeft />}
        variant="ghost"
        onClick={() => navigate('/encyclopedia')}
        label="Back to Encyclopedia"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-xl text-gray-500">{family}</h3>
        <h1 className="text-3xl">
          {commonName} ({scientificName})
        </h1>
      </div>
      <div className="flex gap-2 justify-end shrink-0">
        <Button label="Add to Collection" onClick={() => {}} />
        <Button label="Quick Add" onClick={() => {}} variant="outlined" />
      </div>
    </div>
  );
}
