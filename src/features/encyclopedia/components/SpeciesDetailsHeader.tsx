import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Button, { IconButton } from '@components/Button';
import { H1, H3 } from '@components/Typography';

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
        <H3 className="text-gray-500">{family}</H3>
        <H1>
          {commonName} ({scientificName})
        </H1>
      </div>
      <div className="flex gap-2 justify-end shrink-0">
        <Button
          label="Add to Collection"
          ariaLabel="Add to Collection"
          onClick={() => {}}
        />
        <Button
          label="Quick Add"
          ariaLabel="Quick Add"
          onClick={() => {}}
          variant="outlined"
        />
      </div>
    </div>
  );
}
