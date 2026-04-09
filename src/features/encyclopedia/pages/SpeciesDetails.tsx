import Link from '@components/Link';
import Spinner from '@components/Spinner';
import { useAuth } from '@context/auth/useAuth';
import { useToast } from '@context/toast/useToast';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SpeciesDetailsHeader from '../components/SpeciesDetailsHeader';
import SpeciesDetailsMainContent from '../components/SpeciesDetailsMainContent';
import SpeciesDetailsSidebar, {
  type UserPlant,
} from '../components/SpeciesDetailsSidebar';
import useSpeciesDetails from '../hooks/useSpeciesDetails';
import { getUserPlants } from '../services/getUserPlants';

export default function SpeciesDetails() {
  const { id } = useParams();
  const { showError } = useToast();
  const { speciesDetails, loading } = useSpeciesDetails(id);
  const { user } = useAuth();
  const [userPlants, setUserPlants] = useState<UserPlant[]>([]);

  useEffect(() => {
    const fetchUserPlants = async () => {
      if (!id || !user) {
        setUserPlants([]);
        return;
      }
      try {
        const temp = await getUserPlants(user.id, id);
        setUserPlants(temp);
      } catch (error) {
        showError(
          'Error loading user plants',
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    };

    fetchUserPlants();
  }, [id, showError, user]);

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
        <SpeciesDetailsSidebar
          speciesDetails={speciesDetails}
          userPlants={userPlants}
        />
      </div>
    </div>
  );
}
