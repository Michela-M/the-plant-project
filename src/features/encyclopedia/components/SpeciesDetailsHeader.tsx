import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { IconButton } from '@components/Button';
import { H1, H3 } from '@components/Typography';

export default function SpeciesDetailsHeader({
  commonName,
  family,
  scientificName,
}: Readonly<{
  commonName: string;
  family: string;
  scientificName: string;
}>) {
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
    </div>
  );
}
