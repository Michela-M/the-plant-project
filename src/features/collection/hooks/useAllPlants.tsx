import { useAuth } from '@context/auth/useAuth';
import { useToast } from '@context/toast/useToast';
import { useEffect, useState } from 'react';
import { getAllPlants } from '../services/getAllPlants';
import type { Plant } from '../type/plants';

export default function useAllPlants(plantId?: string) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const { showError } = useToast();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (plantId) {
      setLoading(false);
      return;
    }

    if (!user?.id) {
      setLoading(true);
      return;
    }

    const fetchPlants = async () => {
      setLoading(true);
      try {
        const plantsData = await getAllPlants(user.id);
        setPlants(
          plantsData.map((plant) => ({
            id: plant.id,
            name: plant.name,
            speciesName: plant.speciesName,
            imageUrl: plant.imageUrl || '/images/placeholder.jpg',
          }))
        );
      } catch (error) {
        showError(
          'Error loading plants',
          error instanceof Error ? error.message : 'Unknown error'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, [showError, user?.id, plantId]);

  return { plants, loading };
}
