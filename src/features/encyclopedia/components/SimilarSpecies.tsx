import Tag from '@components/Tag';
import { Callout } from '@components/Typography';
import { Link } from 'react-router-dom';
import useSpeciesDetails from '../hooks/useSpeciesDetails';

export default function SimilarSpecies({
  speciesId,
}: Readonly<{ speciesId: string }>) {
  const { speciesDetails: similarSpecies } = useSpeciesDetails(speciesId);

  return (
    <Link to={`/species/${speciesId}`}>
      <div className="flex flex-row gap-2 group pt-2">
        <img
          className="aspect-square overflow-hidden object-cover w-1/4 h-full"
          src={similarSpecies?.image || '/images/placeholder.jpg'}
          alt={
            similarSpecies?.image
              ? `${similarSpecies.commonName} (${similarSpecies.scientificName}) image`
              : `No photo available`
          }
        />
        <div className="w-3/4">
          <Callout className="text-stone-600">
            {similarSpecies?.family || 'Unknown Family'}
          </Callout>
          <p>{similarSpecies?.commonName || 'Unknown'}</p>

          <div className="flex flex-wrap gap-2 mt-1">
            {similarSpecies?.tags.map((tag, index) => (
              <Tag key={`${tag}-${index}`} label={tag} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
