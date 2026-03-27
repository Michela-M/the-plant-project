import SpeciesCard from '../components/SpeciesCard';
import ButtonRadio from '@components/ButtonRadio';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { useEffect, useState } from 'react';
import SpeciesListItem from '../components/SpeciesListItem';
import { getAllSpecies } from '../services/getAllSpecies';
import { useToast } from '@context/toast/useToast';
import Spinner from '@components/Spinner';
import { H1 } from '@components/Typography';
import TextField from '@components/TextField';

export default function Encyclopedia() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const icons = [
    { Icon: LayoutGrid, id: 'grid', label: 'Grid view' },
    { Icon: LayoutList, id: 'list', label: 'List view' },
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
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredSpecies = species.filter((specie) => {
    const matchesCommonName = specie.commonName
      .toLowerCase()
      .includes(normalizedQuery);
    const matchesFamily = specie.family.toLowerCase().includes(normalizedQuery);
    return matchesCommonName || matchesFamily;
  });

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
    return <Spinner label="Loading species..." />;
  }

  return (
    <div className="w-1/2 mx-auto py-8 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <H1>Encyclopedia</H1>
        <ButtonRadio
          icons={icons}
          selectedIndex={selectedIndex}
          onChange={setSelectedIndex}
          groupLabel="Select view"
        />
      </div>
      <TextField
        placeholder="Search species..."
        ariaLabel="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredSpecies.length === 0 && searchQuery && (
        <p className="text-stone-500">
          No species found. Try adjusting your search.
        </p>
      )}
      {species.length === 0 && !searchQuery && (
        <p className="text-stone-500">
          No species found. Please check back later.
        </p>
      )}
      {selectedIndex === 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {filteredSpecies.map((specie) => (
            <SpeciesCard
              key={specie.id}
              imageUrl={specie.image ?? '/images/placeholder.jpg'}
              family={specie.family}
              commonName={specie.commonName}
              id={specie.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredSpecies.map((specie) => (
            <SpeciesListItem
              key={specie.id}
              family={specie.family}
              commonName={specie.commonName}
              description={specie.description}
              tags={specie.tags}
              imageUrl={specie.image ?? '/images/placeholder.jpg'}
              id={specie.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
