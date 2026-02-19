import { CirclePlus } from 'lucide-react';
import { IconButton } from '@components/Button';

export default function SpeciesCard({
  imageUrl,
  family,
  commonName,
}: {
  imageUrl?: string;
  family?: string;
  commonName?: string;
}) {
  return (
    <div className="group">
      <img
        className="aspect-square overflow-hidden object-cover w-full"
        src={
          imageUrl ||
          'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
        }
        alt={commonName || 'Plant Image'}
      />
      <div className="flex">
        <div className="grow">
          <p className="text-stone-600">{family || 'Unknown Family'}</p>
          <p className="text-lg">{commonName || 'Unknown'}</p>
        </div>
        <div
          className="opacity-0 group-hover:opacity-100 py-2"
          data-testid="icon-container"
        >
          <IconButton
            variant="ghost"
            icon={<CirclePlus />}
            size="sm"
            label={
              commonName
                ? `Add ${commonName} to collection`
                : 'Add plant to collection'
            }
          />
        </div>
      </div>
    </div>
  );
}
