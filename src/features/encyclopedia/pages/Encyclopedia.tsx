import SpeciesCard from '../components/SpeciesCard';
import ButtonRadio from '@components/ButtonRadio';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { useEffect, useState } from 'react';
import SpeciesListItem from '../components/SpeciesListItem';
import { getAllSpecies } from '../services/getAllSpecies';
import { useToast } from '@context/toast/useToast';
import Spinner from '@components/Spinner';

export default function Encyclopedia() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const icons = [
    { Icon: LayoutGrid, id: 'grid' },
    { Icon: LayoutList, id: 'list' },
  ];
  const [species, setSpecies] = useState<
    {
      id: string;
      family: string;
      commonName: string;
      description: string;
      tags: string[];
      image: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useToast();

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

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="w-1/2 mx-auto py-8 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-900">Encyclopedia</h1>
        <ButtonRadio
          icons={icons}
          selectedIndex={selectedIndex}
          onChange={setSelectedIndex}
        />
      </div>
      {species.length === 0 && (
        <p className="text-stone-500">
          No species found. Please check back later.
        </p>
      )}
      {selectedIndex === 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {species.map((specie) => (
            <SpeciesCard
              key={specie.id}
              imageUrl={
                specie.image ??
                'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
              }
              family={specie.family}
              commonName={specie.commonName}
              id={specie.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {species.map((specie) => (
            <SpeciesListItem
              key={specie.id}
              family={specie.family}
              commonName={specie.commonName}
              description={specie.description}
              tags={specie.tags}
              imageUrl={
                specie.image ??
                'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
              }
              id={specie.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
