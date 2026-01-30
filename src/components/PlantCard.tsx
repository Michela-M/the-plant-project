import { CirclePlus } from 'lucide-react';
import { IconButton } from './Button';

export default function PlantCard({
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
          imageUrl
            ? imageUrl
            : 'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
        }
        alt={commonName ? commonName : 'Plant Image'}
      />
      <div className="flex">
        <div className="grow">
          <p className="text-stone-600">{family ? family : 'Unknown Family'}</p>
          <p className="text-lg">{commonName ? commonName : 'Unknown'}</p>
        </div>
        <div
          className="opacity-0 group-hover:opacity-100"
          data-testid="icon-container"
        >
          <IconButton variant="ghost" icon={<CirclePlus size={16} />} />
        </div>
      </div>
    </div>
  );
}
