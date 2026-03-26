import Button from '@components/Button';
import PlantCard from '../components/PlantCard';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPlants } from '../services/getAllPlants';
import { useToast } from '@context/toast/useToast';
import Spinner from '@components/Spinner';
import { useAuth } from '@context/auth/useAuth';
import { H1 } from '@components/Typography';
import TextField from '@components/TextField';

export default function MyCollection() {
  const [plants, setPlants] = useState<
    {
      id: string;
      name: string;
      species: string;
      imageUrl?: string | null;
    }[]
  >([]);
  const { showError } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredPlants = plants.filter((plant) => {
    const matchesName = plant.name.toLowerCase().includes(normalizedQuery);
    const matchesSpecies = plant.species
      .toLowerCase()
      .includes(normalizedQuery);
    return matchesName || matchesSpecies;
  });

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      try {
        const plantsData = await getAllPlants(user?.id || '');
        setPlants(plantsData);
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
  }, [showError, user]);

  if (loading) {
    return <Spinner label="Loading plants..." />;
  }

  return (
    <div className="w-1/2 mx-auto py-8 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <H1>My Collection</H1>
        <Button
          label="Add Plant"
          ariaLabel="Add Plant"
          onClick={() => navigate('/add-plant')}
        />
      </div>
      <TextField
        placeholder="Search plants..."
        ariaLabel="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredPlants.length === 0 && searchQuery && (
        <p className="text-stone-500">
          No plants found. Try adjusting your search or add new plants to your
          collection.
        </p>
      )}
      {plants.length === 0 && !searchQuery && (
        <p className="text-stone-500">
          No plants found. Please check back later.
        </p>
      )}
      <div className="grid grid-cols-3 gap-4">
        {filteredPlants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={{
              id: plant.id,
              name: plant.name,
              commonName: plant.species,
              imageUrl: plant.imageUrl || '/src/assets/images/placeholder.jpg',
            }}
          />
        ))}
      </div>
    </div>
  );
}
