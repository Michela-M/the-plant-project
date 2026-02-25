import { CirclePlus } from 'lucide-react';
import { IconButton } from '@components/Button';
import { Link } from 'react-router-dom';

export default function SpeciesCard({
  imageUrl,
  family,
  commonName,
  id,
}: {
  imageUrl?: string;
  family?: string;
  commonName?: string;
  id: string;
}) {
  const speciesPath = `/species/${id}`;

  return (
    <div className="group">
      <Link to={speciesPath}>
        <img
          className="aspect-square overflow-hidden object-cover w-full"
          src={
            imageUrl ||
            'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
          }
          alt={commonName || 'Plant Image'}
        />
      </Link>

      <div className="flex">
        <Link to={speciesPath} className="grow">
          <p className="text-stone-600">{family || 'Unknown Family'}</p>
          <p className="text-lg">{commonName || 'Unknown'}</p>
        </Link>
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
