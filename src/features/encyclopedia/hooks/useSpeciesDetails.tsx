import { useToast } from '@context/toast/useToast';
import { useEffect, useState } from 'react';
import { getSpeciesDetails } from '../services/getSpeciesDetails';
import type { SpeciesDetailsData } from '../types/speciesDetails';

export default function useSpeciesDetails(id: string | undefined) {
  const [speciesDetails, setSpeciesDetails] =
    useState<SpeciesDetailsData | null>(null);
  const { showError } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeciesDetails = async () => {
      if (!id) {
        setSpeciesDetails(null);
        setLoading(false);
        return;
      }
      setSpeciesDetails(null);
      setLoading(true);

      try {
        const details = await getSpeciesDetails(id);
        setSpeciesDetails(details);
      } catch (error) {
        showError(
          'Error loading species details',
          error instanceof Error ? error.message : 'Unknown error'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSpeciesDetails();
  }, [id, showError]);

  return { speciesDetails, loading };
}
