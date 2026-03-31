import ImagePreview from '@components/ImagePreview';
import type { SpeciesDetailsData } from '../types/speciesDetails';
import SimilarSpecies from './SimilarSpecies';
import CharacteristicBadge from './CharacteristicBadge';
import { Callout, H3 } from '@components/Typography';
import { Link } from 'react-router-dom';

export default function SpeciesDetailsSidebar({
  speciesDetails,
  userPlants,
}: Readonly<{
  speciesDetails: SpeciesDetailsData;
  userPlants: any[];
}>) {
  return (
    <div className="w-3/8 flex flex-col gap-6">
      <ImagePreview
        url={speciesDetails.image || '/images/placeholder.jpg'}
        alt={
          speciesDetails.image
            ? `${speciesDetails.commonName} image`
            : `No photo available for ${speciesDetails.commonName}`
        }
      />
      <div>
        <p>Other names: {speciesDetails.otherNames.join(', ')}</p>
        <p>Plant type: {speciesDetails.type.join(', ')}</p>
      </div>
      <div>
        <H3>Characteristics</H3>
        {CharacteristicBadge({
          label: 'difficulty',
          value: speciesDetails.characteristics.difficulty,
        })}
        {CharacteristicBadge({
          label: 'toxicity',
          value: speciesDetails.characteristics.toxicity,
        })}
        {CharacteristicBadge({
          label: 'maintenance',
          value: speciesDetails.characteristics.maintenance,
        })}
        {CharacteristicBadge({
          label: 'light',
          value: speciesDetails.characteristics.light,
        })}
        {CharacteristicBadge({
          label: 'pruning',
          value: speciesDetails.characteristics.pruning,
        })}
        {CharacteristicBadge({
          label: 'propagation',
          value: speciesDetails.characteristics.propagation,
        })}
      </div>
      <div>
        <H3>Similar Species</H3>
        {speciesDetails.similarSpecies.length > 0 ? (
          <>
            {speciesDetails.similarSpecies.slice(0, 3).map((id) => (
              <SimilarSpecies key={id} speciesId={id} />
            ))}
          </>
        ) : (
          <p>No similar species listed.</p>
        )}
      </div>
      {userPlants.length > 0 && (
        <div>
          <H3>Your Plants</H3>
          {userPlants.map((plant) => (
            <Link to={`/plants/${plant.id}`} key={plant.id}>
              <div className="flex flex-row gap-2 group pt-2">
                <img
                  className="aspect-square overflow-hidden object-cover w-1/4 h-full"
                  src={plant.imageUrl || '/images/placeholder.jpg'}
                  alt={
                    plant.imageUrl
                      ? `${plant.name} (${plant.speciesName}) image`
                      : `No photo available`
                  }
                />
                <div className="w-3/4">
                  <Callout className="text-stone-600">
                    {plant.speciesName}
                  </Callout>
                  <p>{plant.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
