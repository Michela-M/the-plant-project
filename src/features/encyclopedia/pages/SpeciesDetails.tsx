import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Link from '@components/Link';
import { getSpeciesDetails } from '../services/getSpeciesDetails';
import { useToast } from '@context/toast/useToast';
import Spinner from '@components/Spinner';
import SpeciesDetailsHeader from '../components/SpeciesDetailsHeader';
import SpeciesDetailsSidebar from '../components/SpeciesDetailsSidebar';
import SpeciesDetailsMainContent from '../components/SpeciesDetailsMainContent';
import type { SpeciesDetailsData } from '../types/speciesDetails';

export default function SpeciesDetails() {
  const { id } = useParams();
  const { showError } = useToast();
  const [speciesDetails, setSpeciesDetails] =
    useState<SpeciesDetailsData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeciesDetails = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
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

  if (loading) {
    return <Spinner label="Loading species details..." />;
  }

  if (!speciesDetails) {
    return (
      <div className="w-2/3 mx-auto py-8 flex flex-col items-center gap-2">
        <p className="text-center text-stone-500">Species not found.</p>
        <Link href="/encyclopedia">Back to Encyclopedia</Link>
      </div>
    );
  }

  return (
    <div className="w-2/3 mx-auto py-8 flex flex-col gap-4">
      <SpeciesDetailsHeader
        commonName={speciesDetails.commonName}
        family={speciesDetails.family}
        scientificName={speciesDetails.scientificName}
      />
      <div className="flex gap-6">
        <SpeciesDetailsMainContent speciesDetails={speciesDetails} />
        <SpeciesDetailsSidebar speciesDetails={speciesDetails} />
      </div>
    </div>
  );
}
