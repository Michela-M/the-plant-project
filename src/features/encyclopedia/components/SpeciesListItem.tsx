import Tag from '@components/Tag';
import { IconButton } from '@components/Button';
import { CirclePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Callout } from '@components/Typography';

export default function SpeciesListItem({
  family,
  commonName,
  description,
  tags,
  imageUrl,
  id,
}: {
  family: string;
  commonName: string;
  description?: string;
  tags: string[];
  imageUrl: string;
  id: string;
}) {
  const speciesPath = `/species/${id}`;

  return (
    <div className="flex flex-row gap-2 group">
      <Link to={speciesPath} className="flex flex-row gap-2 grow">
        <img
          className="aspect-square overflow-hidden object-cover w-1/4 h-full"
          src={imageUrl || '/public/images/placeholder.jpg'}
          alt={commonName || 'Plant Image'}
        />
        <div className="w-3/4">
          <div className="flex">
            <div className="grow">
              <Callout className="text-stone-600">
                {family || 'Unknown Family'}
              </Callout>
              <p>{commonName || 'Unknown'}</p>
            </div>
          </div>
          {description && (
            <Callout className="line-clamp-2">{description}</Callout>
          )}
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag, index) => (
              <Tag key={`${tag}-${index}`} label={tag} />
            ))}
          </div>
        </div>
      </Link>
      <div
        className="opacity-0 group-hover:opacity-100"
        data-testid="icon-container"
      >
        <IconButton
          variant="ghost"
          icon={<CirclePlus />}
          label={
            commonName
              ? `Add ${commonName} to collection`
              : 'Add plant to collection'
          }
        />
      </div>
    </div>
  );
}
