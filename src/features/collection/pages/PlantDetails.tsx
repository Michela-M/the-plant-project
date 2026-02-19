import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPlantDetails } from '../services/getPlantDetails';
import PlantDetailsHeader from '../components/PlantDetailsHeader';
import ImagePreview from '@components/ImagePreview';
import PlantDetailsSchedule from '../components/PlantDetailsSchedule';
import { useToast } from '@context/toast/useToast';
import Spinner from '@components/Spinner';
import { useAuth } from '@context/auth/useAuth';

export default function PlantDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showError } = useToast();
  const [plantDetails, setPlantDetails] = useState<{
    id: string;
    name: string;
    species: string;
    wateringFrequency: number;
    lastWatered: Date;
    notes: string;
    creationDate: Date;
    imageUrl: string | null;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlantDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const details = await getPlantDetails(id, user?.id || '');
        setPlantDetails(details);
      } catch (error) {
        showError(
          'Error loading plant details',
          error instanceof Error ? error.message : 'Unknown error'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlantDetails();
  }, [id, showError]);

  if (loading) {
    return <Spinner />;
  }

  if (!plantDetails) {
    return (
      <div className="w-2/3 mx-auto py-8">
        <p className="text-center text-stone-500">Plant not found.</p>
        <Link
          to="/collection"
          className="text-green-700 hover:underline block text-center mt-4"
        >
          Back to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="w-2/3 mx-auto py-8 flex flex-col gap-4">
      <PlantDetailsHeader
        plant={{
          id: plantDetails?.id || '',
          name: plantDetails?.name || '',
          commonName: plantDetails?.species || '',
        }}
      />
      <div className="flex">
        <div className="w-5/8 h-64 flex flex-col gap-6">
          <p>{plantDetails?.notes}</p>
          <div>
            <h2 className="text-2xl">History</h2>
            <p className="text-stone-500">No notes yet.</p>
          </div>
        </div>
        <div className="w-3/8 flex flex-col gap-6">
          <ImagePreview
            url={
              plantDetails?.imageUrl ||
              'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
            }
            alt="Plant image"
          />
          <PlantDetailsSchedule
            plant={{
              wateringFrequency: plantDetails?.wateringFrequency,
              lastWatered: plantDetails?.lastWatered,
            }}
          />
        </div>
      </div>
    </div>
  );
}
