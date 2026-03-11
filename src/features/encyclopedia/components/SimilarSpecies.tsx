import { useEffect } from 'react';
import { getSpeciesDetails } from '../services/getSpeciesDetails';
import { useState } from 'react';
import { useToast } from '@context/toast/useToast';
import { Link } from 'react-router-dom';
import Tag from '@components/Tag';
import type { SpeciesDetailsData } from '../types/speciesDetails';
import { Callout } from '@components/Typography';

export default function SimilarSpecies({ speciesId }: { speciesId: string }) {
  const [similarSpecies, setSimilarSpecies] =
    useState<SpeciesDetailsData | null>(null);
  const { showError } = useToast();

  useEffect(() => {
    const fetchSimilarSpecies = async () => {
      if (!speciesId) return;
      try {
        const speciesDetails = await getSpeciesDetails(speciesId);
        setSimilarSpecies(speciesDetails);
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    fetchSimilarSpecies();
  }, [speciesId, showError]);

  return (
    <Link to={`/species/${speciesId}`}>
      <div className="flex flex-row gap-2 group pt-2">
        <img
          className="aspect-square overflow-hidden object-cover w-1/4 h-full"
          src={similarSpecies?.image || '/public/images/placeholder.jpg'}
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
