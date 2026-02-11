import Button from '../components/Button';
import PlantCard from '../features/collection/PlantCard';
import { useEffect, useState } from 'react';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { getAllPlants } from '../services/getAllPlants';

export default function MyCollection() {
  const [plants, setPlants] = useState<
    {
      id: string;
      name: string;
      species: string;
    }[]
  >([]);
  const { showErrorToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const plantsData = await getAllPlants();
        console.log('Fetched plants:', plantsData);
        setPlants(plantsData);
      } catch (error) {
        showErrorToast(
          'Error loading plants',
          error instanceof Error ? error.message : 'Unknown error'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, [showErrorToast]);

  return (
    <div className="w-1/2 mx-auto py-8 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-900">My Collection</h1>
        <Button label="Add Plant" onClick={() => navigate('/add-plant')} />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {plants.length === 0 && (
            <p className="text-stone-500">No plants yet. Add your first one!</p>
          )}
          <div className="grid grid-cols-3 gap-4">
            {plants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={{
                  id: plant.id,
                  name: plant.name,
                  commonName: plant.species,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
