import Button from '@components/Button';
import Spinner from '@components/Spinner';
import TextField from '@components/TextField';
import { H1 } from '@components/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantCard from '../components/PlantCard';
import useAllPlants from '../hooks/useAllPlants';

export default function MyCollection() {
  const { plants, loading } = useAllPlants();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredPlants = plants.filter((plant) => {
    const matchesName = plant.name.toLowerCase().includes(normalizedQuery);
    const matchesSpecies = plant.speciesName
      ?.toLowerCase()
      .includes(normalizedQuery);
    return matchesName || matchesSpecies;
  });
  const hasSearch = normalizedQuery.length > 0;

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
      {filteredPlants.length === 0 && hasSearch && (
        <p className="text-stone-500">
          No plants found. Try adjusting your search or add new plants to your
          collection.
        </p>
      )}
      {plants.length === 0 && !hasSearch && (
        <p className="text-stone-500">
          You haven't added any plants yet. Use "Add Plant" to start your
          collection.
        </p>
      )}
      <div className="grid grid-cols-3 gap-4">
        {filteredPlants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={{
              id: plant.id,
              name: plant.name,
              commonName: plant.speciesName,
              imageUrl: plant.imageUrl || '/images/placeholder.jpg',
            }}
          />
        ))}
      </div>
    </div>
  );
}
