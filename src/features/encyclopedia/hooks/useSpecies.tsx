import { useToast } from '@context/toast/useToast';
import { useEffect, useState } from 'react';
import { getAllSpecies } from '../services/getAllSpecies';
import type { Species } from '../types/species';

export default function useSpecies() {
  const [species, setSpecies] = useState<Species[]>([]);
  const { showError } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecies = async () => {
      setLoading(true);
      try {
        const speciesData = await getAllSpecies();
        setSpecies(speciesData);
      } catch (error) {
        showError(
          'Error loading species',
          error instanceof Error ? error.message : 'Unknown error'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [showError]);

  return { species, loading };
}
