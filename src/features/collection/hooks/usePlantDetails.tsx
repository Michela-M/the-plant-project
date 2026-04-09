import { useAuth } from '@context/auth/useAuth';
import { useToast } from '@context/toast/useToast';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlantDetails } from '../services/getPlantDetails';
import type { PlantDetails } from '../type/plantDetails';

export default function usePlantDetails() {
  const [plantDetails, setPlantDetails] = useState<PlantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();
  const { user } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setPlantDetails(null);
      setLoading(false);
      return;
    }

    async function fetchPlant() {
      setLoading(true);
      setPlantDetails(null);

      try {
        const details = await getPlantDetails(id!, user?.id || '');
        setPlantDetails(details);
      } catch (error) {
        showError(
          'Error loading plant details',
          error instanceof Error ? error.message : 'Unknown error'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPlant();
  }, [id, showError, user]);

  return { plantDetails, loading, setPlantDetails };
}
