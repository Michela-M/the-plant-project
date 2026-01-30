import Tag from './Tag';
import { IconButton } from './Button';
import { CirclePlus } from 'lucide-react';

export default function SpeciesListItem({
  family,
  commonName,
  description,
  tags,
  imageUrl,
}: {
  family: string;
  commonName: string;
  description: string;
  tags: string[];
  imageUrl: string;
}) {
  return (
    <div className="flex flex-row gap-2 group">
      <img
        className="aspect-square overflow-hidden object-cover w-1/4 h-full"
        src={
          imageUrl ||
          'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
        }
        alt={commonName || 'plant image'}
      />
      <div className="w-3/4">
        <div className="flex">
          <div className="grow">
            <p className="text-stone-600">
              {family ? family : 'Unknown Family'}
            </p>
            <p className="text-lg">{commonName ? commonName : 'Unknown'}</p>
          </div>
          <div
            className="opacity-0 group-hover:opacity-100"
            data-testid="icon-container"
          >
            <IconButton variant="ghost" icon={<CirclePlus />} />
          </div>
        </div>
        <p className="line-clamp-2 ">{description}</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}
