import Tag from './Tag';

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
    <div className="flex flex-row gap-2">
      <img
        className="aspect-square overflow-hidden object-cover w-1/4 h-full"
        src={
          imageUrl ||
          'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
        }
        alt={commonName || 'plant image'}
      />
      <div className="w-3/4">
        <p className="text-stone-500">{family || 'Unknown family'}</p>
        <p className="text-lg">{commonName || 'Unknown'}</p>
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
