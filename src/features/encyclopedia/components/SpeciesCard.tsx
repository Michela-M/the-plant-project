import { Link } from 'react-router-dom';
import { Callout } from '@components/Typography';

export default function SpeciesCard({
  imageUrl,
  family,
  commonName,
  id,
}: Readonly<{
  imageUrl?: string;
  family?: string;
  commonName?: string;
  id: string;
}>) {
  const speciesPath = `/species/${id}`;

  return (
    <div className="group">
      <Link to={speciesPath}>
        <img
          className="aspect-square overflow-hidden object-cover w-full"
          src={imageUrl || '/public/images/placeholder.jpg'}
          alt={imageUrl ? `${commonName} image` : `No photo available`}
        />
      </Link>

      <div className="flex">
        <Link to={speciesPath} className="grow">
          <Callout className="text-stone-600">
            {family || 'Unknown Family'}
          </Callout>
          <p>{commonName || 'Unknown'}</p>
        </Link>
      </div>
    </div>
  );
}
