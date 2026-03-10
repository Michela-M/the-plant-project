import { CirclePlus } from 'lucide-react';
import { IconButton } from '@components/Button';
import { Link } from 'react-router-dom';
import { Callout } from '@components/Typography';

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
          src={imageUrl || '/public/images/placeholder.jpg'}
          alt={commonName || 'Plant Image'}
        />
      </Link>

      <div className="flex">
        <Link to={speciesPath} className="grow">
          <Callout className="text-stone-600">
            {family || 'Unknown Family'}
          </Callout>
          <p>{commonName || 'Unknown'}</p>
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
